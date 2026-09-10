"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import Card from "./Card";

type Props = {
  title: string;
  recordId: string;
  fields: { label: string; value: ReactNode }[];
  onClose: () => void;
  children?: ReactNode;
};

export default function DetailsPanel({
  title,
  recordId,
  fields,
  onClose,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  useEffect(() => {
    panelRef.current?.focus();
  }, [recordId]);
  return (
    <Card className="p-6">
      <div
        ref={panelRef}
        role="region"
        tabIndex={-1}
        aria-labelledby={headingId}
        className="outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id={headingId}
              className="text-xl font-semibold text-primary dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-1">{recordId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm text-primary hover:bg-primary-light dark:text-white dark:hover:bg-dark-2"
          >
            Close details
          </button>
        </div>
        <dl className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-sm">{label}</dt>
              <dd className="mt-1 font-medium text-dark dark:text-white">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        {children}
      </div>
    </Card>
  );
}
