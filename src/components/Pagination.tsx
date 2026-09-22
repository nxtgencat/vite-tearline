export default function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-1 text-sm mt-6">
      <button className="btn-icon" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous">‹</button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-8 h-8 rounded-md ${page === i + 1 ? 'bg-ink text-paper font-medium' : 'hover:bg-ink/5'}`}
        >
          {i + 1}
        </button>
      ))}
      <button className="btn-icon" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next">›</button>
    </div>
  );
}
