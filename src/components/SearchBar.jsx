import { Search, X } from 'lucide-react';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function SearchBar({ value, onChange }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <label className="group relative block">
      <Search
        aria-hidden="true"
        className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
          light
            ? 'text-slate-400 group-focus-within:text-emerald-600'
            : 'text-zinc-500 group-focus-within:text-emerald-300'
        }`}
        size={18}
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.search.placeholder}
        className={`h-11 w-full rounded-lg border pl-10 pr-9 text-sm outline-none transition-all duration-200 placeholder:text-zinc-500 focus:ring-4 ${
          light
            ? 'border-slate-200 bg-white text-slate-900 focus:border-emerald-500/70 focus:ring-emerald-500/10'
            : 'border-white/10 bg-zinc-900/80 text-white focus:border-emerald-400/70 focus:ring-emerald-500/10'
        }`}
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label={t.search.clear}
          onClick={() => onChange('')}
          className={`animate-scale-in absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md transition ${
            light
              ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              : 'text-zinc-500 hover:bg-white/10 hover:text-white'
          }`}
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}
