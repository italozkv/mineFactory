import { useState } from 'react';
import { Field, TextArea } from './FormControls.jsx';

export default function MarkdownEditor({ value, onChange }) {
  const [mode, setMode] = useState('write');

  return (
    <Field label="Descricao completa">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/40">
        <div className="flex border-b border-white/10 bg-zinc-950/70 p-1">
          {[
            ['write', 'Editar'],
            ['preview', 'Preview'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`h-9 rounded-lg px-3 text-sm font-semibold transition-colors ${
                mode === key ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === 'write' ? (
          <TextArea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Use Markdown para organizar a ficha do mod..."
            className="min-h-56 rounded-none border-0 bg-transparent focus:ring-0"
          />
        ) : (
          <div className="min-h-56 whitespace-pre-wrap px-4 py-3 text-sm leading-7 text-zinc-300">
            {value || 'Nada para visualizar ainda.'}
          </div>
        )}
      </div>
    </Field>
  );
}
