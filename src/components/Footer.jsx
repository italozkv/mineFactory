import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <footer
      className={`py-10 text-sm ${
        light ? 'border-t border-slate-200 text-slate-600' : 'border-t border-white/10 text-zinc-400'
      }`}
    >
      <div className="content-wrap flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img
            src="/images/minefactory-logo.png"
            alt="MineFactory"
            className="block h-8 w-auto object-contain md:h-10"
          />
          <span>MineFactory</span>
        </div>
        <span>{t.footer.note}</span>
      </div>
    </footer>
  );
}
