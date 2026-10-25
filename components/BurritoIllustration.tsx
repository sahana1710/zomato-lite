// A studio-styled burrito platter — supplied by the user in-app (pasted screenshot).
// Rights note: source unverified. Fine for a personal project; confirm the photo's
// origin/license before any commercial release.
// Squared off with object-cover, so whatever the tile size, the platter stays whole.

export function BurritoTile({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200 ${className}`}
    >
      <img
        src="/burrito.jpg"
        alt="A carne asada burrito, split open to show the filling"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
