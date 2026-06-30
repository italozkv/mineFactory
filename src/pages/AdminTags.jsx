import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminCard from '../components/admin/AdminCard.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import ConfirmDialog from '../components/admin/ConfirmDialog.jsx';
import DataTable from '../components/admin/DataTable.jsx';
import { Field, TextInput } from '../components/admin/FormControls.jsx';
import Modal from '../components/admin/Modal.jsx';
import { useToast } from '../components/admin/ToastProvider.jsx';
import { createTag, deleteTag, listTagsWithCounts, updateTag } from '../services/adminService.js';
import { slugify } from '../utils/formatters.js';

const EMPTY_FORM = { name: '', slug: '', color: '#22c55e' };

export default function AdminTags() {
  const { showToast } = useToast();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  async function loadTags() {
    setLoading(true);
    try {
      setTags(await listTagsWithCounts());
    } catch (error) {
      showToast({ type: 'error', title: 'Erro ao carregar tags', description: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTags();
  }, []);

  function openNew() {
    setForm(EMPTY_FORM);
    setModal({ mode: 'new' });
  }

  function openEdit(tag) {
    setForm({ name: tag.name, slug: tag.slug, color: tag.color || '#22c55e' });
    setModal({ mode: 'edit', tag });
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      showToast({ type: 'error', title: 'Informe o nome da tag.' });
      return;
    }

    setSaving(true);
    try {
      if (modal.mode === 'edit') {
        await updateTag(modal.tag.id, form);
        showToast({ title: 'Tag atualizada.' });
      } else {
        await createTag(form);
        showToast({ title: 'Tag criada.' });
      }
      setModal(null);
      await loadTags();
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel salvar', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteTag(confirm.id);
      showToast({ title: 'Tag excluida.' });
      setConfirm(null);
      await loadTags();
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel excluir', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: 'name', header: 'Nome', render: (tag) => <span className="font-semibold text-white">{tag.name}</span> },
    {
      key: 'color',
      header: 'Cor',
      render: (tag) => (
        <span className="inline-flex items-center gap-2">
          <span className="size-4 rounded border border-white/20" style={{ background: tag.color }} />
          <span className="text-zinc-400">{tag.color}</span>
        </span>
      ),
    },
    { key: 'count', header: 'Quantidade de Projetos', render: (tag) => tag.projects_count },
    {
      key: 'actions',
      header: 'Botoes',
      render: (tag) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(tag)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Editar tag"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            onClick={() => setConfirm(tag)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
            aria-label="Excluir tag"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tags"
      subtitle="Use cores para diferenciar tecnologias, temas e estados editoriais dos mods."
      actions={
        <button
          type="button"
          onClick={openNew}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          <Plus size={17} />
          Nova Tag
        </button>
      }
    >
      <AdminCard className="p-4">
        <DataTable columns={columns} rows={tags} loading={loading} getRowKey={(tag) => tag.id} />
      </AdminCard>

      <Modal open={Boolean(modal)} title={modal?.mode === 'edit' ? 'Editar Tag' : 'Nova Tag'} onClose={() => setModal(null)}>
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
              placeholder="Magia"
            />
          </Field>
          <Field label="Slug">
            <TextInput
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
              placeholder="magia"
            />
          </Field>
          <Field label="Cor">
            <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
              <input
                type="color"
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                className="h-11 w-16 rounded-lg border border-white/10 bg-zinc-950 p-1"
              />
              <TextInput
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                placeholder="#22c55e"
              />
            </div>
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
        title="Excluir tag"
        message={`Tem certeza que deseja excluir "${confirm?.name}"? Os vinculos com projetos tambem serao removidos.`}
        confirmLabel="Excluir"
        loading={saving}
        onCancel={() => setConfirm(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
