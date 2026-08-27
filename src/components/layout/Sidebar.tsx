import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { usePermission } from '@/hooks/usePermission'
import * as Icons from 'react-icons/fi'

function getIcon(name: string) {
  return (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.FiCircle
}

type Props = { open: boolean; onClose: () => void }

function Sidebar({ open, onClose }: Props) {
  const { can } = usePermission()
  const items = useMemo(() => NAV_ITEMS.filter(i => !i.permission || can(i.permission as never)), [can])

  const content = (
    <nav className="p-4 space-y-1">
      <div className="px-2 py-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-content-center font-display font-semibold text-sm rotate-[-4deg]">H</span>
          <span className="font-display font-semibold">MediCare HMS</span>
        </div>
        <p className="mini-tag mt-2">Enterprise • v1.0</p>
      </div>
      {items.map(it => {
        const Icon = getIcon('Fi' + it.icon.replace(/^./, c => c.toUpperCase())) // fallback
        const LucideIcon = getIcon(it.icon === 'LayoutDashboard' ? 'FiGrid' : it.icon === 'Stethoscope' ? 'FiActivity' : it.icon === 'Calendar' ? 'FiCalendar' : it.icon === 'FileText' ? 'FiFileText' : it.icon === 'Pill' ? 'FiFeather' : it.icon === 'FlaskConical' ? 'FiDroplet' : it.icon === 'Receipt' ? 'FiCreditCard' : it.icon === 'Package' ? 'FiPackage' : it.icon === 'Bell' ? 'FiBell' : it.icon === 'BarChart3' ? 'FiBarChart2' : it.icon === 'Users' ? 'FiUsers' : 'FiCircle')
        const I = LucideIcon || Icon
        return (
          <NavLink
            key={it.path}
            to={it.path}
            onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark font-medium' : 'hover:bg-ink/5 dark:hover:bg-white/5 text-slate dark:text-slatedark hover:text-ink dark:hover:text-paperdark'}`}
          >
            <I className="w-4 h-4 shrink-0" /> {it.label}
          </NavLink>
        )
      })}
      <div className="pt-6 mt-6 border-t border-line dark:border-linedark">
        <p className="mini-tag px-3 mb-2">Hospital Branches</p>
        <div className="space-y-2 px-3 text-xs text-slate dark:text-slatedark">
          <p>• Central Hospital — New Delhi</p>
          <p>• West Wing — Mumbai</p>
          <p>• South Care — Bengaluru</p>
        </div>
      </div>
    </nav>
  )

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 border-r border-line dark:border-linedark bg-surface dark:bg-surfacedark sticky top-0 h-screen overflow-y-auto">
        {content}
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-72 bg-surface dark:bg-surfacedark shadow-lg overflow-y-auto">{content}</div>
        </div>
      )}
    </>
  )
}

export default React.memo(Sidebar)
