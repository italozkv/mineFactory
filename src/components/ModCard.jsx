import { ArrowRight, Cpu, Layers } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function ModCard({ mod, style }) {
  const [loaded, setLoaded] = useState(false);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <article
      className={`group animate-fade-up overflow-hidden rounded-lg border transition-all duration-300 hover:-translate-y-1.5 ${
        light
          ? 'border-slate-200 bg-white/95 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-900/10'
          : 'border-white/10 bg-zinc-900/76 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-950/30'
      }`}
      style={style}
    >
      <div className={`relative aspect-[16/9] overflow-hidden ${light ? 'bg-slate-200' : 'bg-zinc-800'}`}>
        {!loaded && <div className="skeleton absolute inset-0" />}
        <img
          src={mod.banner}
          alt={`Banner do mod ${mod.name}`}
          className={`h-full w-full object-cover transition-opacity duration-500 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="grid gap-4 p-4">
        <div className="grid gap-2">
          <h2
            className={`text-xl font-semibold transition-colors ${
              light ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-300'
            }`}
          >
            {mod.name}
          </h2>
          <p className={`line-clamp-2 min-h-10 text-sm leading-5 ${light ? 'text-slate-600' : 'text-zinc-400'}`}>
            {mod.shortDescription}
          </p>
        </div>

        <div className={`grid gap-2 text-sm ${light ? 'text-slate-700' : 'text-zinc-300'}`}>
          <span className="flex items-center gap-2">
            <Layers size={16} className={light ? 'text-sky-600' : 'text-sky-300'} />
            Minecraft {mod.minecraftVersions.join(', ')}
          </span>
          <span className="flex items-center gap-2">
            <Cpu size={16} className={light ? 'text-emerald-600' : 'text-emerald-300'} />
            {mod.loaders.join(', ')}
          </span>
        </div>

        <Link
          to={`/mods/${mod.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-emerald-400 hover:gap-3 active:scale-[0.98]"
        >
          {t.modCard.view}
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
