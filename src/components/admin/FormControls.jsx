import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/formatters.js';

export function Field({ label, error, children, hint }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-zinc-200">{label}</span>
      {children}
      {hint && !error && <span className="text-xs text-zinc-500">{hint}</span>}
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={cn(
        'h-11 rounded-lg border border-white/10 bg-zinc-950/60 px-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60',
        props.className,
      )}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-28 rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10',
        props.className,
      )}
    />
  );
}

export function SelectInput({ children, className = '', ...props }) {
  return (
    <span className="relative">
      <select
        {...props}
        className={cn(
          'h-11 w-full appearance-none rounded-lg border border-white/10 bg-zinc-950/60 px-3 pr-9 text-sm text-white outline-none transition-all focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10',
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
    </span>
  );
}

export function CheckboxGroup({ options, values, onChange }) {
  function toggle(value) {
    const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
    onChange(next);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const active = values.includes(value);

        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors',
              active
                ? 'border-emerald-400/50 bg-emerald-500/12 text-emerald-100'
                : 'border-white/10 bg-zinc-950/50 text-zinc-400 hover:text-white',
            )}
          >
            {active && <Check size={15} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
