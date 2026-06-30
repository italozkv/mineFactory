export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function toMonthLabel(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: '2-digit',
  }).format(value);
}

export function normalizeProject(project) {
  return {
    ...project,
    category: project?.categories || project?.category || null,
    tags: project?.project_tags?.map((item) => item.tags).filter(Boolean) || project?.tags || [],
  };
}

export function isArchivedProject(project) {
  const status = String(project?.status || '').toLowerCase();
  return Boolean(project?.archived_at) || status === 'archived' || status === 'arquivado';
}

export function projectToPublicCard(project) {
  const normalized = normalizeProject(project);

  return {
    ...normalized,
    id: normalized.slug || normalized.id,
    name: normalized.title || normalized.name,
    slug: normalized.slug,
    shortDescription: normalized.short_description || normalized.shortDescription || '',
    description: normalized.description || '',
    banner: normalized.banner_url || normalized.banner || '/images/mods-hero.png',
    logo: normalized.logo_url || normalized.logo || '/images/minefactory-logo.png',
    minecraftVersions: normalized.minecraft_versions || normalized.minecraftVersions || [],
    loaders: normalized.loaders || [],
  };
}
