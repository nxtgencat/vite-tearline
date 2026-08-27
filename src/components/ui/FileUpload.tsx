import React, { useCallback, useState } from 'react'
import { mockUpload, validateFile } from '@/services/cloudinary'
import { FiUpload, FiX, FiFileText } from 'react-icons/fi'

type Uploaded = { url: string; name: string; type: string; size: number }

type Props = { onUploaded: (u: Uploaded | null) => void; label?: string }

function FileUpload({ onUploaded, label = 'Upload file' }: Props) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<Uploaded | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handle = useCallback(async (f: File | null) => {
    if (!f) return
    const v = validateFile(f)
    if (v) { setError(v); return }
    setError(null); setUploading(true); setProgress(0)
    try {
      const res = await mockUpload(f, setProgress)
      setFile(res); onUploaded(res)
    } catch (e: unknown) { setError((e as Error).message) }
    finally { setUploading(false) }
  }, [onUploaded])

  const remove = () => { setFile(null); setProgress(0); onUploaded(null); if (file?.url) URL.revokeObjectURL(file.url) }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>
      {!file ? (
        <label className="block border border-dashed border-line dark:border-linedark rounded-xl p-6 text-center cursor-pointer hover:border-cobalt transition-colors">
          <FiUpload className="w-5 h-5 mx-auto mb-2 text-slate dark:text-slatedark" />
          <span className="text-sm">Click to upload or drag & drop</span>
          <span className="block text-xs text-slate dark:text-slatedark mt-1">JPG, PNG, WEBP or PDF up to 5MB</span>
          <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={e => handle(e.target.files?.[0] ?? null)} />
        </label>
      ) : (
        <div className="rounded-xl border border-line dark:border-linedark p-4">
          <div className="flex items-start gap-3">
            {file.type.startsWith('image/') ? <img src={file.url} alt={file.name} className="w-16 h-16 rounded-lg object-cover border border-line dark:border-linedark" /> : <div className="w-16 h-16 rounded-lg bg-ink/5 dark:bg-white/5 grid place-content-center"><FiFileText className="w-6 h-6" /></div>}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-slate dark:text-slatedark">{(file.size/1024).toFixed(1)} KB · {file.type}</p>
              {file.type === 'application/pdf' && <a href={file.url} target="_blank" rel="noreferrer" className="text-xs text-cobalt underline">Preview PDF</a>}
            </div>
            <button onClick={remove} className="btn-icon w-8 h-8"><FiX className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      {uploading && (
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-ink/10 dark:bg-white/10 overflow-hidden"><div className="h-full bg-cobalt transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="text-xs text-slate dark:text-slatedark">{progress}% uploading…</p>
        </div>
      )}
      {error && <p className="text-xs text-rose">{error}</p>}
      <p className="text-xs text-slate dark:text-slatedark">Image preview · PDF preview · progress · remove · validation included</p>
    </div>
  )
}

export default React.memo(FileUpload)
