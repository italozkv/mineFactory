export const PROJECT_STATUSES = [
  { value: 'development', label: 'Em Desenvolvimento', color: 'bg-sky-500/12 text-sky-200 border-sky-400/25' },
  { value: 'testing', label: 'Em Testes', color: 'bg-amber-500/12 text-amber-200 border-amber-400/25' },
  { value: 'beta', label: 'Beta', color: 'bg-violet-500/12 text-violet-200 border-violet-400/25' },
  { value: 'release', label: 'Release', color: 'bg-emerald-500/12 text-emerald-200 border-emerald-400/25' },
  { value: 'paused', label: 'Pausado', color: 'bg-zinc-500/12 text-zinc-200 border-zinc-400/25' },
  { value: 'archived', label: 'Arquivado', color: 'bg-rose-500/12 text-rose-200 border-rose-400/25' },
];

export const LOADERS = ['Forge', 'NeoForge', 'Fabric', 'Quilt'];

export const MINECRAFT_VERSIONS = [
  '1.21.6',
  '1.21.5',
  '1.21.4',
  '1.21.1',
  '1.20.6',
  '1.20.4',
  '1.20.1',
  '1.19.4',
  '1.19.2',
  '1.18.2',
  '1.16.5',
];

export const VISIBILITIES = [
  { value: 'public', label: 'Publico' },
  { value: 'private', label: 'Privado' },
];

export const DEFAULT_CATEGORY_PRESETS = [
  { name: 'Utility', slug: 'utility' },
  { name: 'Magic', slug: 'magic' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Library', slug: 'library' },
  { name: 'QoL', slug: 'qol' },
  { name: 'API', slug: 'api' },
  { name: 'WorldGen', slug: 'worldgen' },
];

export const DEFAULT_TAG_PRESETS = [
  { name: 'Magic', slug: 'magic', color: '#8b5cf6' },
  { name: 'Performance', slug: 'performance', color: '#14b8a6' },
  { name: 'PvP', slug: 'pvp', color: '#f97316' },
  { name: 'RPG', slug: 'rpg', color: '#ec4899' },
  { name: 'Optimization', slug: 'optimization', color: '#22c55e' },
  { name: 'Server', slug: 'server', color: '#3b82f6' },
  { name: 'Client', slug: 'client', color: '#a855f7' },
  { name: 'Forge', slug: 'forge', color: '#ef4444' },
  { name: 'Fabric', slug: 'fabric', color: '#06b6d4' },
];

export const DEFAULT_PROJECT_FORM = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  logo_url: '',
  banner_url: '',
  status: 'development',
  category_id: '',
  tag_ids: [],
  minecraft_versions: [],
  loaders: [],
  visibility: 'private',
  is_published: false,
  external_links: [],
};
