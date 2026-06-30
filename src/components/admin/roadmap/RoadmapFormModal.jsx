import { useEffect, useMemo, useState } from 'react';
import Modal from '../Modal.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../FormControls.jsx';
import { ROADMAP_CATEGORY_SUGGESTIONS, ROADMAP_DEFAULT_FORM, ROADMAP_PRIORITY_OPTIONS, ROADMAP_STATUS_OPTIONS, ROADMAP_TYPE_OPTIONS, roadmapFormFromItem, validateRoadmapForm } from '../../../utils/roadmapUtils.js';

export default function RoadmapFormModal({ open, item, projects, loading, onClose, onSave }) {
  const [form, setForm] = useState(ROADMAP_DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setForm(roadmapFormFromItem(item));
      setErrors({});
    } else if (open) {
      setForm(ROADMAP_DEFAULT_FORM);
      setErrors({});
    }
  }, [item, open]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRoadmapForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSave(form);
  }

  const projectOptions = useMemo(() => projects || [], [projects]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Editar Tarefa' : 'Nova Tarefa'}
      panelClassName="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Titulo" error={errors.title}>
            <TextInput value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Adicionar sistema de quests" />
          </Field>
          <Field label="Projeto relacionado">
            <SelectInput value={form.project_id} onChange={(event) => updateField('project_id', event.target.value)}>
              <option value="">Nenhum</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <Field label="Descricao">
          <TextArea
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Detalhe a tarefa do roadmap..."
            className="min-h-32"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Status" error={errors.status}>
            <SelectInput value={form.status} onChange={(event) => updateField('status', event.target.value)}>
              {ROADMAP_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Prioridade" error={errors.priority}>
            <SelectInput value={form.priority} onChange={(event) => updateField('priority', event.target.value)}>
              {ROADMAP_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Tipo" error={errors.type}>
            <SelectInput value={form.type} onChange={(event) => updateField('type', event.target.value)}>
              {ROADMAP_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Versao prevista">
            <TextInput value={form.target_version} onChange={(event) => updateField('target_version', event.target.value)} placeholder="1.21.1" />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Categoria">
            <TextInput
              list="roadmap-item-categories"
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              placeholder="Gameplay"
            />
            <datalist id="roadmap-item-categories">
              {ROADMAP_CATEGORY_SUGGESTIONS.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Field>
          <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-950/40 p-3">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(event) => updateField('is_public', event.target.checked)}
              className="mt-1 size-4 rounded border-white/10 bg-zinc-950 text-emerald-500"
            />
            <span>
              <span className="block text-sm font-semibold text-white">Publico</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                Futuramente esta tarefa pode aparecer no website publico.
              </span>
            </span>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
