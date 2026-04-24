import { Link } from 'react-router-dom'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      {/* Illustration - Person holding microphone */}
      <div className="mb-12 flex justify-center">
        <svg
          width="160"
          height="160"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sm:w-[180px] sm:h-[180px]"
        >
          {/* Head */}
          <circle cx="100" cy="50" r="22" fill="#7C3AED" opacity="0.3"/>
          
          {/* Body - torso */}
          <rect x="80" y="75" width="40" height="45" rx="8" fill="#7C3AED" opacity="0.2"/>
          
          {/* Left arm */}
          <path d="M80 85 Q50 90 40 120" stroke="#7C3AED" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4"/>
          
          {/* Right arm holding mic */}
          <path d="M120 85 Q150 95 160 130" stroke="#7C3AED" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4"/>
          
          {/* Microphone */}
          <g>
            {/* Mic handle */}
            <rect x="155" y="125" width="8" height="50" rx="4" fill="#7C3AED" opacity="0.5"/>
            
            {/* Mic head - circle */}
            <circle cx="159" cy="115" r="12" fill="none" stroke="#7C3AED" strokeWidth="3" opacity="0.6"/>
            
            {/* Mic grille pattern */}
            <line x1="155" y1="110" x2="163" y2="110" stroke="#7C3AED" strokeWidth="1.5" opacity="0.5"/>
            <line x1="155" y1="115" x2="163" y2="115" stroke="#7C3AED" strokeWidth="1.5" opacity="0.5"/>
            <line x1="155" y1="120" x2="163" y2="120" stroke="#7C3AED" strokeWidth="1.5" opacity="0.5"/>
          </g>
          
          {/* Legs */}
          <line x1="90" y1="120" x2="85" y2="170" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" opacity="0.3"/>
          <line x1="110" y1="120" x2="115" y2="170" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" opacity="0.3"/>
          
          {/* Feet */}
          <ellipse cx="85" cy="172" rx="8" ry="5" fill="#7C3AED" opacity="0.3"/>
          <ellipse cx="115" cy="172" rx="8" ry="5" fill="#7C3AED" opacity="0.3"/>
          
          {/* Chat bubble indicator */}
          <g>
            <path d="M40 180 L60 160 L80 170 Q70 190 50 195 Z" fill="none" stroke="#7C3AED" strokeWidth="2" opacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="45" cy="185" r="2" fill="#7C3AED" opacity="0.4"/>
            <circle cx="55" cy="185" r="2" fill="#7C3AED" opacity="0.4"/>
          </g>
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
