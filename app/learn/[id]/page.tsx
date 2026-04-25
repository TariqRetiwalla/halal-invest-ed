'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import QuizEngine from '@/components/QuizEngine';
import CompoundProfitVisual from '@/components/CompoundProfitVisual';
import NewsPriceChart from '@/components/NewsPriceChart';

interface Lesson {
  number: number;
  title: string;
  accessible: boolean;
  completed: boolean;
  quizScore: number | null;
}

const LESSON_TITLES: Record<number, string> = {
  1: 'What is wealth and how does it grow?',
  2: 'Owning a piece of a real business (Musharakah)',
  3: 'The market: why prices move',
  4: 'Halal screening: what can you invest in?',
  5: 'Building a portfolio: diversification and patience',
};

function Lesson1Content() {
  return (
    <div className="prose-content">
      <h2>What is wealth?</h2>
      <p>
        Wealth isn't just cash sitting in a bank account. It's anything valuable you own — a business,
        a useful skill, a piece of land, or shares in a company. The goal of building wealth isn't
        to hoard it and never spend it. It's to grow it responsibly so that it can support you, your
        family, and your community over time.
      </p>

      <h2>Why does money lose value?</h2>
      <p>
        Have you ever heard your parents say "things were cheaper when I was young"? That's because
        of something called <strong>inflation</strong> — the general rise in prices over time.
      </p>
      <p>
        A dollar today buys less than a dollar ten years ago. If you kept $100 under your mattress for
        ten years, you'd still have $100 in notes — but you'd be able to buy less with it. Prices
        for food, clothes, and everything else will have gone up.
      </p>
      <p>
        This is why simply saving money isn't enough. To stay ahead, your money needs to grow faster
        than inflation.
      </p>

      <h2>Profit vs interest</h2>
      <p>
        In Islam, there's an important distinction between two ways of making money grow.
      </p>
      <p>
        The first is <strong>profit</strong> — earning a return because you did real work or you
        took real ownership and real risk in something. A farmer grows crops and sells them. A
        business owner takes a risk, builds something, and earns a share of what it produces.
      </p>
      <p>
        The second is <strong>riba</strong> (interest) — when money earns money automatically, with
        no link to any real work, real ownership, or real risk. You lend $100, and the rules say you
        must always get back $110, no matter what. Islam forbids this because it's unfair — the
        lender always wins, and the borrower takes all the risk.
      </p>
      <p>
        Halal investing means sharing in real business profits — not collecting guaranteed interest.
      </p>

      <h2>Opportunity cost</h2>
      <p>
        Every choice you make has a hidden cost — the thing you gave up by making that choice.
        Economists call this <strong>opportunity cost</strong>.
      </p>
      <p>
        If you spend your savings on a games console, the opportunity cost is the profit you could
        have earned if you'd invested that money instead. The console isn't necessarily a bad
        choice — but a smart decision-maker thinks about both what they gain <em>and</em> what they
        give up.
      </p>
      <p>
        Good investors are always thinking about opportunity cost. It's one of the most useful
        habits you can build.
      </p>
    </div>
  );
}

function Lesson2Content() {
  return (
    <div className="prose-content">
      <h2>What is a share?</h2>
      <p>
        Imagine you want to start a bakery, but you don't have enough money to buy all the equipment
        on your own. You could ask ten friends to each chip in $100. In return, each friend owns a
        small piece — a <strong>share</strong> — of the bakery.
      </p>
      <p>
        That's exactly how companies work. When a company needs money to grow, it can sell small
        pieces of itself called shares. When you buy a share, you become a part-owner of that
        business. If the business does well, your share goes up in value and you might receive a
        portion of the profits (called a <strong>dividend</strong>). If it does badly, your share
        goes down in value.
      </p>

      <h2>Musharakah: the Islamic way</h2>
      <p>
        <strong>Musharakah</strong> is an Arabic word meaning "sharing" or "partnership." It's one
        of the foundations of Islamic finance.
      </p>
      <p>
        Instead of lending money and charging interest (riba), you invest alongside the business.
        You put in real money. You share the profit if the business succeeds. And yes — you also
        share the loss if it doesn't. That shared risk is what makes it halal. No one is guaranteed
        a return. Everyone has real skin in the game.
      </p>
      <p>
        This is a much fairer arrangement than conventional interest-based lending, where the lender
        always gets paid regardless of how the business does.
      </p>

      <h2>The power of compound profit</h2>
      <p>
        Here's one of the most exciting ideas in all of investing: <strong>compounding</strong>.
      </p>
      <p>
        When you earn profit on an investment and then reinvest that profit, the next year you earn
        profit on a bigger amount. The year after, bigger still. It grows on itself — slowly at
        first, then faster and faster.
      </p>
      <p>
        Albert Einstein is sometimes credited with calling compound interest "the eighth wonder of
        the world." Whether he said it or not, the maths is genuinely remarkable. Use the tool
        below to see it in action.
      </p>

      <CompoundProfitVisual />

      <h2>Patience is an advantage</h2>
      <p>
        Compound profit needs one key ingredient: time. The longer you stay invested in a good,
        halal business, the more powerful the effect becomes.
      </p>
      <p>
        This is why starting young is such a big advantage. If you begin investing at 14, you have
        decades of compounding ahead of you. Every year you wait is a year of growth you can never
        get back.
      </p>
    </div>
  );
}

