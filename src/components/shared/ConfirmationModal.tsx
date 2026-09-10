"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelButtonRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#001842]/55 p-4"
      onMouseDown={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-[535px] rounded-xl border border-stroke bg-white px-6 pb-7 pt-6 text-center shadow-lg dark:border-stroke-dark dark:bg-gray-dark sm:px-7"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-error-light text-error">
          <svg
            aria-hidden="true"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 31H11a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h5M23 13l7 7-7 7M30 20H15" />
          </svg>
        </div>
        <h2
          id="confirmation-title"
          className="text-xl font-semibold text-primary dark:text-white"
        >
          {title}
        </h2>
        <p
          id="confirmation-description"
          className="mx-auto mt-1 max-w-[290px] text-base leading-5 text-dark-5 dark:text-dark-6"
        >
          {description}
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="min-h-12 flex-1 rounded-xl border border-stroke px-4 py-3 text-base font-semibold text-primary hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:border-stroke-dark dark:text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-12 flex-[2.7] rounded-xl bg-error px-4 py-3 text-base font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
