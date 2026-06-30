import { PackageCheck } from 'lucide-react';
import DownloadButton from './DownloadButton.jsx';
import { useLanguage } from './LanguageProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function VersionList({ downloads }) {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const light = theme === 'light';
  const separator = language === 'pt-BR' ? '·' : '·';

  return (
    <div className="grid gap-3">
      {downloads.map((download, index) => (
        <div
          key={`${download.version}-${download.loader}-${download.minecraftVersion}`}
          className={`animate-fade-up flex flex-col gap-3 rounded-lg border p-4 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between ${
            light
              ? 'border-slate-200 bg-white hover:border-slate-300'
              : 'border-white/10 bg-zinc-900/70 hover:border-white/20'
          }`}
          style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
        >
          <div className="flex items-start gap-3">
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                light ? 'bg-emerald-500/10 text-emerald-600' : 'bg-emerald-500/12 text-emerald-300'
              }`}
            >
              <PackageCheck size={20} />
            </span>
            <div>
              <h3 className={`font-semibold ${light ? 'text-slate-900' : 'text-white'}`}>
                {t.modPage.versionPrefix} {download.version}
              </h3>
              <p className={`text-sm ${light ? 'text-slate-600' : 'text-zinc-400'}`}>
                Minecraft {download.minecraftVersion} {separator} {download.loader}
              </p>
            </div>
          </div>
          <DownloadButton download={download} />
        </div>
      ))}
    </div>
  );
}
