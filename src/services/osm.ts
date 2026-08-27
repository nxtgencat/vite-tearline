export type OSMResult = { display_name: string; lat: string; lon: string; place_id: number }

export async function searchLocation(q: string): Promise<OSMResult[]> {
  if (!q.trim()) return []
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
  if (!res.ok) throw new Error('Location search failed')
  return res.json()
}

export function embedUrl(lat: number, lng: number, _zoom = 14) {
  const delta = 0.05
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
}
