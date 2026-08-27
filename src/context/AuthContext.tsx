import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { Role } from '@/constants/roles'
import { delay } from '@/services/api'

export type User = { id: string; name: string; email: string; role: Role; avatar?: string }

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string, role?: Role) => Promise<void>
  register: (data: { name: string; email: string; password: string; role: Role }) => Promise<void>
  logout: () => void
  switchRole: (role: Role) => void
}

export const AuthContext = createContext<AuthState | null>(null)

const SESSION_MS = 30 * 60 * 1000 // 30 min

const DEMO_USERS: Record<string, User & { password: string }> = {
  'admin@hospital.com': { id: 'U1', name: 'Admin Arjun', email: 'admin@hospital.com', role: 'admin', password: 'admin123' },
  'doctor@hospital.com': { id: 'U2', name: 'Dr. Neha Agarwal', email: 'doctor@hospital.com', role: 'doctor', password: 'doctor123' },
  'reception@hospital.com': { id: 'U3', name: 'Rita Reception', email: 'reception@hospital.com', role: 'receptionist', password: 'recep123' },
  'patient@hospital.com': { id: 'U4', name: 'Aarav Patient', email: 'patient@hospital.com', role: 'patient', password: 'patient123' },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('hms_user')
    return raw ? JSON.parse(raw) as User : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hms_token'))
  const [loading, setLoading] = useState(false)

  const logout = useCallback(() => {
    setUser(null); setToken(null)
    localStorage.removeItem('hms_user'); localStorage.removeItem('hms_token'); localStorage.removeItem('hms_session')
  }, [])

  // session expiry timer
  useEffect(() => {
    if (!token) return
    const start = Number(localStorage.getItem('hms_session') || Date.now())
    const elapsed = Date.now() - start
    const remain = SESSION_MS - elapsed
    if (remain <= 0) { logout(); return }
    const t = setTimeout(logout, remain)
    return () => clearTimeout(t)
  }, [token, logout])

  const login = useCallback(async (email: string, _password: string, role?: Role) => {
    setLoading(true)
    await delay(700)
    const demo = DEMO_USERS[email.toLowerCase()]
    // accept demo or any email with role override for dev
    let nextUser: User | null = null
    if (demo) nextUser = { id: demo.id, name: demo.name, email: demo.email, role: role ?? demo.role }
    else {
      // allow any email for register flow
      const stored = localStorage.getItem('hms_user')
      if (stored) {
        const parsed = JSON.parse(stored) as User
        if (parsed.email === email) nextUser = parsed
      }
      if (!nextUser) nextUser = { id: 'U_' + Date.now(), name: email.split('@')[0], email, role: role ?? 'patient' }
    }
    const t = 'mock_token_' + Math.random().toString(36).slice(2)
    setUser(nextUser); setToken(t)
    localStorage.setItem('hms_user', JSON.stringify(nextUser))
    localStorage.setItem('hms_token', t)
    localStorage.setItem('hms_session', String(Date.now()))
    setLoading(false)
  }, [])

  const register = useCallback(async (data: { name: string; email: string; password: string; role: Role }) => {
    setLoading(true)
    await delay(700)
    const u: User = { id: 'U_' + Date.now(), name: data.name, email: data.email, role: data.role }
    const t = 'mock_token_' + Math.random().toString(36).slice(2)
    setUser(u); setToken(t)
    localStorage.setItem('hms_user', JSON.stringify(u))
    localStorage.setItem('hms_token', t)
    localStorage.setItem('hms_session', String(Date.now()))
    setLoading(false)
  }, [])

  const switchRole = useCallback((role: Role) => {
    if (!user) return
    const next = { ...user, role }
    setUser(next)
    localStorage.setItem('hms_user', JSON.stringify(next))
  }, [user])

  const value = useMemo(() => ({ user, token, loading, login, register, logout, switchRole }), [user, token, loading, login, register, logout, switchRole])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
