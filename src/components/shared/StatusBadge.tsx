const tones = {
  primary: "bg-primary-light text-primary",
  warning: "bg-yellow-light-4 text-yellow-dark",
  muted: "bg-gray-2 text-dark-4",
  success: "bg-green-light-6 text-green",
  error: "bg-red-light-5 text-red",
};
export type StatusTone = keyof typeof tones;

export default function StatusBadge({
  label,
  tone = "primary",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {label}
    </span>
  );
}
