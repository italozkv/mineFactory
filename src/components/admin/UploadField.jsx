import { ImagePlus, Loader2, Link2 } from 'lucide-react';
import { useState } from 'react';
import { uploadProjectAsset } from '../../services/adminService.js';
import { Field, TextInput } from './FormControls.jsx';

export default function UploadField({ label, value, onChange, onError, folder, aspectClass = 'aspect-[16/9]', imageClassName = 'object-cover' }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadProjectAsset(file, folder);
      onChange(publicUrl);
    } catch (error) {
      onError?.(error.message || 'Nao foi possivel enviar o arquivo.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <Field label={label} hint="Use uma URL publica ou envie para o bucket project-assets.">
      <div className="grid gap-3">
        <div className={`overflow-hidden rounded-lg border border-white/10 bg-zinc-950/60 ${aspectClass}`}>
          {value ? (
            <img src={value} alt="" className={`h-full w-full ${imageClassName}`} />
          ) : (
            <div className="grid h-full place-items-center gap-2 text-sm text-zinc-500">
              <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5">
                <Link2 size={18} />
              </span>
              Nenhuma imagem selecionada
            </div>
          )}
        </div>
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <TextInput value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://..." />
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10">
            {uploading ? <Loader2 className="animate-spin" size={17} /> : <ImagePlus size={17} />}
            {uploading ? 'Enviando' : 'Arquivo'}
            <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>
      </div>
    </Field>
  );
}
