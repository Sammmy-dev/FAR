import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Image
              src="/FAR.png"
              alt="Flavour Airhis Resources"
              width={64}
              height={52}
              className="object-contain brightness-[10]"
            />
            <p className="mt-3 text-sm leading-relaxed">
              Flavour Airhis Resources — connecting Nigerian businesses with exceptional talent.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/home#about" className="hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="/home#services" className="hover:text-brand-400 transition-colors">Services</a></li>
              <li><a href="/jobs" className="hover:text-brand-400 transition-colors">Open Positions</a></li>
              <li><a href="/home#contact" className="hover:text-brand-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:info@farng.com" className="hover:text-brand-400 transition-colors">
                  info@farng.com
                </a>
              </li>
              <li>
                <a href="tel:+2348000000000" className="hover:text-brand-400 transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li>Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          &copy; {year} Flavour Airhis Resources. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
