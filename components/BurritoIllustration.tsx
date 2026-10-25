// A real burrito — a photo beats a drawing when the shop is named after one.
// Photo: "Carne asada burrito" by Dougk49, CC BY-SA 3.0, via Wikimedia Commons.
// Squared off with object-cover, so whatever the tile size, the burrito stays whole.

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
