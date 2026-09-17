import type { UsersListParams } from "@/types/users";
import type { CasesListParams } from "@/types/cases";

export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (params: UsersListParams) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  cases: {
    all: ["cases"] as const,
    list: (params: CasesListParams) => ["cases", "list", params] as const,
    detail: (id: string) => ["cases", "detail", id] as const,
  },
};
