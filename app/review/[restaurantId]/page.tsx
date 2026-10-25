"use client";

// Screen 1 — /review/[restaurantId]
// Collects one rating and one comment, hands them to POST /api/reviews, and steps back.
// The backend judges the submission; this page only displays whatever it says.

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = use(params);
  const router = useRouter();

  const [name, setName] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Ask the API (not the database) for the restaurant's name — frontend talks to the waiter only.
  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setName(data.name))
      .catch(() => null);
  }, [restaurantId]);

  const ready = rating !== null && comment.trim().length > 0;
  const shown = hover ?? rating ?? 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: Number(restaurantId),
        rating,
        comment,
      }),
    });
    setSubmitting(false);

    if (res.status === 201) {
      router.push(`/restaurant/${restaurantId}`);
      return;
    }

    // Show the backend's own words. We never invent an error message here.
    let message = `Something went wrong (HTTP ${res.status}).`;
    try {
      const data = await res.json();
      if (data && typeof data.error === "string") {
        message = data.error;
      }
    } catch {
      // keep the fallback message
    }
    setError(message);
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-[560px] px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          Review{name ? ` ${name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          One rating, one honest comment. That is all a first review needs to be.
        </p>

        <form onSubmit={handleSubmit} className="mt-12">
          {/* Star picker, 1 to 5, with hover preview */}
          <div className="flex items-baseline justify-between">
            <label className="text-xs uppercase tracking-wider text-neutral-400">Rating</label>
            {rating !== null && (
              <span className="text-sm font-medium text-amber-600">{rating} / 5</span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                className={`rounded px-1 text-5xl transition-colors focus:outline-none focus-visible:text-amber-500 ${
                  star <= shown ? "text-amber-500" : "text-neutral-300 hover:text-amber-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {rating === null && (
            <p className="mt-3 text-xs text-neutral-400">Tap a star to begin.</p>
          )}

          {/* Comment box */}
          <label htmlFor="comment" className="mt-10 block text-xs uppercase tracking-wider text-neutral-400">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            placeholder="What was it like?"
            className="mt-3 w-full resize-none rounded-lg border border-neutral-300 bg-white p-4 text-sm leading-relaxed outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />

          {/* Submit — quiet until it is legit */}
          <button
            type="submit"
            disabled={!ready || submitting}
            className="mt-8 w-full rounded-lg bg-neutral-900 py-3.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Sending…" : "Submit review"}
          </button>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
