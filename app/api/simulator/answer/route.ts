import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';
import { getCompanyById } from '@/lib/simulatorData';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      typeof (body as Record<string, unknown>).sessionId !== 'string' ||
      typeof (body as Record<string, unknown>).companyId !== 'string' ||
      !Array.isArray((body as Record<string, unknown>).studentAnswers) ||
      typeof (body as Record<string, unknown>).attemptNumber !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const { sessionId, companyId, studentAnswers, attemptNumber } = body as {
      sessionId: string;
      companyId: string;
      studentAnswers: unknown[];
      attemptNumber: number;
    };

    if (studentAnswers.length !== 3 || studentAnswers.some((v) => typeof v !== 'boolean')) {
      return NextResponse.json(
        { error: 'studentAnswers must be exactly 3 booleans' },
        { status: 400 }
      );
    }

    if (attemptNumber !== 1 && attemptNumber !== 2) {
      return NextResponse.json(
        { error: 'attemptNumber must be 1 or 2' },
        { status: 400 }
      );
    }

    const answers = studentAnswers as [boolean, boolean, boolean];

    const company = getCompanyById(companyId);
    if (!company) {
      return NextResponse.json({ error: 'Unknown companyId' }, { status: 400 });
    }

    const studentPasses: boolean = answers[0] && answers[1] && answers[2];

    const companyIsHalal = company.verdict === 'halal';
    const companyIsHaram = company.verdict === 'haram';

    let isCorrect: boolean;
    let mistakeType: number | null = null;
    let blocked = false;

    if (companyIsHalal && studentPasses) {
      isCorrect = true;
    } else if (companyIsHaram && !studentPasses) {
      isCorrect = true;
    } else if (companyIsHalal && !studentPasses) {
      isCorrect = false;
      mistakeType = 2;
    } else {
      // companyIsHaram && studentPasses
      isCorrect = false;
      mistakeType = 1;
    }

    // Hard server-side gate: haram company passed on attempt 2 is always blocked
    if (companyIsHaram && studentPasses && attemptNumber === 2) {
      isCorrect = false;
      mistakeType = 1;
      blocked = true;
    }

    // Calculate profitPct
    const lastSession = await prisma.simulatorSession.findFirst({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      select: { profitPct: true },
    });
    const currentProfitPct = lastSession?.profitPct ?? 0.0;

    let delta = 0;
    if (isCorrect && studentPasses) {
      // Correct pass (halal company, student passed)
      delta = randomBetween(4, 9);
    } else if (isCorrect && !studentPasses) {
      // Correct block (haram company, student blocked)
      delta = randomBetween(1, 3);
    } else if (mistakeType === 1 && !blocked) {
      // Type 1 mistake on attempt 1 (passed haram)
      delta = -randomBetween(6, 12);
    } else if (blocked) {
      // Second Type 1 — hard-blocked on attempt 2
      delta = -randomBetween(10, 18);
    }
    // Type 2 mistake: no change

    const newProfitPct = round2(currentProfitPct + delta);

    await prisma.simulatorSession.create({
      data: {
        userId: user.sub,
        companyId,
        studentDecision: studentPasses ? 'pass' : 'fail',
        correct: isCorrect,
        mistakeType: mistakeType,
        attemptNumber,
        profitPct: newProfitPct,
      },
    });

    type AnswerResponse = {
      correct: boolean;
      mistakeType: number | null;
      blocked: boolean;
      profitPct: number;
      hintText?: string;
      islamicPrinciple?: string;
      lessonCallback?: {
        lessonNumber: number;
        sectionNumber: number;
        label: string;
        href: string;
      };
      explanation?: string;
    };

    const response: AnswerResponse = {
      correct: isCorrect,
      mistakeType,
      blocked,
      profitPct: newProfitPct,
    };

    if (mistakeType === 1 && attemptNumber === 1) {
      response.hintText = company.hintText;
      response.islamicPrinciple = company.islamicPrinciple;
    }

    if (mistakeType === 2 || (mistakeType === 1 && (attemptNumber === 2 || blocked))) {
      response.explanation = company.explanation;
    }

    if (!isCorrect) {
      response.lessonCallback = company.lessonCallback;
    }

    // Suppress unused variable warning — sessionId is accepted for future session validation
    void sessionId;

    return NextResponse.json(response);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/simulator/answer]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
