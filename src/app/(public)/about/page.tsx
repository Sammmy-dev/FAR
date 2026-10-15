import type { Metadata } from "next";
import Link from "next/link";
import {
  HiUserGroup,
  HiOfficeBuilding,
  HiClipboardList,
  HiAcademicCap,
  HiTrendingUp,
  HiLibrary,
  HiCheckCircle,
  HiEye,
  HiHeart,
  HiLightningBolt,
  HiShieldCheck,
  HiStar,
} from "react-icons/hi";

export const metadata: Metadata = {
  title: "About FAR | Flavour Airhis Resources",
  description:
    "Learn about Flavour Airhis Resources (FAR) — a Nigerian business solutions firm specialising in talent recruitment, workforce deployment, project management, training & development, and business management consulting.",
};

const STATS = [
  { value: "500+", label: "Employees Deployed" },
  { value: "80+", label: "Client Companies" },
  { value: "10+", label: "Years of Experience" },
  { value: "98%", label: "Client Retention Rate" },
];

const VALUES = [
  {
    icon: <HiShieldCheck className="h-6 w-6" />,
    title: "Integrity",
    description:
      "We operate with complete transparency in every engagement — clients, candidates, and employees can always trust our word.",
  },
  {
    icon: <HiStar className="h-6 w-6" />,
    title: "Excellence",
    description:
      "We hold every placement, project, and training programme to the highest standard. Good enough is never good enough for FAR.",
  },
  {
    icon: <HiHeart className="h-6 w-6" />,
    title: "People First",
    description:
      "Whether it's a candidate's career or a client's workforce, we make decisions with the human impact at the centre.",
  },
  {
    icon: <HiLightningBolt className="h-6 w-6" />,
    title: "Agility",
    description:
      "Business needs shift fast. Our processes are built to respond quickly — deploying solutions without sacrificing quality.",
  },
];

