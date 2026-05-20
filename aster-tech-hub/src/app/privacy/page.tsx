import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Aster Tech Hub | Data Protection & User Rights",
  description: "Read the Aster Tech Hub privacy policy. Learn how we collect, use, and safeguard your data, and understand your rights under data protection laws.",
  keywords: ["privacy policy", "data protection", "Aster Tech Hub legal", "user rights"],
  openGraph: {
    title: "Privacy Policy – Aster Tech Hub",
    description: "Your privacy is our priority. Read about how we handle your data and ensure secure digital experiences.",
    url: "https://astertechhub.com/privacy",
    siteName: "Aster Tech Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://astertechhub.com/privacy" },
};

export default function PrivacyPolicy() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-headline tracking-widest uppercase">
            Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight mb-4 leading-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Policy</span>
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="space-y-24 pb-24 max-w-5xl mx-auto">

        {/* Information We Collect */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-primary font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Section 01</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Information We Collect</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                We collect information you provide directly to us, as well as data from your interactions with our services.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Personal data (name, email address, phone number)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Business information (company name, industry, size)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Usage data and analytics (pages visited, time spent)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Communication preferences and feedback</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-primary/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-primary relative">person_search</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-primary mb-1">person</span>
                    <span className="text-[10px] text-on-surface-variant">Personal</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-primary mb-1">business</span>
                    <span className="text-[10px] text-on-surface-variant">Business</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-primary mb-1">insights</span>
                    <span className="text-[10px] text-on-surface-variant">Usage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-secondary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-secondary/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-secondary/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-secondary relative">handshake</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1">design_services</span>
                    <span className="text-[10px] text-on-surface-variant">Service</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1">forum</span>
                    <span className="text-[10px] text-on-surface-variant">Comm</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1">analytics</span>
                    <span className="text-[10px] text-on-surface-variant">Analytics</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-secondary font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Section 02</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">How We Use Your Information</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                We use the information we collect to deliver, improve, and personalize our services for you.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Service delivery and project fulfillment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Communication regarding your projects and inquiries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Service improvement and feature development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Marketing communications (with your consent)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-primary-container font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Section 03</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Data Protection</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                We implement industry-standard security measures to protect your personal information from unauthorized access.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">AES-256 encryption for data at rest and in transit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Secure cloud infrastructure with regular audits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Strict access control and authentication protocols</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Regular security testing and vulnerability assessments</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-primary-container/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-primary-container/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary-container/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-primary-container relative">security</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-primary-container mb-1">lock</span>
                    <span className="text-[10px] text-on-surface-variant">Encrypt</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-primary-container mb-1">cloud</span>
                    <span className="text-[10px] text-on-surface-variant">Secure</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-primary-container mb-1">verified_user</span>
                    <span className="text-[10px] text-on-surface-variant">Audit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-green-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-green-400/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-green-400 relative">gavel</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">visibility</span>
                    <span className="text-[10px] text-on-surface-variant">Access</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">delete</span>
                    <span className="text-[10px] text-on-surface-variant">Delete</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">undo</span>
                    <span className="text-[10px] text-on-surface-variant">Opt-out</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-green-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Section 04</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Your Rights</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                You have full control over your personal data. Here are your rights under data protection laws.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Right to access your personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Right to request data correction or deletion</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Right to opt-out of marketing communications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Right to data portability</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cookies Policy */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-secondary font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Section 05</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Cookies Policy</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                We use cookies to enhance your browsing experience. Learn about the types of cookies we use.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <div>
                    <span className="text-on-surface-variant text-sm font-semibold block">Essential Cookies</span>
                    <span className="text-on-surface-variant text-xs">Required for website functionality</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <div>
                    <span className="text-on-surface-variant text-sm font-semibold block">Analytics Cookies</span>
                    <span className="text-on-surface-variant text-xs">Help us understand how visitors use our site</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </span>
                  <div>
                    <span className="text-on-surface-variant text-sm font-semibold block">Marketing Cookies</span>
                    <span className="text-on-surface-variant text-xs">Used for targeted advertising (with consent)</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-secondary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-secondary/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-secondary/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-secondary relative">cookie</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1">settings</span>
                    <span className="text-[10px] text-on-surface-variant">Essential</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1">bar_chart</span>
                    <span className="text-[10px] text-on-surface-variant">Analytics</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1">campaign</span>
                    <span className="text-[10px] text-on-surface-variant">Marketing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="text-primary font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Section 06</span>
            <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight mb-6">Contact Information</h2>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mb-8">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-colors">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">mail</span>
                <p className="text-sm font-headline">contact@astertechhub.com</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-colors">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">location_on</span>
                <p className="text-sm font-headline">Davangere, Karnataka, India</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
