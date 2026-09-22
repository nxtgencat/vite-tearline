export default function Skeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="skeleton h-36 rounded-lg" />
          <div className="skeleton h-4 rounded mt-4 w-2/3" />
          <div className="skeleton h-3 rounded mt-2 w-1/3" />
        </div>
      ))}
    </div>
  );
}
