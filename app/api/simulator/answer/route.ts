import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';
import { getCompanyById } from '@/lib/simulatorData';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
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

    // Look up the student's last balance for this game session from the DB.
    // If no prior answer exists in this session (first answer), start at 500.
    const lastAnswer = await prisma.simulatorSession.findFirst({
      where: { userId: user.sub, gameSessionId: sessionId },
      orderBy: { createdAt: 'desc' },
      select: { cashBalance: true },
    });
    const currentCash =
      lastAnswer?.cashBalance != null && Number.isFinite(lastAnswer.cashBalance)
        ? lastAnswer.cashBalance
        : 500;

    let cashDelta = 0;
    if (isCorrect) {
      cashDelta = Math.round(randomBetween(50, 100));
    } else if (blocked) {
      cashDelta = -Math.round(randomBetween(75, 150));
    } else if (mistakeType === 1) {
      cashDelta = -Math.round(randomBetween(50, 100));
    } else if (mistakeType === 2) {
      cashDelta = -Math.round(randomBetween(25, 50));
    }

    const newCashBalance = Math.round(currentCash + cashDelta);

    await prisma.simulatorSession.create({
      data: {
        userId: user.sub,
        gameSessionId: sessionId,
        companyId,
        studentDecision: studentPasses ? 'pass' : 'fail',
        correct: isCorrect,
        mistakeType,
        attemptNumber,
        cashBalance: newCashBalance,
      },
    });

    type AnswerResponse = {
      correct: boolean;
      mistakeType: number | null;
      blocked: boolean;
      cashBalance: number;
      cashDelta: number;
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
      cashBalance: newCashBalance,
      cashDelta,
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

    return NextResponse.json(response);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/simulator/answer]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
