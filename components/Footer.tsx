export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Site name */}
          <p className="text-green-700 font-bold text-base">Halal Invest Ed</p>

          {/* Legal disclaimer */}
          <p className="text-xs text-gray-500 text-center sm:text-left max-w-md">
            Educational only. Not certified Shariah advice. No real financial data.
          </p>

          {/* Links */}
          <nav aria-label="Footer links">
            <ul className="flex gap-4 list-none m-0 p-0">
              <li>
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-green-700 transition-colors underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-green-700 transition-colors underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
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
