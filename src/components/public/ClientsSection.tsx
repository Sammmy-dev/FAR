import Image from "next/image";

const PARTNER_LOGOS = [
  { name: "Partner 1", src: "/partner1.jpg" },
  { name: "Partner 2", src: "/partner2.jpg" },
  { name: "Partner 3", src: "/partner3.jpg" },
  { name: "Partner 4", src: "/partner4.jpg" },
  { name: "Partner 5", src: "/partner5.png" },
];

export default async function ClientsSection() {
  return (
    <section id="clients" className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
            Trusted By
          </p>
          <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
            Our Client Partners
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-neutral-700">
            Leading Nigerian businesses rely on FAR to deliver the talent that drives their growth.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PARTNER_LOGOS.map((partner) => (
            <div
              key={partner.src}
              className="flex h-24 items-center justify-center rounded bg-surface-lowest p-3 border-ghost"
              title={partner.name}
            >
              <div className="relative h-full w-full">
                <Image
                  src={partner.src}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
