import Link from "next/link";

function Card({
  href,
  kicker,
  title,
  subtitle,
}: {
  href: string;
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
    >
      <p className="text-[11px] uppercase tracking-wider text-neutral-400">{kicker}</p>
      <p className="mt-3 flex items-center justify-between font-medium">
        {title}
        <span aria-hidden="true" className="text-neutral-400 transition-transform group-hover:translate-x-1">
          →
        </span>
      </p>
      <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-6 py-16">
        {/* The name of the app — quiet, with a single warm accent on the dash */}
        <header>
          <h1 className="text-4xl font-semibold tracking-tight">
            Zomato<span className="text-amber-600">-Lite</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            One restaurant. One database. Answers computed the moment you ask for
            them — never stored, never stale.
          </p>
        </header>

        {/* The two things this product does — nothing else */}
        <section className="mt-14 space-y-3">
          <Card
            href="/restaurant/1"
            kicker="The dining area"
            title="Ludhiana Burrito"
            subtitle="Read the reviews · Indian · Sector 32"
          />
          <Card
            href="/review/1"
            kicker="The waiter's pad"
            title="Write a review"
            subtitle="A star rating and one honest comment"
          />
        </section>

        <footer className="mt-auto pt-12 text-xs text-neutral-400">
          <p>Zomato-Lite — facts are stored, answers are computed.</p>
        </footer>
      </div>
    </main>
  );
}
