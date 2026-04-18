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
              <strong className="text-neutral-900">Flavour Airhis Resources (FAR)</strong> is a Nigerian HR and staffing agency specialising in talent acquisition and workforce deployment. We act as the bridge between ambitious businesses and the skilled professionals they need to grow.
            </p>
            <p className="mb-4 text-neutral-700 leading-relaxed">
              Our approach is hands-on: we recruit on behalf of our clients, rigorously vet every candidate, and remain the employer of record for deployed staff — giving businesses flexibility without the administrative burden.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              From Lagos boardrooms to regional offices, FAR-deployed talent is trusted by leading organisations across finance, technology, manufacturing, and professional services.
            </p>
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
