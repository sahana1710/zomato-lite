"use client";

// Screen 1 — /review/[restaurantId]
// Collects one rating and one comment, hands them to POST /api/reviews, and steps back.
// The backend judges the submission; this page only displays whatever it says.

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon, ratingTextClass, ratingFillClass } from "@/components/StarIcon";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = use(params);
  const router = useRouter();

  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    <main className="min-h-screen bg-background text-neutral-900">
      <div className="mx-auto max-w-[560px] px-6 py-16">
        <div className="relative flex items-center justify-center">
          <a
            href={`/restaurant/${restaurantId}`}
            className="group absolute left-0 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Back
          </a>

          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Review
          </h1>
        </div>
        <p className="mt-2 text-center text-sm text-neutral-500">
          One rating, one honest comment. That is all a first review needs to be.
        </p>

        <form onSubmit={handleSubmit} className="mt-12">
          {/* Star picker, 1 to 5, with hover preview */}
          <div className="flex items-baseline justify-between">
            <label className="text-xs uppercase tracking-wider text-neutral-400">Rating</label>
            {rating !== null && (
              <span className={`text-sm font-medium ${ratingTextClass(shown)}`}>{rating} / 5</span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                className="group rounded p-1 transition-colors focus:outline-none"
              >
                <StarIcon
                  filled={star <= shown}
                  colorClass={ratingFillClass(shown)}
                  className="h-10 w-10"
                />
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
            className="mt-3 w-full resize-none rounded-lg border border-neutral-300 bg-white p-4 leading-relaxed outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />

          {/* Submit — grey until the review is worthy, amber the moment it is */}
          <button
            type="submit"
            disabled={!ready || submitting}
            className={`mt-8 w-full rounded-lg py-3.5 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40 ${
              ready ? "bg-brand hover:bg-brand-dark" : "bg-neutral-900"
            }`}
          >
            {submitting ? "Sending…" : "Submit review"}
          </button>
          <p className="mt-3 text-center text-xs text-neutral-400">
            Published instantly to the restaurant page.
          </p>

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
