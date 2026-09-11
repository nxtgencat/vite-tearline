import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { keys, readJSON, writeJSON, removeKey } from "@/lib/storage";
import type { AuthUser, User } from "@/lib/types";

interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readJSON<AuthUser | null>(keys.session, null));

  function login(email: string, password: string): string | null {
    const users = readJSON<User[]>(keys.users, []);
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return "No account found for this email";
    if (found.password !== password) return "Incorrect password";
    const session = { id: found.id, name: found.name, email: found.email };
    setUser(session);
    writeJSON(keys.session, session);
    return null;
  }

  function register(name: string, email: string, password: string): string | null {
    const users = readJSON<User[]>(keys.users, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "Email already registered";
    }
    const nu: User = { id: `u_${Date.now()}`, name: name.trim(), email: email.trim(), password };
    users.push(nu);
    writeJSON(keys.users, users);
    const session = { id: nu.id, name: nu.name, email: nu.email };
    setUser(session);
    writeJSON(keys.session, session);
    return null;
  }

  function logout() {
    setUser(null);
    removeKey(keys.session);
  }

  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}
