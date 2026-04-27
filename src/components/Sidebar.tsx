import { FiMoon, FiSun } from 'react-icons/fi'
import { Logo } from './Logo'
import { useTheme } from '../context/ThemeContext'
import avatarImage from '../assets/Oval.jpg'

export function Sidebar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      {/* Mobile/Tablet Header (Top Bar) - shows on screen < 1024px */}
      <header className="flex items-center justify-between w-full px-4 py-4 block lg:hidden shadow-lg sticky top-0 z-40" style={{ backgroundColor: '#373B53' }}>
        <div className="w-8 h-8">
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 hover:opacity-90 transition-opacity flex items-center justify-center shadow-md hover:shadow-lg"
            style={{
              backgroundColor: '#373B53',
              borderRadius: '5px',
              color: '#7E88C3'
            }}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <img 
            src={avatarImage} 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full cursor-pointer hover:shadow-lg transition-shadow"
          />
        </div>
      </header>

      {/* Desktop Sidebar (Left Bar) - shows on screen >= 1024px */}
      <aside className="hidden lg:flex flex-col items-center w-[100px] min-h-screen px-0 py-6 fixed left-0 top-0 z-40 shadow-lg" style={{ backgroundColor: '#373B53' }}>
        {/* Logo */}
        <div className="w-full h-auto flex items-center justify-center py-8">
          <div className="w-16 h-16">
            <Logo />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 mb-6 hover:opacity-90 transition-opacity flex items-center justify-center shadow-md hover:shadow-lg"
          style={{
            backgroundColor: '#373B53',
            borderRadius: '5px',
            color: '#7E88C3'
          }}
          aria-label="Toggle theme"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <FiSun size={22} /> : <FiMoon size={22} />}
        </button>

        {/* Profile Avatar */}
        <img 
          src={avatarImage} 
          alt="User Avatar" 
          className="w-8 h-8 rounded-full cursor-pointer hover:shadow-lg transition-shadow"
        />
      </aside>
    </>
  )
}
