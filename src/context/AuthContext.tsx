import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { KEYS, load, remove, save, uid } from '@/lib/storage';
import type { AuthUser } from '@/lib/types';

interface AuthState {
  user: AuthUser | null;
  users: AuthUser[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function readUsers(): AuthUser[] {
  return load<AuthUser[]>(KEYS.users, []);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>(() => readUsers());
  const [user, setUser] = useState<AuthUser | null>(() => load<AuthUser | null>(KEYS.session, null));

  useEffect(() => {
    save(KEYS.users, users);
  }, [users]);

  useEffect(() => {
    if (user) save(KEYS.session, user);
    else remove(KEYS.session);
  }, [user]);

  function login(email: string, password: string): boolean {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return false;
    setUser(found);
    return true;
  }

  // Returns error message or null on success.
  function register(name: string, email: string, password: string): string | null {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return 'An account with this email already exists.';
    const created: AuthUser = { id: uid('user'), name, email, password, createdAt: new Date().toISOString() };
    setUsers((prev) => [...prev, created]);
    setUser(created);
    return null;
  }

  function logout(): void {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, users, login, register, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
