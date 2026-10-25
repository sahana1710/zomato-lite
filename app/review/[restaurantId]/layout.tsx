import type { Metadata } from "next";
import { sql } from "@/lib/db";

// Server-side tab title: "Review Ludhiana Burrito · Zomato-Lite".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}): Promise<Metadata> {
  const { restaurantId } = await params;
  const id = Number(restaurantId);
  try {
    const [restaurant] = Number.isInteger(id)
      ? await sql`SELECT name FROM restaurants WHERE id = ${id}`
      : [];
    return { title: `Review ${restaurant?.name ?? "a restaurant"} · Zomato-Lite` };
  } catch {
    return { title: "Write a review · Zomato-Lite" };
  }
}

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