const SERVICES_SUMMARY = [
  {
    icon: <HiUserGroup className="h-6 w-6" />,
    title: "Talent Recruitment",
    description: "Sourcing, screening, and placing the right candidates for your roles.",
  },
  {
    icon: <HiOfficeBuilding className="h-6 w-6" />,
    title: "Workforce Deployment",
    description: "Deploying staff directly to your site with FAR as the employer of record.",
  },
  {
    icon: <HiClipboardList className="h-6 w-6" />,
    title: "Project Management",
    description: "End-to-end management of complex initiatives on scope, time, and budget.",
  },
  {
    icon: <HiAcademicCap className="h-6 w-6" />,
    title: "Training & Development",
    description: "Tailored learning programmes that build technical skills and leadership capacity.",
  },
  {
    icon: <HiTrendingUp className="h-6 w-6" />,
    title: "Business Management",
    description: "Consulting that streamlines operations and implements growth strategies.",
  },
  {
    icon: <HiLibrary className="h-6 w-6" />,
    title: "HR Advisory",
    description: "Expert guidance on workforce strategy, compliance, and organisational design.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient py-24 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
            Who We Are
          </p>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight sm:text-6xl">
            Flavour Airhis Resources
          </h1>
          <p className="max-w-2xl text-lg text-white/80 leading-relaxed">
            A Nigerian business solutions firm committed to powering organisations through people, projects, and strategy.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-surface-lowest">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
                Our Story
              </p>
              <h2 className="mb-8 text-4xl font-extrabold text-neutral-900 leading-tight">
                Built on a Simple Belief:<br />People Drive Everything
              </h2>
              <p className="mb-4 text-neutral-700 leading-relaxed">
                <strong className="text-neutral-900">Flavour Airhis Resources (FAR)</strong> was founded with a clear conviction — that Nigerian businesses deserve a partner who understands the full complexity of building and sustaining a high-performing organisation.
              </p>
              <p className="mb-4 text-neutral-700 leading-relaxed">
                What began as a staffing and recruitment agency quickly evolved as our clients asked for more. They needed project delivery expertise, structured training for their teams, and strategic guidance to manage their operations efficiently. FAR answered that call.
              </p>
              <p className="mb-4 text-neutral-700 leading-relaxed">
                Today we are a multi-disciplinary business solutions firm. We recruit and deploy skilled professionals, manage complex projects, develop internal talent, and consult on business strategy — all under one roof, and all with the same relentless commitment to quality.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Our clients span finance, technology, manufacturing, retail, and professional services. From Lagos to regional offices across Nigeria, FAR-backed teams are delivering results every day.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {STATS.map((stat) => (
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

      {/* Mission & Vision */}
      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded bg-brand-gradient p-10 text-white">
              <div className="mb-4 inline-flex rounded bg-white/10 p-3">
                <HiCheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-extrabold">Our Mission</h3>
              <p className="text-white/85 leading-relaxed">
                To empower Nigerian organisations with the people, processes, and capabilities they need to achieve their goals — delivering recruitment, deployment, project management, training, and business consulting with the highest standard of professionalism and integrity.
              </p>
            </div>
            <div className="rounded bg-surface-lowest p-10">
              <div className="mb-4 inline-flex rounded bg-brand-50 p-3 text-brand-500">
                <HiEye className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-extrabold text-neutral-900">Our Vision</h3>
              <p className="text-neutral-700 leading-relaxed">
                To be Africa&apos;s most trusted business solutions partner — recognised for transforming organisations through exceptional talent, disciplined project execution, and strategic insight that creates lasting competitive advantage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-surface-lowest">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
              What Guides Us
            </p>
            <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
              Our Core Values
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded bg-surface p-7 border-ghost"
              >
                <div className="mb-4 inline-flex rounded bg-brand-50 p-3 text-brand-500">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-neutral-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
              What We Offer
            </p>
            <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
              Our Service Areas
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-neutral-700">
              Six interconnected disciplines. One reliable partner.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_SUMMARY.map((service) => (
              <div key={service.title} className="flex items-start gap-4 rounded bg-surface-lowest p-6 border-ghost">
                <div className="flex-shrink-0 mt-0.5 inline-flex rounded bg-brand-50 p-2.5 text-brand-500">
                  {service.icon}
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-neutral-900">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-surface-lowest">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
              The People Behind FAR
            </p>
            <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
              Meet Our Team
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-neutral-700">
              Experienced professionals united by a shared commitment to excellence in everything we deliver.
            </p>
          </div>

          {/* Lead Consultant */}
          <div className="mb-10 flex justify-center">
            <div className="grid w-full max-w-5xl overflow-hidden rounded bg-brand-gradient text-white shadow-lg md:grid-cols-[260px_1fr]">
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-5 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-4 ring-white/30">
                  <img
                    src="/Victor-Ehis.jpeg"
                    alt="Victor Ehis Usifoh"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-2xl font-extrabold">Victor Ehis Usifoh</h3>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/75">
                  Lead Consultant
                </p>
                <p className="text-sm text-white/75">From Edo State, Nigeria</p>
              </div>

              <div className="border-t border-white/15 p-8 md:border-l md:border-t-0 md:p-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                  Human Resources & Business Management
                </p>
                <h4 className="mb-4 text-2xl font-bold sm:text-3xl">
                  Certified people and business development professional
                </h4>
                <div className="mb-6 flex flex-wrap gap-2">
                  {["CHRP", "SPHR", "CPLP"].map((credential) => (
                    <span
                      key={credential}
                      className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide"
                    >
                      {credential}
                    </span>
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-white/85">
                  Victor is a recruitment specialist, training and development expert, and strategic management practitioner. He is also a business management consultant, development manager, career coach, lecturer in human resource management and health and safety, and research specialist.
                </p>

                <div className="mb-6">
                  <h5 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70">
                    Education
                  </h5>
                  <p className="text-sm leading-relaxed text-white/85">
                    Graduate in Computer Science from Landmark University, Omu-Aran, Kwara State; holds a PGD in Human Resources Management and an MBA in Business Administration.
                  </p>
                </div>

                <div className="mb-6">
                  <h5 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70">
                    Specialisms
                  </h5>
                  <p className="text-sm leading-relaxed text-white/85">
                    Health, safety and environment (HSE), public speaking instruction, workplace training, and business promotion. He also manages social media for several organizations and is a member of the Chartered Institute of Human Resource Management.
                  </p>
                </div>

                <p className="border-l-2 border-white/50 pl-4 text-sm italic leading-relaxed text-white/90">
                  Passionate about capacity building, Victor is committed to redirecting young people&apos;s energy into creativity and self-sustainability.
                </p>
                <p className="mt-4 text-xs text-white/70">Victor is married.</p>
              </div>
            </div>
          </div>

          {/* Manager */}
          <div className="mb-10 flex justify-center">
            <div className="w-full max-w-sm rounded bg-surface p-8 text-center border-ghost">
              <div className="mx-auto mb-5 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-brand-50 ring-4 ring-brand-100">
                <img
                  src="/Sunday-Ayobami.jpeg"
                  alt="Sunday Ayobami"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-xl font-extrabold text-neutral-900">Sunday Ayobami</h3>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-500">
                Manager
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Oversees operations and project delivery, ensuring seamless execution and client satisfaction across all engagements.
              </p>
            </div>
          </div>

          {/* HR Assistants */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Esther Olagoke",
                image: "/Esther.jpeg",
                description:
                  "Supports talent sourcing and candidate screening, ensuring every shortlist meets the highest quality standards.",
              },
              {
                name: "Samuel Ajiboye",
                image: "/Samuel.jpeg",
                description:
                  "Coordinates employee onboarding and deployment logistics, keeping client engagements running smoothly.",
              },
              {
                name: "Comfort John Musa",
                image: "/Comfort.jpeg",
                description:
                  "Manages training programme scheduling and development tracking, helping deployed staff grow in their roles.",
              },
            ].map((member, i) => (
              <div
                key={i}
                className="rounded bg-surface p-7 text-center border-ghost"
              >
                <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-brand-50 ring-4 ring-brand-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-base font-extrabold text-neutral-900">{member.name}</h3>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-500">
                  HR Assistant
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-gradient text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
            Ready to Work With FAR?
          </h2>
          <p className="mb-8 text-white/80 text-lg">
            Whether you need to hire, deploy, train, or transform — we&apos;re ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/home#contact"
              className="rounded border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
