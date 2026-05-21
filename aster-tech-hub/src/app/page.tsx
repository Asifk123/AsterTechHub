import Link from "next/link";
import Image from "next/image";
import AnimatedStats from "@/components/AnimatedStats";
import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/sanitize";

export const metadata: Metadata = {
  title: "Aster Tech Hub | Empower Your Business With Innovative IT Solutions",
  description: "Empower your business with cutting-edge web development, AI, digital marketing and more. Explore our portfolio and sign up for a free consultation.",
  keywords: ["web development India", "IT services Davangere", "digital marketing agency", "AI solutions", "Aster Tech Hub"],
  openGraph: {
    title: "Aster Tech Hub | Innovative IT & Digital Solutions",
    description: "Empower your business with cutting-edge web development, AI, digital marketing and more.",
    url: "https://astertechhub.com",
    siteName: "Aster Tech Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://astertechhub.com" },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aster Tech Hub",
  "url": "https://astertechhub.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://astertechhub.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Aster Tech Hub",
    "url": "https://astertechhub.com",
    "logo": { "@type": "ImageObject", "url": "https://astertechhub.com/favicon.png" },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Davangere",
      "addressRegion": "Karnataka",
      "postalCode": "577001",
      "addressCountry": "IN"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": "14.4663", "longitude": "75.9238" },
    "sameAs": ["https://instagram.com/astertechhub", "https://linkedin.com/company/astertechhub"]
  }
};

export default function Home() {
  return (
    <>
      {/* JSON-LD: WebSite + Organization Schema (SEO/AEO/GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeSchema) }}
      />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-secondary/10 rounded-full blur-[150px]"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-headline tracking-widest uppercase text-on-surface-variant">
              Innovation Frontier
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-headline font-black tracking-tight mb-4 md:mb-6 leading-tight text-on-surface">
            Empower Your Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">
              With Aster Tech
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl lg:text-2xl text-on-surface-variant max-w-3xl mx-auto mb-8 md:mb-12 font-light px-4">
            IT Services | Digital Marketing | Innovation Hub
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link
              href="/consultation"
              className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest rounded-md shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:scale-105 transition-all duration-300 text-sm md:text-base"
            >
              Free Consultation
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 glass-panel border border-white/10 text-primary font-headline font-bold uppercase tracking-widest rounded-md hover:bg-white/5 hover:border-primary/50 transition-all duration-300 text-sm md:text-base"
            >
              View Projects
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant opacity-50">
            Discovery
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Stats Row */}
      <AnimatedStats />

      {/* Services Grid */}
      <section className="py-16 md:py-24 lg:py-32 relative bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
            <div className="max-w-2xl px-2 md:px-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-4 md:mb-6">
                Our Capabilities
              </h2>
              <p className="text-on-surface-variant text-base lg:text-lg leading-relaxed">
                We don&apos;t just build software; we engineer digital experiences
                that push the boundaries of what&apos;s possible in the modern tech
                landscape.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-[2px] bg-gradient-to-r from-primary to-transparent mb-2"></div>
              <span className="text-xs font-headline uppercase tracking-tighter text-on-surface-variant">
                Precision Engineering
              </span>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {/* Web Dev Card */}
            <div className="glass-panel group p-8 rounded-xl border border-white/5 hover:border-sky-400/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
              <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-sky-400/10 text-sky-400 flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">code</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Web Dev</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                High-performance architectural web solutions built for scale and
                speed.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all font-headline mt-auto pt-4"
              >
                Explore{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* App Dev Card */}
            <div className="glass-panel group p-8 rounded-xl border border-white/5 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
              <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-secondary/10 text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">smartphone</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">App Dev</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Seamless cross-platform mobile experiences with native performance.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all font-headline mt-auto pt-4"
              >
                Explore{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Data Science Card */}
            <div className="glass-panel group p-8 rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
              <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">analytics</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Data Science</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Transform raw data into actionable intelligence with custom AI models.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all font-headline mt-auto pt-4"
              >
                Explore{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Digital Marketing Card */}
            <div className="glass-panel group p-8 rounded-xl border border-white/5 hover:border-green-400/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
              <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-green-400/10 text-green-400 flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">campaign</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">
                Digital Marketing
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Strategic growth hacking and performance marketing that delivers ROI.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all font-headline mt-auto pt-4"
              >
                Explore{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Cyber Security Card */}
            <div className="glass-panel group p-8 rounded-xl border border-white/5 hover:border-red-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
              <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-red-500/10 text-red-400 flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">security</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Cyber Security</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Enterprise-grade security audits, threat monitoring, and robust penetration testing.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all font-headline mt-auto pt-4"
              >
                Explore{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Asymmetric Showcase Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="md:col-span-5">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold mb-6 md:mb-8">
              Beyond Digital Transformation
            </h2>
            <div className="space-y-6 md:space-y-8">
              <div className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded bg-surface-container-highest flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <div>
                  <h5 className="font-headline font-bold mb-1 md:mb-2">Cognitive Strategy</h5>
                  <p className="text-on-surface-variant text-sm">We think three steps ahead of the market trends to ensure your business remains relevant.</p>
                </div>
              </div>
              <div className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded bg-surface-container-highest flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-secondary">rocket_launch</span>
                </div>
                <div>
                  <h5 className="font-headline font-bold mb-1 md:mb-2">Rapid Deployment</h5>
                  <p className="text-on-surface-variant text-sm">Our agile methodology allows for warp-speed deployment without sacrificing precision.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="md:col-span-7 relative">
            <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group cursor-pointer">
              <Image 
                src="/project-helios.png" 
                alt="Project Helios Concept" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              {/* Animated Status Badge */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,212,255,0.8)]"></span>
                  <span className="text-[10px] font-headline uppercase tracking-widest text-white">Live in Labs</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-full pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[10px] md:text-xs font-headline uppercase tracking-widest text-primary">Internal R&D</div>
                  <div className="w-12 h-[1px] bg-primary/50"></div>
                </div>
                <h4 className="text-xl md:text-3xl font-headline font-bold mb-2">Project Helios</h4>
                <p className="text-xs md:text-sm text-on-surface-variant max-w-md hidden md:block group-hover:text-white transition-colors duration-300">
                  A revolutionary cognitive AI engine powering next-generation predictive modeling.
                </p>
                
                {/* Tech Tags */}
                <div className="flex gap-2 mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-[9px] uppercase tracking-wider px-2 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/10">Neural Nets</span>
                  <span className="text-[9px] uppercase tracking-wider px-2 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/10">Quantum Ready</span>
                  <span className="text-[9px] uppercase tracking-wider px-2 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/10">[REDACTED]</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 md:-top-12 -right-8 md:-right-12 w-48 md:w-64 h-48 md:h-64 bg-primary/20 blur-[100px] -z-10 group-hover:bg-primary/30 transition-colors duration-700"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32 text-center px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-headline font-bold mb-4 md:mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
            Join the ranks of global innovators who have scaled their vision with Aster Tech Hub&apos;s elite engineering.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link href="/consultation" className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:scale-105 transition-transform font-headline text-sm md:text-base">
              Start Your Project
            </Link>
            <Link href="/projects" className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 border border-outline-variant text-primary font-bold rounded-lg hover:bg-white/5 transition-colors font-headline uppercase text-xs md:text-sm tracking-widest">
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
