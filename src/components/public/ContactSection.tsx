import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

export default function ContactSection() {
  const contacts = [
    {
      icon: <HiMail className="h-6 w-6" />,
      label: "Email",
      value: "flavour.hr.airhis@gmail.com",
      href: "mailto:flavour.hr.airhis@gmail.com",
    },
    {
      icon: <HiPhone className="h-6 w-6" />,
      label: "WhatsApp",
      value: "+234 806 245 1204",
      href: "https://wa.me/2348062451204",
    },
    {
      icon: <HiLocationMarker className="h-6 w-6" />,
      label: "Address",
      value: "1st Floor Damilat Building, opp. First Bank, Aregbe Junction, Osogbo, Osun State, Nigeria",
      href: "https://maps.google.com/?q=Aregbe+Junction+Osogbo+Osun+Nigeria",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-surface-lowest">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          {/* Left: Text */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
              Get in Touch
            </p>
            <h2 className="mb-6 text-4xl font-extrabold text-neutral-900 sm:text-5xl">
              Let&apos;s Work Together
            </h2>
            <p className="mb-10 text-neutral-700 leading-relaxed">
              Whether you&apos;re a business looking for top talent, or a professional seeking your next opportunity — the FAR team is ready to help. Reach out and one of our consultants will respond within one business day.
            </p>

            <div className="space-y-4">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 rounded bg-surface p-4 border-ghost"
                >
                  <div className="flex-shrink-0 text-brand-500">{c.icon}</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">{c.label}</div>
                    <div className="text-sm font-medium text-neutral-800">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="rounded bg-brand-gradient p-10 text-white">
            <h3 className="mb-4 text-xl font-bold">Hiring? We Can Help.</h3>
            <p className="mb-6 text-white/80 text-sm leading-relaxed">
              Tell us about the role you&apos;re looking to fill and we&apos;ll get back to you with a shortlist of qualified candidates within 72 hours.
            </p>
            <a
              href="mailto:flavour.hr.airhis@gmail.com"
              className="inline-block rounded bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition-opacity hover:opacity-90"
            >
              Send a Hiring Brief
            </a>

            <hr className="my-8 border-white/20" />

            <h3 className="mb-4 text-xl font-bold">Looking for a Job?</h3>
            <p className="mb-6 text-white/80 text-sm leading-relaxed">
              Browse our current openings and apply directly. New roles are posted weekly.
            </p>
            <a
              href="/jobs"
              className="inline-block rounded border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
