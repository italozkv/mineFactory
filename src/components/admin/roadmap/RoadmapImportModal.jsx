import { CheckCircle2, Copy, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import Modal from '../Modal.jsx';
import { TextArea } from '../FormControls.jsx';
import { useToast } from '../ToastProvider.jsx';
import {
  ROADMAP_IMPORT_TEMPLATE,
  normalizeRoadmapImportItem,
  validateRoadmapImportItems,
} from '../../../utils/roadmapUtils.js';

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || 'Sem projeto';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export default function RoadmapImportModal({ open, onClose, onImport, loading }) {
  const { showToast } = useToast();
  const [rawJson, setRawJson] = useState('');
  const [fileName, setFileName] = useState('');
  const [validation, setValidation] = useState(null);
  const [localError, setLocalError] = useState('');

  function resetState() {
    setRawJson('');
    setFileName('');
    setValidation(null);
    setLocalError('');
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function loadFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawJson(String(reader.result || ''));
      setFileName(file.name);
    };
    reader.readAsText(file);
  }

  function handleValidate() {
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        setValidation({ items: [], errors: ['O JSON precisa ser um array de tarefas.'], warnings: [] });
        return;
      }

      const { items, errors } = validateRoadmapImportItems(parsed);
      const normalized = items.map(normalizeRoadmapImportItem);
      const warnings = [];
      const projectNames = normalized.map((item) => item.project).filter(Boolean);

      if (projectNames.length === 0) {
        warnings.push('Nenhuma tarefa esta vinculada a projeto.');
      }

      setValidation({
        items: normalized,
        errors,
        warnings,
      });
      setLocalError('');
    } catch (error) {
      setValidation({ items: [], errors: ['JSON invalido.'], warnings: [] });
      setLocalError(error.message || 'JSON invalido.');
    }
  }

  async function handleImport() {
    if (!validation || validation.errors.length > 0) {
      handleValidate();
      return;
    }

    try {
      const result = await onImport(validation.items);
      showToast({
        title: `Roadmap importado com sucesso.`,
        description: result?.warnings?.length ? result.warnings.join(' ') : undefined,
      });
      handleClose();
    } catch (error) {
      showToast({ type: 'error', title: 'Nao foi possivel importar', description: error.message });
    }
  }

  const groupedPreview = useMemo(() => {
    if (!validation?.items?.length) return {};
    return countBy(validation.items, 'status');
  }, [validation]);

  return (
    <Modal open={open} onClose={handleClose} title="Importar Roadmap" panelClassName="max-w-4xl">
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-zinc-400">
          Cole um JSON valido com uma lista de tarefas para criar varios itens de uma vez.
        </p>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-zinc-200">Arquivo ou JSON</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={(event) => loadFile(event.target.files?.[0])}
            className="block w-full cursor-pointer rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
          />
          <span className="text-xs text-zinc-500">{fileName || 'Nenhum arquivo selecionado.'}</span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-zinc-200">JSON</span>
          <TextArea
            value={rawJson}
            onChange={(event) => setRawJson(event.target.value)}
            className="min-h-[320px] font-mono text-xs leading-6"
            placeholder='[{"title":"Nova tarefa"}]'
          />
        </label>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(ROADMAP_IMPORT_TEMPLATE);
              showToast({ title: 'Modelo JSON copiado.' });
            }}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10"
          >
            <Copy size={15} />
            Copiar modelo JSON
          </button>
        </div>

        {(localError || validation?.errors?.length > 0) && (
          <div className="grid gap-2 rounded-lg border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {(validation?.errors?.length ? validation.errors : [localError]).map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}

        {validation?.items?.length > 0 && (
          <div className="grid gap-3 rounded-lg border border-emerald-400/20 bg-emerald-500/8 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Importacao validada</p>
                <p className="text-xs text-zinc-400">{validation.items.length} tarefa(s) prontas para importar.</p>
              </div>
            </div>

            {Object.keys(groupedPreview).length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {Object.entries(groupedPreview).map(([status, count]) => (
                  <span key={status} className="rounded-lg border border-white/10 bg-zinc-950/50 px-2.5 py-1 text-zinc-300">
                    {status}: {count}
                  </span>
                ))}
              </div>
            )}

            <div className="max-h-64 overflow-auto rounded-lg border border-white/10 bg-zinc-950/40 p-3">
              <ul className="grid gap-2 text-sm text-zinc-300">
                {validation.items.map((item, index) => (
                  <li key={`${item.title}-${index}`} className="rounded-lg border border-white/10 bg-zinc-950/50 p-3">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.project || 'Sem projeto'} - {item.priority} - {item.type} - {item.status}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 size={14} />
              Clique em Importar para salvar as tarefas no Supabase.
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10"
          >
            Validar
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading || !validation?.items?.length || Boolean(validation?.errors?.length)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
          >
            <Upload size={16} />
            Importar
          </button>
        </div>
      </div>
    </Modal>
  );
}
