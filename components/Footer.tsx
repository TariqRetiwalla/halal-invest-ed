export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-[#2d4f8a] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Site name */}
          <p className="text-[#c9a84c] font-bold text-base">Halal Invest Ed</p>

          {/* Legal disclaimer */}
          <p className="text-xs text-[#4a6a9a] text-center sm:text-left max-w-md">
            Educational only. Not certified Shariah advice. No real financial data.
          </p>

          {/* Links */}
          <nav aria-label="Footer links">
            <ul className="flex gap-4 list-none m-0 p-0">
              <li>
                <a
                  href="#"
                  className="text-xs text-[#4a6a9a] hover:text-[#c9a84c] transition-colors underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-[#4a6a9a] hover:text-[#c9a84c] transition-colors underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
                >
                  Terms
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
