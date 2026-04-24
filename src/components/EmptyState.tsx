import { Link } from 'react-router-dom'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      {/* Illustration positioned outside/above the content box */}
      <div className="mb-12 flex justify-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sm:w-[140px] sm:h-[140px]"
        >
          {/* Envelope */}
          <rect x="30" y="50" width="80" height="50" rx="4" fill="none" stroke="#7C3AED" strokeWidth="2"/>
          <path d="M30 50 L70 75 L110 50" stroke="#7C3AED" strokeWidth="2" fill="none"/>
          
          {/* Plus Icon */}
          <circle cx="70" cy="70" r="35" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
          <line x1="70" y1="55" x2="70" y2="85" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
          <line x1="55" y1="70" x2="85" y2="70" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Content box */}
      <div className="text-center px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
          There is nothing here
        </h2>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-sm mb-8">
          Create an invoice by clicking the New Invoice button and get started
        </p>

        <Link
          to="/create"
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors"
        >
          New Invoice
        </Link>
      </div>
    </div>
  )
}
