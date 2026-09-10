import type { ComponentPropsWithoutRef } from "react";

export default function Card({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`rounded-xl border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark ${className}`}
      {...props}
    />
  );
}
