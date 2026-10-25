// One shared star shape, reused by every screen.
// Filled vs empty is a rendering decision made from a value the backend provides — not arithmetic.
// Color carries meaning: 1–2 red (avoid), 3 yellow (mixed), 4–5 green (good).

export function ratingFillClass(value: number) {
  if (value < 3) return "fill-red-600";
  if (value < 4) return "fill-amber-400";
  return "fill-green-600";
}

export function ratingTextClass(value: number) {
  if (value < 3) return "text-red-600";
  if (value < 4) return "text-amber-500";
  return "text-green-600";
}

export function StarIcon({
  filled,
  colorClass = "",
  className = "",
}: {
  filled: boolean;
  colorClass?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${filled ? colorClass : "fill-neutral-300"} ${className}`}
    >
      <path d="M12 2.1l2.9 6.02 6.63.86-4.86 4.62 1.21 6.59L12 17.06l-5.88 3.13 1.21-6.59L2.47 8.98l6.63-.86L12 2.1z" />
    </svg>
  );
}

export function StarRow({
  value,
  size = "h-4 w-4",
  className = "",
}: {
  value: number;
  size?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      <span className="sr-only">Rated {value} out of 5</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          filled={n <= value}
          colorClass={ratingFillClass(value)}
          className={size}
        />
      ))}
    </span>
  );
}
