import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { keys, readJSON, writeJSON, removeKey } from "@/lib/storage";
import type { AuthUser, User } from "@/lib/types";
import { loginToDummyJSON, registerOnDummyJSON } from "@/services/authApi";

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const TOKEN_KEY = "crm_token";

function localLogin(email: string, password: string): AuthUser | null {
  const users = readJSON<User[]>(keys.users, []);
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!found || found.password !== password) return null;
  return { id: found.id, name: found.name, email: found.email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readJSON<AuthUser | null>(keys.session, null));
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  function persist(session: AuthUser, accessToken?: string) {
    setUser(session);
    writeJSON(keys.session, session);
    if (accessToken) {
      setToken(accessToken);
      try {
        localStorage.setItem(TOKEN_KEY, accessToken);
      } catch {
        // ignore
      }
    }
  }

  async function login(email: string, password: string): Promise<string | null> {
    // 1) Try real DummyJSON auth (visible in Network)
    try {
      const d = await loginToDummyJSON(email, password);
      persist(
        { id: `dummy_${d.id}`, name: `${d.firstName} ${d.lastName}`, email: d.email },
        d.accessToken
      );
      return null;
    } catch {
      // fall through to local accounts
    }
    // 2) Local fallback (registered + seeded accounts)
    const found = localLogin(email, password);
    if (!found) return "No account found (try emilys / emilyspass) or wrong password";
    persist(found);
    return null;
  }

  async function register(name: string, email: string, password: string): Promise<string | null> {
    const users = readJSON<User[]>(keys.users, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "Email already registered";
    }
    // Simulated POST — visible in Network, not persisted by DummyJSON
    try {
      await registerOnDummyJSON(name, email);
    } catch {
      // ignore, still create locally
    }
    const nu: User = { id: `u_${Date.now()}`, name: name.trim(), email: email.trim(), password };
    users.push(nu);
    writeJSON(keys.users, users);
    persist({ id: nu.id, name: nu.name, email: nu.email });
    return null;
  }

  function logout() {
    setUser(null);
    setToken(null);
    removeKey(keys.session);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  return <Ctx.Provider value={{ user, token, login, register, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}
