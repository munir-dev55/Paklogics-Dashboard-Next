"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
};

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis-end", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis-start",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label = "Pagination",
}: PaginationProps) {
  const pages = getVisiblePages(currentPage, Math.max(1, totalPages));

  return (
    <nav
      aria-label={label}
      className="flex w-full max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      <PaginationArrow
        direction="previous"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      <p
        aria-live="polite"
        className="min-w-0 flex-1 px-2 text-center text-sm font-medium text-dark-5 sm:hidden"
      >
        Page{" "}
        <span className="font-semibold text-primary dark:text-white">
          {currentPage}
        </span>{" "}
        of {Math.max(1, totalPages)}
      </p>

      <div className="hidden items-center gap-1.5 sm:flex sm:gap-2">
        {pages.map((page) =>
          typeof page === "number" ? (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                currentPage === page
                  ? "bg-sidebar-active text-white shadow-sm"
                  : "bg-surface-muted text-dark-5 hover:bg-primary-light hover:text-primary"
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={page}
              aria-hidden="true"
              className="inline-flex h-9 min-w-7 items-center justify-center text-sm font-semibold text-dark-5"
            >
              …
            </span>
          ),
        )}
      </div>

      <PaginationArrow
        direction="next"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}

function PaginationArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`${direction === "previous" ? "Previous" : "Next"} page`}
      className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-active text-white transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-dark-5"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "previous" ? "rotate-180" : ""}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}
