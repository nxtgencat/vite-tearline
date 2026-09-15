import { useState } from "react";
import type { Customer } from "@/lib/types";
import { validateCustomer } from "@/lib/validation";
import Field from "@/components/ui/Field";

export interface CustomerFormValue {
  name: string;
  email: string;
  mobile: string;
  address: string;
  license: string;
}

export function toCustomerForm(c?: Customer): CustomerFormValue {
  return {
    name: c?.name || "",
    email: c?.email || "",
    mobile: c?.mobile || "",
    address: c?.address || "",
    license: c?.license || "",
  };
}

export default function CustomerForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: CustomerFormValue;
  onSubmit: (v: CustomerFormValue) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: keyof CustomerFormValue, val: string) {
    setV((p) => ({ ...p, [key]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateCustomer(v);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit(v);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Name" error={errors.name}>
        <input className="field" value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email" error={errors.email}>
          <input className="field" value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="mail@mail.com" />
        </Field>
        <Field label="Mobile" error={errors.mobile}>
          <input className="field" value={v.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="9876543210" />
        </Field>
      </div>
      <Field label="Address" error={errors.address}>
        <input className="field" value={v.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, City" />
      </Field>
      <Field label="Driving license" error={errors.license}>
        <input className="field" value={v.license} onChange={(e) => set("license", e.target.value)} placeholder="MH12-202100123" />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save customer
        </button>
      </div>
    </form>
  );
}
