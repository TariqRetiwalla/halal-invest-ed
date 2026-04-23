'use client';

export interface HistoryEntry {
  companyName: string;
  studentDecision: 'pass' | 'fail';
  correct: boolean;
}

interface ScreeningHistoryProps {
  history: HistoryEntry[];
}

export default function ScreeningHistory({ history }: ScreeningHistoryProps) {
  return (
    <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-4">
      <h3 className="text-[#8aabcc] text-xs font-semibold uppercase tracking-wide mb-3">
        Screening history
      </h3>

      {history.length === 0 ? (
        <p className="text-[#4a6a9a] text-sm">No companies screened yet.</p>
      ) : (
        <ul
          className="space-y-2 max-h-48 overflow-y-auto pr-1"
          aria-label="Screening history"
        >
          {history.map((entry, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-lg bg-[#1d3268] px-3 py-2"
            >
              <span className="text-sm text-[#e8eeff] truncate flex-1 min-w-0">
                {entry.companyName}
              </span>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Student decision badge */}
                <span
                  className={`text-xs rounded-full px-2 py-0.5 border font-medium ${
                    entry.studentDecision === 'pass'
                      ? 'bg-[#0a2010] text-[#4aad70] border-[#2a7a4b]'
                      : 'bg-[#2a0808] text-[#f08080] border-[#8b2a2a]'
                  }`}
                >
                  {entry.studentDecision === 'pass' ? 'Passed' : 'Blocked'}
                </span>

                {/* Correct/incorrect result badge */}
                <span
                  className={`text-xs font-medium ${
                    entry.correct ? 'text-[#4aad70]' : 'text-[#f08080]'
                  }`}
                  aria-label={entry.correct ? 'Correct' : 'Incorrect'}
                >
                  {entry.correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
