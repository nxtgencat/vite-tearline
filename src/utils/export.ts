// export helpers for CSV / PDF (mock) / Excel (CSV with .xls)
export function exportToCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
  downloadBlob(csv, filename, 'text/csv')
}

export function exportToExcel(rows: Record<string, unknown>[], filename: string) {
  exportToCSV(rows, filename.replace('.csv', '.xls'))
}

export function exportToPDF(title: string, rows: Record<string, unknown>[], filename: string) {
  // mock PDF as HTML blob printed — lightweight without extra dep
  const headers = rows.length ? Object.keys(rows[0]) : []
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:system-ui;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left}th{background:#f6f5f1}</style></head><body><h2>${title}</h2><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${headers.map(h=>`<td>${String(r[h] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const w = window.open(url)
  if (w) {
    w.onload = () => {
      w.document.title = filename
    }
  }
  // also download as .pdf html fallback
  downloadBlob(html, filename.replace('.pdf','') + '.html', 'text/html')
  setTimeout(()=>URL.revokeObjectURL(url), 5000)
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
