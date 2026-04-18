export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-36 animate-pulse rounded bg-neutral-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl bg-neutral-200"
          />
        ))}
      </div>
    </div>
  );
}
