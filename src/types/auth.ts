import type { RoleName, UserStatus } from "@/types/enums";

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
  status: UserStatus;
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
};

export type AuthSession = {
  user: AuthUser;
};
