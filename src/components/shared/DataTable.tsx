"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Card from "./Card";
import Pagination from "./Pagination";

export type TableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};
type Props<T> = {
  label: string;
  caption: string;
  records: readonly T[];
  columns: TableColumn<T>[];
  total: number;
  toolbar?: ReactNode;
  detailsBasePath: string;
  pageSize?: number;
};

export default function DataTable<T extends { id: string }>({
  label,
  caption,
  records,
  columns,
  total,
  toolbar,
  detailsBasePath,
  pageSize = 10,
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const currentRecords = records.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  return (
    <Card role="region" aria-label={label} className="overflow-hidden">
      {toolbar}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface-secondary text-primary dark:bg-dark-2 dark:text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-5 py-4 font-semibold"
                >
                  {column.header}
                </th>
              ))}
              <th scope="col" className="px-5 py-4 font-semibold">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-stroke-dark">
            {currentRecords.map((record) => (
              <tr key={record.id}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-5 py-4 ${column.className ?? ""}`}
                  >
                    {column.render(record)}
                  </td>
                ))}
                <td className="px-5 py-4">
                  <Link
                    href={`${detailsBasePath}/${encodeURIComponent(record.id)}`}
                    aria-label={`View ${record.id}`}
                    className="rounded-md px-2 py-1 font-semibold text-primary hover:bg-primary-light focus-visible:outline focus-visible:outline-2 dark:text-white dark:hover:bg-dark-2"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!records.length && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-5 py-12 text-center"
                >
                  No {label.toLowerCase()} match your search. Try another search
                  or clear the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {records.length} of {total} {label.toLowerCase()}
      </p>
      <div className="flex justify-center border-t border-stroke px-4 py-5 dark:border-stroke-dark">
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          label={`${label} pagination`}
        />
      </div>
    </Card>
  );
}

export function RecordIdentity({
  id,
  name,
  secondary,
}: {
  id: string;
  name: string;
  secondary?: string;
}) {
  return (
    <>
      <p className="font-semibold text-primary dark:text-white">{id}</p>
      <p className="mt-1 text-dark dark:text-white ">{name}</p>
      {secondary && <p className="mt-1 text-xs">{secondary}</p>}
    </>
  );
}
