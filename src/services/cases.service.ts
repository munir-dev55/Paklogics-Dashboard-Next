import { STATIC_CASES, staticDelay } from "@/data/static-data";
import { includesSearch, paginate } from "@/data/static-utils";
import type { CaseDetails, CasesListParams, CasesListResult } from "@/types/cases";

export const casesService = {
  list(params: CasesListParams) {
    const all = STATIC_CASES.map((record) => ({
      id: record.id, caseNumber: record.caseNumber, title: record.title,
      caseManager: record.caseManager ? { id: record.caseManager.id, name: `${record.caseManager.firstName} ${record.caseManager.lastName}`.trim(), email: record.caseManager.email } : null,
      status: record.lifecycleStatus, reviewDate: record.updatedAt, createdAt: record.createdAt,
      updatedAt: record.updatedAt, closedAt: record.closedAt,
    }));
    const statusMatches = (status: string) => {
      if (!params.status) return true;
      if (params.status === "PENDING") return status === "INTAKE" || status === "SCHEDULED";
      if (params.status === "ACTIVE") return status === "ACTIVE" || status === "REOPENED";
      return status === params.status;
    };
    const filtered = all.filter((record) => statusMatches(record.status) &&
      includesSearch([record.caseNumber, record.title, record.caseManager?.name], params.search));
    const { records, pagination } = paginate(filtered, params.page, params.limit);
    const result: CasesListResult = {
      cases: records, pagination,
      summary: {
        total: all.length,
        active: all.filter((record) => record.status === "ACTIVE" || record.status === "REOPENED").length,
        closed: all.filter((record) => record.status === "CLOSED").length,
      },
    };
    return staticDelay(result);
  },

  getById(id: string) {
    const record = STATIC_CASES.find((item) => item.id === id);
    if (!record) return Promise.reject(new Error("Case not found."));
    return staticDelay(record);
  },
};
