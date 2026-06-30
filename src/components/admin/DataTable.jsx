import { TableSkeleton } from './Skeleton.jsx';

export default function DataTable({ columns, rows, getRowKey, loading, emptyMessage = 'Nenhum registro encontrado.' }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/30">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10 bg-zinc-950/70 text-xs uppercase text-zinc-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <TableSkeleton rows={4} columns={columns.length} />
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <tr key={getRowKey(row)} className="transition-colors hover:bg-white/[0.03]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 align-middle text-zinc-300">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-zinc-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {loading ? (
          <TableSkeleton rows={4} columns={2} />
        ) : rows.length > 0 ? (
          rows.map((row) => (
            <article key={getRowKey(row)} className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
              {columns.map((column) => (
                <div key={column.key} className="grid gap-1 border-b border-white/10 py-3 first:pt-0 last:border-0 last:pb-0">
                  <span className="text-xs font-semibold uppercase text-zinc-500">{column.header}</span>
                  <div className="text-sm text-zinc-200">{column.render ? column.render(row) : row[column.key]}</div>
                </div>
              ))}
            </article>
          ))
        ) : (
          <div className="py-10 text-center text-sm text-zinc-500">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
}
