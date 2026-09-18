"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { getErrorMessage } from "@/lib/api-error";
import { useInviteUser } from "@/hooks/useUsers";
import {
  INVITABLE_ROLES,
  ROLE_LABELS,
  defaultUserType,
  type InvitableRole,
} from "@/types/enums";

type InviteUserModalProps = {
  open: boolean;
  onClose: () => void;
  onInvited?: () => void;
};

export default function InviteUserModal({
  open,
  onClose,
  onInvited,
}: InviteUserModalProps) {
  const { mutate, isPending, reset } = useInviteUser();
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState<InvitableRole>("CASE_MANAGER");
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setEmail("");
    setRoleName("CASE_MANAGER");
    setJobTitle("");
    setError("");
    reset();
  }, [open, reset]);

  if (!open) return null;

  const userType = defaultUserType(roleName);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    mutate(
      {
        email: email.trim().toLowerCase(),
        roleName,
        userType,
        jobTitle: jobTitle.trim() || undefined,
      },
      {
        onSuccess: () => {
          onInvited?.();
          onClose();
        },
        onError: (err) => setError(getErrorMessage(err, "Unable to invite user.")),
      },
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#001842]/55 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-user-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-[535px] rounded-xl border border-stroke bg-white px-6 py-6 shadow-lg dark:border-stroke-dark dark:bg-gray-dark sm:px-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="invite-user-title"
              className="text-xl font-semibold text-primary dark:text-white"
            >
              Invite user
            </h2>
            <p className="mt-1 text-sm text-dark-5">
              The invitee has 7 days to accept. They will appear as Invited until
              then.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-dark-5 transition hover:bg-surface-muted hover:text-dark disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-dark-2 dark:hover:text-white"
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
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Role
            </span>
            <select
              value={roleName}
              onChange={(event) => setRoleName(event.target.value as InvitableRole)}
              disabled={isPending}
              className="w-full rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              {INVITABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
              User type
            </span>
            <p className="rounded-lg border border-stroke px-3 py-2.5 text-sm text-dark-5 dark:border-dark-3">
              {userType === "INTERNAL" ? "Internal" : "External"}
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Job title <span className="font-normal text-dark-5">(optional)</span>
            </span>
            <input
              type="text"
              maxLength={100}
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-error-light px-4 py-3 text-sm font-medium text-error">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="min-h-12 flex-1 rounded-xl border border-stroke px-4 py-3 text-base font-semibold text-primary hover:bg-surface-muted dark:border-stroke-dark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="min-h-12 flex-[2.7] rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Sending invite..." : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
