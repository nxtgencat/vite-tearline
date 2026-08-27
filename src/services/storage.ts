export function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota errors
  }
}

export function removeStorage(key: string) {
  try { localStorage.removeItem(key) } catch { // ignore
  }
}

// generic CRUD over localStorage array
export function listItems<T extends { id: string }>(key: string, seed: T[]): T[] {
  const existing = getStorage<T[] | null>(key, null)
  if (!existing) {
    setStorage(key, seed)
    return seed
  }
  return existing
}

export function createItem<T extends { id: string }>(key: string, item: T): T {
  const list = getStorage<T[]>(key, [])
  const next = [...list, item]
  setStorage(key, next)
  return item
}

export function updateItem<T extends { id: string }>(key: string, id: string, patch: Partial<T>): T | null {
  const list = getStorage<T[]>(key, [])
  let updated: T | null = null
  const next = list.map(i => {
    if (i.id === id) {
      updated = { ...i, ...patch }
      return updated
    }
    return i
  })
  setStorage(key, next)
  return updated
}

export function deleteItem<T extends { id: string }>(key: string, id: string) {
  const list = getStorage<T[]>(key, [])
  const next = list.filter(i => i.id !== id)
  setStorage(key, next)
}
