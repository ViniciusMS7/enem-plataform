export default function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-ink/60 py-2">
      <span className="inline-block w-3 h-3 border-2 border-ink border-t-transparent animate-spin shrink-0" />
      <span className="font-mono text-sm">{label}</span>
    </div>
  );
}
