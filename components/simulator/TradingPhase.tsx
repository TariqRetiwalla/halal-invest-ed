'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WatchlistCompany {
  id: string;
  name: string;
  industry: string;
}

interface TradingPhaseProps {
  watchlist: WatchlistCompany[];
  startingCash: number;
  sessionId: string;
  onComplete: (finalCash: number) => void;
}

interface CompanyMarket {
  initialPrice: number;
  prices: number[];
  drift: number;      // per-tick trend bias, e.g. +0.02 = +2% per tick
  driftTicks: number; // ticks remaining before drift randomises
}

interface Holding {
  companyId: string;
  companyName: string;
  shares: number;
  totalCost: number;
}

interface NewsItem {
  id: string;
  companyId: string;
  companyName: string;
  headline: string;
  sentiment: 'positive' | 'negative';
  tick: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TICK_MS = 60_000; // 1 real minute
const MAX_HISTORY = 60; // ticks kept in chart

const POSITIVE_HEADLINES = [
  'reports record quarterly revenue',
  'announces major expansion into new markets',
  'receives analyst upgrade to Strong Buy',
  'signs landmark strategic partnership',
  'exceeds earnings expectations',
  'launches highly anticipated new product',
  'secures significant government contract',
  'posts strongest revenue growth in five years',
  'announces share buyback programme',
  'receives top industry rating for sustainability',
];

const NEGATIVE_HEADLINES = [
  'faces new regulatory investigation',
  'reports disappointing quarterly results',
  'loses key contract to rival firm',
  'announces unexpected leadership departure',
  'issues revenue warning for next quarter',
  'recalls product amid quality concerns',
  'faces supply chain disruptions',
  'under scrutiny for accounting practices',
  'reports widening operating losses',
  'loses major market share to competitor',
];

const COMPANY_COLORS = [
  '#4aad70',
  '#f0d98a',
  '#8aabcc',
  '#f08080',
  '#c084fc',
  '#fb923c',
  '#34d399',
  '#60a5fa',
  '#f472b6',
  '#a78bfa',
  '#fbbf24',
  '#e879f9',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Price chart ──────────────────────────────────────────────────────────────

function PriceChart({
  market,
  companies,
}: {
  market: Record<string, CompanyMarket>;
  companies: WatchlistCompany[];
}) {
  const VW = 1200;
  const VH = 340;
  const PL = 62;
  const PR = 12;
  const PT = 14;
  const PB = 28;
  const cW = VW - PL - PR;
  const cH = VH - PT - PB;

  // % change from initial price for each company
  const series = companies.map((c, idx) => {
    const m = market[c.id];
    if (!m || m.prices.length === 0) return null;
    const pcts = m.prices.map((p) => ((p - m.initialPrice) / m.initialPrice) * 100);
    return {
      id: c.id,
      name: c.name,
      color: COMPANY_COLORS[idx % COMPANY_COLORS.length],
      pcts,
    };
  }).filter(Boolean) as { id: string; name: string; color: string; pcts: number[] }[];

  const maxLen = Math.max(...series.map((s) => s.pcts.length), 1);

  // Auto-scale Y with a minimum of ±5%
  let minP = -5;
  let maxP = 5;
  for (const s of series) {
    for (const v of s.pcts) {
      if (v < minP) minP = v;
      if (v > maxP) maxP = v;
    }
  }
  const span = maxP - minP;
  minP -= span * 0.08;
  maxP += span * 0.08;
  const totalSpan = maxP - minP;

  function toX(i: number): number {
    return PL + (i / Math.max(maxLen - 1, 1)) * cW;
  }
  function toY(pct: number): number {
    return PT + ((maxP - pct) / totalSpan) * cH;
  }

  const zeroY = toY(0);

  // Y-axis grid labels
  const labelStep = Math.max(1, Math.ceil(totalSpan / 6));
  const yLabels: { y: number; label: string }[] = [];
  const start = Math.ceil(minP / labelStep) * labelStep;
  for (let v = start; v <= maxP; v += labelStep) {
    yLabels.push({ y: toY(v), label: `${v > 0 ? '+' : ''}${v.toFixed(0)}%` });
  }

  return (
    <div className="w-full space-y-3">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        height="340"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
        aria-label="Live price chart"
      >
        {/* Grid lines */}
        {yLabels.map(({ y, label }) => (
          <g key={label}>
            <line
              x1={PL} y1={y} x2={VW - PR} y2={y}
              stroke="#1d3268" strokeWidth="1"
            />
            <text
              x={PL - 6} y={y}
              textAnchor="end" dominantBaseline="middle"
              fill="#4a6a9a" fontSize="13"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Zero baseline */}
        {zeroY >= PT && zeroY <= PT + cH && (
          <line
            x1={PL} y1={zeroY} x2={VW - PR} y2={zeroY}
            stroke="#2d4f8a" strokeWidth="1.5"
          />
        )}

        {/* Chart border */}
        <rect
          x={PL} y={PT} width={cW} height={cH}
          fill="none" stroke="#2d4f8a" strokeWidth="1"
        />

        {/* Company lines */}
        {series.map(({ id, name, color, pcts }) => {
          if (pcts.length < 2) {
            // Single point — render dot
            const cx = toX(0);
            const cy = toY(pcts[0] ?? 0);
            return <circle key={id} cx={cx} cy={cy} r="3" fill={color} />;
          }
          const pts = pcts
            .map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
            .join(' ');
          return (
            <polyline
              key={id}
              points={pts}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* X-axis label */}
        <text
          x={VW / 2} y={VH - 4}
          textAnchor="middle" fill="#4a6a9a" fontSize="12"
        >
          {maxLen === 1 ? 'Waiting for first tick…' : `${maxLen} ticks · 1 tick = 1 minute`}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-1">
        {series.map(({ id, name, color }) => (
          <div key={id} className="flex items-center gap-1.5 min-w-0">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs text-[#8aabcc] truncate max-w-[140px]">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TradingPhase({
  watchlist,
  startingCash,
  sessionId,
  onComplete,
}: TradingPhaseProps) {
  const [market, setMarket] = useState<Record<string, CompanyMarket>>({});
  const [news, setNews] = useState<NewsItem[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [cash, setCash] = useState(startingCash);
  const [tick, setTick] = useState(0);

  // Refs for use inside setInterval (avoid stale closures)
  const marketRef = useRef<Record<string, CompanyMarket>>({});
  const tickRef = useRef(0);
  const nextNewsInRef = useRef(4);

  // Keep marketRef in sync with state
  useEffect(() => {
    marketRef.current = market;
  }, [market]);

  // ── Initialise market ──────────────────────────────────────────────────────
  useEffect(() => {
    const initial: Record<string, CompanyMarket> = {};
    for (const c of watchlist) {
      const ph = djb2(c.id + sessionId);
      const price = 50 + (ph % 100); // $50–$149 seeded initial price
      const dh = djb2(sessionId + c.id + 'drift');
      const drift = ((dh % 2000) / 2000 - 0.5) * 0.04; // –2% to +2% initial drift
      const dticks = 7 + (djb2(c.id + 'dticks') % 8); // 7–14 ticks initial duration
      initial[c.id] = { initialPrice: price, prices: [price], drift, driftTicks: dticks };
    }
    setMarket(initial);
    marketRef.current = initial;
  }, [watchlist, sessionId]);

  // ── Tick interval ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (watchlist.length === 0) return;

    const id = setInterval(() => {
      tickRef.current += 1;
      nextNewsInRef.current -= 1;
      const fireNews = nextNewsInRef.current <= 0;

      const current = marketRef.current;
      const ids = Object.keys(current);
      if (ids.length === 0) return;

      // Determine news event before updating state (refs are current)
      let newsItem: NewsItem | null = null;
      let newsTargetId: string | null = null;
      let newsSentiment: 'positive' | 'negative' = 'positive';
      let newsImpact = 0;
      let newsDrift = 0;
      let newsDriftTicks = 0;

      if (fireNews) {
        nextNewsInRef.current = Math.floor(Math.random() * 5) + 3; // next news in 3–7 ticks
        newsTargetId = ids[Math.floor(Math.random() * ids.length)];
        newsSentiment = Math.random() > 0.45 ? 'positive' : 'negative';
        newsImpact = 0.05 + Math.random() * 0.05; // 5–10% price shock
        // News also sets a sustained drift in that direction for 5–9 ticks
        newsDrift = newsSentiment === 'positive'
          ? 0.012 + Math.random() * 0.025  // +1.2% to +3.7% uptrend
          : -(0.012 + Math.random() * 0.025);
        newsDriftTicks = Math.floor(Math.random() * 5) + 5;

        const company = watchlist.find((c) => c.id === newsTargetId);
        const headlines =
          newsSentiment === 'positive' ? POSITIVE_HEADLINES : NEGATIVE_HEADLINES;
        newsItem = {
          id: `news-${tickRef.current}`,
          companyId: newsTargetId,
          companyName: company?.name ?? newsTargetId,
          headline: headlines[Math.floor(Math.random() * headlines.length)],
          sentiment: newsSentiment,
          tick: tickRef.current,
        };
      }

      // Update all company prices
      setMarket((prev) => {
        const next: Record<string, CompanyMarket> = {};
        for (const [cid, data] of Object.entries(prev)) {
          const isTarget = cid === newsTargetId;
          const last = data.prices[data.prices.length - 1];

          // Drift (trend) + small noise, plus news shock if this company is targeted
          const noise = (Math.random() - 0.5) * 0.03; // ±1.5%
          const shock = isTarget
            ? newsSentiment === 'positive' ? newsImpact : -newsImpact
            : 0;
          const newPrice = Math.max(0.01, last * (1 + data.drift + noise + shock));

          let drift = data.drift;
          let driftTicks = data.driftTicks - 1;

          if (isTarget) {
            // News resets this company's trend for several ticks
            drift = newsDrift;
            driftTicks = newsDriftTicks;
          } else if (driftTicks <= 0) {
            // Time to pick a new trend direction
            drift = (Math.random() - 0.5) * 0.06; // –3% to +3%
            driftTicks = Math.floor(Math.random() * 8) + 7;
          }

          next[cid] = {
            ...data,
            prices: [...data.prices.slice(-(MAX_HISTORY - 1)), newPrice],
            drift,
            driftTicks,
          };
        }
        return next;
      });

      setTick(tickRef.current);
      if (newsItem) setNews((n) => [newsItem!, ...n].slice(0, 20));
    }, TICK_MS);

    return () => clearInterval(id);
  }, [watchlist]); // watchlist is stable during trading

  // ── Derived values ─────────────────────────────────────────────────────────
  function currentPrice(companyId: string): number {
    const m = market[companyId];
    if (!m || m.prices.length === 0) return 0;
    return m.prices[m.prices.length - 1];
  }

  function pctChange(companyId: string): number {
    const m = market[companyId];
    if (!m || m.prices.length === 0) return 0;
    const cur = m.prices[m.prices.length - 1];
    return ((cur - m.initialPrice) / m.initialPrice) * 100;
  }

  const portfolioValue = holdings.reduce(
    (sum, h) => sum + h.shares * currentPrice(h.companyId),
    0
  );
  const totalValue = cash + portfolioValue;
  const pnl = totalValue - startingCash;

  // ── Buy / Sell ──────────────────────────────────────────────────────────────
  function buyShare(company: WatchlistCompany) {
    const price = currentPrice(company.id);
    if (cash < price) return;
    setCash((prev) => Math.round((prev - price) * 100) / 100);
    setHoldings((prev) => {
      const existing = prev.find((h) => h.companyId === company.id);
      if (existing) {
        return prev.map((h) =>
          h.companyId === company.id
            ? { ...h, shares: h.shares + 1, totalCost: h.totalCost + price }
            : h
        );
      }
      return [
        ...prev,
        { companyId: company.id, companyName: company.name, shares: 1, totalCost: price },
      ];
    });
  }

  function sellShare(companyId: string) {
    const holding = holdings.find((h) => h.companyId === companyId);
    if (!holding) return;
    const price = currentPrice(companyId);
    const avgCost = holding.totalCost / holding.shares;
    setCash((prev) => Math.round((prev + price) * 100) / 100);
    setHoldings((prev) =>
      prev
        .map((h) =>
          h.companyId === companyId
            ? { ...h, shares: h.shares - 1, totalCost: h.totalCost - avgCost }
            : h
        )
        .filter((h) => h.shares > 0)
    );
  }

  function handleFinish() {
    const liquidated = holdings.reduce(
      (sum, h) => sum + h.shares * currentPrice(h.companyId),
      0
    );
    onComplete(Math.round(cash + liquidated));
  }

  // ── Empty watchlist ────────────────────────────────────────────────────────
  if (watchlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="bg-[#2a2010] border border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-[#f0d98a]">
          Educational only. Prices are simulated. Not real market data.
        </div>
        <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-8 flex flex-col items-center text-center gap-5">
          <p className="text-[#8aabcc] text-sm">
            You didn&apos;t pass any companies during screening, so there&apos;s nothing to trade.
          </p>
          <button
            type="button"
            onClick={() => onComplete(startingCash)}
            className="w-full rounded-xl bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d] py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          >
            See results
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-5 max-w-[1400px] mx-auto">

      {/* Disclaimer */}
      <div className="bg-[#2a2010] border border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-[#f0d98a]">
        Educational only. Prices are simulated using a mathematical model. Not real market data.
      </div>

      {/* Portfolio header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Cash', value: `$${fmt(cash)}`, color: 'text-[#c9a84c]' },
          { label: 'Holdings', value: `$${fmt(portfolioValue)}`, color: 'text-[#e8eeff]' },
          { label: 'Total', value: `$${fmt(totalValue)}`, color: 'text-[#e8eeff]' },
          {
            label: 'P&L',
            value: `${pnl >= 0 ? '+' : ''}$${fmt(pnl)}`,
            color: pnl >= 0 ? 'text-[#4aad70]' : 'text-[#f08080]',
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-[#162550] border border-[#2d4f8a] rounded-xl px-4 py-3"
          >
            <p className="text-xs text-[#4a6a9a] mb-1">{label}</p>
            <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main grid: chart + news sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">

        {/* Chart */}
        <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#e8eeff] uppercase tracking-wide">
              Live Market — % change from open
            </h2>
            <span className="text-xs text-[#4a6a9a] font-mono">
              {tick === 0 ? 'Waiting for first tick…' : `Tick ${tick}`}
            </span>
          </div>
          <PriceChart market={market} companies={watchlist} />
        </div>

        {/* News sidebar */}
        <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
          <div className="px-4 py-3 border-b border-[#2d4f8a] flex-shrink-0">
            <h2 className="text-sm font-semibold text-[#e8eeff] uppercase tracking-wide">
              Market News
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {news.length === 0 ? (
              <p className="text-xs text-[#4a6a9a] text-center py-8">
                Waiting for market news…
                <br />
                News fires every 3–7 ticks.
              </p>
            ) : (
              news.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl px-3 py-2.5 border ${
                    item.sentiment === 'positive'
                      ? 'bg-[#0a2010] border-[#2a7a4b]'
                      : 'bg-[#2a0808] border-[#8b2a2a]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide ${
                        item.sentiment === 'positive' ? 'text-[#4aad70]' : 'text-[#f08080]'
                      }`}
                    >
                      {item.sentiment === 'positive' ? '▲ Positive' : '▼ Negative'}
                    </span>
                    <span className="text-[10px] text-[#4a6a9a] font-mono flex-shrink-0">
                      T{item.tick}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#e8eeff] leading-snug">
                    {item.companyName}
                  </p>
                  <p className="text-xs text-[#8aabcc] leading-snug mt-0.5">
                    {item.companyName} {item.headline}.
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Watchlist buy/sell table */}
      <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#2d4f8a]">
          <h2 className="text-xs font-semibold text-[#8aabcc] uppercase tracking-wide">
            Your Watchlist
          </h2>
        </div>
        <ul className="divide-y divide-[#2d4f8a]">
          {watchlist.map((company) => {
            const price = currentPrice(company.id);
            const pct = pctChange(company.id);
            const isUp = pct >= 0;
            const holding = holdings.find((h) => h.companyId === company.id);
            const shares = holding?.shares ?? 0;
            const canAfford = cash >= price && price > 0;

            return (
              <li
                key={company.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#e8eeff] truncate">{company.name}</p>
                  <p className="text-xs text-[#4a6a9a]">{company.industry}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold font-mono text-[#e8eeff]">${fmt(price)}</p>
                  <p
                    className={`text-xs font-medium ${
                      isUp ? 'text-[#4aad70]' : 'text-[#f08080]'
                    }`}
                  >
                    {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{pct.toFixed(2)}%
                  </p>
                </div>

                {shares > 0 && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[#4a6a9a]">{shares} share{shares !== 1 ? 's' : ''}</p>
                    <p className="text-xs text-[#e8eeff] font-mono">${fmt(shares * price)}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => buyShare(company)}
                    disabled={!canAfford}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                      canAfford
                        ? 'bg-[#2a7a4b] hover:bg-[#3a8a5b] text-[#e8eeff]'
                        : 'bg-[#1d3268] text-[#4a6a9a] cursor-not-allowed'
                    }`}
                  >
                    Buy
                  </button>
                  {shares > 0 && (
                    <button
                      type="button"
                      onClick={() => sellShare(company.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#8b2a2a] hover:bg-[#a03a3a] text-[#e8eeff] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                    >
                      Sell
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Holdings detail */}
      {holdings.length > 0 && (
        <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#2d4f8a]">
            <h2 className="text-xs font-semibold text-[#8aabcc] uppercase tracking-wide">
              Your Holdings
            </h2>
          </div>
          <ul className="divide-y divide-[#2d4f8a]">
            {holdings.map((h) => {
              const price = currentPrice(h.companyId);
              const avgCost = h.totalCost / h.shares;
              const pnlH = (price - avgCost) * h.shares;
              const pnlPct = ((price - avgCost) / avgCost) * 100;
              const up = pnlH >= 0;
              return (
                <li
                  key={h.companyId}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#e8eeff]">{h.companyName}</p>
                    <p className="text-xs text-[#4a6a9a]">
                      {h.shares} share{h.shares !== 1 ? 's' : ''} · avg ${fmt(avgCost)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold font-mono text-[#e8eeff]">
                      ${fmt(price * h.shares)}
                    </p>
                    <p className={`text-xs font-medium ${up ? 'text-[#4aad70]' : 'text-[#f08080]'}`}>
                      {up ? '+' : ''}${fmt(pnlH)} ({up ? '+' : ''}{pnlPct.toFixed(1)}%)
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Cash out */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleFinish}
          className="rounded-xl bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d] px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Finish &amp; Cash Out
        </button>
      </div>
    </div>
  );
}
