import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-gradient py-28 text-white">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-black/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
            Nigeria&apos;s Trusted Staffing Partner
          </p>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
            Connecting Businesses with Exceptional Talent
          </h1>
          <p className="mb-10 text-lg text-white/80 sm:text-xl leading-relaxed">
            FAR recruits, vets, and deploys skilled professionals to client companies across Nigeria.
            Whether you&apos;re hiring or job-seeking, we&apos;re your gateway to opportunity.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/jobs"
              className="rounded bg-white px-7 py-3 text-sm font-semibold text-brand-600 transition-opacity hover:opacity-90"
            >
              Browse Open Positions
            </Link>
            <a
              href="#contact"
              className="rounded border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
