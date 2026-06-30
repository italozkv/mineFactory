import { Box, Github, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';
  const navItems = [
    { to: '/', label: t.header.mods, icon: Home },
    { to: '/#downloads', label: t.header.downloads, icon: Box },
  ];

  const shellClass = light
    ? 'sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl'
    : 'sticky top-0 z-50 border-b border-white/10 bg-zinc-950/86 backdrop-blur-xl';

  return (
    <header className={shellClass}>
      <div className="content-wrap flex h-16 items-center gap-4">
        <NavLink to="/" className="flex items-center gap-3 font-semibold transition-opacity hover:opacity-80">
          <img
            src="/images/minefactory-logo.png"
            alt={t.header.siteName}
            className="block h-10 w-auto object-contain md:h-12"
          />
          <span className="leading-tight">
            <span className={`block text-sm ${light ? 'text-slate-500' : 'text-zinc-400'}`}>
              {t.header.siteName}
            </span>
            <span className={`block text-base ${light ? 'text-slate-900' : 'text-white'}`}>
              {t.header.siteTag}
            </span>
          </span>
        </NavLink>

        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    light
                      ? 'hover:bg-slate-100 hover:text-slate-950'
                      : 'hover:bg-white/8 hover:text-white'
                  } ${isActive ? (light ? 'text-slate-950' : 'text-white') : light ? 'text-slate-600' : 'text-zinc-300'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} />
                    {item.label}
                    <span
                      className={`absolute inset-x-3 -bottom-px h-px bg-emerald-400 transition-opacity duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
          <a
            href="https://github.com/"
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
              light
                ? 'border-slate-200 text-slate-700 hover:border-emerald-500/40 hover:bg-slate-100 hover:text-slate-950'
                : 'border-white/10 text-zinc-300 hover:border-emerald-400/50 hover:text-white'
            }`}
          >
            <Github size={16} />
            {t.header.github}
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <button
          type="button"
          aria-label={isOpen ? t.header.closeMenu : t.header.openMenu}
          className={`grid size-10 place-items-center rounded-lg border transition-colors md:hidden ${
            light
              ? 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
              : 'border-white/10 text-zinc-200 hover:border-white/20'
          }`}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span
            className="grid place-items-center transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
          </span>
        </button>
      </div>

      <nav
        className="content-wrap grid overflow-hidden transition-all duration-300 ease-out md:hidden"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
          paddingBottom: isOpen ? '1rem' : '0px',
        }}
      >
        <div className="grid gap-2 overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  light
                    ? 'border-slate-200 text-slate-700 hover:border-emerald-500/40 hover:bg-slate-100'
                    : 'border-white/10 text-zinc-200 hover:border-emerald-400/40 hover:bg-white/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}

          <div className="flex items-center gap-2 px-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
