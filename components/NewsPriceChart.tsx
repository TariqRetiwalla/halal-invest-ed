'use client';

import { useState } from 'react';

const PRICES = [120, 118, 125, 130, 145, 140, 135, 155, 165, 158, 170, 180];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface NewsEvent {
  monthIndex: number;
  headline: string;
  explanation: string;
  direction: 'up' | 'down';
}

const NEWS_EVENTS: NewsEvent[] = [
  {
    monthIndex: 3,
    headline: 'TechHalal wins government contract worth £50m',
    explanation: 'Big contracts mean predictable revenue. Investors got excited about future earnings, so more people wanted to buy shares — pushing the price up.',
    direction: 'up',
  },
  {
    monthIndex: 4,
    headline: 'Profits up 30% this year — best ever results',
    explanation: "Record profits showed the business was growing fast. This is exactly what investors want to see, so the price rose sharply as demand for shares increased.",
    direction: 'up',
  },
  {
    monthIndex: 6,
    headline: 'Key engineer leaves company',
    explanation: "Losing a key person raises doubts about the company's future. Investors weren't sure the business could keep performing, so some sold their shares — pushing the price down.",
    direction: 'down',
  },
  {
    monthIndex: 7,
    headline: 'New product line announced — customers excited',
    explanation: 'New products signal growth and innovation. Investor confidence returned and the price recovered as buyers came back.',
    direction: 'up',
  },
  {
    monthIndex: 10,
    headline: 'Annual report: strong sales across all regions',
    explanation: 'Consistent strong sales across multiple regions shows the business is healthy and not dependent on one market. Investors responded positively.',
    direction: 'up',
  },
];

const NEWS_EVENT_MAP = Object.fromEntries(NEWS_EVENTS.map((e) => [e.monthIndex, e]));

const VIEWBOX_W = 400;
const VIEWBOX_H = 200;
const PAD_LEFT = 10;
const PAD_RIGHT = 10;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

const minPrice = Math.min(...PRICES) - 10;
const maxPrice = Math.max(...PRICES) + 10;

function toX(monthIndex: number): number {
  const usableW = VIEWBOX_W - PAD_LEFT - PAD_RIGHT;
  return PAD_LEFT + (monthIndex / (PRICES.length - 1)) * usableW;
}

function toY(price: number): number {
  const usableH = VIEWBOX_H - PAD_TOP - PAD_BOTTOM;
  return PAD_TOP + (1 - (price - minPrice) / (maxPrice - minPrice)) * usableH;
}

const polylinePoints = PRICES.map((p, i) => `${toX(i)},${toY(p)}`).join(' ');

export default function NewsPriceChart() {
  const [activeEvent, setActiveEvent] = useState<NewsEvent | null>(null);

  const handleEventClick = (event: NewsEvent) => {
    setActiveEvent((prev) => (prev?.monthIndex === event.monthIndex ? null : event));
  };

  return (
    <div className="my-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        TechHalal Ltd — Share price (pence), Jan–Dec
      </p>
      <p className="text-xs text-gray-400 mb-4">
        Click a highlighted dot to see what news caused that price movement.
      </p>

      {/* SVG chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="w-full"
          style={{ minWidth: '280px' }}
          role="img"
          aria-label="TechHalal Ltd share price chart over 12 months"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PAD_TOP + frac * (VIEWBOX_H - PAD_TOP - PAD_BOTTOM);
            return (
              <line
                key={frac}
                x1={PAD_LEFT}
                y1={y}
                x2={VIEWBOX_W - PAD_RIGHT}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Price line */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Area fill */}
          <polyline
            points={`${toX(0)},${toY(minPrice)} ${polylinePoints} ${toX(PRICES.length - 1)},${toY(minPrice)}`}
            fill="url(#chartGradient)"
            opacity={0.25}
          />

          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* All month dots */}
          {PRICES.map((price, i) => {
            const event = NEWS_EVENT_MAP[i];
            const x = toX(i);
            const y = toY(price);

            if (event) {
              const isActive = activeEvent?.monthIndex === i;
              return (
                <g key={i}>
                  {isActive && (
                    <circle cx={x} cy={y} r={10} fill={event.direction === 'up' ? '#bbf7d0' : '#fde68a'} opacity={0.6} />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={5}
                    fill={isActive ? (event.direction === 'up' ? '#16a34a' : '#d97706') : '#fff'}
                    stroke={event.direction === 'up' ? '#16a34a' : '#d97706'}
                    strokeWidth={2}
                    className="cursor-pointer"
                    onClick={() => handleEventClick(event)}
                    role="button"
                    aria-label={`News event in ${MONTHS[i]}: ${event.headline}`}
                    aria-pressed={isActive}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEventClick(event);
                      }
                    }}
                  />
                </g>
              );
            }

            return (
              <circle key={i} cx={x} cy={y} r={2.5} fill="#22c55e" />
            );
          })}

          {/* X-axis month labels */}
          {MONTHS.map((month, i) => (
            <text
              key={month}
              x={toX(i)}
              y={VIEWBOX_H - 4}
              textAnchor="middle"
              fontSize={8}
              fill="#9ca3af"
            >
              {month}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full border-2 border-green-600 inline-block" />
          Price rose
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full border-2 border-amber-500 inline-block" />
          Price dipped
        </span>
      </div>

      {/* Callout */}
      {activeEvent ? (
        <div
          className={`rounded-xl border p-4 ${
            activeEvent.direction === 'up'
              ? 'bg-green-50 border-green-100'
              : 'bg-amber-50 border-amber-100'
          }`}
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {MONTHS[activeEvent.monthIndex]} — News
          </p>
          <p className={`text-sm font-semibold mb-2 ${activeEvent.direction === 'up' ? 'text-green-800' : 'text-amber-800'}`}>
            {activeEvent.headline}
          </p>
          <p className="text-sm text-gray-600">{activeEvent.explanation}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-sm text-gray-400">Click a news event to see how it moved the price.</p>
        </div>
      )}
    </div>
  );
}
