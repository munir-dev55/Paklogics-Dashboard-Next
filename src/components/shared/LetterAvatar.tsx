export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function LetterAvatar({
  name,
  size = "md",
  showStatus = false,
}: {
  name: string;
  size?: "md" | "lg";
  showStatus?: boolean;
}) {
  const sizeClass =
    size === "lg"
      ? "h-full w-full text-3xl sm:text-4xl"
      : "h-12 w-12 text-sm";

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white ${sizeClass}`}
    >
      {getInitials(name)}
      {showStatus && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark" />
      )}
    </span>
  );
}
