import { Archive, Copy, Edit3, Eye, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminCard from '../components/admin/AdminCard.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import AdminSearchBar from '../components/admin/AdminSearchBar.jsx';
import ConfirmDialog from '../components/admin/ConfirmDialog.jsx';
import DataTable from '../components/admin/DataTable.jsx';
import { SelectInput } from '../components/admin/FormControls.jsx';
import Pagination from '../components/admin/Pagination.jsx';
import { StatusBadge, VisibilityBadge } from '../components/admin/StatusBadge.jsx';
import { useToast } from '../components/admin/ToastProvider.jsx';
import { LOADERS, MINECRAFT_VERSIONS, PROJECT_STATUSES } from '../constants/projects.js';
import {
  archiveProject,
  deleteProject,
  duplicateProject,
  listCategories,
  listProjects,
  setProjectPublished,
} from '../services/adminService.js';
import { formatDateTime } from '../utils/formatters.js';

const PAGE_SIZE = 10;

function ActionButton({ title, children, onClick, to }) {
  const className =
    'grid size-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white';

  if (to) {
    return (
      <Link to={to} className={className} title={title} aria-label={title}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} title={title} aria-label={title}>
      {children}
    </button>
  );
}

export default function AdminProjects() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    status: '',
    minecraftVersion: '',
    loader: '',
    page: 1,
  });

  async function loadProjectsData(nextFilters = filters) {
    setLoading(true);
    try {
      const projectsResult = await listProjects({ ...nextFilters, pageSize: PAGE_SIZE });
      setProjects(projectsResult.data);
      setTotal(projectsResult.count);
    } catch (error) {
      showToast({ type: 'error', title: 'Erro ao carregar projetos', description: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadFilterData() {
      try {
        setCategories(await listCategories());
      } catch (error) {
        showToast({ type: 'error', title: 'Erro ao carregar categorias', description: error.message });
      }
    }

    loadFilterData();
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadProjectsData(filters);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [filters]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  }

  async function runAction(action, successMessage) {
    setActionLoading(true);
    try {
      await action();
      showToast({ title: successMessage });
      setConfirm(null);
      await loadProjectsData(filters);
    } catch (error) {
      showToast({ type: 'error', title: 'Acao nao concluida', description: error.message });
    } finally {
      setActionLoading(false);
    }
  }

  const columns = [
      {
        key: 'logo',
        header: 'Logo',
        render: (project) => (
          <div className="grid size-11 place-items-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
            {project.logo_url ? (
              <img src={project.logo_url} alt={project.name} className="size-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-emerald-300">{project.name.slice(0, 1)}</span>
            )}
          </div>
        ),
      },
      {
        key: 'name',
        header: 'Nome',
        render: (project) => (
          <div>
            <p className="font-semibold text-white">{project.name}</p>
            <VisibilityBadge visibility={project.visibility} isPublished={project.is_published} />
          </div>
        ),
      },
      { key: 'category', header: 'Categoria', render: (project) => project.categories?.name || '-' },
      { key: 'status', header: 'Status', render: (project) => <StatusBadge status={project.status} /> },
      { key: 'minecraft', header: 'Minecraft', render: (project) => project.minecraft_versions?.join(', ') || '-' },
      { key: 'updated', header: 'Ultima atualizacao', render: (project) => formatDateTime(project.updated_at) },
      {
        key: 'actions',
        header: 'Acoes',
        render: (project) => (
          <div className="flex flex-wrap gap-2">
            <ActionButton title="Editar" to={`/admin/projects/${project.id}/edit`}>
              <Edit3 size={16} />
            </ActionButton>
            <ActionButton
              title={project.is_published ? 'Despublicar' : 'Publicar'}
              onClick={() => runAction(() => setProjectPublished(project.id, !project.is_published), project.is_published ? 'Projeto despublicado.' : 'Projeto publicado.')}
            >
              <Eye size={16} />
            </ActionButton>
            <ActionButton title="Duplicar" onClick={() => runAction(() => duplicateProject(project.id), 'Projeto duplicado.')}>
              <Copy size={16} />
            </ActionButton>
            <ActionButton title="Arquivar" onClick={() => setConfirm({ type: 'archive', project })}>
              <Archive size={16} />
            </ActionButton>
            <ActionButton title="Excluir" onClick={() => setConfirm({ type: 'delete', project })}>
              <Trash2 size={16} />
            </ActionButton>
          </div>
        ),
      },
    ];

  return (
    <AdminLayout
      title="Projetos"
      subtitle="Organize, publique e mantenha todas as fichas dos seus mods."
      actions={
        <Link
          to="/admin/projects/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          <Plus size={17} />
          Novo Projeto
        </Link>
      }
    >
      <AdminCard className="p-4">
        <div className="grid gap-3 xl:grid-cols-[1.3fr_repeat(4,minmax(150px,1fr))]">
          <AdminSearchBar value={filters.search} onChange={(value) => updateFilter('search', value)} placeholder="Pesquisar por nome" />
          <SelectInput value={filters.categoryId} onChange={(event) => updateFilter('categoryId', event.target.value)}>
            <option value="">Todas categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
            <option value="">Todos status</option>
            {PROJECT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </SelectInput>
          <SelectInput value={filters.minecraftVersion} onChange={(event) => updateFilter('minecraftVersion', event.target.value)}>
            <option value="">Minecraft</option>
            {MINECRAFT_VERSIONS.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </SelectInput>
          <SelectInput value={filters.loader} onChange={(event) => updateFilter('loader', event.target.value)}>
            <option value="">Loader</option>
            {LOADERS.map((loader) => (
              <option key={loader} value={loader}>
                {loader}
              </option>
            ))}
          </SelectInput>
        </div>
      </AdminCard>

      <AdminCard className="p-4">
        <DataTable columns={columns} rows={projects} loading={loading} getRowKey={(project) => project.id} />
        <div className="mt-4">
          <Pagination page={filters.page} pageSize={PAGE_SIZE} total={total} onPageChange={(page) => updateFilter('page', page)} />
        </div>
      </AdminCard>

      <ConfirmDialog
        open={Boolean(confirm)}
        loading={actionLoading}
        title={confirm?.type === 'delete' ? 'Excluir projeto' : 'Arquivar projeto'}
        message={
          confirm?.type === 'delete'
            ? `Tem certeza que deseja excluir "${confirm?.project?.name}"? Essa acao nao pode ser desfeita.`
            : `Arquivar "${confirm?.project?.name}" vai remover a publicacao e marcar o projeto como arquivado.`
        }
        confirmLabel={confirm?.type === 'delete' ? 'Excluir' : 'Arquivar'}
        onCancel={() => setConfirm(null)}
        onConfirm={() =>
          runAction(
            () => (confirm.type === 'delete' ? deleteProject(confirm.project.id) : archiveProject(confirm.project.id)),
            confirm.type === 'delete' ? 'Projeto excluido.' : 'Projeto arquivado.',
          )
        }
      />
    </AdminLayout>
  );
}
