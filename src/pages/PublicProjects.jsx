import { Boxes } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import ModGrid from '../components/ModGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { listPublicProjects } from '../services/adminService.js';
import { projectToPublicCard } from '../utils/formatters.js';

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

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
        const data = await listPublicProjects();
        if (alive) setProjects(data.map(projectToPublicCard));
      } catch (loadError) {
        if (alive) setError(loadError.message || 'Nao foi possivel carregar os projetos.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      alive = false;
    };
  }, []);

  const loaders = useMemo(() => uniqueSorted(projects.flatMap((project) => project.loaders || [])), [projects]);
  const versions = useMemo(
    () => uniqueSorted(projects.flatMap((project) => project.minecraftVersions || [])).reverse(),
    [projects],
  );
  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch = normalizedSearch.length === 0 || project.name.toLowerCase().includes(normalizedSearch);
      const matchesLoader = loader.length === 0 || project.loaders?.includes(loader);
      const matchesVersion = version.length === 0 || project.minecraftVersions?.includes(version);

      return matchesSearch && matchesLoader && matchesVersion;
    });
  }, [loader, projects, search, version]);

  return (
    <section className="content-wrap grid gap-8 py-12">
      <div className="grid gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <Boxes size={18} />
          Projetos Publicos
        </div>
        <h1 className="text-4xl font-black text-white">Projetos MineFactory</h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">
          Catalogo publico dos mods marcados como publicos no painel admin.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.35fr]">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
          loaders={loaders}
          versions={versions}
          selectedLoader={loader}
          selectedVersion={version}
          onLoaderChange={setLoader}
          onVersionChange={setVersion}
          onClear={() => {
            setLoader('');
            setVersion('');
          }}
        />
      </div>

      {error && <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}

      <div className="text-sm text-zinc-500">
        {loading ? 'Carregando projetos...' : `${filteredProjects.length} projeto(s) encontrado(s)`}
      </div>

      {loading ? (
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
          mods={filteredProjects}
          emptyTitle="Nenhum projeto publicado ainda"
          emptyCopy="Quando um projeto publico for criado no painel admin, ele aparecera aqui."
        />
      )}
    </section>
  );
}
