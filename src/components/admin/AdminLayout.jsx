import { BarChart3, FolderTree, LayoutDashboard, LogOut, Package, Plus, Tags } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projetos', to: '/admin/projects', icon: Package },
  { label: 'Novo Projeto', to: '/admin/projects/new', icon: Plus },
  { label: 'Categorias', to: '/admin/projects/categories', icon: FolderTree },
  { label: 'Tags', to: '/admin/projects/tags', icon: Tags },
];

function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.preferred_username ||
    user?.email ||
    'Admin'
  );
}

export default function AdminLayout({ title, subtitle, actions, children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (alive) setUser(currentUser);
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

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.13),transparent_34rem),radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_32rem),#09090b] text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-zinc-950/88 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-5">
            <img src="/images/minefactory-logo.png" alt="MineFactory" className="h-14 w-auto object-contain" />
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <BarChart3 size={16} />
              Painel Admin
            </div>
          </div>
          <nav className="grid gap-1 p-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-emerald-500/12 text-emerald-100' : 'text-zinc-400 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-900/70 p-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="size-9 rounded-lg object-cover" />
              ) : (
                <span className="grid size-9 place-items-center rounded-lg bg-emerald-500/12 text-sm font-bold text-emerald-300">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-zinc-500">Discord conectado</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="grid size-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-200"
                aria-label="Sair"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/82 backdrop-blur-xl">
          <div className="content-wrap flex min-h-20 flex-col justify-center gap-4 py-4 lg:w-auto lg:px-8">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <p className="text-sm font-semibold text-emerald-300">MineFactory Admin</p>
                <h1 className="mt-1 text-2xl font-black text-white">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </div>
            <nav className="flex gap-2 overflow-x-auto lg:hidden">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                        isActive
                          ? 'border-emerald-400/35 bg-emerald-500/12 text-emerald-100'
                          : 'border-white/10 text-zinc-400'
                      }`
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="content-wrap grid gap-6 py-8 lg:w-auto lg:px-8">{children}</main>
      </div>
    </section>
  );
}
