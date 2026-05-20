import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services \u2013 Aster Tech Hub | Web Dev, AI, Digital Marketing & More",
  description: "Explore Aster Tech Hub's full-service offerings: custom web development, mobile apps, data science, digital marketing, and cybersecurity \u2014 built for startups to enterprises.",
  keywords: ["web development India", "app development Davangere", "digital marketing agency", "AI solutions", "cybersecurity services", "Aster Tech Hub services"],
  openGraph: {
    title: "Our Services \u2013 Aster Tech Hub",
    description: "From web apps to AI and cybersecurity \u2014 Aster Tech Hub offers end-to-end digital solutions for businesses worldwide.",
    url: "https://astertechhub.com/services",
    siteName: "Aster Tech Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://astertechhub.com/services" },
};

export default function Services() {
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Aster Tech Hub Services",
    "url": "https://astertechhub.com/services",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "item": { "@type": "Service", "name": "Web Development", "description": "Custom, high-performance web applications built with modern frameworks.", "provider": { "@type": "Organization", "name": "Aster Tech Hub" }, "areaServed": "Worldwide", "serviceType": "Web Development" } },
      { "@type": "ListItem", "position": 2, "item": { "@type": "Service", "name": "App & Software Development", "description": "Cross-platform mobile and desktop software tailored to your business.", "provider": { "@type": "Organization", "name": "Aster Tech Hub" }, "areaServed": "Worldwide", "serviceType": "Software Development" } },
      { "@type": "ListItem", "position": 3, "item": { "@type": "Service", "name": "Data Analysis & AI", "description": "Turn raw data into actionable business intelligence with custom AI models.", "provider": { "@type": "Organization", "name": "Aster Tech Hub" }, "areaServed": "Worldwide", "serviceType": "Data Science" } },
      { "@type": "ListItem", "position": 4, "item": { "@type": "Service", "name": "Digital Marketing", "description": "Performance-driven digital marketing campaigns that generate measurable ROI.", "provider": { "@type": "Organization", "name": "Aster Tech Hub" }, "areaServed": "Worldwide", "serviceType": "Digital Marketing" } },
      { "@type": "ListItem", "position": 5, "item": { "@type": "Service", "name": "Cyber Security", "description": "Enterprise-grade security audits, pen-testing, and continuous monitoring.", "provider": { "@type": "Organization", "name": "Aster Tech Hub" }, "areaServed": "Worldwide", "serviceType": "Cybersecurity" } }
    ]
  };

  return (
    <>
      {/* JSON-LD: Service Schema (AEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[300px] md:min-h-[450px] flex items-center justify-center px-4 md:px-6 py-12 md:py-20 overflow-hidden">
        {/* Abstract Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-headline tracking-widest uppercase shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Our Expertise
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-black tracking-tight mb-6 leading-tight">
            Architecting the <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Digital Frontier</span>
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            We combine high-fidelity design with advanced engineering to build solutions that define the future.
          </p>
        </div>
      </section>

      {/* Pulse Tracer Separator */}
      <div className="w-full max-w-6xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent relative mb-16 md:mb-24">
         <div className="absolute top-0 left-1/4 w-1/4 h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_10px_rgba(0,212,255,0.8)]"></div>
      </div>

      {/* Services Details */}
      <div className="space-y-16 md:space-y-24 pb-16 md:pb-24">

        {/* Web Development */}
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-primary font-headline text-xs tracking-[0.3em] uppercase mb-4 block">System 01</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Web Development</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                End-to-end web solutions covering everything from frontend to backend, designed to scale with your business.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Custom Website & Web Application Development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">E-Commerce & Shopping Cart Solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">CMS Development & Integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">API Development & Third-party Integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Website Maintenance & Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Performance Optimization & SEO</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-primary/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative group/main">
                      <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover/main:bg-primary/50 transition-colors duration-500"></div>
                      <span className="material-symbols-outlined text-7xl text-primary relative group-hover/main:scale-110 transition-transform duration-500">code</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-primary mb-1 group-hover/icon:scale-110 transition-transform">web</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-primary transition-colors">Frontend</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-secondary/30 hover:shadow-[0_0_15px_rgba(217,185,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1 group-hover/icon:scale-110 transition-transform">dns</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-secondary transition-colors">Backend</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-primary-container/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-primary-container mb-1 group-hover/icon:scale-110 transition-transform">storage</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-primary-container transition-colors">Database</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App & Software Development */}
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-secondary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-secondary/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative group/main">
                      <div className="absolute inset-0 bg-secondary/30 blur-xl rounded-full group-hover/main:bg-secondary/50 transition-colors duration-500"></div>
                      <span className="material-symbols-outlined text-7xl text-secondary relative group-hover/main:scale-110 transition-transform duration-500">smartphone</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-secondary/30 hover:shadow-[0_0_15px_rgba(217,185,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1 group-hover/icon:scale-110 transition-transform">phone_android</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-secondary transition-colors">Android</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-primary mb-1 group-hover/icon:scale-110 transition-transform">phone_iphone</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-primary transition-colors">iOS</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-secondary-container/30 hover:shadow-[0_0_15px_rgba(217,185,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-secondary-container mb-1 group-hover/icon:scale-110 transition-transform">apps</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-secondary-container transition-colors">Custom</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-secondary font-headline text-xs tracking-[0.3em] uppercase mb-4 block">System 02</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">App & Software Development</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Mobile applications and custom software solutions tailored to meet your specific business requirements.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Mobile App Development (Android & iOS)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Cross-Platform Apps (Flutter & React Native)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Custom Software Solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Business Process Automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Enterprise Software Integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">App Maintenance & Updates</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Analysis & Intelligence */}
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-primary-container font-headline text-xs tracking-[0.3em] uppercase mb-4 block">System 03</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Data Analysis & Intelligence</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Transform raw data into actionable insights with ML models, visualizations, and intelligent dashboards.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Machine Learning Models & AI Solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Data Analysis & Processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Data Visualization & Reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Dashboard Creation & Monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Predictive Analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Data Science Consulting</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-primary-container/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-primary-container/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative group/main">
                      <div className="absolute inset-0 bg-primary-container/30 blur-xl rounded-full group-hover/main:bg-primary-container/50 transition-colors duration-500"></div>
                      <span className="material-symbols-outlined text-7xl text-primary-container relative group-hover/main:scale-110 transition-transform duration-500">analytics</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-primary-container/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-primary-container mb-1 group-hover/icon:scale-110 transition-transform">psychology</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-primary-container transition-colors">ML/AI</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-primary mb-1 group-hover/icon:scale-110 transition-transform">bar_chart</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-primary transition-colors">Analysis</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-secondary/30 hover:shadow-[0_0_15px_rgba(217,185,255,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1 group-hover/icon:scale-110 transition-transform">dashboard</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-secondary transition-colors">Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Marketing */}
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-green-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-green-400/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative group/main">
                      <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full group-hover/main:bg-green-400/50 transition-colors duration-500"></div>
                      <span className="material-symbols-outlined text-7xl text-green-400 relative group-hover/main:scale-110 transition-transform duration-500">campaign</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-green-400/30 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1 group-hover/icon:scale-110 transition-transform">share</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-green-400 transition-colors">Social</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-green-400/30 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1 group-hover/icon:scale-110 transition-transform">trending_up</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-green-400 transition-colors">Growth</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-green-400/30 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1 group-hover/icon:scale-110 transition-transform">mail</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-green-400 transition-colors">Email</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-primary font-headline text-xs tracking-[0.3em] uppercase mb-4 block">System 04</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Digital Marketing & Social Media</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Comprehensive digital marketing solutions to boost your online presence and drive measurable growth.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Social Media Management & Handling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Advertising Campaigns (Google, Meta, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Search Engine Optimization (SEO)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Content Marketing Strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Email Marketing Campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Analytics & Performance Reports</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cyber Security */}
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-red-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">System 05</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Cyber Security</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Protect your digital assets with enterprise-grade security solutions, threat monitoring, and vulnerability assessments.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Threat Detection & Prevention Systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Vulnerability Assessment & Penetration Testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Network Security & Firewalls</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Data Encryption & Privacy Solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Security Audits & Compliance (GDPR, ISO)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">24/7 Security Monitoring & Incident Response</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-red-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-red-400/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative group/main">
                      <div className="absolute inset-0 bg-red-400/30 blur-xl rounded-full group-hover/main:bg-red-400/50 transition-colors duration-500"></div>
                      <span className="material-symbols-outlined text-7xl text-red-400 relative group-hover/main:scale-110 transition-transform duration-500">security</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-red-400/30 hover:shadow-[0_0_15px_rgba(248,113,113,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-red-400 mb-1 group-hover/icon:scale-110 transition-transform"> vpn_lock</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-red-400 transition-colors">Firewall</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-red-400/30 hover:shadow-[0_0_15px_rgba(248,113,113,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-red-400 mb-1 group-hover/icon:scale-110 transition-transform">shield</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-red-400 transition-colors">Defense</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-all duration-300 border border-white/5 hover:border-red-400/30 hover:shadow-[0_0_15px_rgba(248,113,113,0.2)] hover:-translate-y-1 group/icon">
                    <span className="material-symbols-outlined text-2xl text-red-400 mb-1 group-hover/icon:scale-110 transition-transform">monitor_heart</span>
                    <span className="text-[10px] text-on-surface-variant group-hover/icon:text-red-400 transition-colors">Monitor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-t border-white/5 bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-6">
            Ready to Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Future?</span>
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Choose the right services for your business and let our expert team architect a digital solution that drives real growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/consultation"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:shadow-[0_0_50px_rgba(0,212,255,0.4)] hover:-translate-y-1 transition-all font-headline uppercase tracking-widest text-xs"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-4 border border-white/10 text-primary font-bold rounded-xl hover:bg-white/5 transition-all font-headline uppercase tracking-widest text-xs"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
