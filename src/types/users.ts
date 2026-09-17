import type { Pagination } from "@/types/api";
import type {
  AdminSettableStatus,
  InvitableRole,
  RoleName,
  UserStatus,
  UserType,
} from "@/types/enums";

export type UsersListParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: RoleName | "";
  status?: UserStatus | "";
};

export type AdminUser = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  firmCompany: string | null;
  role: RoleName | null;
  email: string;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type UsersListResult = {
  users: AdminUser[];
  pagination: Pagination;
};

export type UserDetails = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  userType: UserType;
  status: UserStatus;
  roleId: string | null;
  role: {
    id: string;
    name: RoleName;
  } | null;
  deactivatedAt: string | null;
  deactivationReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InviteUserPayload = {
  email: string;
  userType: UserType;
  roleName: InvitableRole;
  jobTitle?: string;
};

export type SetUserStatusPayload = {
  status: AdminSettableStatus;
  reason?: string;
};
