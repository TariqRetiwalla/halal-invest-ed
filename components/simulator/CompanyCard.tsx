'use client';

import { generatePriceHistory } from '@/lib/gbm';

interface PublicCompany {
  id: string;
  name: string;
  industry: string;
  description: string;
  mainIncomeSource: string;
  interestIncomeLevel: 'Low' | 'Medium' | 'High';
  debtLevel: 'Low' | 'Medium' | 'High';
}

interface CompanyCardProps {
  company: PublicCompany;
  highlightDebt?: boolean;
  highlightInterest?: boolean;
  highlightSector?: boolean;
  attemptNumber: 1 | 2;
}

type Level = 'Low' | 'Medium' | 'High';

function LevelBadge({ level, highlight }: { level: Level; highlight?: boolean }) {
  const colourMap: Record<Level, string> = {
    Low: 'bg-[#0a2010] text-[#4aad70] border border-[#2a7a4b]',
    Medium: 'bg-[#1a2a1a] text-[#8aad70] border border-[#3a6a3a]',
    High: 'bg-[#2a0808] text-[#f08080] border border-[#8b2a2a]',
  };

  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${colourMap[level]} ${
        highlight
          ? 'ring-2 ring-[#c9a84c] ring-offset-1 ring-offset-[#162550] rounded-lg transition-all'
          : ''
      }`}
    >
      {level}
    </span>
  );
}

function Sparkline({ seed }: { seed: string }) {
  const prices = generatePriceHistory(seed, 30);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const points = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * 100;
      const y = 30 - ((p - min) / (max - min + 0.01)) * 28;
      return `${x},${y}`;
    })
    .join(' ');

  const lastPrice = prices[prices.length - 1];
  const isUp = lastPrice >= prices[0];
  const strokeColour = isUp ? '#4aad70' : '#f08080';

  return (
    <svg
      viewBox="0 0 100 30"
      width="100"
      height="30"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <polyline
        points={points}
        stroke={strokeColour}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CompanyCard({
  company,
  highlightDebt = false,
  highlightInterest = false,
  highlightSector = false,
  attemptNumber,
}: CompanyCardProps) {
  return (
    <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-6">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-[#e8eeff]">{company.name}</h2>
          <span className="bg-[#2d4f8a] text-[#8aabcc] rounded-full px-3 py-1 text-xs">
            {company.industry}
          </span>
        </div>
        <Sparkline seed={company.id} />
      </div>

      {/* Second attempt badge */}
      {attemptNumber === 2 && (
        <div className="mb-4 rounded-lg bg-[#2a2010] border border-[#c9a84c] px-3 py-2 text-xs text-[#f0d98a]">
          Second look — check the highlighted data
        </div>
      )}

      {/* Description */}
      <div
        className={`mb-4 rounded-lg p-3 bg-[#1d3268] ${
          highlightSector
            ? 'ring-2 ring-[#c9a84c] ring-offset-1 ring-offset-[#162550] transition-all'
            : ''
        }`}
      >
        <p className="text-sm text-[#8aabcc] leading-relaxed">{company.description}</p>
      </div>

      {/* Data rows */}
      <div className="space-y-2">
        {/* Main income */}
        <div className="flex items-center justify-between rounded-lg bg-[#1d3268] px-4 py-2.5">
          <span className="text-xs text-[#4a6a9a] font-medium uppercase tracking-wide">
            Main income
          </span>
          <span className="text-sm text-[#e8eeff] text-right max-w-[60%]">
            {company.mainIncomeSource}
          </span>
        </div>

        {/* Interest income */}
        <div
          className={`flex items-center justify-between rounded-lg bg-[#1d3268] px-4 py-2.5 ${
            highlightInterest
              ? 'ring-2 ring-[#c9a84c] ring-offset-1 ring-offset-[#162550] transition-all'
              : ''
          }`}
        >
          <span className="text-xs text-[#4a6a9a] font-medium uppercase tracking-wide">
            Interest income
          </span>
          <LevelBadge level={company.interestIncomeLevel} />
        </div>

        {/* Debt level */}
        <div
          className={`flex items-center justify-between rounded-lg bg-[#1d3268] px-4 py-2.5 ${
            highlightDebt
              ? 'ring-2 ring-[#c9a84c] ring-offset-1 ring-offset-[#162550] transition-all'
              : ''
          }`}
        >
          <span className="text-xs text-[#4a6a9a] font-medium uppercase tracking-wide">
            Debt level
          </span>
          <LevelBadge level={company.debtLevel} highlight={highlightDebt} />
        </div>
      </div>
    </div>
  );
}
