export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanations: Record<string, string>;
}

export interface LessonMeta {
  number: number;
  title: string;
  slug: string;
}

export const LESSONS: LessonMeta[] = [
  { number: 1, title: 'What is wealth and how does it grow?', slug: 'what-is-wealth' },
  { number: 2, title: 'Owning a piece of a real business (Musharakah)', slug: 'musharakah' },
  { number: 3, title: 'The market: why prices move', slug: 'why-prices-move' },
  { number: 4, title: 'Halal screening: what can you invest in?', slug: 'halal-screening' },
  { number: 5, title: 'Building a portfolio: diversification and patience', slug: 'portfolio-building' },
];

const QUIZ_DATA: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 'l1q1',
      question: 'What makes money lose its value over time?',
      options: [
        { id: 'a', text: 'Inflation' },
        { id: 'b', text: 'Saving it in a bank account' },
        { id: 'c', text: 'Spending less than you earn' },
        { id: 'd', text: 'Working more hours' },
      ],
      correctOptionId: 'a',
      explanations: {
        b: 'Saving keeps your money safe but it still loses buying power when inflation rises — saving alone doesn\'t stop inflation.',
        c: 'Spending less doesn\'t affect money\'s buying power directly; inflation is what erodes it.',
        d: 'Working more increases your income but doesn\'t prevent inflation from reducing what your money can buy.',
      },
    },
    {
      id: 'l1q2',
      question: 'If you invest £1,000 and earn £100 profit, what is your profit rate?',
      options: [
        { id: 'a', text: '1%' },
        { id: 'b', text: '5%' },
        { id: 'c', text: '10%' },
        { id: 'd', text: '100%' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: '1% of £1,000 would only be £10 in profit — that\'s much less than £100.',
        b: '5% would give you £50 profit, not £100.',
        d: '100% would mean you doubled your money — your profit would equal your full investment of £1,000.',
      },
    },
    {
      id: 'l1q3',
      question: 'Which of these is a halal way to grow your money?',
      options: [
        { id: 'a', text: 'Charging interest on a loan' },
        { id: 'b', text: 'Sharing in a business\'s profits' },
        { id: 'c', text: 'Gambling on price movements' },
        { id: 'd', text: 'Selling something you don\'t yet own' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'Charging interest (riba) is forbidden in Islamic finance because it earns money without real risk or effort.',
        c: 'Gambling on prices is maysir — prohibited because it\'s pure chance with no underlying value creation.',
        d: 'Selling what you don\'t own violates Islamic ownership rules — you must own something before you can sell it.',
      },
    },
    {
      id: 'l1q4',
      question: 'What is opportunity cost?',
      options: [
        { id: 'a', text: 'The price you pay in a shop' },
        { id: 'b', text: 'What you give up when you make a choice' },
        { id: 'c', text: 'A fee you pay for missing a sale' },
        { id: 'd', text: 'A charge added by the bank' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'A shop price is just the cost of a product — opportunity cost is about what you forgo by choosing one option over another.',
        c: 'There\'s no such thing as a "missed sale fee" — opportunity cost is the value of the next best alternative you didn\'t choose.',
        d: 'A bank charge is a fee for a service, not the same as opportunity cost.',
      },
    },
  ],
  2: [
    {
      id: 'l2q1',
      question: 'When you buy a share in a company, what do you become?',
      options: [
        { id: 'a', text: 'A lender to the company' },
        { id: 'b', text: 'An employee of the company' },
        { id: 'c', text: 'A part-owner of the company' },
        { id: 'd', text: 'A customer of the company' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'A lender gives money and expects fixed interest back — that\'s a bond, not a share. Shares give you ownership, not a loan agreement.',
        b: 'Employees work for wages — owning shares makes you an owner who shares in profits and losses.',
        d: 'Customers buy products or services — shareholders own a slice of the business itself.',
      },
    },
    {
      id: 'l2q2',
      question: 'What makes compound profit different from simple profit?',
      options: [
        { id: 'a', text: 'You receive a single payout at the end' },
        { id: 'b', text: 'You earn profit on your previous profits too' },
        { id: 'c', text: 'Profit is only calculated on your original amount' },
        { id: 'd', text: 'Your profits are taxed twice' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'A single payout at the end describes simple profit — compound profit keeps reinvesting and growing throughout.',
        c: 'Calculating profit only on the original amount is simple profit — compound profit grows on the accumulated total.',
        d: 'Being taxed twice is not what compound profit means — it refers to how reinvested profits generate their own profits.',
      },
    },
    {
      id: 'l2q3',
      question: 'Why is Musharakah considered halal?',
      options: [
        { id: 'a', text: 'The return is guaranteed upfront' },
        { id: 'b', text: 'Both partners share the real risk and reward of the business' },
        { id: 'c', text: 'It has been approved by the government' },
        { id: 'd', text: 'It is only available to Muslim business owners' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'A guaranteed return sounds like riba — in Musharakah there are no guarantees, because both parties share the actual risk.',
        c: 'Government approval is not the basis for halal — it\'s the principle of shared risk and reward that makes Musharakah permissible.',
        d: 'Musharakah is a partnership structure based on shared risk, not restricted to Muslim owners.',
      },
    },
    {
      id: 'l2q4',
      question: 'You invest £500, earn 10% profit in year 1, and reinvest everything. How much do you start year 2 with?',
      options: [
        { id: 'a', text: '£500' },
        { id: 'b', text: '£510' },
        { id: 'c', text: '£550' },
        { id: 'd', text: '£600' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: '£500 forgets to add the 10% profit — you earned £50 in year 1, so you start year 2 with more.',
        b: '£510 is the result of 2% profit on £500, not 10%.',
        d: '£600 would mean you earned 20% profit — 10% of £500 is £50, giving you £550.',
      },
    },
  ],
  3: [
    {
      id: 'l3q1',
      question: 'What does basic supply and demand tell us about prices?',
      options: [
        { id: 'a', text: 'When more people want something than is available, prices rise' },
        { id: 'b', text: 'Prices always go up over time' },
        { id: 'c', text: 'Supply limits how much of something you can buy' },
        { id: 'd', text: 'Demand only affects the prices of luxury goods' },
      ],
      correctOptionId: 'a',
      explanations: {
        b: 'Prices don\'t always go up — they can fall when supply is high or demand drops.',
        c: 'Supply describes availability in the market, not a personal purchase limit.',
        d: 'Demand affects prices across all goods, not just luxury items.',
      },
    },
    {
      id: 'l3q2',
      question: 'Why is short-selling not allowed in Islamic finance?',
      options: [
        { id: 'a', text: 'It is too complex for most investors' },
        { id: 'b', text: 'It guarantees a profit with no risk' },
        { id: 'c', text: 'It means selling something you don\'t own yet' },
        { id: 'd', text: 'It is only restricted for banks' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'Complexity is not the reason — the prohibition is about Islamic ownership principles, not difficulty.',
        b: 'Short-selling does not guarantee a profit; it actually carries significant risk. The issue is selling what you don\'t own.',
        d: 'The prohibition applies to all investors under Islamic finance principles, not only banks.',
      },
    },
    {
      id: 'l3q3',
      question: 'A company announces record profits. What usually happens to its share price?',
      options: [
        { id: 'a', text: 'It stays the same because profits are already expected' },
        { id: 'b', text: 'It falls because the company will now spend more' },
        { id: 'c', text: 'It goes up because investors expect more future profits' },
        { id: 'd', text: 'It falls because profits are being paid out to shareholders' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'Record profits — above expectations — typically cause prices to rise as investors update their view of future earnings.',
        b: 'Higher spending concern doesn\'t apply here; record profits signal a healthy, growing business.',
        d: 'Dividend payouts can cause minor adjustments, but record profits generally drive prices up due to improved future expectations.',
      },
    },
    {
      id: 'l3q4',
      question: 'What is gharar in Islamic finance?',
      options: [
        { id: 'a', text: 'A type of halal investment fund' },
        { id: 'b', text: 'Excessive uncertainty or deception in a transaction' },
        { id: 'c', text: 'A profit-sharing agreement between two businesses' },
        { id: 'd', text: 'The interest charged on a bank loan' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'Gharar is not a type of fund — it is a concept describing forbidden uncertainty or ambiguity in a contract.',
        c: 'A profit-sharing agreement describes Musharakah or Mudarabah, not gharar.',
        d: 'Interest on a loan is riba — gharar refers to deceptive or excessively uncertain transactions.',
      },
    },
  ],
  4: [
    {
      id: 'l4q1',
      question: 'Which of these businesses is typically NOT halal to invest in?',
      options: [
        { id: 'a', text: 'A healthcare company' },
        { id: 'b', text: 'A technology company' },
        { id: 'c', text: 'A company that produces alcohol' },
        { id: 'd', text: 'A renewable energy company' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'Healthcare is generally a halal sector — it provides real benefit and is not excluded under Islamic screening criteria.',
        b: 'Technology is generally halal — it doesn\'t fall into prohibited sectors like alcohol, gambling, or weapons.',
        d: 'Renewable energy is generally halal — it supports real societal benefit and doesn\'t involve prohibited activities.',
      },
    },
    {
      id: 'l4q2',
      question: 'What is riba?',
      options: [
        { id: 'a', text: 'A type of business partnership' },
        { id: 'b', text: 'Charging or receiving interest on a loan' },
        { id: 'c', text: 'A tool used to screen halal investments' },
        { id: 'd', text: 'A financial ratio used to value companies' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'A business partnership is Musharakah — riba specifically refers to interest, which is prohibited in Islamic finance.',
        c: 'Riba is not a screening tool; it is the prohibited practice of charging or earning interest.',
        d: 'Riba is not a financial ratio — it is the concept of usury or interest, which is forbidden.',
      },
    },
    {
      id: 'l4q3',
      question: 'A company has total assets of £10 million and total debt of £8 million. Is this a concern for halal investing?',
      options: [
        { id: 'a', text: 'No — the debt ratio tells us nothing about the sector' },
        { id: 'b', text: 'Yes — the debt is too high relative to assets' },
        { id: 'c', text: 'No — it means the company is growing well by borrowing' },
        { id: 'd', text: 'No — all companies have debt, so this is normal' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'The debt ratio matters beyond just the sector — most halal screening guidelines cap total debt as a percentage of assets.',
        c: 'High borrowing relative to assets is a red flag under halal screening, not a sign of healthy growth.',
        d: 'Having some debt isn\'t the issue — the problem is the proportion. A debt-to-assets ratio of 80% is very high under most screening thresholds.',
      },
    },
    {
      id: 'l4q4',
      question: 'A company earns 97% of revenue from halal retail but 3% from conventional insurance. What is the most likely outcome of halal screening?',
      options: [
        { id: 'a', text: 'It fails screening — any non-halal revenue means automatic rejection' },
        { id: 'b', text: 'It passes because the insurance division is small' },
        { id: 'c', text: 'It may pass screening if the non-halal revenue is below the acceptable threshold' },
        { id: 'd', text: 'It passes once the company promises to close the insurance division' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'Blanket automatic rejection ignores the threshold principle — most halal screening standards allow a small percentage of incidental non-halal income.',
        b: 'Simply being small isn\'t enough — it must fall within a defined threshold (typically 5% or less depending on the screening standard).',
        d: 'Promising to close a division is not a screening criterion — screening is based on current revenue, not future intentions.',
      },
    },
  ],
  5: [
    {
      id: 'l5q1',
      question: 'What does diversification mean for your investments?',
      options: [
        { id: 'a', text: 'Putting all your money into one strong company' },
        { id: 'b', text: 'Spreading money across different companies and sectors to reduce risk' },
        { id: 'c', text: 'Buying and selling stocks every day' },
        { id: 'd', text: 'Only investing in large, well-known companies' },
      ],
      correctOptionId: 'b',
      explanations: {
        a: 'Concentrating in one company is the opposite of diversification — if that one company struggles, your entire investment is at risk.',
        c: 'Buying and selling daily is active trading, not diversification — diversification is about spreading risk across holdings.',
        d: 'Sticking to large companies is still concentration — diversification means spreading across sectors and sizes.',
      },
    },
    {
      id: 'l5q2',
      question: 'Why does a long-term halal investor have an advantage?',
      options: [
        { id: 'a', text: 'They avoid all investment risk' },
        { id: 'b', text: 'They receive special tax breaks for halal investing' },
        { id: 'c', text: 'They focus on real business value and avoid risky short-term trades' },
        { id: 'd', text: 'They can predict which companies will be winners' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'No investor avoids all risk — long-term investors manage risk better by holding through short-term volatility.',
        b: 'There are no special tax breaks specifically for halal investing.',
        d: 'No one can reliably pick winners every time — the advantage of long-term halal investing is avoiding speculative short-term trades, not prediction.',
      },
    },
    {
      id: 'l5q3',
      question: 'What is the main benefit of staying invested for a long time?',
      options: [
        { id: 'a', text: 'Share prices only go up over long periods' },
        { id: 'b', text: 'You avoid paying tax on your profits' },
        { id: 'c', text: 'Compound profit has more time to grow your money' },
        { id: 'd', text: 'You get priority access to new shares before other investors' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'Share prices don\'t only go up — markets fall too. The benefit of time is compounding, not guaranteed growth.',
        b: 'Tax avoidance is not the main benefit of long-term investing and varies by country and account type.',
        d: 'Priority share access is not a standard benefit for long-term retail investors.',
      },
    },
    {
      id: 'l5q4',
      question: 'Which of these describes a patient, halal investor?',
      options: [
        { id: 'a', text: 'Selling every time the market drops to protect their money' },
        { id: 'b', text: 'Checking prices every hour to find the best moment to buy' },
        { id: 'c', text: 'Holding good businesses through short-term drops, focused on long-term value' },
        { id: 'd', text: 'Only buying shares after prices have risen sharply' },
      ],
      correctOptionId: 'c',
      explanations: {
        a: 'Selling on every drop locks in losses and means you miss the recovery — patient investors hold through short-term volatility.',
        b: 'Checking prices every hour encourages panic and emotional decisions — the opposite of patient, long-term thinking.',
        d: 'Only buying after sharp rises means buying at high prices — patient investors look for good businesses at fair value, not momentum.',
      },
    },
  ],
};

export function getLessonQuiz(lessonNumber: number): QuizQuestion[] {
  return QUIZ_DATA[lessonNumber] ?? [];
}
