"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label = "Pagination",
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label={label} className="flex items-center gap-2">
      <PaginationArrow
        direction="previous"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {pages.map((page) => (
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
      ))}
      <PaginationArrow
        direction="next"
        disabled={currentPage === totalPages}
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
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-sidebar-active text-white transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-dark-5"
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
