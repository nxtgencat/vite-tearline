import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchCarsFromAPI, fallbackCars } from "@/services/carApi";
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
    if (readJSON<Car[]>(keys.carsOverride, []).length > 0 && tick === 0) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    fetchCarsFromAPI()
      .then((list) => {
        if (!alive) return;
        setCars(list);
        writeJSON(keys.carsOverride, list);
      })
      .catch(() => {
        if (!alive) return;
        const fb = fallbackCars();
        setCars(fb);
        writeJSON(keys.carsOverride, fb);
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
    addCar: (c) => save([...cars, { ...c, id: `local_${Date.now()}` }]),
    updateCar: (id, patch) => save(cars.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    removeCar: (id) => save(cars.filter((c) => c.id !== id)),
    setStatus: (id, status) => save(cars.map((c) => (c.id === id ? { ...c, status } : c))),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCars(): CarCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCars outside provider");
  return v;
}
