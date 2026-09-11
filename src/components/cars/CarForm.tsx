import { useState } from "react";
import type { Car, FuelType, Transmission } from "@/lib/types";
import { validateCar } from "@/lib/validation";
import Field from "@/components/ui/Field";

export interface CarFormValue {
  brand: string;
  model: string;
  year: string;
  pricePerDay: string;
  fuelType: FuelType;
  transmission: Transmission;
  seating: string;
  image: string;
}

export function toFormValue(c?: Car): CarFormValue {
  return {
    brand: c?.brand || "",
    model: c?.model || "",
    year: c ? String(c.year) : "",
    pricePerDay: c ? String(c.pricePerDay) : "",
    fuelType: c?.fuelType || "Petrol",
    transmission: c?.transmission || "Automatic",
    seating: c ? String(c.seating) : "5",
    image: c?.image || "",
  };
}

export default function CarForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: CarFormValue;
  onSubmit: (v: Omit<Car, "id" | "status">) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: keyof CarFormValue, val: string) {
    setV((p) => ({ ...p, [key]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateCar(v);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      brand: v.brand.trim(),
      model: v.model.trim(),
      year: Number(v.year),
      pricePerDay: Number(v.pricePerDay),
      fuelType: v.fuelType,
      transmission: v.transmission,
      seating: Number(v.seating),
      image: v.image.trim() || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Brand" error={errors.brand}>
          <input className="field" value={v.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Toyota" />
        </Field>
        <Field label="Model" error={errors.model}>
          <input className="field" value={v.model} onChange={(e) => set("model", e.target.value)} placeholder="Camry" />
        </Field>
        <Field label="Year" error={errors.year}>
          <input className="field" value={v.year} onChange={(e) => set("year", e.target.value)} placeholder="2022" />
        </Field>
        <Field label="Price per day ($)" error={errors.pricePerDay}>
          <input className="field" value={v.pricePerDay} onChange={(e) => set("pricePerDay", e.target.value)} placeholder="55" />
        </Field>
        <Field label="Fuel type">
          <select className="field" value={v.fuelType} onChange={(e) => set("fuelType", e.target.value)}>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
        </Field>
        <Field label="Transmission">
          <select className="field" value={v.transmission} onChange={(e) => set("transmission", e.target.value)}>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </Field>
        <Field label="Seating" error={errors.seating}>
          <input className="field" value={v.seating} onChange={(e) => set("seating", e.target.value)} placeholder="5" />
        </Field>
        <Field label="Image URL">
          <input className="field" value={v.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save car
        </button>
      </div>
    </form>
  );
}
