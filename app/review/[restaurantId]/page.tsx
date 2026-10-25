"use client";

// Screen 1 — /review/[restaurantId]
// Collects one rating and one comment, hands them to POST /api/reviews.
// Only after the backend confirms storage does the thank-you appear; the page
// displays whatever it says.

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon, StarRow, ratingTextClass, ratingFillClass } from "@/components/StarIcon";

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
  const [thanks, setThanks] = useState(false);

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
      // The review exists; only now does the thank-you earn its place.
      setThanks(true);
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
            className="group absolute left-0 inline-flex items-center gap-1.5 text-base text-neutral-700 transition-colors hover:text-brand"
          >
            {/* A real vector icon, not a unicode glyph — same recipe as the pencil on the restaurant page */}
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:-translate-x-0.5"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
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
            <label className="text-base uppercase tracking-wider text-neutral-400">Rating</label>
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
          <label htmlFor="comment" className="mt-10 block text-base uppercase tracking-wider text-neutral-400">
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
            className={`mt-8 w-full rounded-lg py-3.5 text-base font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40 ${
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

      {/* The thank-you: a plain bordered toast, no shadows, shown only after the backend's 201.
          It echoes the submitted stars — same component, same tier colors. */}
      {thanks && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-neutral-900/40 px-6">
          <div
            role="dialog"
            aria-labelledby="thanks-title"
            className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 text-center"
          >
            <svg
              aria-hidden="true"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
            <h2 id="thanks-title" className="mt-4 text-xl font-semibold tracking-tight">
              Thank you!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Your review is live on the restaurant page.
            </p>
            {rating !== null && (
              <div className="mt-4 flex justify-center" aria-label={`You rated ${rating} out of 5`}>
                <StarRow value={rating} size="h-5 w-5" />
              </div>
            )}
            <button
              type="button"
              onClick={() => router.push(`/restaurant/${restaurantId}`)}
              className="mt-6 w-full rounded-lg bg-brand py-3 text-base font-medium text-white transition-colors hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              See it on the page
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
