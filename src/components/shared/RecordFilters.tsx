"use client";

import type { SelectHTMLAttributes } from "react";

const controlClass =
  "rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white";

const selectControlClass =
  "w-full appearance-none rounded-lg border border-stroke bg-white py-2.5 pl-3 pr-10 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white";

export function StatusSelect({
  label = "Status",
  options,
  allOption = false,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: readonly string[];
  allOption?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-dark dark:text-white">
      {label}
      <span className="relative block">
        <select {...props} className={selectControlClass}>
          {allOption && <option value="">Any status</option>}
          {options.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <SelectChevron />
      </span>
    </label>
  );
}

function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5 dark:text-dark-6"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  label: string;
  placeholder: string;
  statuses: readonly string[];
  query: string;
  status: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export default function RecordFilters({
  label,
  placeholder,
  statuses,
  query,
  status,
  onQueryChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-stroke p-5 dark:border-stroke-dark sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-dark dark:text-white">
        {label}
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className={controlClass}
        />
      </label>
      <StatusSelect
        options={statuses}
        allOption
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      />
      {(query || status) && (
        <button
          type="button"
          onClick={() => {
            onQueryChange("");
            onStatusChange("");
          }}
          className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary focus-visible:outline focus-visible:outline-2 dark:text-white"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