function Lesson3Content() {
  return (
    <div className="prose-content">
      <h2>What is a market?</h2>
      <p>
        A market is simply a place where buyers and sellers meet to exchange things. A fruit market
        sells fruit. A stock market lets people buy and sell shares in companies.
      </p>
      <p>
        In a stock market, prices change constantly — sometimes every second — based on what buyers
        and sellers think a company is currently worth. No one sets the price from above; it emerges
        naturally from millions of people making decisions.
      </p>

      <h2>Supply and demand</h2>
      <p>
        The basic rule of any market is supply and demand. When lots of people want to buy something
        and not many people want to sell it, the price goes up. When more people want to sell than
        buy, the price drops.
      </p>
      <p>
        It's the same with shares. If investors are excited about a company and lots of people want
        to own a piece of it, the share price rises. If investors are worried and rushing to sell,
        the price falls.
      </p>

      <h2>News moves prices</h2>
      <p>
        One of the biggest things that shifts supply and demand is <strong>news</strong>. When
        something good happens to a company — record profits, a new product, a major contract —
        investors get excited and want to buy. Price goes up.
      </p>
      <p>
        When something bad happens — a scandal, rising costs, a product failure — investors get
        nervous and want to sell. Price goes down.
      </p>
      <p>
        Click the news events on the chart below to see how real events moved a fictional company's
        share price.
      </p>

      <NewsPriceChart />

      <h2>Why shorting is haram</h2>
      <p>
        <strong>Short-selling</strong> (or "shorting") is a trading strategy where you borrow
        someone else's shares, sell them immediately, wait for the price to drop, buy them back
        cheaper, and pocket the difference.
      </p>
      <p>
        Islam is clear: you can only sell something you actually own. Selling borrowed shares
        violates this principle directly.
      </p>
      <p>
        There's also an ethical problem. Shorting profits when a company's price falls. That means
        a short-seller is hoping the company does badly — sometimes actively spreading negative
        information to make it happen. This is the opposite of constructive investment, which grows
        real businesses and creates real value.
      </p>
      <p>
        Halal investors don't short. They only buy what they actually own, in companies they
        genuinely believe in.
      </p>
    </div>
  );
}

