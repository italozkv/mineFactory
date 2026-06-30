import ModCard from './ModCard.jsx';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function ModGrid({ mods }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';

  if (mods.length === 0) {
    return (
      <div className="glass-panel animate-scale-in rounded-lg p-8 text-center">
        <h2 className={`text-xl font-semibold ${light ? 'text-slate-900' : 'text-white'}`}>
          {t.modCard.noResultsTitle}
        </h2>
        <p className={`mt-2 text-sm ${light ? 'text-slate-600' : 'text-zinc-400'}`}>
          {t.modCard.noResultsCopy}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {mods.map((mod, index) => (
        <ModCard
          key={mod.id}
          mod={mod}
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        />
      ))}
    </div>
  );
}
