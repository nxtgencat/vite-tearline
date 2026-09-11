import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { keys, readJSON, writeJSON } from "@/lib/storage";
import { seedCustomers } from "@/lib/seed";
import type { Customer } from "@/lib/types";
import { uid } from "@/lib/rental";

interface CustomerCtx {
  customers: Customer[];
  addCustomer: (c: Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
}

const Ctx = createContext<CustomerCtx | null>(null);

function initial(): Customer[] {
  const saved = readJSON<Customer[]>(keys.customers, []);
  if (saved.length > 0) return saved;
  writeJSON(keys.customers, seedCustomers);
  return seedCustomers;
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(initial);

  function save(next: Customer[]) {
    setCustomers(next);
    writeJSON(keys.customers, next);
  }

  return (
    <Ctx.Provider
      value={{
        customers,
        addCustomer: (c) => save([...customers, { ...c, id: uid("cust"), createdAt: new Date().toISOString() }]),
        updateCustomer: (id, patch) => save(customers.map((c) => (c.id === id ? { ...c, ...patch } : c))),
        removeCustomer: (id) => save(customers.filter((c) => c.id !== id)),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCustomers(): CustomerCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCustomers outside provider");
  return v;
}
