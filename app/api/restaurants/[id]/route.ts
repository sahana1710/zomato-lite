// GET /api/restaurants/[id] — everything the restaurant page needs, shaped like the screen.

import { sql } from "@/lib/db";

type ReviewRow = { id: number; rating: number; comment: string; created_at: Date };

export async function GET(
  _request: Request,
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
    ORDER BY created_at DESC, id DESC -- latestReview + reviews
  `;

  const toReview = (row: ReviewRow) => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  });

  const hasReviews = newestFirst.length > 0;
  const [statsRow] = stats;

  return Response.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: statsRow.average_rating === null ? null : Number(statsRow.average_rating),
    totalReviews: Number(statsRow.total_reviews),
    latestReview: hasReviews ? toReview(newestFirst[0] as ReviewRow) : null,
    reviews: newestFirst.slice(1).map((row) => toReview(row as ReviewRow)),
  });
}
