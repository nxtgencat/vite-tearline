import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-slate mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button className="btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="px-5 py-2.5 rounded-full bg-rose text-white text-sm font-medium hover:opacity-90"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
