import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCars } from "@/contexts/CarContext";
import { useCustomers } from "@/contexts/CustomerContext";
import { useBookings } from "@/contexts/BookingContext";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Modal from "@/components/ui/Modal";
import { calcDays, calcTotal, datesOverlap } from "@/lib/rental";
import { currency, todayInput } from "@/lib/format";

export default function NewBookingPage() {
  const { cars, setStatus } = useCars();
  const { customers } = useCustomers();
  const { bookings, addBooking } = useBookings();
  const nav = useNavigate();
  const [params] = useSearchParams();

  const [customerId, setCustomerId] = useState("");
  const [carId, setCarId] = useState(params.get("car") || "");
  const [pickup, setPickup] = useState(todayInput());
  const [ret, setRet] = useState(todayInput());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const availableCars = useMemo(() => cars.filter((c) => c.status === "available"), [cars]);
  const car = cars.find((c) => c.id === carId);
  const customer = customers.find((c) => c.id === customerId);
  const days = calcDays(pickup, ret);
  const total = car ? calcTotal(days, car.pricePerDay) : 0;

  function isCarBlocked(id: string): boolean {
    return bookings.some(
      (b) => b.carId === id && b.status === "active" && datesOverlap(pickup, ret, b.pickupDate, b.returnDate)
    );
  }

  function validate(): string {
    if (!customerId) return "Select a customer";
    if (!carId) return "Select a car";
    if (!car || car.status !== "available") return "Selected car is not available";
    if (days <= 0) return "Return date must be after pickup date";
    if (isCarBlocked(carId)) return "Car already booked for these dates";
    return "";
  }

  function openConfirm() {
    const e = validate();
    setError(e);
    if (e) return;
    setConfirmOpen(true);
  }

  function confirm() {
    const e = validate();
    if (e) {
      setError(e);
      setConfirmOpen(false);
      return;
    }
    addBooking({ customerId, carId, pickupDate: pickup, returnDate: ret, days, totalCost: total });
    setStatus(carId, "rented");
    toast.success("Booking confirmed!");
    setConfirmOpen(false);
    nav("/bookings");
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <span className="ticket-tag">RENTAL</span>
        <h1 className="font-display font-semibold text-3xl mt-3">New Booking</h1>
      </div>

      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Customer">
            <select className="field" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.mobile}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Car (available only)">
            <select className="field" value={carId} onChange={(e) => setCarId(e.target.value)}>
              <option value="">Select car…</option>
              {availableCars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.model} · {currency(c.pricePerDay)}/day
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pickup date">
            <input type="date" className="field" value={pickup} onChange={(e) => setPickup(e.target.value)} />
          </Field>
          <Field label="Return date">
            <input type="date" className="field" value={ret} onChange={(e) => setRet(e.target.value)} />
          </Field>
        </div>
        {error && <p className="text-xs text-rose mt-4">{error}</p>}
      </Card>

      <Card>
        <h2 className="font-display font-semibold text-lg mb-3">Booking Summary</h2>
        <div className="text-sm space-y-2">
          <p>
            <span className="text-slate">Customer:</span> {customer ? customer.name : "—"}
          </p>
          <p>
            <span className="text-slate">Car:</span> {car ? `${car.brand} ${car.model} (${car.year})` : "—"}
          </p>
          <p>
            <span className="text-slate">Days:</span> {days > 0 ? `${days} day(s)` : "—"}
          </p>
          <p className="font-display font-semibold text-xl pt-2">
            Total: {total > 0 ? currency(total) : "—"}
          </p>
        </div>
        <button className="btn-primary w-full mt-5" onClick={openConfirm}>
          Review & Confirm
        </button>
      </Card>

      <Modal open={confirmOpen} title="Confirm booking?" onClose={() => setConfirmOpen(false)}>
        <p className="text-sm text-slate mb-4">
          {customer?.name} · {car?.brand} {car?.model} · {days} day(s) · {currency(total)}
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-outline" onClick={() => setConfirmOpen(false)}>
            Back
          </button>
          <button className="btn-primary" onClick={confirm}>
            Confirm booking
          </button>
        </div>
      </Modal>
    </div>
  );
}
