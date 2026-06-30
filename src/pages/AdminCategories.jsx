import { Edit3, FolderPlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminCard from '../components/admin/AdminCard.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import ConfirmDialog from '../components/admin/ConfirmDialog.jsx';
import DataTable from '../components/admin/DataTable.jsx';
import { Field, TextInput } from '../components/admin/FormControls.jsx';
import Modal from '../components/admin/Modal.jsx';
import { useToast } from '../components/admin/ToastProvider.jsx';
import { DEFAULT_CATEGORY_PRESETS } from '../constants/projects.js';
import {
  createCategory,
  deleteCategory,
  listCategoriesWithCounts,
  updateCategory,
} from '../services/adminService.js';
import { formatDate, slugify } from '../utils/formatters.js';

const EMPTY_FORM = { name: '', slug: '' };

export default function AdminCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  async function loadCategories() {
    setLoading(true);
    try {
      setCategories(await listCategoriesWithCounts());
    } catch (error) {
      showToast({ type: 'error', title: 'Erro ao carregar categorias', description: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openNew() {
    setForm(EMPTY_FORM);
    setModal({ mode: 'new' });
  }

  function openEdit(category) {
    setForm({ name: category.name, slug: category.slug });
    setModal({ mode: 'edit', category });
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      showToast({ type: 'error', title: 'Informe o nome da categoria.' });
      return;
    }

    setSaving(true);
    try {
      if (modal.mode === 'edit') {
        await updateCategory(modal.category.id, form);
        showToast({ title: 'Categoria atualizada.' });
      } else {
        await createCategory(form);
        showToast({ title: 'Categoria criada.' });
      }
      setModal(null);
      await loadCategories();
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel salvar', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteCategory(confirm.id);
      showToast({ title: 'Categoria excluida.' });
      setConfirm(null);
      await loadCategories();
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel excluir', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function createPresetCategory(preset) {
    const exists = categories.some((category) => category.slug === preset.slug);
    if (exists) {
      showToast({ title: `A categoria "${preset.name}" ja existe.` });
      return;
    }

    setSaving(true);
    try {
      await createCategory(preset);
      showToast({ title: `Categoria "${preset.name}" criada.` });
      await loadCategories();
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel criar', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function createAllPresetCategories() {
    setSaving(true);
    try {
      const existing = new Set(categories.map((category) => category.slug));
      const pending = DEFAULT_CATEGORY_PRESETS.filter((preset) => !existing.has(preset.slug));
      if (pending.length === 0) {
        showToast({ title: 'Todas as categorias padrao ja existem.' });
        return;
      }

      await Promise.all(pending.map((preset) => createCategory(preset)));
      showToast({ title: 'Categorias padrao criadas.' });
      await loadCategories();
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel criar as categorias padrao', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: 'name', header: 'Nome', render: (category) => <span className="font-semibold text-white">{category.name}</span> },
    { key: 'slug', header: 'Slug', render: (category) => <span className="text-zinc-400">{category.slug}</span> },
    { key: 'count', header: 'Quantidade de Projetos', render: (category) => category.projects_count },
    { key: 'created_at', header: 'Data de criacao', render: (category) => formatDate(category.created_at) },
    {
      key: 'actions',
      header: 'Botoes',
      render: (category) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(category)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Editar categoria"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            onClick={() => setConfirm(category)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
            aria-label="Excluir categoria"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Categorias"
      subtitle="Agrupe projetos e acompanhe quantos mods usam cada categoria."
    >
      <AdminCard className="p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Categorias padrao</h2>
            <p className="mt-1 text-sm text-zinc-500">Crie a base comum de categorias e depois adicione outras livremente.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={createAllPresetCategories}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/50 px-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <FolderPlus size={15} />
              Criar todas
            </button>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              <FolderPlus size={17} />
              Nova Categoria
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {DEFAULT_CATEGORY_PRESETS.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              onClick={() => createPresetCategory(preset)}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/50 px-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <FolderPlus size={15} />
              {preset.name}
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard className="p-4">
        <DataTable columns={columns} rows={categories} loading={loading} getRowKey={(category) => category.id} />
      </AdminCard>

      <Modal open={Boolean(modal)} title={modal?.mode === 'edit' ? 'Editar Categoria' : 'Nova Categoria'} onClose={() => setModal(null)}>
        <form onSubmit={handleSave} className="grid gap-4">
          <Field label="Nome">
            <TextInput
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: current.slug ? current.slug : slugify(event.target.value),
                }))
              }
              placeholder="Tecnologia"
            />
          </Field>
          <Field label="Slug">
            <TextInput
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
              placeholder="tecnologia"
            />
          </Field>
          <button
            type="submit"
            disabled={saving}
            className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Excluir categoria"
        message={`Antes de excluir "${confirm?.name}", o painel verifica se existe algum projeto usando esta categoria.`}
        confirmLabel="Excluir"
        loading={saving}
        onCancel={() => setConfirm(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
