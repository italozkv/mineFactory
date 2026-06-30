import { PROJECT_STATUSES } from '../../constants/projects.js';
import { cn } from '../../utils/formatters.js';

const STATUS_ALIASES = {
  'em desenvolvimento': 'development',
  'em testes': 'testing',
  beta: 'beta',
  release: 'release',
  pausado: 'paused',
  arquivado: 'archived',
};

export function StatusBadge({ status }) {
  const normalizedStatus = STATUS_ALIASES[String(status || '').toLowerCase()] || status;
  const statusConfig = PROJECT_STATUSES.find((item) => item.value === normalizedStatus);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold',
        statusConfig?.color || 'border-zinc-400/20 bg-zinc-500/10 text-zinc-300',
      )}
    >
      {statusConfig?.label || status || 'Sem status'}
    </span>
  );
}

export function VisibilityBadge({ visibility, isPublished }) {
  const isPublic = visibility === 'public' && isPublished;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold',
        isPublic
          ? 'border-emerald-400/25 bg-emerald-500/12 text-emerald-200'
          : 'border-zinc-400/20 bg-zinc-500/10 text-zinc-300',
      )}
    >
      {isPublic ? 'Publico' : 'Privado'}
    </span>
  );
}
