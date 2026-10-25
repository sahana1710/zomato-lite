// POST /api/reviews — save one review.
// The ONLY door through which a review enters the database, and this door checks everything.

import { sql } from "@/lib/db";

export async function POST(request: Request) {
  let body: { restaurantId?: unknown; rating?: unknown; comment?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "The request body was not valid JSON." },
      { status: 400 },
    );
  }

  const { restaurantId, rating, comment } = body;

  // Check 1 — rating: a whole number from 1 to 5.
  // The star picker in the UI offers 1–5, but this door never trusts the polite visitor.
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return Response.json(
      { error: "Rating must be a whole number between 1 and 5." },
      { status: 400 },
    );
  }

  // Check 2 — comment: not blank once surrounding whitespace is trimmed off.
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return Response.json(
      { error: "Please write a comment. An empty review tells nobody anything." },
      { status: 400 },
    );
  }

  // Check 3 — the restaurant has to actually exist. Only the database knows that.
  try {
    const found = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
    if (found.length === 0) {
      return Response.json(
        { error: `Restaurant ${String(restaurantId)} does not exist.` },
        { status: 400 },
      );
    }
  } catch {
    return Response.json(
      { error: `Restaurant ${String(restaurantId)} does not exist.` },
      { status: 400 },
    );
  }

  // All checks passed. Write exactly one row. Touch nothing else.
  const created = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${Number(restaurantId)}, ${rating}, ${comment})
    RETURNING id
  `;

  return Response.json(
    { success: true, reviewId: created[0].id },
    { status: 201 },
  );
}
