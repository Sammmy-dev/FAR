export default function ClientsLoading() {
  return (
    <div className="space-y-3">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-24 animate-pulse rounded bg-neutral-200" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-neutral-200" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded bg-neutral-200" />
      ))}
    </div>
  );
}
