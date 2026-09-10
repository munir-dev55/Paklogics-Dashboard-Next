"use client";

import { useState } from "react";

export default function useRecordFilters<T extends { status: string }>(
  records: readonly T[],
  searchValues: (record: T) => readonly string[],
) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const search = query.trim().toLowerCase();
  const filtered = records.filter(
    (record) =>
      (!status || record.status === status) &&
      searchValues(record).some((value) =>
        value.toLowerCase().includes(search),
      ),
  );
  return {
    query,
    status,
    filtered,
    onQueryChange: setQuery,
    onStatusChange: setStatus,
  };
}
