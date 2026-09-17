"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-error";
import { isAdminRole, saveSession } from "@/lib/auth-session";
import { authService } from "@/services/auth.service";
import type { SignInPayload } from "@/types/auth";

export function useSignIn() {
  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const data = await authService.signIn(payload);

      if (!isAdminRole(data.user.role?.name)) {
        throw new ApiError(403, "You do not have access to the admin panel.");
      }

      return data;
    },
    onSuccess: (data) => {
      saveSession({
        accessToken: data.accessToken,
        user: data.user,
      });
    },
  });
}
