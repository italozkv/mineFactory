import { ArrowLeft, ExternalLink, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StatusBadge } from '../components/admin/StatusBadge.jsx';
import { getPublicProjectBySlug } from '../services/adminService.js';
import { projectToPublicCard } from '../utils/formatters.js';

export default function PublicProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadProject() {
      setLoading(true);
      try {
        const data = await getPublicProjectBySlug(slug);
        if (alive) setProject(projectToPublicCard(data));
      } catch (loadError) {
        if (alive) setError(loadError.message || 'Projeto nao encontrado.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProject();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="content-wrap grid min-h-[60vh] place-items-center py-16 text-zinc-400">Carregando projeto...</div>;
  }

  if (error || !project) {
    return (
      <div className="content-wrap grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <h1 className="text-4xl font-black text-white">Projeto nao encontrado</h1>
          <p className="mt-3 text-zinc-400">Este projeto nao esta publico ou nao existe.</p>
          <Link to="/projects" className="mt-6 inline-flex h-10 items-center rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950">
            Voltar para projetos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="animate-fade-in">
      <section className="border-b border-white/10">
        <div className="content-wrap py-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200">
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
          <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
            <img src={project.banner} alt={`Banner do projeto ${project.name}`} className="h-[260px] w-full object-cover sm:h-[360px]" />
          </div>
        </div>
      </section>

      <div className="content-wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="grid gap-8">
          <header className="grid gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid size-20 place-items-center overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                {project.logo ? <img src={project.logo} alt="" className="size-full object-cover" /> : project.name.slice(0, 1)}
              </div>
              <div>
                <h1 className="text-4xl font-black text-white sm:text-5xl">{project.name}</h1>
                <p className="mt-2 text-lg leading-8 text-zinc-300">{project.shortDescription}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.category && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                  <Tag size={14} className="text-emerald-300" />
                  {project.category.name}
                </span>
              )}
              {project.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-200"
                  style={{ background: `${tag.color}24`, borderColor: `${tag.color}55` }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </header>

          <section className="grid gap-4">
            <h2 className="text-2xl font-bold text-white">Descricao</h2>
            <div className="whitespace-pre-wrap rounded-lg border border-white/10 bg-zinc-900/70 p-5 text-sm leading-7 text-zinc-300">
              {project.description}
            </div>
          </section>
        </main>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
          <section className="glass-panel rounded-lg p-5">
            <h2 className="text-lg font-bold text-white">Ficha do Projeto</h2>
            <div className="mt-4 grid gap-4 text-sm">
              <div>
                <span className="text-zinc-500">Status</span>
                <div className="mt-2">
                  <StatusBadge status={project.status} />
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Minecraft</span>
                <p className="mt-1 text-zinc-200">{project.minecraftVersions?.join(', ') || '-'}</p>
              </div>
              <div>
                <span className="text-zinc-500">Loaders</span>
                <p className="mt-1 text-zinc-200">{project.loaders?.join(', ') || '-'}</p>
              </div>
            </div>
          </section>

          {project.external_links?.length > 0 && (
            <section className="glass-panel rounded-lg p-5">
              <h2 className="text-lg font-bold text-white">Links externos</h2>
              <div className="mt-4 grid gap-2">
                {project.external_links.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950/70 p-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-400/40 hover:text-white"
                  >
                    {link.label}
                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
