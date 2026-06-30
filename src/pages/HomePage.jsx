import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Boxes, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import ModGrid from '../components/ModGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useLanguage } from '../components/LanguageProvider.jsx';
import { useTheme } from '../components/ThemeProvider.jsx';
import { listPublicProjects } from '../services/adminService.js';
import { projectToPublicCard } from '../utils/formatters.js';

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function getOAuthErrorFromUrl() {
  if (typeof window === 'undefined') return null;

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const error = searchParams.get('error') || hashParams.get('error');
  const errorCode = searchParams.get('error_code') || hashParams.get('error_code');
  const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

  if (!error && !errorCode && !errorDescription) return null;

  return {
    error,
    errorCode,
    errorDescription,
  };
}

function Counter({ value }) {
  const { theme } = useTheme();
  const light = theme === 'light';
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={`text-3xl font-black ${light ? 'text-slate-950' : 'text-white'}`}>{display}</span>;
}

export default function HomePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';
  const [search, setSearch] = useState('');
  const [selectedLoader, setSelectedLoader] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [oauthError] = useState(getOAuthErrorFromUrl);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadProjects() {
      setLoadingProjects(true);
      setProjectsError('');
      try {
        const data = await listPublicProjects();
        if (alive) setProjects(data.map(projectToPublicCard));
      } catch (error) {
        if (alive) setProjectsError(error.message || 'Nao foi possivel carregar os projetos.');
      } finally {
        if (alive) setLoadingProjects(false);
      }
    }

    loadProjects();

    return () => {
      alive = false;
    };
  }, []);

  const loaders = useMemo(() => uniqueSorted(projects.flatMap((mod) => mod.loaders || [])), [projects]);
  const versions = useMemo(() => uniqueSorted(projects.flatMap((mod) => mod.minecraftVersions || [])).reverse(), [projects]);

  const filteredMods = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return projects.filter((mod) => {
      const matchesSearch = normalizedSearch.length === 0 || mod.name.toLowerCase().includes(normalizedSearch);
      const matchesLoader = selectedLoader.length === 0 || mod.loaders?.includes(selectedLoader);
      const matchesVersion = selectedVersion.length === 0 || mod.minecraftVersions?.includes(selectedVersion);

      return matchesSearch && matchesLoader && matchesVersion;
    });
  }, [projects, search, selectedLoader, selectedVersion]);

  function clearFilters() {
    setSearch('');
    setSelectedLoader('');
    setSelectedVersion('');
  }

  return (
    <>
      {oauthError && (
        <section className="content-wrap pt-6">
          <div
            className={`animate-fade-up rounded-lg border p-4 shadow-lg ${
              light
                ? 'border-rose-200 bg-rose-50 text-rose-950 shadow-rose-950/5'
                : 'border-rose-400/25 bg-rose-500/10 text-rose-50 shadow-black/20'
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold">Nao foi possivel concluir o login com Discord</h2>
                <p className={`mt-1 text-sm ${light ? 'text-rose-800' : 'text-rose-100/80'}`}>
                  O Discord ou Supabase retornou um erro durante a autenticacao. Tente entrar novamente pelo painel admin.
                </p>
                {oauthError.errorDescription && (
                  <p className={`mt-2 text-sm ${light ? 'text-rose-700' : 'text-rose-100/70'}`}>
                    {oauthError.errorDescription}
                  </p>
                )}
                {(oauthError.error || oauthError.errorCode) && (
                  <p className={`mt-2 text-xs ${light ? 'text-rose-700/80' : 'text-rose-100/60'}`}>
                    Detalhes: {[oauthError.error, oauthError.errorCode].filter(Boolean).join(' / ')}
                  </p>
                )}
              </div>
              <Link
                to="/admin/login"
                className={`inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors ${
                  light
                    ? 'border-rose-200 bg-white text-rose-900 hover:border-rose-300'
                    : 'border-rose-300/20 bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className={`relative overflow-hidden border-b ${light ? 'border-slate-200/80' : 'border-white/10'}`}>
        <div className="absolute inset-0">
          <img
            src="/images/mods-hero.png"
            alt=""
            className={`h-full w-full object-cover ${light ? 'opacity-22 saturate-90' : 'opacity-36'}`}
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="content-wrap relative grid min-h-[520px] content-center gap-8 py-20 md:min-h-[580px]">
          <div className="max-w-3xl">
            <div className="animate-fade-up mb-6 flex items-center gap-4">
              <img
                src="/images/minefactory-logo.png"
                alt={t.header.siteName}
                className="block h-24 w-auto max-w-[360px] object-contain md:h-32"
              />
            </div>
            <span
              className={`animate-fade-up mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                light
                  ? 'border-emerald-500/25 bg-emerald-500/8 text-emerald-700'
                  : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
              }`}
              style={{ animationDelay: '80ms' }}
            >
              <Sparkles size={16} />
              {t.home.heroBadge}
            </span>
            <h1
              className={`animate-fade-up text-4xl font-black leading-tight sm:text-6xl ${
                light ? 'text-slate-950' : 'text-white'
              }`}
              style={{ animationDelay: '140ms' }}
            >
              {t.home.heroTitle}
            </h1>
            <p
              className={`animate-fade-up mt-5 max-w-2xl text-base leading-7 sm:text-lg ${
                light ? 'text-slate-700' : 'text-zinc-300'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              {t.home.heroCopy}
            </p>
          </div>

          <div className="animate-fade-up grid gap-3 sm:grid-cols-3" style={{ animationDelay: '260ms' }}>
            <div className="glass-panel rounded-lg p-4 transition-colors hover:border-emerald-400/30">
              <Counter value={projects.length} />
              <p className={`mt-1 text-sm ${light ? 'text-slate-600' : 'text-zinc-400'}`}>{t.home.stats.mods}</p>
            </div>
            <div className="glass-panel rounded-lg p-4 transition-colors hover:border-sky-400/30">
              <Counter value={versions.length} />
              <p className={`mt-1 text-sm ${light ? 'text-slate-600' : 'text-zinc-400'}`}>{t.home.stats.versions}</p>
            </div>
            <div className="glass-panel rounded-lg p-4 transition-colors hover:border-emerald-400/30">
              <Counter value={loaders.length} />
              <p className={`mt-1 text-sm ${light ? 'text-slate-600' : 'text-zinc-400'}`}>{t.home.stats.loaders}</p>
            </div>
          </div>

          <a
            href="#mods"
            className={`animate-fade-up group inline-flex h-11 w-fit items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all duration-200 hover:gap-3 ${
              light
                ? 'border-slate-200 bg-white text-slate-900 hover:border-emerald-500/50 hover:text-slate-950'
                : 'border-white/10 text-zinc-200 hover:border-emerald-400/60 hover:text-white'
            }`}
            style={{ animationDelay: '320ms' }}
          >
            {t.home.cta}
            <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>

      <section id="mods" className="content-wrap grid gap-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className={`mb-3 flex items-center gap-2 text-sm font-semibold ${light ? 'text-emerald-700' : 'text-emerald-300'}`}>
              <Boxes size={18} />
              {t.home.catalogLabel}
            </div>
            <h2 className={`text-3xl font-bold ${light ? 'text-slate-950' : 'text-white'}`}>{t.home.catalogTitle}</h2>
          </div>
          <span className={`text-sm ${light ? 'text-slate-600' : 'text-zinc-400'}`}>
            {loadingProjects ? 'Carregando projetos...' : t.home.results(filteredMods.length, projects.length)}
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1.35fr]">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            loaders={loaders}
            versions={versions}
            selectedLoader={selectedLoader}
            selectedVersion={selectedVersion}
            onLoaderChange={setSelectedLoader}
            onVersionChange={setSelectedVersion}
            onClear={clearFilters}
          />
        </div>

        {projectsError && (
          <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100">
            {projectsError}
          </div>
        )}

        {loadingProjects ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="glass-panel overflow-hidden rounded-lg">
                <div className="skeleton aspect-[16/9]" />
                <div className="grid gap-4 p-4">
                  <div className="skeleton h-6 w-2/3 rounded-lg" />
                  <div className="skeleton h-10 w-full rounded-lg" />
                  <div className="skeleton h-5 w-4/5 rounded-lg" />
                  <div className="skeleton h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ModGrid
            mods={filteredMods}
            emptyTitle="Nenhum projeto publicado ainda"
            emptyCopy="Quando um projeto publico for criado no painel admin, ele aparecera aqui."
          />
        )}
      </section>
    </>
  );
}
