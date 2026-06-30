import Modal from './Modal.jsx';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', loading, onCancel, onConfirm }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="grid gap-5">
        <p className="text-sm leading-6 text-zinc-400">{message}</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-10 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-10 rounded-lg bg-rose-500 px-4 text-sm font-bold text-white transition-colors hover:bg-rose-400 disabled:opacity-50"
          >
            {loading ? 'Processando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
