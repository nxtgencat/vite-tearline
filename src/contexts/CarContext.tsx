import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchCarsFromAPI, fallbackCars, addCarToAPI, updateCarInAPI, deleteCarFromAPI } from "@/services/carApi";
import { keys, readJSON, writeJSON } from "@/lib/storage";
import type { Car, CarStatus } from "@/lib/types";

interface CarCtx {
  cars: Car[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  addCar: (c: Omit<Car, "id">) => void;
  updateCar: (id: string, patch: Partial<Car>) => void;
  removeCar: (id: string) => void;
  setStatus: (id: string, status: CarStatus) => void;
}

const Ctx = createContext<CarCtx | null>(null);

export function CarProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(() => readJSON<Car[]>(keys.carsOverride, []));
  const [loading, setLoading] = useState(cars.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const cached = readJSON<Car[]>(keys.carsOverride, []);
    // Cosmetics-era cache used api_1..api_100 — live vehicles are only
    // 113-117 + 167-171. Refetch when cosmetics or no fleet cars present.
    const hasCosmetics = cached.some((c) => {
      if (!c.id.startsWith("api_")) return false;
      const n = Number(c.id.slice(4));
      return Number.isFinite(n) && n <= 100;
    });
    const hasFleet = cached.some((c) => c.id.startsWith("fleet_"));
    if (cached.length >= 20 && hasFleet && !hasCosmetics && tick === 0) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    fetchCarsFromAPI()
      .then((list) => {
        if (!alive) return;
        // Keep user-added cars across refetch / source switch
        const locals = readJSON<Car[]>(keys.carsOverride, []).filter((c) => c.id.startsWith("local_"));
        const merged = [...list, ...locals];
        setCars(merged);
        writeJSON(keys.carsOverride, merged);
      })
      .catch(() => {
        if (!alive) return;
        const existing = readJSON<Car[]>(keys.carsOverride, []);
        if (existing.length > 0) {
          setCars(existing);
        } else {
          const fb = fallbackCars();
          setCars(fb);
          writeJSON(keys.carsOverride, fb);
        }
        setError("Live API unreachable, showing cached fleet.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  function save(next: Car[]) {
    setCars(next);
    writeJSON(keys.carsOverride, next);
  }

  const value: CarCtx = {
    cars,
    loading,
    error,
    reload: () => setTick((t) => t + 1),
    addCar: (c) => {
      save([...cars, { ...c, id: `local_${Date.now()}` }]);
      // Simulated POST — visible in DevTools Network, not persisted by DummyJSON
      addCarToAPI(c).catch(() => {});
    },
    updateCar: (id, patch) => {
      save(cars.map((c) => (c.id === id ? { ...c, ...patch } : c)));
      // Simulated PUT — visible in DevTools Network, not persisted by DummyJSON
      updateCarInAPI(id, patch).catch(() => {});
    },
    removeCar: (id) => {
      save(cars.filter((c) => c.id !== id));
      // Simulated DELETE — visible in DevTools Network, not persisted by DummyJSON
      deleteCarFromAPI(id).catch(() => {});
    },
    setStatus: (id, status) => {
      save(cars.map((c) => (c.id === id ? { ...c, status } : c)));
      updateCarInAPI(id, { status }).catch(() => {});
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCars(): CarCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCars outside provider");
  return v;
}
