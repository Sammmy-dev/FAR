import { HiStar } from "react-icons/hi";

const TESTIMONIALS = [
  {
    name: "Chukwuemeka Obi",
    title: "Head of Operations",
    company: "Meridian Finance Ltd",
    quote:
      "FAR transformed how we build our workforce. Within three weeks of briefing them, we had four exceptional candidates on-site. The quality of screening was far above what we'd experienced elsewhere.",
    rating: 5,
  },
  {
    name: "Amina Bello",
    title: "Managing Director",
    company: "Crestview Technologies",
    quote:
      "The project management team FAR deployed to us handled our infrastructure rollout flawlessly. On time, on budget, and with minimal disruption to our operations. I'd recommend FAR without hesitation.",
    rating: 5,
  },
  {
    name: "Taiwo Adeyemi",
    title: "HR Director",
    company: "Pinnacle Manufacturing",
    quote:
      "We enrolled our entire supervisory team in FAR's leadership development programme. The results were immediate — better communication, faster decisions, and a measurable drop in staff turnover.",
    rating: 5,
  },
  {
    name: "Ngozi Eze",
    title: "Chief Executive Officer",
    company: "Broadfield Logistics",
    quote:
      "FAR's business management consultants helped us restructure our ops division during a period of rapid growth. Their guidance was practical, data-driven, and genuinely made a difference.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-surface-lowest">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
            Client Stories
          </p>
          <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-neutral-700">
            Organisations across Nigeria trust FAR to deliver — here&apos;s what some of them have to say.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded bg-surface p-7 border-ghost"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <HiStar key={i} className="h-4 w-4 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 flex-1 text-sm leading-relaxed text-neutral-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-outline/30 pt-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-500">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">
                    {t.title}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
