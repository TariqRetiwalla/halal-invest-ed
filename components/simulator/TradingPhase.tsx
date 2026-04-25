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
  openPrice: number;   // day-open price — fixed, used for % change
  prices: number[];    // last MAX_HISTORY prices
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
  displayTick: number;
}

interface NewsEvent {
  sentiment: 'positive' | 'negative';
  impact: number;
  headline: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TICK_MS = 30_000;
const TICK_S = TICK_MS / 1000;
const MAX_HISTORY = 60;

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
  '#60a5fa',
  '#f08080',
  '#c084fc',
  '#fb923c',
  '#34d399',
  '#8aabcc',
  '#f472b6',
  '#a78bfa',
  '#fbbf24',
  '#e879f9',
];

// ─── Deterministic market engine ──────────────────────────────────────────────
// All price data is derived from (companyId, absoluteTickNumber, marketSeed).
// Given the same inputs, every user on every device gets identical numbers.

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Mulberry32 seeded PRNG — returns a function that yields floats in [0, 1)
function seededRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Market seed: UTC date string — resets daily, same for every user on the same day
function marketSeed(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

// Absolute tick number derived from wall clock — same for everyone at the same moment
function wallTick(): number {
  return Math.floor(Date.now() / TICK_MS);
}

// Drift for a company at a given absolute tick — changes every 10 ticks
function driftAt(companyId: string, tick: number, seed: string): number {
  const epoch = Math.floor(tick / 10);
  const rng = seededRng(djb2(`${companyId}|dr|${epoch}|${seed}`));
  return (rng() - 0.5) * 0.06; // −3 % to +3 %
}

// News event for a company at a given tick (null = no news this tick)
function newsAt(companyId: string, tick: number, seed: string): NewsEvent | null {
  const rng = seededRng(djb2(`${companyId}|nw|${tick}|${seed}`));
  if (rng() >= 0.12) return null; // ~12 % chance per company per tick
  const sentiment: 'positive' | 'negative' = rng() > 0.45 ? 'positive' : 'negative';
  const impact = 0.05 + rng() * 0.05;
  const headlines = sentiment === 'positive' ? POSITIVE_HEADLINES : NEGATIVE_HEADLINES;
  const headline = headlines[Math.floor(rng() * headlines.length)];
  return { sentiment, impact, headline };
}

// Day-open price for a company — seeded only by today's date + companyId
function openPriceFor(companyId: string, seed: string): number {
  const rng = seededRng(djb2(`${companyId}|open|${seed}`));
  return 50 + Math.floor(rng() * 100); // $50–$149
}

// Simulate price history from fromTick to toTick using the open price as the
// starting point. Path-dependent but fully reproducible given the same inputs.
function simulatePrices(
  companyId: string,
  openPrice: number,
  fromTick: number,
  toTick: number,
  seed: string,
): number[] {
  // Walk forward from day start to fromTick to get the correct base price,
  // then continue to toTick keeping last MAX_HISTORY values.
  const dayStart = (() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return Math.floor(d.getTime() / TICK_MS);
  })();

  let price = openPrice;

  // Fast-forward from day start to fromTick (no need to store intermediate values)
  for (let t = dayStart + 1; t < fromTick; t++) {
    const drift = driftAt(companyId, t, seed);
    const event = newsAt(companyId, t, seed);
    const rng = seededRng(djb2(`${companyId}|tn|${t}|${seed}`));
    const noise = (rng() - 0.5) * 0.03;
    const shock = event ? (event.sentiment === 'positive' ? event.impact : -event.impact) : 0;
    price = Math.max(0.01, price * (1 + drift + noise + shock));
  }

  // Collect the visible window
  const prices: number[] = [];
  for (let t = fromTick; t <= toTick; t++) {
    if (t > dayStart) {
      const drift = driftAt(companyId, t, seed);
      const event = newsAt(companyId, t, seed);
      const rng = seededRng(djb2(`${companyId}|tn|${t}|${seed}`));
      const noise = (rng() - 0.5) * 0.03;
      const shock = event ? (event.sentiment === 'positive' ? event.impact : -event.impact) : 0;
      price = Math.max(0.01, price * (1 + drift + noise + shock));
    }
    prices.push(price);
  }
  return prices;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Price chart ──────────────────────────────────────────────────────────────

function PriceChart({
  market,
  companies,
  highlightedId,
  onHighlight,
}: {
  market: Record<string, CompanyMarket>;
  companies: WatchlistCompany[];
  highlightedId: string | null;
  onHighlight: (id: string | null) => void;
}) {
  const VW = 1200;
  const VH = 360;
  const PL = 60;
  const PR = 16;
  const PT = 16;
  const PB = 20;
  const cW = VW - PL - PR;
  const cH = VH - PT - PB;

  const series = companies.map((c, idx) => {
    const m = market[c.id];
    if (!m || m.prices.length === 0) return null;
    const pcts = m.prices.map((p) => ((p - m.openPrice) / m.openPrice) * 100);
    const cur = pcts[pcts.length - 1] ?? 0;
    return { id: c.id, name: c.name, color: COMPANY_COLORS[idx % COMPANY_COLORS.length], pcts, cur };
  }).filter(Boolean) as { id: string; name: string; color: string; pcts: number[]; cur: number }[];

  const maxLen = Math.max(...series.map((s) => s.pcts.length), 1);

  let minP = -5, maxP = 5;
  for (const s of series) for (const v of s.pcts) { if (v < minP) minP = v; if (v > maxP) maxP = v; }
  const span = maxP - minP;
  minP -= span * 0.1;
  maxP += span * 0.1;
  const totalSpan = maxP - minP;

  const toX = (i: number) => PL + (i / Math.max(maxLen - 1, 1)) * cW;
  const toY = (pct: number) => PT + ((maxP - pct) / totalSpan) * cH;
  const zeroY = Math.min(PT + cH, Math.max(PT, toY(0)));

  const labelStep = Math.max(1, Math.ceil(totalSpan / 6));
  const yLabels: { y: number; label: string }[] = [];
  for (let v = Math.ceil(minP / labelStep) * labelStep; v <= maxP; v += labelStep) {
    yLabels.push({ y: toY(v), label: `${v > 0 ? '+' : ''}${v.toFixed(0)}%` });
  }

  const hasHighlight = highlightedId !== null;

  return (
    <div className="w-full space-y-4">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        preserveAspectRatio="none"
        style={{ display: 'block', height: '340px' }}
        aria-label="Live price chart"
      >
        <rect x={PL} y={PT} width={cW} height={cH} fill="#0a1628" />
        {zeroY > PT && <rect x={PL} y={PT} width={cW} height={zeroY - PT} fill="rgba(74,173,112,0.05)" />}
        {zeroY < PT + cH && <rect x={PL} y={zeroY} width={cW} height={PT + cH - zeroY} fill="rgba(240,128,128,0.05)" />}

        {yLabels.map(({ y, label }) => (
          <g key={label}>
            <line x1={PL} y1={y} x2={VW - PR} y2={y} stroke="#1a2f5a" strokeWidth="1" strokeDasharray="6 5" />
            <text x={PL - 8} y={y} textAnchor="end" dominantBaseline="middle" fill="#3d5a8a" fontSize="13" fontFamily="monospace">
              {label}
            </text>
          </g>
        ))}

        <line x1={PL} y1={zeroY} x2={VW - PR} y2={zeroY} stroke="#2d5080" strokeWidth="2" />
        <rect x={PL} y={PT} width={cW} height={cH} fill="none" stroke="#1d3268" strokeWidth="1" />

        {/* Dimmed lines */}
        {series.filter(({ id }) => !hasHighlight || id !== highlightedId).map(({ id, color, pcts }) => {
          if (pcts.length < 2) return <circle key={id} cx={toX(0)} cy={toY(pcts[0] ?? 0)} r="3" fill={color} opacity={hasHighlight ? 0.1 : 0.9} />;
          const pts = pcts.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
          return <polyline key={id} points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity={hasHighlight ? 0.1 : 0.9} />;
        })}

        {/* Highlighted line on top */}
        {hasHighlight && (() => {
          const s = series.find((s) => s.id === highlightedId);
          if (!s || s.pcts.length < 2) return null;
          const pts = s.pcts.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
          return (
            <g>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" opacity="0.18" />
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" opacity="1" />
            </g>
          );
        })()}
      </svg>

      {/* Clickable legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2.5 px-1">
        {series.map(({ id, name, color, cur }) => {
          const isUp = cur >= 0;
          const isActive = highlightedId === id;
          const isDimmed = hasHighlight && !isActive;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onHighlight(isActive ? null : id)}
              className={`flex items-center gap-2 min-w-0 rounded-lg px-2 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                isActive ? 'bg-[#1d3268] ring-1 ring-[#3d6aaa]' : 'hover:bg-[#1a2a50]'
              } ${isDimmed ? 'opacity-25' : 'opacity-100'}`}
            >
              <div className="w-5 h-[2.5px] flex-shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-[#8aabcc] truncate max-w-[120px]">{name}</span>
              <span className={`text-xs font-mono font-semibold flex-shrink-0 ${isUp ? 'text-[#4aad70]' : 'text-[#f08080]'}`}>
                {isUp ? '+' : ''}{cur.toFixed(2)}%
              </span>
            </button>
          );
        })}
        {hasHighlight && (
          <button type="button" onClick={() => onHighlight(null)} className="text-xs text-[#4a6a9a] hover:text-[#8aabcc] px-2 py-1 transition-colors">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TradingPhase({
  watchlist,
  startingCash,
  sessionId: _sessionId,
  onComplete,
}: TradingPhaseProps) {
  const [market, setMarket] = useState<Record<string, CompanyMarket>>({});
  const [news, setNews] = useState<NewsItem[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [cash, setCash] = useState(startingCash);
  const [displayTick, setDisplayTick] = useState(0);
  const [timeToNext, setTimeToNext] = useState(TICK_S);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const marketRef = useRef<Record<string, CompanyMarket>>({});

  useEffect(() => { marketRef.current = market; }, [market]);

  // ── Initialise market from wall-clock history ──────────────────────────────
  useEffect(() => {
    if (watchlist.length === 0) return;
    const seed = marketSeed();
    const curTick = wallTick();
    const fromTick = curTick - MAX_HISTORY + 1;

    const initial: Record<string, CompanyMarket> = {};
    for (const c of watchlist) {
      const openPrice = openPriceFor(c.id, seed);
      const prices = simulatePrices(c.id, openPrice, fromTick, curTick, seed);
      initial[c.id] = { openPrice, prices };
    }
    setMarket(initial);
    marketRef.current = initial;
  }, [watchlist]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const nextTickAt = (wallTick() + 1) * TICK_MS;
      setTimeToNext(Math.max(0, Math.ceil((nextTickAt - Date.now()) / 1000)));
    }, 500);
    return () => clearInterval(id);
  }, []);

  // ── Tick interval — aligned to global wall-clock boundaries ───────────────
  useEffect(() => {
    if (watchlist.length === 0) return;

    function doTick() {
      const seed = marketSeed();
      const curTick = wallTick();

      // Compute new price for each company using deterministic functions
      setMarket((prev) => {
        const next: Record<string, CompanyMarket> = {};
        for (const [cid, data] of Object.entries(prev)) {
          const drift = driftAt(cid, curTick, seed);
          const event = newsAt(cid, curTick, seed);
          const rng = seededRng(djb2(`${cid}|tn|${curTick}|${seed}`));
          const noise = (rng() - 0.5) * 0.03;
          const shock = event ? (event.sentiment === 'positive' ? event.impact : -event.impact) : 0;
          const last = data.prices[data.prices.length - 1];
          const newPrice = Math.max(0.01, last * (1 + drift + noise + shock));
          next[cid] = { ...data, prices: [...data.prices.slice(-(MAX_HISTORY - 1)), newPrice] };
        }
        return next;
      });

      // Generate news items for this tick
      setDisplayTick((prev) => {
        const dt = prev + 1;
        const newItems: NewsItem[] = [];
        for (const c of watchlist) {
          const event = newsAt(c.id, curTick, seed);
          if (event) {
            newItems.push({
              id: `${c.id}-${curTick}`,
              companyId: c.id,
              companyName: c.name,
              headline: event.headline,
              sentiment: event.sentiment,
              displayTick: dt,
            });
          }
        }
        if (newItems.length > 0) setNews((n) => [...newItems, ...n].slice(0, 20));
        return dt;
      });
    }

    // Align first firing to the next real tick boundary
    const msUntilNext = TICK_MS - (Date.now() % TICK_MS);
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      doTick();
      interval = setInterval(doTick, TICK_MS);
    }, msUntilNext);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [watchlist]);

  // ── Derived values ─────────────────────────────────────────────────────────
  function currentPrice(companyId: string): number {
    const m = market[companyId];
    if (!m || m.prices.length === 0) return 0;
    return m.prices[m.prices.length - 1];
  }

  function pctChange(companyId: string): number {
    const m = market[companyId];
    if (!m || m.prices.length === 0) return 0;
    return ((m.prices[m.prices.length - 1] - m.openPrice) / m.openPrice) * 100;
  }

  const portfolioValue = holdings.reduce((sum, h) => sum + h.shares * currentPrice(h.companyId), 0);
  const totalValue = cash + portfolioValue;
  const pnl = totalValue - startingCash;

  // ── Buy / Sell ──────────────────────────────────────────────────────────────
  function buyShare(company: WatchlistCompany) {
    const price = currentPrice(company.id);
    if (cash < price) return;
    setCash((prev) => Math.round((prev - price) * 100) / 100);
    setHoldings((prev) => {
      const existing = prev.find((h) => h.companyId === company.id);
      if (existing) return prev.map((h) => h.companyId === company.id ? { ...h, shares: h.shares + 1, totalCost: h.totalCost + price } : h);
      return [...prev, { companyId: company.id, companyName: company.name, shares: 1, totalCost: price }];
    });
  }

  function sellShare(companyId: string) {
    const holding = holdings.find((h) => h.companyId === companyId);
    if (!holding) return;
    const price = currentPrice(companyId);
    const avgCost = holding.totalCost / holding.shares;
    setCash((prev) => Math.round((prev + price) * 100) / 100);
    setHoldings((prev) => prev.map((h) => h.companyId === companyId ? { ...h, shares: h.shares - 1, totalCost: h.totalCost - avgCost } : h).filter((h) => h.shares > 0));
  }

  function handleFinish() {
    const liquidated = holdings.reduce((sum, h) => sum + h.shares * currentPrice(h.companyId), 0);
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
          <button type="button" onClick={() => onComplete(startingCash)} className="w-full rounded-xl bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d] py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
            See results
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.round(((TICK_S - timeToNext) / TICK_S) * 100);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-5 max-w-[1400px] mx-auto">

      <div className="bg-[#2a2010] border border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-[#f0d98a]">
        Educational only. Prices are simulated using a mathematical model. Not real market data.
      </div>

      {/* Portfolio header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Cash', value: `$${fmt(cash)}`, color: 'text-[#c9a84c]' },
          { label: 'Holdings', value: `$${fmt(portfolioValue)}`, color: 'text-[#e8eeff]' },
          { label: 'Total', value: `$${fmt(totalValue)}`, color: 'text-[#e8eeff]' },
          { label: 'P&L', value: `${pnl >= 0 ? '+' : ''}$${fmt(pnl)}`, color: pnl >= 0 ? 'text-[#4aad70]' : 'text-[#f08080]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#162550] border border-[#2d4f8a] rounded-xl px-4 py-3">
            <p className="text-xs text-[#4a6a9a] mb-1">{label}</p>
            <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Chart + news */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">

        <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3">
            <h2 className="text-sm font-semibold text-[#e8eeff] uppercase tracking-wide">
              Live Market — % change from open
            </h2>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-[#4a6a9a] font-mono">Tick {displayTick}</span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4aad70] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4aad70]" />
                </span>
                <span className="text-xs font-mono text-[#4aad70] w-[42px] text-right">{timeToNext}s</span>
              </div>
            </div>
          </div>

          <div className="h-[3px] w-full bg-[#1d3268]">
            <div className="h-full bg-[#4aad70] transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="px-4 sm:px-5 py-4">
            <PriceChart market={market} companies={watchlist} highlightedId={highlightedId} onHighlight={setHighlightedId} />
          </div>
        </div>

        <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
          <div className="px-4 py-3 border-b border-[#2d4f8a] flex-shrink-0">
            <h2 className="text-sm font-semibold text-[#e8eeff] uppercase tracking-wide">Market News</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {news.length === 0 ? (
              <p className="text-xs text-[#4a6a9a] text-center py-8">
                News updates every few ticks.
              </p>
            ) : (
              news.map((item) => (
                <div key={item.id} className={`rounded-xl px-3 py-2.5 border ${item.sentiment === 'positive' ? 'bg-[#0a2010] border-[#2a7a4b]' : 'bg-[#2a0808] border-[#8b2a2a]'}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${item.sentiment === 'positive' ? 'text-[#4aad70]' : 'text-[#f08080]'}`}>
                      {item.sentiment === 'positive' ? '▲ Positive' : '▼ Negative'}
                    </span>
                    <span className="text-[10px] text-[#4a6a9a] font-mono flex-shrink-0">T{item.displayTick}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#e8eeff] leading-snug">{item.companyName}</p>
                  <p className="text-xs text-[#8aabcc] leading-snug mt-0.5">{item.companyName} {item.headline}.</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#2d4f8a]">
          <h2 className="text-xs font-semibold text-[#8aabcc] uppercase tracking-wide">Your Watchlist</h2>
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
              <li key={company.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#e8eeff] truncate">{company.name}</p>
                  <p className="text-xs text-[#4a6a9a]">{company.industry}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold font-mono text-[#e8eeff]">${fmt(price)}</p>
                  <p className={`text-xs font-medium ${isUp ? 'text-[#4aad70]' : 'text-[#f08080]'}`}>
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
                  <button type="button" onClick={() => buyShare(company)} disabled={!canAfford}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${canAfford ? 'bg-[#2a7a4b] hover:bg-[#3a8a5b] text-[#e8eeff]' : 'bg-[#1d3268] text-[#4a6a9a] cursor-not-allowed'}`}>
                    Buy
                  </button>
                  {shares > 0 && (
                    <button type="button" onClick={() => sellShare(company.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#8b2a2a] hover:bg-[#a03a3a] text-[#e8eeff] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                      Sell
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Holdings */}
      {holdings.length > 0 && (
        <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#2d4f8a]">
            <h2 className="text-xs font-semibold text-[#8aabcc] uppercase tracking-wide">Your Holdings</h2>
          </div>
          <ul className="divide-y divide-[#2d4f8a]">
            {holdings.map((h) => {
              const price = currentPrice(h.companyId);
              const avgCost = h.totalCost / h.shares;
              const pnlH = (price - avgCost) * h.shares;
              const pnlPct = ((price - avgCost) / avgCost) * 100;
              const up = pnlH >= 0;
              return (
                <li key={h.companyId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#e8eeff]">{h.companyName}</p>
                    <p className="text-xs text-[#4a6a9a]">{h.shares} share{h.shares !== 1 ? 's' : ''} · avg ${fmt(avgCost)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold font-mono text-[#e8eeff]">${fmt(price * h.shares)}</p>
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

      <div className="flex justify-end">
        <button type="button" onClick={handleFinish} className="rounded-xl bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d] px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
          Finish &amp; Cash Out
        </button>
      </div>
    </div>
  );
}
