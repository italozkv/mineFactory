import { SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function FilterBar({
  loaders,
  versions,
  selectedLoader,
  selectedVersion,
  onLoaderChange,
  onVersionChange,
  onClear,
}) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';
  const hasFilters = selectedLoader.length > 0 || selectedVersion.length > 0;

  return (
    <div className="glass-panel grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
      <div className={`flex items-center gap-2 text-sm font-medium ${light ? 'text-slate-700' : 'text-zinc-300'}`}>
        <SlidersHorizontal size={17} className={light ? 'text-emerald-600' : 'text-emerald-300'} />
        {t.filters.title}
      </div>

      <select
        aria-label="Filtrar por loader"
        value={selectedLoader}
        onChange={(event) => onLoaderChange(event.target.value)}
        className={`h-10 cursor-pointer rounded-lg border px-3 text-sm outline-none transition-colors duration-200 ${
          light
            ? 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-emerald-500/70'
            : 'border-white/10 bg-zinc-950 text-zinc-100 hover:border-white/20 focus:border-emerald-400/70'
        }`}
      >
        <option value="">{t.filters.allLoaders}</option>
        {loaders.map((loader) => (
          <option key={loader} value={loader}>
            {loader}
          </option>
        ))}
      </select>

      <select
        aria-label={t.filters.versionLabel}
        value={selectedVersion}
        onChange={(event) => onVersionChange(event.target.value)}
        className={`h-10 cursor-pointer rounded-lg border px-3 text-sm outline-none transition-colors duration-200 ${
          light
            ? 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-sky-500/70'
            : 'border-white/10 bg-zinc-950 text-zinc-100 hover:border-white/20 focus:border-sky-400/70'
        }`}
      >
        <option value="">{t.filters.allVersions}</option>
        {versions.map((version) => (
          <option key={version} value={version}>
            Minecraft {version}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasFilters}
        className={`flex h-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
          light
            ? 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 disabled:hover:border-slate-200 disabled:hover:bg-transparent'
            : 'border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white disabled:hover:border-white/10 disabled:hover:bg-transparent'
        }`}
      >
        <X size={15} />
        {t.filters.clear}
      </button>
    </div>
  );
}