function Lesson4Content() {
  return (
    <div className="prose-content">
      <h2>Not every company is halal</h2>
      <p>
        Owning shares in a company means you own a piece of its business. That means you share in
        its profits — and its activities. If a company makes money from things that are haram, your
        investment is tainted.
      </p>
      <p>
        A halal investor has to check before buying. This process is called <strong>halal screening</strong>.
      </p>

      <h2>Business type screening</h2>
      <p>
        The first filter is simple: what does the company actually do?
      </p>
      <p>
        Companies to avoid include those whose primary business involves alcohol, tobacco, weapons
        manufacturing, pornography, conventional banking or insurance (which is riba-based), or
        gambling.
      </p>
      <p>
        Companies that are generally fine include those in technology, healthcare, food (where the
        food itself is halal), retail, renewable energy, and many other sectors.
      </p>

      <h2>Financial ratio screening</h2>
      <p>
        Even a company in a halal sector might not pass screening if its finances involve too much
        debt or interest income.
      </p>
      <p>
        Islamic scholars generally use these thresholds:
      </p>
      <ul>
        <li>
          <strong>Debt ratio:</strong> Total debt should be less than 33% of total assets. A company
          built heavily on borrowed money is problematic.
        </li>
        <li>
          <strong>Interest income:</strong> Income from interest (e.g. from a bank account) should
          be less than 5% of total revenue. A tiny amount is usually tolerated; a company earning
          lots of interest income is not acceptable.
        </li>
      </ul>

      <h2>Mixed businesses</h2>
      <p>
        Some companies are mostly halal but have a small part that isn't. A food company that sells
        mostly halal products but also sells a small range of alcohol-containing sauces, for example.
      </p>
      <p>
        Scholars generally allow investing in such companies if the non-halal revenue is below about
        5% of total revenue. However, they recommend <strong>purification</strong> — donating that
        same proportion of your dividend income to charity, to cleanse the haram portion.
      </p>

      <h2>Practical tip</h2>
      <p>
        You don't have to screen every company from scratch yourself. Halal investment indexes and
        screening services (such as those provided by AAOIFI or MSCI) do this work and publish
        their lists of approved companies.
      </p>
      <p>
        In the simulator, you'll get to screen companies yourself using these exact criteria. This
        lesson gives you the knowledge to do that confidently.
      </p>
    </div>
  );
}

function Lesson5Content() {
  return (
    <div className="prose-content">
      <h2>Don't put everything in one place</h2>
      <p>
        Even if you've found a halal company that looks excellent, putting all your money into a
        single company is risky. Companies can fail for reasons nobody predicted — a new competitor,
        a change in the law, a natural disaster. If you're all in on one company and it collapses,
        you lose everything.
      </p>
      <p>
        <strong>Diversification</strong> means spreading your money across different companies,
        sectors, and even countries. If one investment goes down, the others can hold you steady.
      </p>

      <h2>How much diversification?</h2>
      <p>
        You don't need to own hundreds of companies — that actually gets difficult to manage and
        the benefits diminish quickly beyond a certain point.
      </p>
      <p>
        For a beginner, 10 to 15 halal-screened companies across different sectors is a solid
        foundation. Think: a few technology companies, a few in healthcare, a few in food or retail.
        The goal is that no single failure can seriously damage your whole portfolio.
      </p>

      <h2>The halal investor's edge</h2>
      <p>
        Here's something interesting: the rules of halal investing accidentally make you a better
        investor.
      </p>
      <p>
        Conventional investors are often tempted by short-selling, leveraged trading (borrowing to
        bet on price movements), and complex derivatives — strategies that look exciting but that
        research consistently shows destroy wealth over time.
      </p>
      <p>
        A halal investor can't do any of those things. The result? You're left with the strategies
        that actually work: buying real businesses, holding them long-term, and letting compound
        profit do its quiet, powerful work.
      </p>

      <h2>Patience in practice</h2>
      <p>
        Share prices go up and down constantly. Every day there's news that moves markets. This can
        feel alarming if you check your portfolio every hour.
      </p>
      <p>
        A patient investor knows that short-term price movements are mostly noise. What matters is
        the quality of the underlying business over years, not what the price does on a Tuesday.
        If the business is strong and halal, a temporary price drop isn't a disaster — it might
        even be a chance to buy more shares at a lower price.
      </p>
      <p>
        Check your portfolio once a week. Not every hour.
      </p>

      <h2>Putting it all together</h2>
      <p>
        You've now covered the full picture. You know what wealth is and why it matters. You
        understand how owning shares in real businesses creates real profit. You know how markets
        work and why prices move. You can screen a company for halal compliance. And you understand
        how to build a diversified portfolio that can withstand setbacks and grow over time.
      </p>
      <p>
        The next step is practice. The simulator will let you apply everything you've learned —
        screen real (fictional) companies, build a portfolio, and see how your decisions play out.
        Good luck.
      </p>
    </div>
  );
}

