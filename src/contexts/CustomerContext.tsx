import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { keys, readJSON, writeJSON } from "@/lib/storage";
import {
  fetchCustomersFromAPI,
  fallbackCustomers,
  addCustomerToAPI,
  updateCustomerInAPI,
  deleteCustomerFromAPI,
} from "@/services/customerApi";
import type { Customer } from "@/lib/types";
import { uid } from "@/lib/rental";

interface CustomerCtx {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  addCustomer: (c: Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
}

const Ctx = createContext<CustomerCtx | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() =>
    readJSON<Customer[]>(keys.customers, [])
  );
  const [loading, setLoading] = useState(customers.length < 10);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const cached = readJSON<Customer[]>(keys.customers, []);
    // Old cache had 3 seed customers — refetch to get 100 DummyJSON users
    if (cached.length >= 10 && tick === 0) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    fetchCustomersFromAPI(100)
      .then((list) => {
        if (!alive) return;
        // Keep user-added customers across refetch
        const locals = readJSON<Customer[]>(keys.customers, []).filter(
          (c) => !c.id.startsWith("user_") && !c.id.startsWith("cust_seed_")
        );
        const merged = [...list, ...locals];
        setCustomers(merged);
        writeJSON(keys.customers, merged);
      })
      .catch(() => {
        if (!alive) return;
        const existing = readJSON<Customer[]>(keys.customers, []);
        if (existing.length > 0) {
          setCustomers(existing);
        } else {
          const fb = fallbackCustomers();
          setCustomers(fb);
          writeJSON(keys.customers, fb);
        }
        setError("Live API unreachable, showing cached customers.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  function save(next: Customer[]) {
    setCustomers(next);
    writeJSON(keys.customers, next);
  }

  return (
    <Ctx.Provider
      value={{
        customers,
        loading,
        error,
        reload: () => setTick((t) => t + 1),
        addCustomer: (c) => {
          save([...customers, { ...c, id: uid("cust"), createdAt: new Date().toISOString() }]);
          // Simulated POST — visible in DevTools Network
          addCustomerToAPI(c).catch(() => {});
        },
        updateCustomer: (id, patch) => {
          save(customers.map((c) => (c.id === id ? { ...c, ...patch } : c)));
          updateCustomerInAPI(id, patch).catch(() => {});
        },
        removeCustomer: (id) => {
          save(customers.filter((c) => c.id !== id));
          deleteCustomerFromAPI(id).catch(() => {});
        },
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
