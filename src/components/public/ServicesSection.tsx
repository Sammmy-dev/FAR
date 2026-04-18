import { HiUserGroup, HiOfficeBuilding, HiShieldCheck, HiLibrary, HiLightningBolt, HiAcademicCap } from "react-icons/hi";

const SERVICES = [
  {
    icon: <HiUserGroup className="h-7 w-7" />,
    title: "Talent Recruitment",
    description:
      "We source, screen, and shortlist top candidates tailored to your specific role requirements — saving you time and reducing mis-hires.",
  },
  {
    icon: <HiOfficeBuilding className="h-7 w-7" />,
    title: "Workforce Deployment",
    description:
      "FAR acts as the employer of record, deploying staff directly to your business so you benefit from skilled labour without the administrative overhead.",
  },
  {
    icon: <HiShieldCheck className="h-7 w-7" />,
    title: "Compliance & Payroll",
    description:
      "We manage employment contracts, statutory deductions (PAYE, pension, NHF), and payroll processing — ensuring your workforce stays compliant.",
  },
  {
    icon: <HiLibrary className="h-7 w-7" />,
    title: "HR Advisory",
    description:
      "Need guidance on workforce strategy, org structure, or performance frameworks? Our HR experts provide actionable advice for businesses of all sizes.",
  },
  {
    icon: <HiLightningBolt className="h-7 w-7" />,
    title: "Executive Search",
    description:
      "For C-suite and director-level positions, our dedicated executive search practice identifies passive talent that won't appear on a job board.",
  },
  {
    icon: <HiAcademicCap className="h-7 w-7" />,
    title: "Training & Development",
    description:
      "We run tailored training programmes — technical, soft-skills, and leadership — to upskill your existing workforce and newly deployed staff.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">What We Do</p>
          <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
            End-to-End HR &amp; Staffing Solutions
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-neutral-700">
            From first-round interviews to ongoing payroll management, FAR covers every stage of the talent lifecycle.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded bg-surface-lowest p-7 border-ghost"
            >
              <div className="mb-5 inline-flex rounded bg-brand-50 p-3 text-brand-500">
                {service.icon}
              </div>
              <h3 className="mb-2 text-base font-bold text-neutral-900">{service.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-700">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
