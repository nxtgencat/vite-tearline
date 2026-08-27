export type UploadResult = { url: string; name: string; type: string; size: number }

const ALLOWED_TYPES = ['image/jpeg','image/png','image/webp','application/pdf']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPG, PNG, WEBP or PDF allowed'
  if (file.size > MAX_SIZE) return 'File must be under 5MB'
  return null
}

export function mockUpload(file: File, onProgress: (pct: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const err = validateFile(file)
    if (err) { reject(new Error(err)); return }
    let pct = 0
    const timer = setInterval(() => {
      pct += 20
      onProgress(Math.min(pct, 100))
      if (pct >= 100) {
        clearInterval(timer)
        const url = URL.createObjectURL(file)
        resolve({ url, name: file.name, type: file.type, size: file.size })
      }
    }, 120)
  })
}
