"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Card from "./Card";
import Pagination from "./Pagination";
import { ViewIcon } from "../Tables/TableFive";

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
  detailsBasePath?: string;
  getDetailsHref?: (record: T) => string;
  onDetailsClick?: (record: T) => void;
  emptyMessage?: string;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export default function DataTable<T extends { id: string }>({
  label,
  caption,
  records,
  columns,
  total,
  toolbar,
  detailsBasePath,
  getDetailsHref,
  onDetailsClick,
  emptyMessage,
  pageSize = 10,
  currentPage,
  totalPages,
  onPageChange,
}: Props<T>) {
  const [localPage, setLocalPage] = useState(1);
  const isServerPaged = Boolean(onPageChange && totalPages);
  const activePage = isServerPaged ? (currentPage ?? 1) : Math.min(localPage, Math.max(1, Math.ceil(records.length / pageSize)));
  const pages = isServerPaged
    ? Math.max(1, totalPages ?? 1)
    : Math.max(1, Math.ceil(records.length / pageSize));
  const startIndex = (activePage - 1) * pageSize;
  const currentRecords = isServerPaged ? records : records.slice(startIndex, startIndex + pageSize);
  const hasDetails = Boolean(getDetailsHref || detailsBasePath || onDetailsClick);

  useEffect(() => {
    if (!isServerPaged) setLocalPage(1);
  }, [records, isServerPaged]);

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
              {hasDetails && (
                <th scope="col" className="px-5 py-4 font-semibold">
                  Details
                </th>
              )}
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
                {hasDetails && (
                  <td className="px-5 py-4 align-middle">
                    {onDetailsClick ? (
                      <button
                        type="button"
                        onClick={() => onDetailsClick(record)}
                        aria-label={`View ${record.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-white dark:hover:bg-dark-2"
                      >
                        <ViewIcon />
                      </button>
                    ) : (
                      <Link
                        href={
                          getDetailsHref
                            ? getDetailsHref(record)
                            : `${detailsBasePath}/${encodeURIComponent(record.id)}`
                        }
                        aria-label={`View ${record.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-white dark:hover:bg-dark-2"
                      >
                        <ViewIcon />
                      </Link>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {!records.length && (
              <tr>
                <td
                  colSpan={columns.length + (hasDetails ? 1 : 0)}
                  className="px-5 py-12 text-center"
                >
                  {emptyMessage ??
                    `No ${label.toLowerCase()} match your search. Try another search or clear the filters.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {records.length} of {total} {label.toLowerCase()}
      </p>
      <div className="flex justify-center border-t border-stroke px-3 py-4 sm:px-4 sm:py-5 dark:border-stroke-dark">
        <Pagination
          currentPage={activePage}
          totalPages={pages}
          onPageChange={onPageChange ?? setLocalPage}
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
