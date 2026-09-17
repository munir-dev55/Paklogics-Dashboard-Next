import { apiClient } from "@/lib/api-client";
import { withQuery } from "@/lib/query-string";
import type { CaseDetails, CasesListParams, CasesListResult } from "@/types/cases";

export const casesService = {
  list(params: CasesListParams) {
    return apiClient<CasesListResult>(withQuery("/admin/cases", params));
  },

  getById(id: string) {
    return apiClient<CaseDetails>(`/cases/${id}`);
  },
};
