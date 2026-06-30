import { Boxes, ExternalLink, Tag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import { LOADERS, MINECRAFT_VERSIONS } from '../constants/projects.js';
import { listPublicProjects } from '../services/adminService.js';
import { normalizeProject } from '../utils/formatters.js';

export default function PublicProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState('');
  const [version, setVersion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadProjects() {
      setLoading(true);
      setError('');
      try {
        const data = await listPublicProjects({ search, loader, minecraftVersion: version });
        if (alive) setProjects(data.map(normalizeProject));
      } catch (loadError) {
        if (alive) setError(loadError.message || 'Nao foi possivel carregar os projetos.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    const timeout = window.setTimeout(loadProjects, 250);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
    };
  }, [search, loader, version]);

  const total = useMemo(() => projects.length, [projects]);

  return (
    <section className="content-wrap grid gap-8 py-12">
      <div className="grid gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <Boxes size={18} />
          Projetos Publicos
        </div>
        <h1 className="text-4xl font-black text-white">Projetos MineFactory</h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">
          Catalogo publico dos mods marcados como publicos e publicados no painel admin.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
        <SearchBar value={search} onChange={setSearch} />
        <select
          value={version}
          onChange={(event) => setVersion(event.target.value)}
          className="h-11 rounded-lg border border-white/10 bg-zinc-900/80 px-3 text-sm text-white outline-none"
        >
          <option value="">Minecraft</option>
          {MINECRAFT_VERSIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={loader}
          onChange={(event) => setLoader(event.target.value)}
          className="h-11 rounded-lg border border-white/10 bg-zinc-900/80 px-3 text-sm text-white outline-none"
        >
          <option value="">Loader</option>
          {LOADERS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}

      <div className="text-sm text-zinc-500">{loading ? 'Carregando projetos...' : `${total} projeto(s) encontrado(s)`}</div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.slug}`}
            className="group overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40"
          >
            <div className="h-40 bg-zinc-950">
              {project.banner_url ? (
                <img src={project.banner_url} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="grid h-full place-items-center text-zinc-600">Sem banner</div>
              )}
            </div>
            <div className="grid gap-4 p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
                  {project.logo_url ? <img src={project.logo_url} alt="" className="size-full object-cover" /> : project.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-white">{project.name}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">{project.short_description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.category && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
                    <Tag size={13} />
                    {project.category.name}
                  </span>
                )}
                {project.loaders?.map((item) => (
                  <span key={item} className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
                    {item}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                Ver projeto
                <ExternalLink size={15} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!loading && projects.length === 0 && (
        <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center text-zinc-400">
          Nenhum projeto publico encontrado.
        </div>
      )}
    </section>
  );
}
