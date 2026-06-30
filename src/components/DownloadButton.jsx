import { Download } from 'lucide-react';
import { useTheme } from './ThemeProvider.jsx';

export default function DownloadButton({ download }) {
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <a
      href={download.file}
      download
      className={`group inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition-all duration-200 active:scale-[0.97] ${
        light
          ? 'bg-sky-500 text-white hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20'
          : 'bg-sky-500 text-zinc-950 hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20'
      }`}
    >
      <Download size={17} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
      {download.version} · {download.loader}
    </a>
  );
}
