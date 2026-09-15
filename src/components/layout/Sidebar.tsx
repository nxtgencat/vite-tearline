import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/cars", label: "Cars" },
  { to: "/customers", label: "Customers" },
  { to: "/bookings/new", label: "New Booking" },
  { to: "/bookings", label: "Bookings" },
  { to: "/availability", label: "Availability" },
  { to: "/reports", label: "Reports" },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-ink/40 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-dvh lg:h-screen w-60 shrink-0 lg:self-start bg-surface border-r border-line p-5 flex flex-col gap-1 overflow-y-auto overscroll-contain transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-2 mb-6 shrink-0">
          <span className="w-8 h-8 rounded-md bg-ink text-paper grid place-content-center font-display font-semibold text-sm rotate-[-4deg]">
            D
          </span>
          <span className="font-display font-semibold">DriveLine</span>
        </div>
        <nav className="flex flex-col gap-1 min-h-0 flex-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onClose}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-ink text-paper font-medium" : "text-slate hover:bg-ink/5"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <p className="mini-tag mt-auto pt-6 px-2 shrink-0">CAR RENTAL · V1</p>
      </aside>
    </>
  );
}
