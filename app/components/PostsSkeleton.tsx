export default function PostsSkeleton() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-gray-200 p-5">
          <div className="h-40 w-full rounded-lg bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
