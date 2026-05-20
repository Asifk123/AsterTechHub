import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us – Aster Tech Hub | Our Story, Team & Values",
  description: "Learn about Aster Tech Hub — our founders, mission, core values, and the talented team behind innovative IT solutions, web development, and digital marketing services.",
  keywords: ["Aster Tech Hub", "about us", "IT company Davangere", "web development team India", "digital agency founders"],
  openGraph: {
    title: "About Us – Aster Tech Hub",
    description: "Meet the team driving digital innovation at Aster Tech Hub — from AI and web development to digital marketing.",
    url: "https://astertechhub.com/about",
    siteName: "Aster Tech Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://astertechhub.com/about" },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Aster Tech Hub",
  "url": "https://astertechhub.com/about",
  "description": "Aster Tech Hub is a full-service digital agency based in Davangere, Karnataka, offering web development, AI, digital marketing and cybersecurity solutions.",
  "publisher": {
    "@type": "Organization",
    "name": "Aster Tech Hub",
    "url": "https://astertechhub.com",
    "foundingDate": "2023",
    "founders": [
      { "@type": "Person", "name": "Asif K", "jobTitle": "CEO & Founder" },
      { "@type": "Person", "name": "Buden Sab I", "jobTitle": "Managing Director" },
      { "@type": "Person", "name": "Manjunath N", "jobTitle": "Operations Director" }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Davangere",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": "14.4663", "longitude": "75.9238" },
    "areaServed": "Worldwide"
  }
};

export default function About() {
  return (
    <>
      {/* JSON-LD: AboutPage + Organization + Founders Schema (AEO/GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-24 px-4 md:px-6 pt-28 md:pt-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline mb-6">
            About <span className="text-primary">Aster Tech</span>
          </h1>
          <p className="text-base md:text-xl text-on-surface-variant max-w-3xl mx-auto">
            We craft digital experiences that push boundaries. From startups to enterprises,
            we transform ideas into powerful, scalable solutions.
          </p>
        </div>
      </section>

      {/* Pulse Tracer */}
      <div className="pulse-tracer w-full max-w-4xl mx-auto" />

      {/* Story Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-headline mb-6 text-primary">Our Story</h2>
            <p className="text-on-surface-variant mb-4">
              Founded with a passion for technology and design, Aster Tech has grown from
              a small team of developers to a full-service digital agency.
            </p>
            <p className="text-on-surface-variant">
              We believe in pushing boundaries and challenging conventions. Every project
              is an opportunity to create something extraordinary.
            </p>
          </div>
          <div className="glass-panel rounded-xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-headline text-primary mb-2">20+</div>
                <div className="text-sm text-on-surface-variant">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-headline text-secondary mb-2">20+</div>
                <div className="text-sm text-on-surface-variant">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-headline text-primary-container mb-2">98%</div>
                <div className="text-sm text-on-surface-variant">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-headline text-primary mb-2">24/7</div>
                <div className="text-sm text-on-surface-variant">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-headline mb-10 md:mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-panel rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary">lightbulb</span>
              </div>
              <h3 className="text-xl font-headline mb-3">Innovation</h3>
              <p className="text-sm text-on-surface-variant">
                We constantly push the boundaries of what's possible with cutting-edge technology.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-secondary">group</span>
              </div>
              <h3 className="text-xl font-headline mb-3">Collaboration</h3>
              <p className="text-sm text-on-surface-variant">
                Your vision is our priority. We work closely with clients to deliver exactly what they need.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary-container">verified</span>
              </div>
              <h3 className="text-xl font-headline mb-3">Quality</h3>
              <p className="text-sm text-on-surface-variant">
                We never compromise on quality. Every line of code, every design element is crafted with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Team Section */}
      <section className="py-24 px-4 md:px-6 relative overflow-hidden bg-surface-container-lowest border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.05),transparent_50%)]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">The Minds Behind <span className="text-primary">Aster Tech</span></h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-base">
              Our leadership team brings together decades of combined experience in technology, design, and business strategy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Asif K - CEO & Founder */}
            <div className="glass-panel rounded-2xl p-8 text-center group hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] transition-all duration-500">
                <span className="text-4xl font-headline text-primary font-black">AK</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-1 group-hover:text-primary transition-colors">Asif K</h3>
              <p className="text-[10px] text-primary tracking-widest uppercase mb-4 font-headline border border-primary/20 rounded-full inline-block px-3 py-1 bg-primary/10">CEO & Founder</p>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Visionary leader driving innovation and the core architect of Aster Tech Hub's digital excellence.
              </p>
            </div>

            {/* Buden Sab I - Managing Director */}
            <div className="glass-panel rounded-2xl p-8 text-center group hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20 group-hover:shadow-[0_0_30px_rgba(217,185,255,0.4)] transition-all duration-500">
                <span className="text-4xl font-headline text-secondary font-black">BS</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-1 group-hover:text-secondary transition-colors">Buden Sab I</h3>
              <p className="text-[10px] text-secondary tracking-widest uppercase mb-4 font-headline border border-secondary/20 rounded-full inline-block px-3 py-1 bg-secondary/10">Managing Director</p>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Strategic mind ensuring operational success and forging strong global client relationships.
              </p>
            </div>

            {/* Manjunath N - Operations Director */}
            <div className="glass-panel rounded-2xl p-8 text-center group hover:border-primary-container/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-container/20 to-primary-container/5 flex items-center justify-center border border-primary-container/20 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-500">
                <span className="text-4xl font-headline text-primary-container font-black">MN</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-1 group-hover:text-primary-container transition-colors">Manjunath N</h3>
              <p className="text-[10px] text-primary-container tracking-widest uppercase mb-4 font-headline border border-primary-container/20 rounded-full inline-block px-3 py-1 bg-primary-container/10">Operations Director</p>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Master of execution, transforming complex technical blueprints into flawless final products.
              </p>
            </div>

            {/* Priya N - Project Manager */}
            <div className="glass-panel rounded-2xl p-8 text-center group hover:border-white/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500">
                <span className="text-4xl font-headline text-on-surface font-black">PN</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-1 transition-colors">Priya N</h3>
              <p className="text-[10px] text-on-surface-variant tracking-widest uppercase mb-4 font-headline border border-white/10 rounded-full inline-block px-3 py-1 bg-white/5">Project Manager</p>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Keeps everything on track, ensuring on-time delivery with uncompromising quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center glass-panel rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-headline mb-4">Want to Work With Us?</h2>
          <p className="text-on-surface-variant mb-8 text-sm md:text-base">
            We're always looking for talented people and exciting projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/consultation"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-headline tracking-wide hover:opacity-90 transition-opacity text-center"
            >
              Start a Project
            </a>
            <a
              href="/consultation"
              className="w-full sm:w-auto px-8 py-4 border border-white/10 text-on-surface rounded-lg font-headline tracking-wide hover:border-primary/30 transition-colors text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
