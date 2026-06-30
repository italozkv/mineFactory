import { Disc3, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageProvider.jsx';
import { getAdminEnvStatus, getDiscordUserId, isAdminUser } from '../lib/adminAuth.js';
import { supabase } from '../lib/supabaseClient.js';

function getRedirectUrl() {
  return new URL(`${import.meta.env.BASE_URL}admin/dashboard`, window.location.origin).toString();
}

export default function AdminLogin() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const envStatus = getAdminEnvStatus();
  const envReady = envStatus.hasSupabaseUrl && envStatus.hasSupabaseAnonKey && envStatus.hasAdminDiscordId;

  useEffect(() => {
    let alive = true;

    async function checkSession() {
      if (!envReady) {
        setStatus('idle');
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!alive) return;

      if (!user) {
        setStatus('idle');
        return;
      }

      if (isAdminUser(user)) {
        setStatus('authorized');
        return;
      }

      navigate('/admin/unauthorized', {
        replace: true,
        state: { discordId: getDiscordUserId(user) },
      });
    }

    checkSession();

    return () => {
      alive = false;
    };
  }, [envReady, navigate]);

  async function handleDiscordLogin() {
    setMessage('');
    setStatus('loading');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      setStatus('idle');
      setMessage(error.message);
    }
  }

  if (status === 'authorized') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <section className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_32rem),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30rem),#09090b] px-4 py-12 text-zinc-100">
      <div className="w-full max-w-md animate-scale-in overflow-hidden rounded-lg border border-white/10 bg-zinc-900/76 shadow-2xl shadow-black/30">
        <div className="border-b border-white/10 p-6 text-center">
          <img
            src="/images/minefactory-logo.png"
            alt={t.adminLogin.title}
            className="mx-auto h-20 w-auto object-contain"
          />
          <p className="mt-5 text-sm font-semibold uppercase text-emerald-300">{t.adminLogin.adminLabel}</p>
          <h1 className="mt-2 text-3xl font-black text-white">{t.adminLogin.title}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{t.adminLogin.subtitle}</p>
        </div>

        <div className="grid gap-4 p-6">
          {!envReady && (
            <div className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
              {t.adminLogin.envWarning}
            </div>
          )}

          <button
            type="button"
            onClick={handleDiscordLogin}
            disabled={!envReady || status === 'checking' || status === 'loading'}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#5865f2] px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-[#4752c4] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Disc3 size={19} />
            {status === 'loading' || status === 'checking' ? t.adminLogin.loading : t.adminLogin.button}
          </button>

          {message && (
            <p className="rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-100">
              {message}
            </p>
          )}

          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-950/50 p-4 text-sm text-zinc-400">
            <ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={18} />
            <p>{t.adminLogin.accessNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
