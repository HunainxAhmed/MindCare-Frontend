import { Menu, Moon, Sun } from 'lucide-react';

export default function Header({ onMenuClick, isDarkMode, toggleDarkMode }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 z-10 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* FIX: Ensure this button is visible on mobile and triggers the click */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-400 rounded-lg md:hidden transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Current Session</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Secure & Confidential</span>
        </div>
      </div>

      <button
        onClick={toggleDarkMode}
        className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-400 rounded-lg transition-colors"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}