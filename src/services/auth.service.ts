import { apiClient } from "@/lib/api-client";
import type { SignInPayload, SignInResult } from "@/types/auth";

export const authService = {
  signIn(payload: SignInPayload) {
    return apiClient<SignInResult>("/auth/signin", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
};
