import { cn } from '../../utils/formatters.js';

export default function AdminCard({ children, className = '' }) {
  return (
    <section className={cn('rounded-lg border border-white/10 bg-zinc-900/76 shadow-2xl shadow-black/10', className)}>
      {children}
    </section>
  );
}
