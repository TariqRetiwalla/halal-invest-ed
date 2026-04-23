'use client';

import { useState } from 'react';

const INITIAL = 1000;
const RATE = 0.07;

function formatPounds(value: number): string {
  return '£' + Math.round(value).toLocaleString('en-GB');
}

export default function CompoundProfitVisual() {
  const [years, setYears] = useState(10);

  const compound = INITIAL * Math.pow(1 + RATE, years);
  const simple = INITIAL + INITIAL * RATE * years;

  const maxValue = INITIAL * Math.pow(1 + RATE, 30);
  const compoundPct = (compound / maxValue) * 100;
  const simplePct = (simple / maxValue) * 100;

  return (
    <div className="my-8 rounded-2xl border border-gray-100 bg-gray-50 p-6">
      <p className="text-sm font-semibold text-gray-800 mb-5">
        If you invest £1,000 at 7% profit per year…
      </p>

      {/* Slider */}
      <div className="mb-6">
        <label htmlFor="years-slider" className="block text-sm text-gray-600 mb-2">
          Years invested:{' '}
          <span className="font-bold text-gray-900">{years} {years === 1 ? 'year' : 'years'}</span>
        </label>
        <input
          id="years-slider"
          type="range"
          min={1}
          max={30}
          value={years}
          onChange={(e) => setYears(parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-green-600 cursor-pointer"
          aria-label="Years invested"
          aria-valuemin={1}
          aria-valuemax={30}
          aria-valuenow={years}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 year</span>
          <span>30 years</span>
        </div>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-white border border-green-100 p-4">
          <p className="text-xs font-medium text-green-700 mb-1">Compound profit</p>
          <p className="text-xl font-bold text-green-700">{formatPounds(compound)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Profit reinvested each year</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Simple profit only</p>
          <p className="text-xl font-bold text-gray-700">{formatPounds(simple)}</p>
          <p className="text-xs text-gray-400 mt-0.5">No reinvestment</p>
        </div>
      </div>

      {/* Visual bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-green-700">Compound</span>
            <span className="text-xs text-green-700">{formatPounds(compound)}</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${compoundPct}%` }}
              role="img"
              aria-label={`Compound value: ${formatPounds(compound)}`}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">Simple</span>
            <span className="text-xs text-gray-500">{formatPounds(simple)}</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-300 rounded-full transition-all duration-300"
              style={{ width: `${simplePct}%` }}
              role="img"
              aria-label={`Simple value: ${formatPounds(simple)}`}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        The longer you stay invested, the bigger the gap between compound and simple growth.
      </p>
    </div>
  );
}
