import Link from 'next/link';

const FEATURES = [
  {
    icon: '📚',
    title: '5 Lessons',
    description:
      'Step-by-step lessons covering wealth, business ownership, markets, halal screening, and building a portfolio — written for ages 12 and up.',
  },
  {
    icon: '🔍',
    title: 'Halal Screening Simulator',
    description:
      'Practice evaluating real-style companies against Islamic finance criteria. No real money, no pressure — just learning by doing.',
  },
  {
    icon: '📈',
    title: 'Track Your Progress',
    description:
      'See how far you have come, revisit lessons, and compare your scores if you are part of a class.',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Learn the principles',
    description: 'Work through 5 short lessons at your own pace. Each one builds on the last.',
  },
  {
    step: 2,
    title: 'Practice with the simulator',
    description:
      'Apply what you have learned by screening companies in our interactive halal simulator.',
  },
  {
    step: 3,
    title: 'Track your progress',
    description:
      'Check your stats, revisit quizzes, and see your improvement over time on your account page.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#162550] to-[#0f1f3d] px-4 py-20 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#e8eeff] leading-tight tracking-tight">
            Learn to invest{' '}
            <span className="text-[#c9a84c]">the halal way</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[#8aabcc] max-w-xl mx-auto leading-relaxed">
            A free, beginner-friendly curriculum teaching Islamic finance principles — designed for
            young people aged 12 and up.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-8 py-3.5 text-base font-semibold text-[#0f1f3d] hover:bg-[#b5923a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors shadow-sm"
            >
              Start Learning
            </Link>
            <Link
              href="/start-a-club"
              className="inline-flex items-center justify-center rounded-full border border-[#c9a84c] px-8 py-3.5 text-base font-semibold text-[#c9a84c] hover:bg-[#2a2010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors"
            >
              Start a Club
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-4 py-16 sm:py-20 bg-[#0f1f3d]" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <h2
            id="features-heading"
            className="text-center text-2xl sm:text-3xl font-bold text-[#e8eeff] mb-12"
          >
            Everything you need to get started
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none m-0 p-0">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6 hover:border-[#c9a84c] transition-colors"
              >
                <div className="text-4xl mb-4" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#e8eeff] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#8aabcc] leading-relaxed">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-4 py-16 sm:py-20 bg-[#162550]"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-3xl mx-auto">
          <h2
            id="how-it-works-heading"
            className="text-center text-2xl sm:text-3xl font-bold text-[#e8eeff] mb-12"
          >
            How it works
          </h2>
          <ol className="space-y-8 list-none m-0 p-0">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="flex gap-5 items-start">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c9a84c] text-[#0f1f3d] font-bold text-base flex items-center justify-center shadow-sm"
                  aria-hidden="true"
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#e8eeff] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#8aabcc] leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-8 py-3.5 text-base font-semibold text-[#0f1f3d] hover:bg-[#b5923a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors shadow-sm"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
