'use client';

import { useState } from 'react';

const INITIAL = 1000;
const RATE = 0.07;
const maxValue = INITIAL * Math.pow(1 + RATE, 30);

function formatDollars(value: number): string {
  return '$' + Math.round(value).toLocaleString('en-US');
}

export default function CompoundProfitVisual() {
  const [years, setYears] = useState(10);

  const compound = INITIAL * Math.pow(1 + RATE, years);
  const simple = INITIAL + INITIAL * RATE * years;

  const compoundPct = (compound / maxValue) * 100;
  const simplePct = (simple / maxValue) * 100;

  return (
    <div className="my-8 rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6">
      <p className="text-sm font-semibold text-[#e8eeff] mb-5">
        If you invest $1,000 at 7% profit per year…
      </p>

      {/* Slider */}
      <div className="mb-6">
        <label htmlFor="years-slider" className="block text-sm text-[#8aabcc] mb-2">
          Years invested:{' '}
          <span className="font-bold text-[#c9a84c]">{years} {years === 1 ? 'year' : 'years'}</span>
        </label>
        <input
          id="years-slider"
          type="range"
          min={1}
          max={30}
          value={years}
          onChange={(e) => setYears(parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-full appearance-none bg-[#2d4f8a] accent-[#c9a84c] cursor-pointer"
          aria-label="Years invested"
          aria-valuemin={1}
          aria-valuemax={30}
          aria-valuenow={years}
        />
        <div className="flex justify-between text-xs text-[#4a6a9a] mt-1">
          <span>1 year</span>
          <span>30 years</span>
        </div>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-[#0f1f3d] border border-[#2d4f8a] p-4">
          <p className="text-xs font-medium text-[#c9a84c] mb-1">Compound profit</p>
          <p className="text-xl font-bold text-[#f0d98a]">{formatDollars(compound)}</p>
          <p className="text-xs text-[#8aabcc] mt-0.5">Profit reinvested each year</p>
        </div>
        <div className="rounded-xl bg-[#0f1f3d] border border-[#2d4f8a] p-4">
          <p className="text-xs font-medium text-[#8aabcc] mb-1">Without reinvesting</p>
          <p className="text-xl font-bold text-[#8aabcc]">{formatDollars(simple)}</p>
          <p className="text-xs text-[#4a6a9a] mt-0.5">No reinvestment</p>
        </div>
      </div>

      {/* Visual bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-[#c9a84c]">Compound</span>
            <span className="text-xs text-[#f0d98a]">{formatDollars(compound)}</span>
          </div>
          <div className="h-6 bg-[#0f1f3d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a84c] rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${compoundPct}%` }}
              role="img"
              aria-label={`Compound value: ${formatDollars(compound)}`}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-[#8aabcc]">Without reinvesting</span>
            <span className="text-xs text-[#8aabcc]">{formatDollars(simple)}</span>
          </div>
          <div className="h-6 bg-[#0f1f3d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2d4f8a] rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${simplePct}%` }}
              role="img"
              aria-label={`Without reinvesting value: ${formatDollars(simple)}`}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#4a6a9a]">
        The longer you stay invested, the bigger the gap between compound and simple growth.
      </p>
    </div>
  );
}
