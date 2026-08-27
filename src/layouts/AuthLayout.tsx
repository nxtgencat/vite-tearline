import React from 'react'
import { Link } from 'react-router-dom'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-paper dark:bg-inkdark">
      <div className="hidden md:flex flex-col justify-between p-8 bg-ink dark:bg-surfacedark text-paper dark:text-paperdark relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-paper dark:bg-paperdark text-ink dark:text-inkdark grid place-content-center font-display font-semibold text-sm rotate-[-4deg]">H</span>
            <span className="font-display font-semibold">MediCare HMS</span>
          </div>
          <h2 className="font-display text-4xl font-semibold mt-12 leading-tight">Enterprise<br /><span className="text-cobalt-light">Hospital</span> Management</h2>
          <p className="mt-4 text-sm text-paper/70 dark:text-paperdark/70 max-w-sm">Secure, responsive, role-based system for patients, doctors, receptionists and admins. Built with React, Tailwind, Context & enterprise standards.</p>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <span className="ticket-tag !text-paper/70 !border-paper/20">Tearline Design</span>
            <span className="ticket-tag !text-paper/70 !border-paper/20">Production Ready</span>
          </div>
          <p className="text-xs text-paper/60">Central • West Wing • South Care</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cobalt/20 blur-3xl" />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10 max-w-md w-full mx-auto">
        <Link to="/login" className="md:hidden flex items-center gap-2 mb-8">
          <span className="w-8 h-8 rounded-md bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-content-center font-display font-semibold text-sm rotate-[-4deg]">H</span>
          <span className="font-display font-semibold">MediCare HMS</span>
        </Link>
        <div className="card shadow-md">{children}</div>
        <p className="text-xs text-slate dark:text-slatedark text-center mt-6">Demo logins: admin@hospital.com / doctor@hospital.com / reception@hospital.com / patient@hospital.com — any password works in mock</p>
      </div>
    </div>
  )
}

export default AuthLayout
