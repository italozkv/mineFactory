import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminUser } from '../lib/adminAuth.js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const [state, setState] = useState({
    status: 'loading',
    user: null,
  });

  useEffect(() => {
    let alive = true;

    async function verifyUser() {
      if (!isSupabaseConfigured) {
        setState({ status: 'guest', user: null });
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!alive) return;

      if (error || !user) {
        setState({ status: 'guest', user: null });
        return;
      }

      setState({
        status: isAdminUser(user) ? 'authorized' : 'unauthorized',
        user,
      });
    }

    verifyUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      verifyUser();
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  if (state.status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-zinc-100">
        <div className="glass-panel animate-scale-in grid gap-4 rounded-lg p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-lg bg-emerald-500/12 text-emerald-300">
            <ShieldCheck size={24} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">Verificando acesso</h1>
            <p className="mt-2 text-sm text-zinc-400">Validando sua sessao do Discord.</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'guest') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (state.status === 'unauthorized') {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
}
