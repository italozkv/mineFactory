import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="content-wrap grid min-h-[60vh] place-items-center py-16 text-center">
      <div className="animate-fade-up max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">404</p>
        <h1 className="mt-3 text-4xl font-black text-white">Página não encontrada</h1>
        <p className="mt-3 text-zinc-400">
          A página que você tentou abrir não existe neste catálogo de mods.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-emerald-400 active:scale-[0.98]"
        >
          <Home size={17} />
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
