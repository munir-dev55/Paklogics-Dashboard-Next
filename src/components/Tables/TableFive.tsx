"use client";

import { useEffect, useState, type ReactNode } from "react";
import Pagination from "@/components/shared/Pagination";

type UserStatus = "Active" | "Inactive";

type UserRecord = {
  id: number;
  name: string;
  firmCompany: string;
  role: string;
  email: string;
  phone: string;
  status: UserStatus;
};

const users: UserRecord[] = [
  {
    id: 1,
    name: "Vivik",
    firmCompany: "Meridian Corp",
    role: "Case Manager",
    email: "vivkor@gmail.com",
    phone: "+1 202 555 0142",
    status: "Active",
  },
  {
    id: 2,
    name: "Charlis Williams",
    firmCompany: "Williams Legal",
    role: "Neutral",
    email: "charlisW@gmail.com",
    phone: "+1 202 555 0186",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Mark",
    firmCompany: "Pinnacle ADR",
    role: "Lawyer",
    email: "mark@gmail.com",
    phone: "+1 202 555 0129",
    status: "Active",
  },
  {
    id: 4,
    name: "Spy",
    firmCompany: "Hartwell Construction",
    role: "Client",
    email: "spy@gmail.com",
    phone: "+1 202 555 0175",
    status: "Inactive",
  },
  {
    id: 5,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Accounting Staff",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 6,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Accounting Staff",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 7,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Neutral",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 8,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Lawyer",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 9,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Case Manager",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 10,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Neutral",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 12,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Accounting Staff",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
  {
    id: 11,
    name: "John Doe",
    firmCompany: "FedArb ADR",
    role: "Case Manager",
    email: "jhondoe@gmail.com",
    phone: "+1 202 555 0113",
    status: "Active",
  },
];

const itemsPerPage = 10;

export default function TableFive() {
  const [data, setData] = useState(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredData = data.filter((user) => {
    const matchesSearch =
      !normalizedSearchQuery ||
      [user.name, user.firmCompany, user.role, user.email, user.phone].some(
        (value) => value.toLowerCase().includes(normalizedSearchQuery),
      );
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });
  const roles = Array.from(new Set(data.map((user) => user.role))).sort();
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const toggleStatus = (id: number) => {
    setData((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user,
      ),
    );
  };

  const removeUser = (id: number) => {
    setData((current) => current.filter((user) => user.id !== id));
  };

  return (
    <div className="overflow-hidden rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="grid gap-4 border-b border-stroke p-4 dark:border-dark-3 sm:p-6 md:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_220px_180px_auto] xl:items-end">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Search users
          </span>
          <span className="relative block">
            <SearchIcon />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, company, email, or phone"
              className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-10 pr-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Role
          </span>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="w-full rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
          >
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as UserStatus | "")
            }
            className="w-full rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setRoleFilter("");
            setStatusFilter("");
          }}
          disabled={!searchQuery && !roleFilter && !statusFilter}
          className="rounded-lg border border-stroke px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
        >
          Clear filters
        </button>
      </div>

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
            {currentData.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-surface-secondary dark:hover:bg-dark-2"
              >
                <TableCell>
                  <span className="font-medium text-dark dark:text-white">
                    {user.name}
                  </span>
                </TableCell>
                <TableCell>{user.firmCompany}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <a
                    href={`mailto:${user.email}`}
                    className="block font-medium text-dark hover:text-primary dark:text-white"
                  >
                    {user.email}
                  </a>
                  <a
                    href={`tel:${user.phone.replace(/\s/g, "")}`}
                    className="mt-1 block text-sm hover:text-primary"
                  >
                    {user.phone}
                  </a>
                </TableCell>
                <TableCell align="center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={user.status === "Active"}
                    aria-label={`${user.status === "Active" ? "Deactivate" : "Activate"} ${user.name}`}
                    onClick={() => toggleStatus(user.id)}
                    className="inline-flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span
                      aria-hidden="true"
                      className={`relative h-6 w-11 rounded-full shadow-inner transition-colors duration-200 ${user.status === "Active" ? "bg-sidebar-active" : "bg-stroke"}`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${user.status === "Active" ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </span>
                  </button>
                </TableCell>
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`View ${user.name}`}
                      title="View user"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dark-5 transition-colors hover:bg-primary-light hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      aria-label={`Delete ${user.name}`}
                      title="Delete user"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dark-5 transition-colors hover:bg-error-light hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-error"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </TableCell>
              </tr>
            ))}
            {!currentData.length && (
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
        {filteredData.length} {filteredData.length === 1 ? "user" : "users"}
        found.
      </p>

      {filteredData.length > 0 && (
        <div className="flex justify-center border-t border-stroke px-4 py-5 dark:border-dark-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            label="Users pagination"
          />
        </div>
      )}
    </div>
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

function ViewIcon() {
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
