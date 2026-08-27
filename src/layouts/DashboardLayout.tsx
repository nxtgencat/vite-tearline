import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

function DashboardLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-paper dark:bg-inkdark flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenu={() => setOpen(v => !v)} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-[1400px] w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
        <footer className="border-t border-line dark:border-linedark py-4 text-center text-xs text-slate dark:text-slatedark">
          © 2026 MediCare Hospital Management System — Enterprise Edition
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout
