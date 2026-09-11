import { useAuth } from "@/contexts/AuthContext";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 flex items-center justify-between gap-4 px-4 sm:px-6 border-b border-line bg-paper/85 backdrop-blur-md sticky top-0 z-30">
      <button className="btn-icon lg:hidden" onClick={onMenu} aria-label="Menu">
        ☰
      </button>
      <div className="hidden sm:block">
        <p className="font-display font-semibold leading-tight">Welcome, {user?.name || "Manager"}</p>
        <p className="text-xs text-slate">Manage fleet, customers and bookings</p>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-xs text-slate hidden sm:block">{user?.email}</span>
        <button className="btn-outline px-4 py-2 text-xs" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
