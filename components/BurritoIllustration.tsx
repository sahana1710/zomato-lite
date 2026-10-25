// An illustrated Ludhiana-style burrito, drawn in this app's own palette.
// A gentle flat illustration instead of a stock photo — keeps the quiet design language.

export function BurritoTile({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-brand ${className}`}
    >
      <svg viewBox="0 0 64 64" className="h-5/6 w-5/6">
        {/* steam */}
        <g stroke="#fff1f2" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85">
          <path d="M21 16c-2.5 2.5 2.5 4.5 0 9" />
          <path d="M32 12c-2.5 2.5 2.5 4.5 0 9" />
          <path d="M43 16c-2.5 2.5 2.5 4.5 0 9" />
        </g>
        {/* the burrito, tilted */}
        <g transform="rotate(-18 32 44)">
          {/* roll */}
          <rect x="10" y="34" width="44" height="20" rx="10" fill="#fef3c7" />
          {/* folded end, the toasted cap */}
          <ellipse cx="16.5" cy="44" rx="6.5" ry="10" fill="#f5deb3" />
          {/* swirl on the cap */}
          <path
            d="M15.5 39.5c2.5 1 3.5 3.5 1 5.5s-1 3.5 1.5 4.5"
            stroke="#e23744"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          {/* wrap folds */}
          <g stroke="#e23744" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M30 34.5c-3 4.5-3 15 0 19.5" />
            <path d="M43 34.2c-2.5 4-2.5 15.5 0 19.5" opacity="0.7" />
          </g>
          {/* filling peeking out of the far end */}
          <path
            d="M50.5 36.5c2.6 0.8 4 2.2 3.5 3.5-.5 1.3-3 1.6-4.5 1"
            fill="#e23744"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
}
