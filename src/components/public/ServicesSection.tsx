import {
  HiUserGroup,
  HiOfficeBuilding,
  HiClipboardList,
  HiAcademicCap,
  HiTrendingUp,
  HiLibrary,
} from "react-icons/hi";

const SERVICES = [
  {
    icon: <HiUserGroup className="h-7 w-7" />,
    title: "Talent Recruitment",
    description:
      "We source, screen, and shortlist top candidates tailored to your specific role requirements — saving you time and reducing mis-hires across all industries.",
  },
  {
    icon: <HiOfficeBuilding className="h-7 w-7" />,
    title: "Workforce Deployment",
    description:
      "FAR acts as the employer of record, deploying skilled staff directly to your business so you benefit from expert labour without the administrative overhead.",
  },
  {
    icon: <HiClipboardList className="h-7 w-7" />,
    title: "Project Management",
    description:
      "From initiation to delivery, our project management professionals plan, coordinate, and execute complex initiatives — keeping your projects on scope, time, and budget.",
  },
  {
    icon: <HiAcademicCap className="h-7 w-7" />,
    title: "Training & Development",
    description:
      "We design and deliver tailored training programmes — technical skills, soft skills, and leadership development — to upskill your workforce and drive performance.",
  },
  {
    icon: <HiTrendingUp className="h-7 w-7" />,
    title: "Business Management",
    description:
      "Our business management consultants help organisations streamline operations, optimise processes, and implement strategies that unlock sustainable growth.",
  },
  {
    icon: <HiLibrary className="h-7 w-7" />,
    title: "HR Advisory",
    description:
      "Need expert guidance on workforce strategy, organisational design, or compliance? Our HR advisors provide actionable insights tailored to your business stage.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">What We Do</p>
          <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
            Comprehensive Business Solutions
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-neutral-700">
            From talent acquisition and workforce deployment to project management and business consulting, FAR delivers end-to-end solutions that drive organisational success.
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
