export function SkeletonLine({ className = 'h-4 w-full' }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="grid gap-3 p-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-3 rounded-lg border border-white/10 bg-zinc-950/40 p-4 md:grid-cols-4">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <SkeletonLine key={columnIndex} className={columnIndex === 0 ? 'h-5 w-36' : 'h-5 w-full'} />
          ))}
        </div>
      ))}
    </div>
  );
}
