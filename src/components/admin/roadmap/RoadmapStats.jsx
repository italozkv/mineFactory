import { AlertCircle, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import AdminCard from '../AdminCard.jsx';

function StatCard({ label, value, icon: Icon, tone = 'emerald' }) {
  const color =
    tone === 'sky'
      ? 'bg-sky-500/12 text-sky-300'
      : tone === 'amber'
        ? 'bg-amber-500/12 text-amber-300'
        : tone === 'rose'
          ? 'bg-rose-500/12 text-rose-300'
          : 'bg-emerald-500/12 text-emerald-300';

  return (
    <AdminCard className="p-5">
      <span className={`grid size-11 place-items-center rounded-lg ${color}`}>
        <Icon size={21} />
      </span>
      <p className="mt-5 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </AdminCard>
  );
}

export default function RoadmapStats({ stats }) {
  const cards = [
    { label: 'Total de tarefas', value: stats.total, icon: Clock3, tone: 'sky' },
    { label: 'Planejadas', value: stats.planned, icon: AlertCircle, tone: 'sky' },
    { label: 'Em andamento', value: stats.inProgress, icon: Clock3, tone: 'amber' },
    { label: 'Concluidas', value: stats.completed, icon: CheckCircle2, tone: 'emerald' },
    { label: 'Canceladas', value: stats.cancelled, icon: XCircle, tone: 'rose' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
