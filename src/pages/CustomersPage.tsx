import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCustomers } from "@/contexts/CustomerContext";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import CustomerForm, { toCustomerForm } from "@/components/customers/CustomerForm";
import type { Customer } from "@/lib/types";

const PAGE_SIZE = 6;

export default function CustomersPage() {
  const { customers, loading, error, reload, addCustomer, updateCustomer, removeCustomer } = useCustomers();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.mobile.includes(s)
    );
  }, [customers, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return (
      <div className="space-y-5">
        <span className="ticket-tag">CRM</span>
        <h1 className="font-display font-semibold text-3xl mt-3">Customers</h1>
        <div className="card p-0 overflow-hidden">
          <div className="p-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-12" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="ticket-tag">CRM · {customers.length}</span>
          <h1 className="font-display font-semibold text-3xl mt-3">Customers</h1>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Add customer
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-amber/10 text-sm flex justify-between gap-3">
          <span>{error}</span>
          <button className="text-cobalt font-medium" onClick={reload}>
            Retry
          </button>
        </div>
      )}

      <Card>
        <input className="field max-w-md" placeholder="Search name, email or mobile…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      </Card>

      {rows.length === 0 ? (
        <EmptyState title="No customers found" hint="Add a customer to start booking rentals." />
      ) : (
        <>
          <div className="card p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-slate border-b border-line">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Contact</th>
                  <th className="p-3 font-medium">License</th>
                  <th className="p-3 font-medium">Address</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-slate">
                      {c.email}
                      <br />
                      {c.mobile}
                    </td>
                    <td className="p-3 font-mono text-xs">{c.license}</td>
                    <td className="p-3 text-slate max-w-[200px] truncate">{c.address}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        className="text-cobalt text-xs font-medium mr-3"
                        onClick={() => {
                          setEditing(c);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button className="text-rose text-xs font-medium" onClick={() => setDeleting(c)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <button className="w-8 h-8 rounded-md grid place-content-center hover:bg-ink/5" disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}>
              ‹
            </button>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-md ${safePage === i + 1 ? "bg-ink text-paper font-medium" : "hover:bg-ink/5"}`}
              >
                {i + 1}
              </button>
            ))}
            <button className="w-8 h-8 rounded-md grid place-content-center hover:bg-ink/5" disabled={safePage === pages} onClick={() => setPage((p) => p + 1)}>
              ›
            </button>
          </div>
        </>
      )}

      <Modal open={showForm} title={editing ? "Edit customer" : "Add customer"} onClose={() => setShowForm(false)}>
        <CustomerForm
          key={editing?.id || "new"}
          initial={toCustomerForm(editing || undefined)}
          onCancel={() => setShowForm(false)}
          onSubmit={(v) => {
            if (editing) {
              updateCustomer(editing.id, v);
              toast.success("Customer updated");
            } else {
              addCustomer(v);
              toast.success("Customer added");
            }
            setShowForm(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete customer?"
        message={`Remove ${deleting?.name}? Their booking history stays but they cannot take new bookings.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            removeCustomer(deleting.id);
            toast.success("Customer deleted");
          }
          setDeleting(null);
        }}
      />
    </div>
  );
}
