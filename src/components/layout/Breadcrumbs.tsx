import { Link, useLocation } from "react-router-dom";

const names: Record<string, string> = {
  "": "Dashboard",
  cars: "Cars",
  customers: "Customers",
  bookings: "Bookings",
  new: "New",
  availability: "Availability",
  reports: "Reports",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-2 text-sm text-slate flex-wrap">
      <Link to="/" className="hover:text-ink">
        Home
      </Link>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>›</span>
          <span className={i === parts.length - 1 ? "text-ink font-medium" : ""}>
            {names[p] || p}
          </span>
        </span>
      ))}
    </div>
  );
}