const LESSON_CONTENT: Record<number, React.FC> = {
  1: Lesson1Content,
  2: Lesson2Content,
  3: Lesson3Content,
  4: Lesson4Content,
  5: Lesson5Content,
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);

  const idParam = params?.id;
  const lessonNumber = typeof idParam === 'string' ? parseInt(idParam, 10) : NaN;
  const isValidId = !isNaN(lessonNumber) && lessonNumber >= 1 && lessonNumber <= 5;

  useEffect(() => {
    if (!isValidId) {
      setLoading(false);
      return;
    }

    fetch('/api/lessons')
      .then((res) => {
        if (res.status === 401) {
          router.push(`/auth/login?redirect=/learn/${lessonNumber}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setLessons(data.lessons);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [isValidId, lessonNumber, router]);

  const handleQuizComplete = async (_score: number) => {
    setQuizComplete(true);
    try {
      const res = await fetch('/api/lessons');
      if (res.ok) {
        const data = await res.json();
        const updated: Lesson[] = data.lessons;
        setLessons(updated);

        if (lessonNumber === 5) {
          router.push('/play');
          return;
        }

        const next = updated.find((l) => l.number === lessonNumber + 1);
        if (next?.accessible) {
          router.push(`/learn/${lessonNumber + 1}`);
        }
        // next lesson teacher-locked: stay on page, nav buttons appear below
      }
    } catch {
      // network error — nav buttons will appear as fallback
    }
  };

  if (!isValidId) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-[#8aabcc] text-sm mb-4">That lesson doesn't exist.</p>
        <Link href="/learn" className="text-[#c9a84c] text-sm font-medium underline hover:text-[#f0d98a]">
          Back to all lessons
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#162550] rounded w-24" />
          <div className="h-8 bg-[#162550] rounded w-2/3" />
          <div className="h-4 bg-[#162550] rounded w-full" />
          <div className="h-4 bg-[#162550] rounded w-5/6" />
          <div className="h-4 bg-[#162550] rounded w-full" />
        </div>
      </div>
    );
  }

  const thisLesson = lessons.find((l) => l.number === lessonNumber);

  if (thisLesson && !thisLesson.accessible) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#162550] border border-[#2d4f8a] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#e8eeff] mb-2">This lesson is locked</h1>
        <p className="text-sm text-[#8aabcc] mb-6">
          Complete the previous lesson and its quiz to unlock this one.
        </p>
        <Link
          href="/learn"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-[#c9a84c] text-[#0f1f3d] hover:bg-[#b5923a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1f3d]"
        >
          Back to all lessons
        </Link>
      </div>
    );
  }

  const LessonContent = LESSON_CONTENT[lessonNumber];
  const title = LESSON_TITLES[lessonNumber];
  const nextLesson = lessons.find((l) => l.number === lessonNumber + 1);
  const hasNext = nextLesson !== undefined;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-[#8aabcc] hover:text-[#c9a84c] mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All lessons
      </Link>

      {/* Lesson header */}
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold text-[#8aabcc] bg-[#2d4f8a] rounded-full px-3 py-1 mb-3">
          Lesson {lessonNumber}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e8eeff] leading-snug">{title}</h1>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 bg-[#2a2010] border border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-[#f0d98a]">
        Educational content only. Not certified Shariah advice. Always consult a qualified scholar for personal financial decisions.
      </div>

      {/* Lesson content */}
      <div className="lesson-prose bg-[#162550] border border-[#2d4f8a] rounded-2xl p-6 mb-12">
        <LessonContent />
      </div>

      {/* Quiz */}
      <div className="border-t border-[#2d4f8a] pt-10">
        <h2 className="text-xl font-bold text-[#e8eeff] mb-2">Quiz</h2>
        <p className="text-sm text-[#8aabcc] mb-6">
          Answer all questions to complete this lesson.
        </p>
        <QuizEngine lessonNumber={lessonNumber} onComplete={handleQuizComplete} />
      </div>

      {/* Navigation */}
      {quizComplete && (
        <div className="mt-10 flex justify-end gap-3">
          {hasNext && nextLesson?.accessible ? (
            <Link
              href={`/learn/${lessonNumber + 1}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#c9a84c] text-[#0f1f3d] hover:bg-[#b5923a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1f3d]"
            >
              Next lesson
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/learn"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium border border-[#2d4f8a] text-[#8aabcc] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1f3d]"
            >
              Back to lessons
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
