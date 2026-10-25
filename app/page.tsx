import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-6 py-16">
        {/* The name of the app — quiet, with a single warm accent on the dash */}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">
            Zomato<span className="text-amber-600">-Lite</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            One restaurant. One database. Answers computed the moment you ask for them — never stored, never stale.
          </p>
        </header>

        {/* The two things this product does — nothing else */}
        <section className="mt-12 space-y-3">
          <Link
            href="/restaurant/1"
            className="block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
          >
            <p className="font-medium">Ludhiana Burrito</p>
            <p className="mt-1 text-sm text-neutral-500">
              Read the reviews · Indian · Sector 32
            </p>
          </Link>

          <Link
            href="/review/1"
            className="block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
          >
            <p className="font-medium">Write a review</p>
            <p className="mt-1 text-sm text-neutral-500">
              A star rating and one honest comment
            </p>
          </Link>
        </section>

        <footer className="mt-auto pt-12 text-xs text-neutral-400">
          <p>Zomato-Lite — facts are stored, answers are computed.</p>
        </footer>
      </div>
    </main>
  );
}
