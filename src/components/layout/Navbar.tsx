"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/home#services" },
  { label: "Jobs", href: "/jobs" },
  { label: "Assessments", href: "/assessments" },
  { label: "Clients", href: "/home#clients" },
  { label: "Contact", href: "/home#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(href: string) {
    setOpen(false);
    if (href.includes("#")) {
      const id = href.split("#")[1];
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled
          ? "glass border-outline/20"
          : "glass"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <Image
            src="/FAR.png"
            alt="Flavour Airhis Resources"
            width={56}
            height={46}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-brand-500 ${
                pathname === link.href ? "text-brand-500" : "text-neutral-700"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="bg-brand-gradient rounded px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Staff Login
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="glass border-t border-outline/20 px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block py-2.5 text-sm font-medium text-neutral-700 hover:text-brand-500"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="mt-3 block bg-brand-gradient rounded px-3 py-2.5 text-center text-sm font-medium text-white hover:opacity-90"
          >
            Staff Login
          </Link>
        </nav>
      )}
    </header>
  );
}
