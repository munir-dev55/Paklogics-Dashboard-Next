import { DEMO_USER, staticDelay } from "@/data/static-data";
import type { SignInPayload, SignInResult } from "@/types/auth";

export const authService = {
  signIn(payload: SignInPayload) {
    return staticDelay<SignInResult>({
      user: { ...DEMO_USER, email: payload.email },
    });
  },
};
