'use client';

import { useState, useMemo } from 'react';
import { generatePriceHistory } from '@/lib/gbm';

interface WatchlistCompany {
  id: string;
  name: string;
  industry: string;
}

interface Holding {
  companyId: string;
  companyName: string;
  shares: number;
  totalCost: number;
}

interface TradingPhaseProps {
  watchlist: WatchlistCompany[];
  startingCash: number;
  onComplete: (finalCash: number) => void;
}

const TOTAL_DAYS = 30;

export default function TradingPhase({ watchlist, startingCash, onComplete }: TradingPhaseProps) {
  const [day, setDay] = useState(0);
  const [cash, setCash] = useState(startingCash);
  const [holdings, setHoldings] = useState<Holding[]>([]);

  // Generate full 30-day price history for each company once on mount
  const priceHistories = useMemo(() => {
    return Object.fromEntries(watchlist.map((c) => [c.id, generatePriceHistory(c.id, TOTAL_DAYS)]));
  }, [watchlist]);

  function currentPrice(companyId: string): number {
    return Math.round((priceHistories[companyId]?.[day] ?? 100) * 100) / 100;
  }

  function prevPrice(companyId: string): number {
    if (day === 0) return priceHistories[companyId]?.[0] ?? 100;
    return priceHistories[companyId]?.[day - 1] ?? 100;
  }

  const portfolioValue = holdings.reduce((sum, h) => sum + h.shares * currentPrice(h.companyId), 0);

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
      return [...prev, { companyId: company.id, companyName: company.name, shares: 1, totalCost: price }];
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

  function handleNextDay() {
    if (day < TOTAL_DAYS - 1) setDay((d) => d + 1);
  }

  function handleFinish() {
    const liquidatedCash = holdings.reduce((sum, h) => sum + h.shares * currentPrice(h.companyId), 0);
    onComplete(Math.round(cash + liquidatedCash));
  }

  function fmt(n: number) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const isLastDay = day === TOTAL_DAYS - 1;

  // Empty watchlist — student passed no halal companies
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
            className="w-full rounded-xl bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          >
            See results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Disclaimer */}
      <div className="bg-[#2a2010] border border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-[#f0d98a]">
        Educational only. Prices are simulated using a mathematical model. Not real market data.
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#e8eeff]">Trading Phase</h1>
          <p className="text-xs text-[#4a6a9a] mt-0.5">
            Day {day + 1} of {TOTAL_DAYS}
            {isLastDay && <span className="ml-2 text-[#f0d98a]">— Last day. Close your positions.</span>}
          </p>
        </div>
        <div className="flex gap-3 text-right">
          <div>
            <p className="text-xs text-[#4a6a9a]">Cash</p>
            <p className="text-base font-bold text-[#c9a84c]">${fmt(cash)}</p>
          </div>
          <div>
            <p className="text-xs text-[#4a6a9a]">Holdings</p>
            <p className="text-base font-bold text-[#e8eeff]">${fmt(portfolioValue)}</p>
          </div>
        </div>
      </div>

      {/* Day controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleNextDay}
          disabled={isLastDay}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
            isLastDay
              ? 'bg-[#1d3268] text-[#4a6a9a] cursor-not-allowed'
              : 'bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d]'
          }`}
        >
          Next Day →
        </button>
        <button
          type="button"
          onClick={handleFinish}
          className="flex-1 rounded-xl border border-[#2d4f8a] bg-[#162550] hover:bg-[#1d3268] text-[#e8eeff] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Finish &amp; Cash Out
        </button>
      </div>

      {/* Watchlist */}
      <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-4 space-y-3">
        <h2 className="text-xs font-semibold text-[#8aabcc] uppercase tracking-wide">Your Watchlist</h2>
        {watchlist.map((company) => {
          const price = currentPrice(company.id);
          const prev = prevPrice(company.id);
          const change = price - prev;
          const changePct = (change / prev) * 100;
          const isUp = change >= 0;
          const canAfford = cash >= price;

          return (
            <div
              key={company.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#1d3268] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#e8eeff] truncate">{company.name}</p>
                <p className="text-xs text-[#4a6a9a]">{company.industry}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#e8eeff]">${fmt(price)}</p>
                  <p className={`text-xs font-medium ${isUp ? 'text-[#4aad70]' : 'text-[#f08080]'}`}>
                    {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{fmt(change)} ({isUp ? '+' : ''}{changePct.toFixed(1)}%)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => buyShare(company)}
                  disabled={!canAfford}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                    canAfford
                      ? 'bg-[#2a7a4b] hover:bg-[#3a8a5b] text-[#e8eeff]'
                      : 'bg-[#1d3268] text-[#4a6a9a] cursor-not-allowed'
                  }`}
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Holdings */}
      <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-4 space-y-3">
        <h2 className="text-xs font-semibold text-[#8aabcc] uppercase tracking-wide">Your Holdings</h2>
        {holdings.length === 0 ? (
          <p className="text-sm text-[#4a6a9a]">No holdings yet. Buy companies above.</p>
        ) : (
          holdings.map((h) => {
            const price = currentPrice(h.companyId);
            const avgCost = h.totalCost / h.shares;
            const pnl = (price - avgCost) * h.shares;
            const pnlPct = ((price - avgCost) / avgCost) * 100;
            const isUp = pnl >= 0;

            return (
              <div
                key={h.companyId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#1d3268] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#e8eeff] truncate">{h.companyName}</p>
                  <p className="text-xs text-[#4a6a9a]">
                    {h.shares} share{h.shares !== 1 ? 's' : ''} · avg ${fmt(avgCost)}
                  </p>
                  <p className={`text-xs font-medium mt-0.5 ${isUp ? 'text-[#4aad70]' : 'text-[#f08080]'}`}>
                    P&amp;L: {isUp ? '+' : ''}${fmt(pnl)} ({isUp ? '+' : ''}{pnlPct.toFixed(1)}%)
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-sm font-bold text-[#e8eeff]">${fmt(price * h.shares)}</p>
                  <button
                    type="button"
                    onClick={() => sellShare(h.companyId)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#8b2a2a] hover:bg-[#a03a3a] text-[#e8eeff] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                  >
                    Sell
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
