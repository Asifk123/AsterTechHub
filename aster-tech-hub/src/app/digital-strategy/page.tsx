import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Strategy & Consulting – Aster Tech Hub | Growth-Driven Solutions",
  description: "Accelerate your business growth with Aster Tech Hub's data-driven digital strategies. Expert consulting for SEO, marketing, and digital transformation.",
  keywords: ["digital strategy India", "IT consulting Davangere", "business growth strategy", "marketing automation", "digital transformation consulting"],
  openGraph: {
    title: "Digital Strategy & Consulting – Aster Tech Hub",
    description: "Transform your business with expert digital consulting and growth strategies from Aster Tech Hub.",
    url: "https://astertechhub.com/digital-strategy",
    siteName: "Aster Tech Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://astertechhub.com/digital-strategy" },
};

export default function DigitalStrategy() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 mb-4 rounded-full border border-green-400/20 bg-green-400/5 text-green-400 text-xs font-headline tracking-widest uppercase">
            Strategy & Consulting
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight mb-4 leading-tight">
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary">Strategy</span>
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your business with data-driven digital strategies that deliver measurable growth and lasting competitive advantage.
          </p>
        </div>
      </section>

      {/* Strategy Overview */}
      <div className="space-y-24 pb-24">

        {/* Discovery & Analysis */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-green-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Phase 01</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Discovery & Analysis</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                We dive deep into understanding your business, audience, and market landscape to build a strategy that actually works.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Business Goal Analysis & KPI Definition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Target Audience Research & Segmentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Competitor Benchmarking & Market Positioning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Digital Audit (Website, SEO, Social presence)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Opportunity Mapping & Growth Channels</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-green-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-green-400/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-green-400 relative">search</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">analytics</span>
                    <span className="text-[10px] text-on-surface-variant">Audit</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">group</span>
                    <span className="text-[10px] text-on-surface-variant">Research</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">compare</span>
                    <span className="text-[10px] text-on-surface-variant">Compare</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Strategy */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-green-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-green-400/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-green-400 relative">campaign</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">share</span>
                    <span className="text-[10px] text-on-surface-variant">Social</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">trending_up</span>
                    <span className="text-[10px] text-on-surface-variant">Growth</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">mail</span>
                    <span className="text-[10px] text-on-surface-variant">Email</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-green-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Phase 02</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Marketing Strategy</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Comprehensive digital marketing plans tailored to your audience, budget, and business objectives.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Search Engine Optimization (SEO) Strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Social Media Content Strategy & Calendar</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Paid Advertising (Google Ads, Meta Ads)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Email Marketing & Automation Flows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Content Marketing & Distribution Plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Influencer & Partnership Strategy</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Analytics & Reporting */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-green-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Phase 03</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Analytics & Reporting</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Track, measure, and optimize your digital presence with comprehensive analytics and actionable insights.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">KPI Tracking & Performance Dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Google Analytics & Tag Manager Setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Monthly Performance Reports with Insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">ROI Measurement & Attribution Modeling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">A/B Testing Strategy & Implementation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Conversion Rate Optimization (CRO)</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-green-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-green-400/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-green-400 relative">bar_chart</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">dashboard</span>
                    <span className="text-[10px] text-on-surface-variant">Dashboard</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">insights</span>
                    <span className="text-[10px] text-on-surface-variant">Insights</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">assessment</span>
                    <span className="text-[10px] text-on-surface-variant">Reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Management */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-green-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-xl border border-green-400/20 glass-panel p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full"></div>
                      <span className="material-symbols-outlined text-7xl text-green-400 relative">ads_click</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">ads_click</span>
                    <span className="text-[10px] text-on-surface-variant">Google</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">public</span>
                    <span className="text-[10px] text-on-surface-variant">Meta</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center aspect-square hover:bg-surface-container-high transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-2xl text-green-400 mb-1">replay</span>
                    <span className="text-[10px] text-on-surface-variant">Retarget</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-green-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Phase 04</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 tracking-tight">Campaign Management</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                End-to-end campaign planning and management across all major digital advertising platforms.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Paid Search Campaigns (Google Ads)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Social Media Advertising (Meta, Instagram)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Retargeting & Remarketing Campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Lead Generation Funnels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Budget Optimization & Bid Management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-on-surface-variant text-sm">Campaign A/B Testing & Iteration</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-green-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">How We Work</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your business goals and challenges", icon: "search" },
              { step: "02", title: "Strategy", desc: "Building a customized digital roadmap", icon: "route" },
              { step: "03", title: "Implementation", desc: "Executing the plan across channels", icon: "build" },
              { step: "04", title: "Monitoring", desc: "Tracking performance and gathering data", icon: "monitoring" },
              { step: "05", title: "Optimization", desc: "Continuous improvement based on insights", icon: "trending_up" },
            ].map((item) => (
              <div key={item.step} className="relative group flex flex-col h-full">
                <div className="absolute -inset-4 bg-green-400/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex-1 overflow-hidden rounded-xl border border-green-400/20 glass-panel p-6 text-center hover:border-green-400/40 transition-colors flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-green-400 mb-4 block">{item.icon}</span>
                  <div className="text-xs text-green-400 font-headline tracking-widest mb-2">{item.step}</div>
                  <h3 className="text-lg font-headline font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-green-400 font-headline text-xs tracking-[0.3em] uppercase mb-4 block">Technologies</span>
            <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">Tools We Use</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Google Analytics", icon: "analytics" },
              { name: "Google Ads", icon: "ads_click" },
              { name: "Meta Business Suite", icon: "public" },
              { name: "Ahrefs", icon: "link" },
              { name: "SEMrush", icon: "search" },
              { name: "Mailchimp", icon: "mail" },
              { name: "HubSpot", icon: "campaign" },
              { name: "Hootsuite", icon: "schedule" },
            ].map((tool) => (
              <div key={tool.name} className="bg-surface-container-low rounded-lg p-4 flex items-center gap-3 hover:bg-surface-container-high transition-colors border border-white/5">
                <span className="material-symbols-outlined text-xl text-green-400">{tool.icon}</span>
                <span className="text-sm font-headline">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
