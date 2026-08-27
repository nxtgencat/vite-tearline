import React from 'react'

type Column<T> = { key: string; header: string; render?: (row: T) => React.ReactNode }

type Props<T> = { columns: Column<T>[]; data: T[]; onRowClick?: (row: T) => void }

function Table<T extends { id: string }>({ columns, data, onRowClick }: Props<T>) {
  return (
    <div className="overflow-auto rounded-xl border border-line dark:border-linedark">
      <table className="w-full text-sm">
        <thead className="bg-paper dark:bg-inkdark text-left">
          <tr>{columns.map(c => <th key={c.key} className="px-4 py-3 font-medium text-slate dark:text-slatedark whitespace-nowrap">{c.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-linedark bg-surface dark:bg-surfacedark">
          {data.map(row => (
            <tr key={row.id} onClick={() => onRowClick?.(row)} className={onRowClick ? 'hover:bg-ink/5 dark:hover:bg-white/5 cursor-pointer' : ''}>
              {columns.map(c => (
                <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                  {c.render ? c.render(row) : String((row as unknown as Record<string, unknown>)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default React.memo(Table) as typeof Table
