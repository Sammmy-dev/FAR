import type { Metadata } from "next";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import ServicesSection from "@/components/public/ServicesSection";
import FeaturedJobs from "@/components/public/FeaturedJobs";
import ClientsSection from "@/components/public/ClientsSection";
import ContactSection from "@/components/public/ContactSection";

export const metadata: Metadata = {
  title: "Home",
  description:
    "FAR helps Nigerian businesses find and deploy top talent. Browse our open positions or learn about our staffing services.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeaturedJobs />
      <ClientsSection />
      <ContactSection />
    </>
  );
}
