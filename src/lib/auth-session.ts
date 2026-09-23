import type { AuthSession, AuthUser } from "@/types/auth";

export const AUTH_STORAGE_KEY = "fedarb_static_demo_session";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getSession(): AuthSession | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.user?.id) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getSession()?.user);
}

export function isAuthPath(pathname: string) {
  return pathname.startsWith("/auth");
}

export function saveSession(session: AuthSession) {
  if (!canUseStorage()) return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getDisplayName(user: AuthUser) {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}
