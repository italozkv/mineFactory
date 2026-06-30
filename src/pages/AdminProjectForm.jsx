import { ArrowLeft, ExternalLink, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminCard from '../components/admin/AdminCard.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import {
  CheckboxGroup,
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from '../components/admin/FormControls.jsx';
import MarkdownEditor from '../components/admin/MarkdownEditor.jsx';
import UploadField from '../components/admin/UploadField.jsx';
import { useToast } from '../components/admin/ToastProvider.jsx';
import {
  DEFAULT_PROJECT_FORM,
  LOADERS,
  MINECRAFT_VERSIONS,
  PROJECT_STATUSES,
  VISIBILITIES,
} from '../constants/projects.js';
import {
  createProject,
  getProject,
  listCategories,
  listTags,
  updateProject,
} from '../services/adminService.js';
import { slugify } from '../utils/formatters.js';

function formFromProject(project) {
  return {
    ...DEFAULT_PROJECT_FORM,
    ...project,
    category_id: project.category_id || '',
    tag_ids: project.project_tags?.map((item) => item.tags?.id).filter(Boolean) || [],
    name: project.name || '',
    slug: project.slug || '',
    short_description: project.short_description || '',
    description: project.description || '',
    logo_url: project.logo_url || '',
    banner_url: project.banner_url || '',
    minecraft_versions: project.minecraft_versions || [],
    loaders: project.loaders || [],
    external_links: Array.isArray(project.external_links) ? project.external_links : [],
  };
}

export default function AdminProjectForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(DEFAULT_PROJECT_FORM);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let alive = true;

    async function loadFormData() {
      setLoading(true);
      try {
        const [categoriesResult, tagsResult, projectResult] = await Promise.all([
          listCategories(),
          listTags(),
          isEditing ? getProject(id) : Promise.resolve(null),
        ]);
        if (!alive) return;
        setCategories(categoriesResult);
        setTags(tagsResult);
        if (projectResult) {
          setForm(formFromProject(projectResult));
          setSlugTouched(true);
        }
      } catch (error) {
        showToast({ type: 'error', title: 'Erro ao carregar formulario', description: error.message });
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadFormData();

    return () => {
      alive = false;
    };
  }, [id, isEditing, showToast]);

  function updateField(key, value) {
    setForm((current) => {
      if (key === 'name' && !slugTouched) {
        return { ...current, name: value, slug: slugify(value) };
      }
      return { ...current, [key]: value };
    });
  }

  function updateExternalLink(index, key, value) {
    setForm((current) => ({
      ...current,
      external_links: (Array.isArray(current.external_links) ? current.external_links : []).map((link, linkIndex) =>
        linkIndex === index ? { ...link, [key]: value } : link,
      ),
    }));
  }

  function addExternalLink() {
    setForm((current) => ({
      ...current,
      external_links: [...current.external_links, { label: '', url: '' }],
    }));
  }

  function removeExternalLink(index) {
      setForm((current) => ({
        ...current,
        external_links: (Array.isArray(current.external_links) ? current.external_links : []).filter(
          (_, linkIndex) => linkIndex !== index,
        ),
      }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Informe o nome do projeto.';
    if (!form.slug.trim()) nextErrors.slug = 'Informe o slug.';
    if (!form.short_description.trim()) nextErrors.short_description = 'Informe uma descricao curta.';
    if (!form.description.trim()) nextErrors.description = 'Informe a descricao completa.';
    if (form.loaders.length === 0) nextErrors.loaders = 'Escolha pelo menos um loader.';
    if (form.minecraft_versions.length === 0) nextErrors.minecraft_versions = 'Escolha pelo menos uma versao.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateProject(id, form);
        showToast({ title: 'Projeto atualizado.' });
      } else {
        await createProject(form);
        showToast({ title: 'Projeto criado.' });
      }
      navigate('/admin/projects');
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel salvar', description: error.message });
    } finally {
      setSaving(false);
    }
  }

  const tagOptions = useMemo(() => tags.map((tag) => ({ value: tag.id, label: tag.name })), [tags]);

  return (
    <AdminLayout
      title={isEditing ? 'Editar Projeto' : 'Novo Projeto'}
      subtitle="Preencha a ficha completa do mod e controle como ele aparece no website publico."
      actions={
        <Link
          to="/admin/projects"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={17} />
          Voltar
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminCard className="grid gap-5 p-5">
          {loading ? (
            <div className="rounded-lg border border-white/10 p-6 text-sm text-zinc-400">Carregando dados do projeto...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome" error={errors.name}>
                  <TextInput value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Arcane Engineering" />
                </Field>
                <Field label="Slug" error={errors.slug}>
                  <TextInput
                    value={form.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      updateField('slug', slugify(event.target.value));
                    }}
                    placeholder="arcane-engineering"
                  />
                </Field>
              </div>

              <Field label="Descricao curta" error={errors.short_description}>
                <TextArea
                  value={form.short_description}
                  onChange={(event) => updateField('short_description', event.target.value)}
                  placeholder="Resumo rapido para cards e listagens."
                  className="min-h-24"
                />
              </Field>

              <div>
                <MarkdownEditor value={form.description} onChange={(value) => updateField('description', value)} />
                {errors.description && <span className="mt-2 block text-xs text-rose-300">{errors.description}</span>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <UploadField
                  label="Logo"
                  value={form.logo_url}
                  folder="logos"
                  onChange={(value) => updateField('logo_url', value)}
                  onError={(message) => showToast({ type: 'error', title: 'Upload nao concluido', description: message })}
                />
                <UploadField
                  label="Banner"
                  value={form.banner_url}
                  folder="banners"
                  onChange={(value) => updateField('banner_url', value)}
                  onError={(message) => showToast({ type: 'error', title: 'Upload nao concluido', description: message })}
                />
              </div>

              <Field label="Links externos">
                <div className="grid gap-3">
                  {form.external_links.map((link, index) => (
                    <div key={index} className="grid gap-2 rounded-lg border border-white/10 bg-zinc-950/40 p-3 md:grid-cols-[1fr_1.5fr_auto]">
                      <TextInput value={link.label} onChange={(event) => updateExternalLink(index, 'label', event.target.value)} placeholder="Discord" />
                      <TextInput value={link.url} onChange={(event) => updateExternalLink(index, 'url', event.target.value)} placeholder="https://..." />
                      <button
                        type="button"
                        onClick={() => removeExternalLink(index)}
                        className="grid h-11 place-items-center rounded-lg border border-white/10 px-3 text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
                        aria-label="Remover link"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExternalLink}
                    className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <ExternalLink size={16} />
                    Adicionar link
                  </button>
                </div>
              </Field>
            </>
          )}
        </AdminCard>

        <div className="grid h-fit gap-6">
          <AdminCard className="grid gap-4 p-5">
            <h2 className="text-lg font-bold text-white">Organizacao</h2>
            <Field label="Status">
              <SelectInput value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                {PROJECT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Categoria">
              <SelectInput value={form.category_id} onChange={(event) => updateField('category_id', event.target.value)}>
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Tags">
              <CheckboxGroup options={tagOptions} values={form.tag_ids} onChange={(value) => updateField('tag_ids', value)} />
            </Field>
          </AdminCard>

          <AdminCard className="grid gap-4 p-5">
            <h2 className="text-lg font-bold text-white">Compatibilidade</h2>
            <Field label="Minecraft Versions" error={errors.minecraft_versions}>
              <CheckboxGroup
                options={MINECRAFT_VERSIONS}
                values={form.minecraft_versions}
                onChange={(value) => updateField('minecraft_versions', value)}
              />
            </Field>
            <Field label="Loaders" error={errors.loaders}>
              <CheckboxGroup options={LOADERS} values={form.loaders} onChange={(value) => updateField('loaders', value)} />
            </Field>
          </AdminCard>

          <AdminCard className="grid gap-4 p-5">
            <h2 className="text-lg font-bold text-white">Publicacao</h2>
            <Field label="Visibilidade">
              <SelectInput value={form.visibility} onChange={(event) => updateField('visibility', event.target.value)}>
                {VISIBILITIES.map((visibility) => (
                  <option key={visibility.value} value={visibility.value}>
                    {visibility.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-950/40 p-3">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(event) => updateField('is_published', event.target.checked)}
                className="mt-1 size-4 rounded border-white/10 bg-zinc-950 text-emerald-500"
              />
              <span>
                <span className="block text-sm font-semibold text-white">Publicado</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">
                  Somente projetos publicos e publicados aparecem no website publico.
                </span>
              </span>
            </label>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? 'Salvando...' : 'Salvar Projeto'}
            </button>
          </AdminCard>
        </div>
      </form>
    </AdminLayout>
  );
}
