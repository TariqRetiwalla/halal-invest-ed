import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';
import { getLessonQuiz } from '@/lib/lessonData';

interface AnswerSubmission {
  questionId: string;
  selectedOption: string;
}

export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const lessonNumber = Number(params?.id);
    if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
      return NextResponse.json({ error: 'Lesson number must be between 1 and 5' }, { status: 400 });
    }

    const questions = getLessonQuiz(lessonNumber);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      !Array.isArray((body as Record<string, unknown>).answers)
    ) {
      return NextResponse.json({ error: 'Request body must contain an answers array' }, { status: 400 });
    }

    const answers = (body as { answers: unknown[] }).answers;

    if (answers.length !== questions.length) {
      return NextResponse.json(
        { error: `Expected ${questions.length} answers, received ${answers.length}` },
        { status: 400 }
      );
    }

    const typedAnswers = answers as AnswerSubmission[];

    let correctCount = 0;
    const feedback = questions.map((question) => {
      const submission = typedAnswers.find((a) => a.questionId === question.id);
      const selected = submission?.selectedOption ?? '';
      const correct = selected === question.correctOptionId;
      if (correct) correctCount++;

      const explanation = correct
        ? 'Correct!'
        : (question.explanations[selected] ?? 'That answer is not correct.');

      return { questionId: question.id, correct, explanation };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const userId = user.sub;

    await prisma.$transaction([
      prisma.quizAttempt.create({
        data: { userId, lessonNumber, score },
      }),
      prisma.lessonProgress.upsert({
        where: { userId_lessonNumber: { userId, lessonNumber } },
        create: { userId, lessonNumber },
        update: {},
      }),
    ]);

    return NextResponse.json({ score, feedback });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/lessons/:id/quiz]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
