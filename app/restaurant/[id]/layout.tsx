import type { Metadata } from "next";
import { sql } from "@/lib/db";

// This runs on the Next.js server — kitchen territory, allowed to touch the database —
// purely to compose the browser-tab title. The screen itself stays display-only.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const restaurantId = Number(id);
  if (!Number.isInteger(restaurantId)) {
    return { title: "Not found · Zomato-Lite" };
  }
  try {
    const [restaurant] = await sql`
      SELECT name FROM restaurants WHERE id = ${restaurantId}
    `;
    if (!restaurant) {
      return { title: "Not found · Zomato-Lite" };
    }
    const [stats] = await sql`
      SELECT ROUND(AVG(rating)::numeric, 1) AS average_rating
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
    `;
    const rating = stats && stats.average_rating !== null ? `${Number(stats.average_rating)} ★ ` : "";
    return { title: `${rating}${restaurant.name} · Zomato-Lite` };
  } catch {
    return { title: "Zomato-Lite" };
  }
}

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
