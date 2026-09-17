"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Pagination from "@/components/shared/Pagination";
import Link from "next/link";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import InviteUserModal from "@/components/Users/InviteUserModal";
import ClickOutside from "@/components/ClickOutside";
import { getErrorMessage } from "@/lib/api-error";
import { getSession } from "@/lib/auth-session";
import { useSetUserStatus, useUsers } from "@/hooks/useUsers";
import {
  ROLE_LABELS,
  USER_STATUS_LABELS,
  roleLabel,
  type RoleName,
  type UserStatus,
} from "@/types/enums";
import type { AdminUser } from "@/types/users";
import { toast } from "sonner";

const PAGE_SIZE = 10;
const ROLE_FILTERS = Object.keys(ROLE_LABELS) as RoleName[];
const STATUS_FILTERS = Object.keys(USER_STATUS_LABELS) as UserStatus[];

export default function TableFive() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleName | "">("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError] = useState("");
  const [userToDeactivate, setUserToDeactivate] = useState<AdminUser | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>();

  useEffect(() => {
    setCurrentUserId(getSession()?.user.id);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 900);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  const listParams = useMemo(
    () => ({
      page: currentPage,
      limit: PAGE_SIZE,
      search,
      role: roleFilter,
      status: statusFilter,
    }),
    [currentPage, search, roleFilter, statusFilter],
  );

  const { data, isLoading, isFetching, isError, error: queryError } = useUsers(listParams);
  const { mutate: setStatus, isPending: isUpdatingStatus } = useSetUserStatus();
  const users = data?.users ?? [];
  const pagination = data?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  useEffect(() => {
    if (pagination && currentPage > pagination.totalPages && pagination.totalPages > 0) {
      setCurrentPage(pagination.totalPages);
    }
  }, [currentPage, pagination]);

  const updateStatus = (
    user: AdminUser,
    status: "ACTIVE" | "DEACTIVATED",
    reason?: string,
  ) => {
    setError("");
    setStatus(
      { id: user.id, status, reason },
      {
        onSuccess: () => {
          toast.success(
            status === "ACTIVE"
              ? `${user.name} is now active.`
              : `${user.name} is now inactive.`,
          );
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Unable to update user status."));
        },
      },
    );
  };

  const toggleStatus = (user: AdminUser) => {
    if (user.id === currentUserId) {
      toast.error("You cannot change the status of your own account.");
      return;
    }

    updateStatus(
      user,
      user.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE",
      user.status === "ACTIVE" ? "Deactivated from admin users table" : undefined,
    );
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="grid gap-4 border-b border-stroke p-4 dark:border-dark-3 sm:p-6 md:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_220px_180px_auto_auto] xl:items-end">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Search users
          </span>
          <span className="relative block">
            <SearchIcon />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, company, email, or phone"
              className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-10 pr-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
            />
          </span>
        </label>

        <FilterSelect
          label="Role"
          value={roleFilter}
          placeholder="All roles"
          options={ROLE_FILTERS.map((role) => ({
            value: role,
            label: ROLE_LABELS[role],
          }))}
          onChange={(value) => setRoleFilter(value as RoleName | "")}
        />

        <FilterSelect
          label="Status"
          value={statusFilter}
          placeholder="Any status"
          options={STATUS_FILTERS.map((status) => ({
            value: status,
            label: USER_STATUS_LABELS[status],
          }))}
          onChange={(value) => setStatusFilter(value as UserStatus | "")}
        />

        <button
          type="button"
          onClick={() => {
            setSearchInput("");
            setSearch("");
            setRoleFilter("");
            setStatusFilter("");
          }}
          disabled={!searchInput && !roleFilter && !statusFilter}
          title="Clear filters"
          aria-label="Clear filters"
          className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-stroke text-dark-5 transition hover:bg-error-light hover:text-error disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-3 dark:text-white"
        >
          <ClearFiltersIcon />
        </button>

        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Invite user
        </button>
      </div>

      {(error || isError) && (
        <div className="px-4 pt-4 sm:px-6">
          <p className="rounded-lg bg-error-light px-4 py-3 text-sm font-medium text-error">
            {error || getErrorMessage(queryError, "Unable to load users.")}
          </p>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1050px] table-auto text-left">
          <caption className="sr-only">Admin portal users</caption>
          <thead className="bg-surface-secondary dark:bg-dark-2">
            <tr>
              <TableHeading>Name</TableHeading>
              <TableHeading>Firm / Company</TableHeading>
              <TableHeading>Role</TableHeading>
              <TableHeading>Contact Info</TableHeading>
              <TableHeading align="center">Status</TableHeading>
              <TableHeading align="right">Action</TableHeading>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {users.map((user) => {
                const isActive = user.status === "ACTIVE";
                const canToggle =
                  (user.status === "ACTIVE" || user.status === "DEACTIVATED") &&
                  user.id !== currentUserId;

                return (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-surface-secondary dark:hover:bg-dark-2"
                  >
                    <TableCell>
                      <span className="font-medium text-dark dark:text-white">
                        {user.name}
                      </span>
                    </TableCell>
                    <TableCell>{user.firmCompany || "—"}</TableCell>
                    <TableCell>{roleLabel(user.role)}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${user.email}`}
                        className="block font-medium text-dark hover:text-primary dark:text-white"
                      >
                        {user.email}
                      </a>
                      {user.phone ? (
                        <a
                          href={`tel:${user.phone.replace(/\s/g, "")}`}
                          className="mt-1 block text-sm hover:text-primary"
                        >
                          {user.phone}
                        </a>
                      ) : (
                        <span className="mt-1 block text-sm text-dark-5">—</span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          role="switch"
                          disabled={!canToggle || isUpdatingStatus}
                          aria-checked={isActive}
                          aria-label={`${isActive ? "Deactivate" : "Activate"} ${user.name}`}
                          onClick={() => toggleStatus(user)}
                          className="inline-flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span
                            aria-hidden="true"
                            className={`relative h-6 w-11 rounded-full shadow-inner transition-colors duration-200 ${isActive ? "bg-sidebar-active" : "bg-stroke"}`}
                          >
                            <span
                              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isActive ? "translate-x-5" : "translate-x-0"}`}
                            />
                          </span>
                        </button>
                        <span className="text-xs text-dark-5">
                          {USER_STATUS_LABELS[user.status]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/users/details?id=${user.id}`}
                          aria-label={`View ${user.name}`}
                          title="View user"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dark-5 transition-colors hover:bg-primary-light hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <ViewIcon />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (user.id === currentUserId) {
                              toast.error("You cannot deactivate your own account.");
                              return;
                            }
                            setUserToDeactivate(user);
                          }}
                          disabled={user.status === "DEACTIVATED" || user.id === currentUserId}
                          aria-label={`Deactivate ${user.name}`}
                          title="Deactivate user"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dark-5 transition-colors hover:bg-error-light hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-error disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </TableCell>
                  </tr>
                );
            })}
            {!isLoading && !users.length && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="sr-only" aria-live="polite">
        {pagination?.total ?? 0} {(pagination?.total ?? 0) === 1 ? "user" : "users"}
        found.
        {isFetching ? " Updating." : ""}
      </p>

      {(pagination?.total ?? 0) > 0 && (
        <div className="flex justify-center border-t border-stroke px-4 py-5 dark:border-dark-3">
          <Pagination
            currentPage={pagination?.page ?? currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            label="Users pagination"
          />
        </div>
      )}

      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={() => toast.success("Invite sent. The user will appear as Invited.")}
      />

      <ConfirmationModal
        open={userToDeactivate !== null}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${userToDeactivate?.name ?? "this user"}? This is a soft delete.`}
        confirmLabel={isUpdatingStatus ? "Deactivating..." : "Deactivate user"}
        confirmDisabled={isUpdatingStatus}
        icon={<DeleteIcon />}
        onCancel={() => setUserToDeactivate(null)}
        onConfirm={() => {
          if (!userToDeactivate) return;
          updateStatus(
            userToDeactivate,
            "DEACTIVATED",
            "Removed from admin panel",
          );
          setUserToDeactivate(null);
        }}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <ClickOutside onClick={() => setOpen(false)} className="block">
      <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="relative w-full rounded-lg border border-stroke bg-white py-2.5 pl-3 pr-10 text-left text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
        >
          {selected?.label ?? placeholder}
          <SelectChevron />
        </button>
        {open && (
          <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-stroke bg-white py-1 shadow-lg dark:border-dark-3 dark:bg-gray-dark">
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-primary-light ${!value ? "font-semibold text-primary" : "text-dark dark:text-white"}`}
              >
                {placeholder}
              </button>
            </li>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-primary-light ${value === option.value ? "font-semibold text-primary" : "text-dark dark:text-white"}`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ClickOutside>
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

function ClearFiltersIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055" />
      <path d="m22 3-5 5" />
      <path d="m17 3 5 5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function TableHeading({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-5 py-4 text-sm font-semibold uppercase text-dark-5 dark:text-dark-6 sm:px-6 ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <td
      className={`px-5 py-4 align-middle sm:px-6 ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`}
    >
      {children}
    </td>
  );
}

export function ViewIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}
