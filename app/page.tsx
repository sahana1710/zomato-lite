import Link from "next/link";

const identity = ["One restaurant", "Two tables", "Zero stored averages"];

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
      className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-brand"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm uppercase tracking-wider text-brand">{kicker}</p>
        <span aria-hidden="true" className="text-brand opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
          →
        </span>
      </div>
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-6 py-16">
        {/* The name of the app — the single warm accent on the dash */}
        <header>
          <h1 className="text-6xl font-semibold tracking-tight">
            Zomato<span className="text-brand">-Lite</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            One restaurant. One database. Answers computed the moment you ask for
            them — never stored, never stale.
          </p>
          {/* Who this product is, in three quiet pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {identity.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-600"
              >
                {pill}
              </span>
            ))}
          </div>
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
