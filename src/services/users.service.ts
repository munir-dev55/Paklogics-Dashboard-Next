import { STATIC_USER_DETAILS, STATIC_USERS, staticDelay } from "@/data/static-data";
import { includesSearch, paginate } from "@/data/static-utils";
import type {
  InviteUserPayload,
  SetUserStatusPayload,
  UserDetails,
  UsersListParams,
  UsersListResult,
} from "@/types/users";

let users = [...STATIC_USERS];
let details = [...STATIC_USER_DETAILS];

export const usersService = {
  list(params: UsersListParams) {
    const filtered = users.filter((user) =>
      (!params.role || user.role === params.role) &&
      (!params.status || user.status === params.status) &&
      includesSearch([user.name, user.firmCompany, user.email, user.phone], params.search),
    );
    const page = paginate(filtered, params.page, params.limit);
    return staticDelay<UsersListResult>({ users: page.records, pagination: page.pagination });
  },

  getById(id: string) {
    const user = details.find((item) => item.id === id);
    return user ? staticDelay(user) : Promise.reject(new Error("User not found."));
  },

  invite(body: InviteUserPayload) {
    const now = new Date().toISOString();
    const id = `user-demo-${Date.now()}`;
    const firstName = body.email.split("@")[0] || "Invited";
    const detail: UserDetails = {
      id, firstName, lastName: "User", email: body.email, phone: null,
      jobTitle: body.jobTitle ?? null, userType: body.userType, status: "INVITED",
      roleId: `role-${body.roleName}`, role: { id: `role-${body.roleName}`, name: body.roleName },
      deactivatedAt: null, deactivationReason: null, createdAt: now, updatedAt: now,
    };
    details = [detail, ...details];
    users = [{
      id, name: `${firstName} User`, firstName, lastName: "User", firmCompany: null,
      role: body.roleName, email: body.email, phone: null, status: "INVITED",
      createdAt: now, updatedAt: now,
    }, ...users];
    return staticDelay(detail);
  },

  resendInvite(id: string) {
    const user = details.find((item) => item.id === id);
    return user
      ? staticDelay({ user, invitationToken: "static-demo-invitation" })
      : Promise.reject(new Error("User not found."));
  },

  setStatus(id: string, body: SetUserStatusPayload) {
    const now = new Date().toISOString();
    users = users.map((user) => user.id === id ? { ...user, status: body.status, updatedAt: now } : user);
    details = details.map((user) => user.id === id ? {
      ...user, status: body.status, updatedAt: now,
      deactivatedAt: body.status === "DEACTIVATED" ? now : null,
      deactivationReason: body.status === "DEACTIVATED" ? body.reason ?? null : null,
    } : user);
    return staticDelay({ id, ...body });
  },
};
