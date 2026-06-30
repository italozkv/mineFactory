import { Edit3, MoveHorizontal, Trash2 } from 'lucide-react';
import { formatDate } from '../../../utils/formatters.js';
import {
  getRoadmapPriorityOption,
  getRoadmapStatusLabel,
  getRoadmapStatusOption,
  getRoadmapTypeLabel,
  ROADMAP_STATUS_OPTIONS,
} from '../../../utils/roadmapUtils.js';

export default function RoadmapCard({ item, onEdit, onDelete, onMove }) {
  const statusOption = getRoadmapStatusOption(item.status);
  const priorityOption = getRoadmapPriorityOption(item.priority);

  return (
    <article className="grid min-w-0 gap-4 rounded-lg border border-white/10 bg-zinc-950/50 p-4 shadow-lg shadow-black/10 transition-colors hover:border-emerald-400/20">
      <div className="grid min-w-0 gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-sm font-bold text-white">{item.title}</h3>
            {item.project ? <p className="mt-1 break-words text-xs text-zinc-500">{item.project.name}</p> : null}
          </div>
          <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusOption.color}`}>
            {statusOption.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className={`rounded-lg border px-2.5 py-1 ${priorityOption.color}`}>{priorityOption.label}</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-zinc-300">
            {getRoadmapTypeLabel(item.type)}
          </span>
          {item.category ? (
            <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-zinc-300">{item.category}</span>
          ) : null}
        </div>

        <div className="grid gap-2 text-xs text-zinc-400 break-words">
          {item.target_version ? <p>Versao prevista: {item.target_version}</p> : null}
          <p>Criado em: {formatDate(item.created_at)}</p>
        </div>
      </div>

      <div className="grid gap-2 min-w-0">
        <label className="grid gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Mover status</span>
          <select
            value={item.status}
            onChange={(event) => onMove(item.id, event.target.value)}
            className="h-9 w-full rounded-lg border border-white/10 bg-zinc-900/80 px-3 text-xs text-white outline-none transition-colors focus:border-emerald-400/60"
          >
            {ROADMAP_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Edit3 size={14} />
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-semibold text-zinc-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
          >
            <Trash2 size={14} />
            Excluir
          </button>
          <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-semibold text-zinc-500">
            <MoveHorizontal size={14} />
            Status
          </span>
        </div>
      </div>
    </article>
  );
}
