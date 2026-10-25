// GET /api/restaurants/[id] — everything the restaurant page needs, shaped like the screen.
// Supports ?page=N for the older reviews: the featured latest review lives on page 1,
// and the plain archive list paginates PER_PAGE items per page after it.

import { sql } from "@/lib/db";

type ReviewRow = { id: number; rating: number; comment: string; created_at: Date };

// How many plain reviews fit on one page. The featured latest review is not one of them.
const PER_PAGE = 10;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const restaurantId = Number(rawId);

  if (!Number.isInteger(restaurantId)) {
    return Response.json(
      { error: `No restaurant called "${rawId}".` },
      { status: 404 },
    );
  }

  // Fact 1 — the restaurant itself.
  const restaurants = await sql`
    SELECT id, name, cuisine, area
    FROM restaurants
    WHERE id = ${restaurantId}
  `;
  if (restaurants.length === 0) {
    return Response.json(
      { error: `Restaurant ${restaurantId} does not exist.` },
      { status: 404 },
    );
  }
  const restaurant = restaurants[0];

  // The answers — computed fresh on every single load. Never stored, always asked.
  // The three lines of intelligence of this entire product:
  const stats = await sql`
    SELECT ROUND(AVG(rating)::numeric, 1) AS average_rating,   -- averageRating
           COUNT(*)                                 AS total_reviews -- totalReviews
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
  `;

  const newestFirst = await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC
    LIMIT 1 -- just the featured latest; the list comes from pageReviews
  `;

  const hasReviews = newestFirst.length > 0;
  const [statsRow] = stats;

  // Page math lives here, in the backend — never in the browser.
  // Page 1 shows the 10 plain reviews after the featured latest;
  // page 2 the next 10, and so on. Out-of-range pages clamp inward.
  const totalReviews = Number(statsRow.total_reviews);
  const listable = Math.max(totalReviews - 1, 0); // every review except the featured latest
  const totalPages = listable === 0 ? 1 : Math.ceil(listable / PER_PAGE);
  const rawPage = Number(new URL(request.url).searchParams.get("page") ?? "1");
  const page = Number.isInteger(rawPage) ? Math.min(Math.max(rawPage, 1), totalPages) : 1;

  const pageReviews = await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC
    OFFSET ${1 + (page - 1) * PER_PAGE} -- skip the featured latest, then arrive at this page
    LIMIT ${PER_PAGE}
  `;

  const toReview = (row: ReviewRow) => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  });

  return Response.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: statsRow.average_rating === null ? null : Number(statsRow.average_rating),
    totalReviews,
    page,
    totalPages,
    latestReview: hasReviews && page === 1 ? toReview(newestFirst[0] as ReviewRow) : null,
    reviews: pageReviews.map((row) => toReview(row as ReviewRow)),
  });
}
