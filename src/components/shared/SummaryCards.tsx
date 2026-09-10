import Card from "./Card";

export type SummaryItem = { label: string; value: string | number };

export default function SummaryCards({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
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
