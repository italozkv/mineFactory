import AdminCard from '../AdminCard.jsx';
import AdminSearchBar from '../AdminSearchBar.jsx';
import { Field, SelectInput, TextInput } from '../FormControls.jsx';
import { ROADMAP_CATEGORY_SUGGESTIONS, ROADMAP_PRIORITY_OPTIONS, ROADMAP_STATUS_OPTIONS, ROADMAP_TYPE_OPTIONS } from '../../../utils/roadmapUtils.js';

export default function RoadmapFilters({ projects, filters, onChange, onClear }) {
  return (
    <AdminCard className="p-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="sm:col-span-2 xl:col-span-2">
          <Field label="Pesquisar por titulo">
            <AdminSearchBar value={filters.search} onChange={(value) => onChange('search', value)} placeholder="Buscar tarefa..." />
          </Field>
        </div>
        <Field label="Projeto">
          <SelectInput value={filters.projectId} onChange={(event) => onChange('projectId', event.target.value)}>
            <option value="">Todos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Status">
          <SelectInput value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="">Todos</option>
            {ROADMAP_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Prioridade">
          <SelectInput value={filters.priority} onChange={(event) => onChange('priority', event.target.value)}>
            <option value="">Todas</option>
            {ROADMAP_PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Tipo">
          <SelectInput value={filters.type} onChange={(event) => onChange('type', event.target.value)}>
            <option value="">Todos</option>
            {ROADMAP_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Categoria">
          <TextInput list="roadmap-categories" value={filters.category} onChange={(event) => onChange('category', event.target.value)} placeholder="Gameplay" />
          <datalist id="roadmap-categories">
            {ROADMAP_CATEGORY_SUGGESTIONS.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          Limpar filtros
        </button>
      </div>
    </AdminCard>
  );
}
