import { ExternalLink, Puzzle, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Gallery from '../components/Gallery.jsx';
import VersionList from '../components/VersionList.jsx';
import { useLanguage } from '../components/LanguageProvider.jsx';
import mods from '../data/mods.json';

function Section({ title, children }) {
  return (
    <section className="animate-fade-up grid gap-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function ModPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const mod = mods.find((item) => item.id === id);

  if (!mod) {
    return (
      <div className="content-wrap animate-fade-in grid min-h-[58vh] place-items-center py-16 text-center">
        <div>
          <h1 className="text-4xl font-black text-white">Mod not found</h1>
          <p className="mt-3 text-zinc-400">This mod does not exist in the local file.</p>
          <Link
            to="/"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-emerald-400 active:scale-[0.98]"
          >
            {t.modPage.backCatalog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="animate-fade-in">
      <section className="border-b border-white/10">
        <div className="content-wrap py-8">
          <Link to="/" className="text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200">
            {t.modPage.backMods}
          </Link>
          <div className="animate-scale-in mt-5 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
            <img
              src={mod.banner}
              alt={`Banner do mod ${mod.name}`}
              className="h-[260px] w-full object-cover sm:h-[360px]"
            />
          </div>
        </div>
      </section>

      <div className="content-wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-10">
          <header className="animate-fade-up grid gap-4">
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">{mod.name}</h1>
            <p className="text-lg leading-8 text-zinc-300">{mod.description}</p>
            <div className="flex flex-wrap gap-2">
              {mod.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors duration-200 hover:border-emerald-400/40 hover:text-white"
                >
                  <Tag size={14} className="text-emerald-300" />
                  {category}
                </span>
              ))}
            </div>
          </header>

          <Section title={t.modPage.versionsTitle}>
            <VersionList downloads={mod.downloads} />
          </Section>

          <Section title={t.modPage.changelogTitle}>
            <div className="grid gap-4">
              {mod.changelog.map((entry) => (
                <div
                  key={`${entry.version}-${entry.date}`}
                  className="rounded-lg border border-white/10 bg-zinc-900/70 p-5 transition-colors duration-200 hover:border-white/20"
                >
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <h3 className="font-semibold text-white">{entry.version}</h3>
                    <time className="text-sm text-zinc-500">{entry.date}</time>
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-zinc-300">
                    {entry.changes.map((change) => (
                      <li key={change} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Galeria">
            <Gallery images={mod.gallery} modName={mod.name} />
          </Section>
        </div>

        <aside className="animate-fade-up grid h-fit gap-5 lg:sticky lg:top-24">
          <div className="glass-panel rounded-lg p-5 transition-colors hover:border-emerald-400/20">
            <h2 className="text-lg font-bold text-white">{t.modPage.compatibilityTitle}</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div>
                <span className="text-zinc-500">Minecraft</span>
                <p className="mt-1 text-zinc-200">{mod.minecraftVersions.join(', ')}</p>
              </div>
              <div>
                <span className="text-zinc-500">Loaders</span>
                <p className="mt-1 text-zinc-200">{mod.loaders.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-5 transition-colors hover:border-sky-400/20">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Puzzle size={19} className="text-sky-300" />
              {t.modPage.dependenciesTitle}
            </h2>
            {mod.dependencies.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {mod.dependencies.map((dependency) => (
                  <a
                    key={dependency.name}
                    href={dependency.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-zinc-950/70 p-3 text-sm text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/50"
                  >
                    <span>
                      {dependency.name}
                      <span className="block text-xs text-zinc-500">
                        {dependency.required ? 'Obrigatoria' : 'Opcional'}
                      </span>
                    </span>
                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-400">{t.modPage.noDependencies}</p>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
