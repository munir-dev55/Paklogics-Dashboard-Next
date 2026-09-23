import type { Pagination } from "@/types/api";

export function paginate<T>(records: T[], page = 1, limit = 10) {
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.max(1, Math.ceil(records.length / safeLimit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safeLimit;

  const pagination: Pagination = {
    page: safePage,
    limit: safeLimit,
    total: records.length,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };

  return { records: records.slice(start, start + safeLimit), pagination };
}

export function includesSearch(values: Array<unknown>, search?: string) {
  const term = search?.trim().toLowerCase();
  if (!term) return true;
  return values.some((value) => String(value ?? "").toLowerCase().includes(term));
}
