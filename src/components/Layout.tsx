import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const links = [
  { to: '/', label: 'Dashboard', icon: '◧' },
  { to: '/rooms', label: 'Rooms', icon: '▤' },
  { to: '/guests', label: 'Guests', icon: '○' },
  { to: '/book', label: 'New Booking', icon: '+' },
  { to: '/stay', label: 'Check-In / Out', icon: '⇄' },
  { to: '/payments', label: 'Payments', icon: '$' },
  { to: '/history', label: 'History', icon: '≡' },
  { to: '/reports', label: 'Reports', icon: '▦' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2">
          <span className="w-8 h-8 rounded-md bg-ink text-paper grid place-content-center font-display font-semibold text-sm -rotate-3">H</span>
          <span className="font-display font-semibold tracking-tight">Harbor Stay</span>
        </div>
        <nav className="mt-8 space-y-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <span className="w-5 text-center">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="rounded-xl border border-line p-3 text-sm">
          <p className="font-medium truncate">{user?.name}</p>
          <p className="text-xs text-slate truncate">{user?.email}</p>
          <button onClick={handleLogout} className="btn-outline w-full mt-3 py-1.5 text-xs">
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md border-b border-line">
          <div className="px-4 sm:px-6 h-16 flex items-center gap-3">
            <span className="lg:hidden w-8 h-8 rounded-md bg-ink text-paper grid place-content-center font-display font-semibold text-sm -rotate-3">H</span>
            <p className="font-display font-semibold lg:hidden">Harbor Stay</p>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:block text-xs text-slate">{user?.email}</span>
              <ThemeToggle />
              <button onClick={handleLogout} className="btn-ghost border border-line lg:hidden">
                Logout
              </button>
            </div>
          </div>
          <nav className="lg:hidden flex gap-1 overflow-x-auto px-4 pb-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${isActive ? 'bg-ink text-paper border-ink' : 'border-line bg-surface'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
