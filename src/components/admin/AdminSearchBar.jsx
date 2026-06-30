import { Search, X } from 'lucide-react';

export default function AdminSearchBar({ value, onChange, placeholder = 'Pesquisar...' }) {
  return (
    <label className="group relative block">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-300"
        size={18}
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950/60 pl-10 pr-9 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10"
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label="Limpar pesquisa"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}
