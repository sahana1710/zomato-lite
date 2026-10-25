"use client";

// Screen 2 — /restaurant/[id]
// Fetches GET /api/restaurants/[id] and renders what it receives.
// This file contains no arithmetic of any kind: the backend hands over computed answers,
// this page's only job is to display them beautifully.

import { use, useEffect, useState } from "react";
import { StarRow } from "@/components/StarIcon";
import { BurritoTile } from "@/components/BurritoIllustration";

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

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
      {children}
    </span>
  );
}

// The page's single warm shout: a full-width amber call to action.
function WriteReviewButton({ id }: { id: string }) {
  return (
    <a
      href={`/review/${id}`}
      className="group mt-12 flex w-full items-center justify-between rounded-lg bg-amber-600 px-6 py-4 font-medium text-white transition-colors hover:bg-amber-500"
    >
      <span>Write a review</span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

// Grey placeholder blocks shaped like the content, so the page never jumps on arrival.
function Skeleton() {
  return (
    <div className="mx-auto max-w-[560px] px-6 py-16">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="mt-3 h-8 w-52 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-14 w-14 animate-pulse rounded-lg bg-neutral-200" />
      </div>
      <div className="mt-8">
        <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-16 w-36 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="mt-12">
        <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="mt-4 h-44 animate-pulse rounded-lg bg-neutral-200" />
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
      <main className="min-h-screen bg-background text-neutral-900">
        <div className="mx-auto max-w-[560px] px-6 py-16">
          <p className="text-neutral-500">There is no restaurant at this address.</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background text-neutral-900">
        <Skeleton />
      </main>
    );
  }

  const emptyRoom = data.averageRating === null && data.latestReview === null;

  return (
    <main className="min-h-screen bg-background text-neutral-900">
      <div className="mx-auto max-w-[560px] px-6 py-14">
        {/* Restaurant identity — monogram tile, name, chips */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-amber-600">Zomato-Lite</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip>{data.cuisine}</Chip>
              <Chip>{data.area}</Chip>
            </div>
          </div>
          <BurritoTile className="h-20 w-20 sm:h-24 sm:w-24" />
        </header>

        {emptyRoom ? (
          <section className="mt-12 rounded-lg border border-dashed border-neutral-300 bg-white p-10 text-center">
            <p className="text-lg font-medium">No reviews yet.</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Be the first — the honest opening deserves an honest rating.
            </p>
            <div className="mt-6">
              <WriteReviewButtonHeroless id={id} />
            </div>
          </section>
        ) : (
          <>
            {/* The average — sits with the identity block, given to us as 4.4, printed as 4.4. No adding. No dividing. */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wider text-neutral-400">Average rating</p>
              <div className="mt-3 flex items-center gap-4">
                {/* ← THE LINE: the average is printed, never calculated. */}
                <p className="text-7xl font-semibold leading-none tracking-tight text-amber-600">
                  {data.averageRating}
                </p>
                <div className="flex flex-col items-start">
                  <StarRow value={data.averageRating ?? 0} size="h-4 w-4" />
                  <span className="mt-1 text-sm text-neutral-500">
                    out of 5 · {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>

            {/* One Reviews section: the highlighted latest review, then the older ones */}
            <section className="mt-12 border-t border-neutral-200 pt-10">
              <h2 className="text-xs uppercase tracking-widest text-neutral-400">Reviews</h2>
              {data.latestReview && (
                <div className="relative mt-4 overflow-hidden rounded-lg bg-amber-200/60 p-6">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-2 right-4 select-none font-serif text-8xl leading-none text-amber-300"
                  >
                    ”
                  </span>
                  <p
                    className="relative text-xs font-medium uppercase tracking-widest text-amber-900"
                    aria-hidden="true"
                  >
                    Latest review
                  </p>
                  <p className="relative mt-3 text-xl leading-relaxed text-amber-950">
                    {data.latestReview.comment}
                  </p>
                  <p className="relative mt-5 flex items-center gap-3 text-sm text-amber-900/70">
                    <StarRow value={data.latestReview.rating} size="h-4 w-4" />
                    <span>{formatDate(data.latestReview.createdAt)}</span>
                  </p>
                </div>
              )}

              {/* The rest, plain and quiet, under the same roof */}
              {data.reviews.length > 0 && (
                <ul className="mt-6 divide-y divide-neutral-200 border-t border-neutral-200">
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
            </section>

            <WriteReviewButton id={id} />
          </>
        )}
      </div>
    </main>
  );
}

// The empty state's CTA — identical warmth, centered instead of edge-to-edge.
function WriteReviewButtonHeroless({ id }: { id: string }) {
  return (
    <a
      href={`/review/${id}`}
      className="inline-block rounded-lg bg-amber-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-500"
    >
      Write the first review
    </a>
  );
}
