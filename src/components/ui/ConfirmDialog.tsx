import React from 'react'
import Modal from './Modal'
import Button from './Button'

type Props = { open: boolean; onClose: () => void; onConfirm: () => void; title?: string; message?: string }

function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?' }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate dark:text-slatedark mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => { onConfirm(); onClose() }} className="bg-rose hover:bg-rose/90">Confirm</Button>
      </div>
    </Modal>
  )
}

export default React.memo(ConfirmDialog)
