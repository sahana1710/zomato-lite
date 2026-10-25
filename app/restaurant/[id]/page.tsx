"use client";

// Screen 2 — /restaurant/[id]
// Fetches GET /api/restaurants/[id] and renders what it receives.
// This file contains no arithmetic of any kind: the backend hands over computed answers,
// this page's only job is to display them beautifully.

import { use, useEffect, useState } from "react";
import { StarRow } from "@/components/StarIcon";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Grey placeholder blocks shaped like the content, so the page never jumps on arrival.
function Skeleton() {
  return (
    <div className="mx-auto max-w-[560px] px-6 py-16">
      <div className="h-8 w-52 animate-pulse rounded bg-neutral-200" />
      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-neutral-200" />
      <div className="mt-10 border-t border-neutral-200 pt-10">
        <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-16 w-36 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="mt-8 h-40 animate-pulse rounded-lg bg-neutral-200" />
      <div className="mt-8 space-y-6">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
      </div>
    </div>
  );
}

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [data, setData] = useState<RestaurantData | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/restaurants/${id}`).then((res) => {
      setStatus(res.status);
      if (res.ok) {
        return res.json().then((json: RestaurantData) => setData(json));
      }
    });
  }, [id]);

  if (status === 404) {
    return (
      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-[560px] px-6 py-16">
          <p className="text-neutral-500">There is no restaurant at this address.</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <Skeleton />
      </main>
    );
  }

  const emptyRoom = data.averageRating === null && data.latestReview === null;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-[560px] px-6 py-16">
        {/* Restaurant identity */}
        <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {data.cuisine} · {data.area}
        </p>

        {emptyRoom ? (
          <section className="mt-12 rounded-lg border border-neutral-200 bg-white p-10 text-center">
            <p className="text-lg font-medium">No reviews yet.</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Be the first — the honest opening deserves an honest rating.
            </p>
            <a
              href={`/review/${id}`}
              className="mt-6 inline-block rounded-lg bg-neutral-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-neutral-700"
            >
              Write the first review
            </a>
          </section>
        ) : (
          <>
            {/* The average — given to us as 4.4, printed as 4.4. No adding. No dividing. */}
            <div className="mt-10 border-t border-neutral-200 pt-10">
              <p className="text-xs uppercase tracking-wider text-neutral-400">Average rating</p>
              <div className="mt-3 flex items-baseline gap-3">
                {/* ← THE LINE: the average is printed, never calculated. */}
                <p className="text-7xl font-semibold tracking-tight text-amber-600">
                  {data.averageRating}
                </p>
                <div className="flex flex-col">
                  <StarRow value={data.averageRating ?? 0} size="h-4 w-4" />
                  <span className="mt-1.5 text-sm text-neutral-500">
                    out of 5 · {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>

            {/* The latest review — highlighted, because recency is what people trust */}
            {data.latestReview && (
              <section className="mt-8 rounded-lg border border-neutral-200 border-l-2 border-l-amber-500 bg-white p-6">
                <p className="text-xs uppercase tracking-wider text-neutral-400">Latest review</p>
                <p className="mt-3 text-xl leading-relaxed">{data.latestReview.comment}</p>
                <p className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
                  <StarRow value={data.latestReview.rating} size="h-4 w-4" />
                  <span>{formatDate(data.latestReview.createdAt)}</span>
                </p>
              </section>
            )}

            {/* The older reviews, plain and quiet */}
            {data.reviews.length > 0 && (
              <ul className="mt-8 divide-y divide-neutral-200 border-t border-neutral-200">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-5">
                    <p className="leading-relaxed">{review.comment}</p>
                    <p className="mt-2 flex items-center gap-3 text-sm text-neutral-500">
                      <StarRow value={review.rating} size="h-4 w-4" />
                      <span>{formatDate(review.createdAt)}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <p className="mt-12 border-t border-neutral-200 pt-8">
          <a
            href={`/review/${id}`}
            className="text-sm font-medium text-amber-700 underline underline-offset-4 transition-colors hover:text-amber-800"
          >
            Write a review
          </a>
        </p>
      </div>
    </main>
  );
}
