import React, { useContext, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { NotificationContext } from '@/context/NotificationContext'
import { ALL_ROLES, ROLE_LABELS, type Role } from '@/constants/roles'
import { FiBell, FiLogOut, FiMenu, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

type Props = { onMenu: () => void }

function Topbar({ onMenu }: Props) {
  const { user, logout, switchRole } = useAuth()
  const notif = useContext(NotificationContext)
  const [showRoles, setShowRoles] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md border-b border-line dark:border-linedark">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="btn-icon lg:hidden"><FiMenu className="w-4 h-4" /></button>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">Welcome, {user?.name}</p>
            <p className="text-xs text-slate dark:text-slatedark">{user?.email} · {ROLE_LABELS[user?.role as Role]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setShowRoles(v => !v)} className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-line dark:border-linedark text-xs">
              Role: {ROLE_LABELS[user?.role as Role]}
            </button>
            {showRoles && (
              <div className="absolute right-0 mt-2 w-44 panel p-1">
                {ALL_ROLES.map(r => (
                  <button key={r} onClick={() => { switchRole(r); setShowRoles(false) }} className={`menu-item ${user?.role===r ? 'bg-ink/5 dark:bg-white/10 font-medium' : ''}`}>{ROLE_LABELS[r]}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => navigate('/notifications')} className="relative btn-icon">
            <FiBell className="w-4 h-4" />
            {notif && notif.unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose text-white text-[10px] grid place-content-center">{notif.unread}</span>}
          </button>
          <div className="w-8 h-8 rounded-full bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-content-center"><FiUser className="w-4 h-4" /></div>
          <button onClick={() => { logout(); navigate('/login') }} className="btn-ghost px-3 py-1.5 text-xs"><FiLogOut className="w-4 h-4" /> Logout</button>
        </div>
      </div>
    </header>
  )
}

export default React.memo(Topbar)
