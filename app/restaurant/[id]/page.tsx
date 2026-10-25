"use client";

// Screen 2 — /restaurant/[id]
// Fetches GET /api/restaurants/[id] and renders what it receives.
// This file contains no arithmetic of any kind: the backend hands over computed answers,
// this page's only job is to display them beautifully.

import { use, useEffect, useState } from "react";

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

function Stars({ value }: { value: number }) {
  return <span aria-hidden="true" className="text-amber-600">★ {value}</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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
        <div className="mx-auto max-w-[560px] px-6 py-16">
          <p className="text-neutral-400">Loading…</p>
        </div>
      </main>
    );
  }

  const emptyRoom = data.averageRating === null && data.latestReview === null;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-[560px] px-6 py-12">
        {/* Restaurant identity */}
        <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {data.cuisine} · {data.area}
        </p>

        {emptyRoom ? (
          <section className="mt-10 rounded-lg border border-neutral-200 bg-white p-8 text-center">
            <p className="text-lg font-medium">No reviews yet.</p>
            <p className="mt-2 text-sm text-neutral-500">
              Be the first — the honest opening deserves an honest rating.
            </p>
            <a
              href={`/review/${id}`}
              className="mt-6 inline-block rounded-lg bg-neutral-900 px-5 py-2.5 text-sm text-white hover:bg-neutral-700"
            >
              Write the first review
            </a>
          </section>
        ) : (
          <>
            {/* The average — given to us as 4.5, printed as 4.5. No adding. No dividing. */}
            <div className="mt-8 flex items-baseline gap-3">
              {/* ← THE LINE: the average is printed, never calculated. */}
              <p className="text-6xl font-semibold tracking-tight text-amber-600">
                {data.averageRating}
              </p>
              <span className="text-sm text-neutral-500">★ out of 5 · {data.totalReviews}</span>
            </div>

            {/* The latest review — highlighted, because recency is what people trust */}
            {data.latestReview && (
              <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-5">
                <p className="text-xs uppercase tracking-wider text-neutral-400">Latest review</p>
                <p className="mt-2 text-lg leading-relaxed">
                  {data.latestReview.comment}
                </p>
                <p className="mt-3 flex items-center gap-3 text-sm text-neutral-500">
                  <Stars value={data.latestReview.rating} />
                  <span>{formatDate(data.latestReview.createdAt)}</span>
                </p>
              </section>
            )}

            {/* The older reviews, plain and quiet */}
            {data.reviews.length > 0 && (
              <ul className="mt-6 divide-y divide-neutral-200 border-t border-neutral-200">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-4">
                    <p className="leading-relaxed">{review.comment}</p>
                    <p className="mt-1.5 flex items-center gap-3 text-sm text-neutral-500">
                      <Stars value={review.rating} />
                      <span>{formatDate(review.createdAt)}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <p className="mt-10">
          <a
            href={`/review/${id}`}
            className="text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800"
          >
            Write a review
          </a>
        </p>
      </div>
    </main>
  );
}
