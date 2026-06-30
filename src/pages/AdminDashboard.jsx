import {
  Boxes,
  FolderTree,
  Globe2,
  LockKeyhole,
  PackageCheck,
  PencilLine,
  Rocket,
  Tags,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminCard from '../components/admin/AdminCard.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import DataTable from '../components/admin/DataTable.jsx';
import { SkeletonLine } from '../components/admin/Skeleton.jsx';
import { StatusBadge } from '../components/admin/StatusBadge.jsx';
import { getDashboardStats, listRecentProjects } from '../services/adminService.js';
import { formatDateTime, toMonthLabel } from '../utils/formatters.js';

function StatCard({ label, value, icon: Icon, tone = 'emerald' }) {
  const color = tone === 'sky' ? 'bg-sky-500/12 text-sky-300' : tone === 'rose' ? 'bg-rose-500/12 text-rose-300' : 'bg-emerald-500/12 text-emerald-300';

  return (
    <AdminCard className="animate-fade-up p-5 transition-colors hover:border-emerald-400/30">
      <span className={`grid size-11 place-items-center rounded-lg ${color}`}>
        <Icon size={21} />
      </span>
      <p className="mt-5 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </AdminCard>
  );
}

function MonthlyChart({ data }) {
  const max = Math.max(1, ...data.map((item) => item.count));

  if (data.length === 0) {
    return <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">Sem dados de criacao ainda.</div>;
  }

  return (
    <div className="flex h-64 items-end gap-3 rounded-lg border border-white/10 bg-zinc-950/35 p-4">
      {data.map((item) => (
        <div key={item.key} className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex h-44 w-full items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-sky-400 shadow-lg shadow-emerald-950/30"
              style={{ height: `${Math.max(10, (item.count / max) * 100)}%` }}
              title={`${item.count} projeto(s)`}
            />
          </div>
          <span className="truncate text-xs text-zinc-500">{toMonthLabel(item.date)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');
      try {
        const [dashboardStats, latestProjects] = await Promise.all([getDashboardStats(), listRecentProjects(6)]);
        if (!alive) return;
        setStats(dashboardStats);
        setRecentProjects(latestProjects);
      } catch (loadError) {
        if (alive) setError(loadError.message || 'Nao foi possivel carregar o dashboard.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      alive = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      { label: 'Total de Projetos', value: stats?.totalProjects ?? 0, icon: Boxes },
      { label: 'Projetos Publicos', value: stats?.publicProjects ?? 0, icon: Globe2, tone: 'sky' },
      { label: 'Projetos Privados', value: stats?.privateProjects ?? 0, icon: LockKeyhole, tone: 'rose' },
      { label: 'Em Desenvolvimento', value: stats?.developmentProjects ?? 0, icon: PencilLine, tone: 'sky' },
      { label: 'Finalizados', value: stats?.finishedProjects ?? 0, icon: PackageCheck },
      { label: 'Categorias', value: stats?.totalCategories ?? 0, icon: FolderTree, tone: 'sky' },
      { label: 'Tags', value: stats?.totalTags ?? 0, icon: Tags },
      { label: 'Ultimo Projeto Criado', value: stats?.lastCreatedProject?.name || '-', icon: Rocket, tone: 'sky' },
    ],
    [stats],
  );

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      render: (project) => <span className="font-semibold text-white">{project.name}</span>,
    },
    {
      key: 'category',
      header: 'Categoria',
      render: (project) => project.categories?.name || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (project) => <StatusBadge status={project.status} />,
    },
    {
      key: 'updated_at',
      header: 'Ultima atualizacao',
      render: (project) => formatDateTime(project.updated_at),
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Visao geral dos seus projetos, categorias, tags e atividade recente."
    >
      {error && <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <AdminCard key={index} className="p-5">
                <SkeletonLine className="size-11" />
                <SkeletonLine className="mt-5 h-8 w-24" />
                <SkeletonLine className="mt-3 h-4 w-36" />
              </AdminCard>
            ))
          : cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <AdminCard className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Ultimos Projetos</h2>
            <p className="mt-1 text-sm text-zinc-500">Projetos editados recentemente no painel.</p>
          </div>
          <DataTable columns={columns} rows={recentProjects} loading={loading} getRowKey={(project) => project.id} />
        </AdminCard>

        <AdminCard className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Projetos criados por mes</h2>
            <p className="mt-1 text-sm text-zinc-500">Volume mensal dos ultimos registros.</p>
          </div>
          {loading ? <SkeletonLine className="h-64 w-full" /> : <MonthlyChart data={stats?.monthlyProjects || []} />}
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
