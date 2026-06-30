import { Moon, Sun } from 'lucide-react';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function ThemeToggle() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      aria-label={isLight ? t.theme.dark : t.theme.light}
      aria-pressed={isLight}
      title={isLight ? t.theme.dark : t.theme.light}
      className="relative grid size-10 place-items-center overflow-hidden rounded-lg border border-white/10 text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/50 hover:bg-white/8 hover:text-white"
      onClick={toggleTheme}
    >
      <span
        className={`absolute grid place-items-center transition-all duration-300 ${
          isLight ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'
        }`}
      >
        <Sun size={18} />
      </span>
      <span
        className={`absolute grid place-items-center transition-all duration-300 ${
          isLight ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      >
        <Moon size={18} />
      </span>
    </button>
  );
}
