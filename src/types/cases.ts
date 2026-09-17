import type { Pagination } from "@/types/api";
import type { AdminCaseStatusFilter, CaseLifecycleStatus } from "@/types/enums";

export type CasesListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminCaseStatusFilter | CaseLifecycleStatus | "";
};

export type AdminCase = {
  id: string;
  caseNumber: string;
  title: string;
  caseManager: {
    id: string;
    name: string;
    email: string;
  } | null;
  status: CaseLifecycleStatus;
  reviewDate: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
};

export type CasesListResult = {
  cases: AdminCase[];
  pagination: Pagination;
  summary: {
    total: number;
    active: number;
    closed: number;
  };
};

export type CaseDetails = {
  id: string;
  caseNumber: string;
  title: string;
  caseType: string | null;
  lifecycleStatus: CaseLifecycleStatus;
  closedAt: string | null;
  closureSummary: string | null;
  jurisdiction: string | null;
  isInternational: boolean;
  caseValue: number | null;
  createdAt: string;
  updatedAt: string;
  caseManager: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};
