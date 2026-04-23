import { FiMoon, FiSun } from 'react-icons/fi'
import { Logo } from './Logo'
import { useTheme } from '../context/ThemeContext'

export function Sidebar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      {/* Mobile/Tablet Header (Top Bar) */}
      <header className="lg:hidden bg-gradient-to-r from-primary to-primary-dark dark:from-slate-800 dark:to-slate-900 flex items-center justify-between px-4 py-4 shadow-lg sticky top-0 z-40">
        <div className="w-8 h-8">
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white flex items-center justify-center shadow-md hover:shadow-lg"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:shadow-lg transition-shadow">
            A
          </div>
        </div>
      </header>

      {/* Desktop Sidebar (Left Bar) */}
      <aside className="hidden lg:flex w-[100px] bg-gradient-to-b from-primary to-primary-dark dark:from-slate-800 dark:to-slate-900 flex-col items-center py-6 min-h-screen fixed left-0 top-0 shadow-lg z-40">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-10 h-10">
            <Logo />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white mb-6 flex items-center justify-center shadow-md hover:shadow-lg"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <FiSun size={22} /> : <FiMoon size={22} />}
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:shadow-lg transition-shadow">
          A
        </div>
      </aside>
    </>
  )
}
