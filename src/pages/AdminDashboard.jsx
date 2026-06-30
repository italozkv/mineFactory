import { Download, FileArchive, LogOut, RefreshCcw, Rocket, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageProvider.jsx';
import mods from '../data/mods.json';
import { supabase } from '../lib/supabaseClient.js';

const totalDownloads = mods.reduce((total, mod) => total + mod.downloads.length, 0);
const totalUpdates = mods.reduce((total, mod) => total + mod.changelog.length, 0);
const totalProjects = new Set(mods.flatMap((mod) => mod.categories)).size;

function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.preferred_username ||
    user?.email ||
    'Admin'
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (alive) {
        setUser(currentUser);
      }
    }

    loadUser();

    return () => {
      alive = false;
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = getDisplayName(user);

  const cards = [
    { label: t.adminDashboard.cards.published, value: mods.length, icon: FileArchive, tone: 'emerald' },
    { label: t.adminDashboard.cards.downloads, value: totalDownloads, icon: Download, tone: 'sky' },
    { label: t.adminDashboard.cards.updates, value: totalUpdates, icon: RefreshCcw, tone: 'emerald' },
    { label: t.adminDashboard.cards.projects, value: totalProjects, icon: Rocket, tone: 'sky' },
  ];

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_32rem),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30rem),#09090b] text-zinc-100">
      <header className="border-b border-white/10 bg-zinc-950/86 backdrop-blur-xl">
        <div className="content-wrap flex min-h-20 flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <img src="/images/minefactory-logo.png" alt="MineFactory" className="h-12 w-auto object-contain" />
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <ShieldCheck size={16} />
                {t.adminDashboard.panel}
              </p>
              <h1 className="text-xl font-black text-white">MineFactory</h1>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="size-9 rounded-lg object-cover" />
              ) : (
                <span className="grid size-9 place-items-center rounded-lg bg-emerald-500/12 text-sm font-bold text-emerald-300">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-zinc-500">{t.adminDashboard.discordConnected}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="grid size-10 place-items-center rounded-lg border border-white/10 text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-400/50 hover:text-white active:scale-[0.98]"
              aria-label={t.adminDashboard.logout}
              title={t.adminDashboard.logout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="content-wrap grid gap-8 py-10">
        <div className="animate-fade-up">
          <h2 className="text-3xl font-black text-white">{t.adminDashboard.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{t.adminDashboard.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isEmerald = card.tone === 'emerald';

            return (
              <article
                key={card.label}
                className="glass-panel animate-fade-up rounded-lg p-5 transition-colors hover:border-emerald-400/30"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div
                  className={`grid size-11 place-items-center rounded-lg ${
                    isEmerald ? 'bg-emerald-500/12 text-emerald-300' : 'bg-sky-500/12 text-sky-300'
                  }`}
                >
                  <Icon size={21} />
                </div>
                <p className="mt-5 text-3xl font-black text-white">{card.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{card.label}</p>
              </article>
            );
          })}
        </div>

        <section className="glass-panel animate-fade-up rounded-lg p-5">
          <h3 className="text-lg font-bold text-white">{t.adminDashboard.recentMods}</h3>
          <div className="mt-4 grid gap-3">
            {mods.map((mod) => (
              <div
                key={mod.id}
                className="flex flex-col gap-3 rounded-lg border border-white/10 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={mod.banner} alt={mod.name} className="h-12 w-20 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-white">{mod.name}</p>
                    <p className="text-sm text-zinc-500">{mod.loaders.join(', ')}</p>
                  </div>
                </div>
                <span className="rounded-lg border border-white/10 px-3 py-1 text-sm text-zinc-300">
                  {mod.minecraftVersions.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </section>
  );
}
