import Card from "./Card";

export type SummaryItem = { label: string; value: string | number };

export default function SummaryCards({ items }: { items: SummaryItem[] }) {
  const columns =
    items.length <= 1
      ? "sm:grid-cols-1 sm:max-w-xs"
      : items.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-3";

  return (
    <div className={`grid gap-4 ${columns}`}>
      {items.map(({ label, value }) => (
        <Card key={label} className="p-5">
          <p className="text-sm">{label}</p>
          <p className="mt-2 text-2xl font-bold text-primary dark:text-white">
            {value}
          </p>
        </Card>
      ))}
    </div>
  );
}
