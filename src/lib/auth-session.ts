import type { AuthSession, AuthUser } from "@/types/auth";
import { ADMIN_ROLES } from "@/types/enums";

export const AUTH_STORAGE_KEY = "fedarb_admin_session";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getSession(): AuthSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.accessToken) {
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
  return Boolean(getAccessToken());
}

export function isAuthPath(pathname: string) {
  return pathname.startsWith("/auth");
}

export function getAccessToken() {
  return getSession()?.accessToken ?? null;
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getDisplayName(user: AuthUser) {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

export function isAdminRole(roleName: string | undefined | null) {
  return Boolean(roleName && ADMIN_ROLES.includes(roleName as (typeof ADMIN_ROLES)[number]));
}
