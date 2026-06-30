import { Lock, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageProvider.jsx';
import { supabase } from '../lib/supabaseClient.js';

export default function Unauthorized() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const discordId = location.state?.discordId;

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <section className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.14),transparent_30rem),radial-gradient(circle_at_top_right,rgba(34,197,94,0.1),transparent_30rem),#09090b] px-4 text-zinc-100">
      <div className="w-full max-w-md animate-scale-in rounded-lg border border-white/10 bg-zinc-900/76 p-8 text-center shadow-2xl shadow-black/30">
        <span className="mx-auto grid size-14 place-items-center rounded-lg bg-red-500/12 text-red-300">
          <Lock size={26} />
        </span>
        <h1 className="mt-6 text-3xl font-black text-white">{t.unauthorized.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{t.unauthorized.copy}</p>

        {discordId && (
          <p className="mt-4 rounded-lg border border-white/10 bg-zinc-950/50 p-3 text-xs text-zinc-500">
            {t.unauthorized.detectedId}: {discordId}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition hover:border-red-400/50 hover:text-white"
          >
            <LogOut size={16} />
            {t.unauthorized.logout}
          </button>
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400"
          >
            {t.unauthorized.back}
          </Link>
        </div>
      </div>
    </section>
  );
}
