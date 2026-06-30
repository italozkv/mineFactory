import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { TableSkeleton } from '../../components/admin/Skeleton.jsx';
import { useToast } from '../../components/admin/ToastProvider.jsx';
import RoadmapBoard from '../../components/admin/roadmap/RoadmapBoard.jsx';
import RoadmapFilters from '../../components/admin/roadmap/RoadmapFilters.jsx';
import RoadmapFormModal from '../../components/admin/roadmap/RoadmapFormModal.jsx';
import RoadmapStats from '../../components/admin/roadmap/RoadmapStats.jsx';
import { listProjectsForSelect, listRoadmapItems, createRoadmapItem, updateRoadmapItem, deleteRoadmapItem, moveRoadmapItem } from '../../services/roadmapService.js';
import { ROADMAP_STATUS_ORDER } from '../../utils/roadmapUtils.js';

const EMPTY_FILTERS = {
  search: '',
  projectId: '',
  status: '',
  priority: '',
  type: '',
  category: '',
};

function buildStats(items) {
  return {
    total: items.length,
    planned: items.filter((item) => item.status === 'planned').length,
    inProgress: items.filter((item) => item.status === 'in_progress').length,
    completed: items.filter((item) => item.status === 'completed').length,
    cancelled: items.filter((item) => item.status === 'cancelled').length,
  };
}

export default function RoadmapPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirm, setConfirm] = useState(null);

  async function loadData(nextFilters = filters) {
    setLoading(true);
    try {
      const [roadmapItems, projectOptions] = await Promise.all([
        listRoadmapItems(nextFilters),
        projects.length > 0 ? Promise.resolve(projects) : listProjectsForSelect(),
      ]);
      setItems(roadmapItems);
      setProjects(projectOptions);
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel carregar o roadmap', description: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadData(filters);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [filters]);

  const stats = useMemo(() => buildStats(items), [items]);
  const hasItems = items.length > 0;

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setSelectedItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setSelectedItem(item);
    setModalOpen(true);
  }

  async function handleSave(form) {
    setSaving(true);
    try {
      if (selectedItem) {
        await updateRoadmapItem(selectedItem.id, form);
        showToast({ title: 'Tarefa atualizada.' });
      } else {
        await createRoadmapItem(form);
        showToast({ title: 'Tarefa criada.' });
      }
      setModalOpen(false);
      setSelectedItem(null);
      await loadData(filters);
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel salvar', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(id, status) {
    if (!ROADMAP_STATUS_ORDER.includes(status)) {
      showToast({ type: 'error', title: 'Status invalido.' });
      return;
    }

    setSaving(true);
    try {
      await moveRoadmapItem(id, status);
      showToast({ title: 'Status atualizado.' });
      await loadData(filters);
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel mover', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteRoadmapItem(confirm.id);
      showToast({ title: 'Tarefa excluida.' });
      setConfirm(null);
      await loadData(filters);
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel excluir', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout
      title="Roadmap"
      subtitle="Organize o desenvolvimento dos seus projetos."
      actions={
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          <Plus size={17} />
          Nova Tarefa
        </button>
      }
    >
      <RoadmapStats stats={stats} />

      <RoadmapFilters
        projects={projects}
        filters={filters}
        onChange={updateFilter}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {loading ? (
        <AdminCard className="p-4">
          <TableSkeleton rows={4} columns={4} />
        </AdminCard>
      ) : hasItems ? (
        <RoadmapBoard items={items} onEdit={openEdit} onDelete={setConfirm} onMove={handleMove} />
      ) : (
        <AdminCard className="grid min-h-60 place-items-center p-8 text-center">
          <div>
            <h2 className="text-xl font-bold text-white">Nenhuma tarefa no roadmap ainda.</h2>
            <p className="mt-2 text-sm text-zinc-500">Crie sua primeira tarefa para organizar as proximas entregas.</p>
          </div>
        </AdminCard>
      )}

      <RoadmapFormModal
        open={modalOpen}
        item={selectedItem}
        projects={projects}
        loading={saving}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Excluir tarefa"
        message="Tem certeza que deseja excluir esta tarefa do roadmap?"
        confirmLabel="Excluir"
        loading={saving}
        onCancel={() => setConfirm(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
