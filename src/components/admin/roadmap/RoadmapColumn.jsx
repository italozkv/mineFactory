import AdminCard from '../AdminCard.jsx';
import RoadmapCard from './RoadmapCard.jsx';

export default function RoadmapColumn({ title, count, items, onEdit, onDelete, onMove }) {
  return (
    <AdminCard className="flex min-w-0 min-h-[320px] flex-col p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <p className="mt-1 text-xs text-zinc-500">{count} tarefa(s)</p>
        </div>
      </div>

      <div className="grid gap-3 min-w-0">
        {items.length > 0 ? (
          items.map((item) => (
            <RoadmapCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
          ))
        ) : (
          <div className="grid min-h-40 place-items-center rounded-lg border border-dashed border-white/10 text-sm text-zinc-500">
            Nenhuma tarefa nesta coluna.
          </div>
        )}
      </div>
    </AdminCard>
  );
}
