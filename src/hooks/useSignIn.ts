"use client";

import { useMutation } from "@tanstack/react-query";
import { saveSession } from "@/lib/auth-session";
import { authService } from "@/services/auth.service";
import type { SignInPayload } from "@/types/auth";

export function useSignIn() {
  return useMutation({
    mutationFn: (payload: SignInPayload) => authService.signIn(payload),
    onSuccess: (data) => {
      saveSession({
        user: data.user,
      });
    },
  });
}
