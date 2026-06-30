import { Globe2, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

const options = [
  { code: 'en', label: 'EN' },
  { code: 'pt-BR', label: 'PT-BR' },
  { code: 'es', label: 'ES' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`grid size-10 place-items-center rounded-lg border transition-all duration-200 hover:-translate-y-0.5 ${
          light
            ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950'
            : 'border-white/10 bg-zinc-950/45 text-zinc-300 hover:border-emerald-400/50 hover:text-white'
        }`}
        title="Language"
      >
        <Globe2 size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 w-40 overflow-hidden rounded-xl border p-1 shadow-2xl ${
            light
              ? 'border-slate-200 bg-white text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.12)]'
              : 'border-white/10 bg-zinc-950 text-zinc-100 shadow-black/40'
          }`}
        >
          {options.map((option) => {
            const active = language === option.code;

            return (
              <button
                key={option.code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setLanguage(option.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? light
                      ? 'bg-slate-100 text-slate-950'
                      : 'bg-emerald-500 text-zinc-950'
                    : light
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                      : 'text-zinc-400 hover:bg-white/8 hover:text-zinc-100'
                }`}
              >
                <span>{option.label}</span>
                {active && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
