import { apiClient } from "@/lib/api-client";
import { withQuery } from "@/lib/query-string";
import type {
  InviteUserPayload,
  SetUserStatusPayload,
  UserDetails,
  UsersListParams,
  UsersListResult,
} from "@/types/users";

export const usersService = {
  list(params: UsersListParams) {
    return apiClient<UsersListResult>(withQuery("/admin/users", params));
  },

  getById(id: string) {
    return apiClient<UserDetails>(`/users/${id}`);
  },

  invite(body: InviteUserPayload) {
    return apiClient<unknown>("/auth/invite", {
      method: "POST",
      body,
    });
  },

  resendInvite(id: string) {
    return apiClient<{
      user: UserDetails;
      invitationToken: string;
    }>(`/auth/users/${id}/resend-invite`, {
      method: "POST",
    });
  },

  setStatus(id: string, body: SetUserStatusPayload) {
    return apiClient<unknown>(`/users/${id}/status`, {
      method: "PATCH",
      body,
    });
  },
};
