export const ROADMAP_STATUS_OPTIONS = [
  { value: 'planned', label: 'Planejado', color: 'border-sky-400/25 bg-sky-500/12 text-sky-200' },
  { value: 'in_progress', label: 'Em andamento', color: 'border-amber-400/25 bg-amber-500/12 text-amber-200' },
  { value: 'completed', label: 'Concluido', color: 'border-emerald-400/25 bg-emerald-500/12 text-emerald-200' },
  { value: 'cancelled', label: 'Cancelado', color: 'border-rose-400/25 bg-rose-500/12 text-rose-200' },
];

export const ROADMAP_PRIORITY_OPTIONS = [
  { value: 'high', label: 'Alta', color: 'border-rose-400/25 bg-rose-500/12 text-rose-200' },
  { value: 'medium', label: 'Media', color: 'border-amber-400/25 bg-amber-500/12 text-amber-200' },
  { value: 'low', label: 'Baixa', color: 'border-emerald-400/25 bg-emerald-500/12 text-emerald-200' },
];

export const ROADMAP_TYPE_OPTIONS = [
  { value: 'feature', label: 'Funcionalidade' },
  { value: 'improvement', label: 'Melhoria' },
  { value: 'bugfix', label: 'Correcao' },
  { value: 'visual', label: 'Visual' },
  { value: 'performance', label: 'Performance' },
  { value: 'documentation', label: 'Documentacao' },
  { value: 'refactor', label: 'Refatoracao' },
  { value: 'idea', label: 'Ideia' },
];

export const ROADMAP_CATEGORY_SUGGESTIONS = [
  'Gameplay',
  'Sistema',
  'Interface',
  'Banco de Dados',
  'Design',
  'API',
  'Performance',
  'Compatibilidade',
  'Documentacao',
  'Correcao',
  'Assets',
  'IA',
  'Outro',
];

export const ROADMAP_STATUS_ORDER = ['planned', 'in_progress', 'completed', 'cancelled'];

export const ROADMAP_DEFAULT_FORM = {
  title: '',
  description: '',
  project_id: '',
  status: 'planned',
  priority: 'medium',
  type: 'feature',
  category: '',
  target_version: '',
  is_public: false,
};

export function textValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidRoadmapStatus(value) {
  return ROADMAP_STATUS_OPTIONS.some((option) => option.value === value);
}

export function isValidRoadmapPriority(value) {
  return ROADMAP_PRIORITY_OPTIONS.some((option) => option.value === value);
}

export function isValidRoadmapType(value) {
  return ROADMAP_TYPE_OPTIONS.some((option) => option.value === value);
}

export function getRoadmapOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || value || '-';
}

export function getRoadmapStatusOption(value) {
  return ROADMAP_STATUS_OPTIONS.find((option) => option.value === value) || ROADMAP_STATUS_OPTIONS[0];
}

export function getRoadmapPriorityOption(value) {
  return ROADMAP_PRIORITY_OPTIONS.find((option) => option.value === value) || ROADMAP_PRIORITY_OPTIONS[1];
}

export function getRoadmapTypeLabel(value) {
  return getRoadmapOptionLabel(ROADMAP_TYPE_OPTIONS, value);
}

export function getRoadmapStatusLabel(value) {
  return getRoadmapOptionLabel(ROADMAP_STATUS_OPTIONS, value);
}

export function getRoadmapPriorityLabel(value) {
  return getRoadmapOptionLabel(ROADMAP_PRIORITY_OPTIONS, value);
}

export function normalizeRoadmapItem(item) {
  const project = item.project || item.projects || null;

  return {
    ...item,
    project,
    project_name: project?.name || null,
    project_slug: project?.slug || null,
  };
}

export function validateRoadmapForm(form) {
  const errors = {};

  if (!textValue(form.title)) errors.title = 'Informe um titulo.';
  if (!isValidRoadmapStatus(form.status)) errors.status = 'Selecione um status valido.';
  if (!isValidRoadmapPriority(form.priority)) errors.priority = 'Selecione uma prioridade valida.';
  if (!isValidRoadmapType(form.type)) errors.type = 'Selecione um tipo valido.';

  return errors;
}

export function roadmapFormFromItem(item) {
  return {
    ...ROADMAP_DEFAULT_FORM,
    ...item,
    project_id: item.project_id || '',
    title: item.title || '',
    description: item.description || '',
    category: item.category || '',
    target_version: item.target_version || '',
    is_public: Boolean(item.is_public),
  };
}
