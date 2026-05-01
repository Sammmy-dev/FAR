import Link from "next/link";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-surface-lowest">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
              Who We Are
            </p>
            <h2 className="mb-8 text-4xl font-extrabold text-neutral-900 sm:text-5xl leading-tight">
              Nigerian-Born.<br />Excellence-Driven.
            </h2>
            <p className="mb-4 text-neutral-700 leading-relaxed">
              <strong className="text-neutral-900">Flavour Airhis Resources (FAR)</strong> is a Nigerian business solutions firm specialising in talent acquisition, workforce deployment, project management, training &amp; development, and business management consulting.
            </p>
            <p className="mb-4 text-neutral-700 leading-relaxed">
              We act as the bridge between ambitious organisations and the people, processes, and strategies they need to thrive. From recruiting and deploying skilled professionals to managing critical projects and building internal capacity, FAR is a true end-to-end partner.
            </p>
            <p className="mb-8 text-neutral-700 leading-relaxed">
              Trusted by leading organisations across finance, technology, manufacturing, and professional services, our work spans Lagos boardrooms to regional offices nationwide.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center rounded bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Learn More About FAR
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "500+", label: "Employees Deployed" },
              { value: "80+", label: "Client Companies" },
              { value: "10+", label: "Years of Experience" },
              { value: "98%", label: "Client Retention Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded bg-surface p-8 text-center"
              >
                <div className="mb-1 text-4xl font-extrabold text-brand-500">{stat.value}</div>
                <div className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
