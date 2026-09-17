import type { RoleName } from "@/types/enums";

export type SignInPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  jobTitle: string | null;
  userType: "INTERNAL" | "EXTERNAL";
  status: string;
  roleId: string;
  role: {
    id: string;
    name: RoleName;
  } | null;
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SignInResult = {
  user: AuthUser;
  accessToken: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};
