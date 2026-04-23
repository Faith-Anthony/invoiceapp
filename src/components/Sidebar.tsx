import { FiMoon, FiSun } from 'react-icons/fi'
import { Logo } from './Logo'
import { useTheme } from '../context/ThemeContext'

export function Sidebar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <aside className="w-[100px] bg-gradient-to-b from-primary to-primary-dark dark:from-slate-800 dark:to-slate-900 flex flex-col items-center py-6 min-h-screen fixed left-0 top-0 shadow-lg md:w-[120px] lg:w-[100px] z-40">
      {/* Logo */}
      <div className="mb-10 md:mb-16">
        <div className="w-10 h-10 md:w-12 md:h-12">
          <Logo />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2.5 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white mb-4 md:mb-6"
        aria-label="Toggle theme"
      >
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      {/* Profile Avatar */}
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xs md:text-sm cursor-pointer hover:shadow-lg transition-shadow">
        A
      </div>
    </aside>
  )
}
