"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "A full-stack e-commerce solution with payment integration, inventory management, and analytics dashboard.",
    icon: "shopping_cart",
    color: "primary",
  },
  {
    id: 2,
    title: "Healthcare App",
    category: "App Development",
    description: "Cross-platform mobile app for patient management, appointment scheduling, and telemedicine consultations.",
    icon: "local_hospital",
    color: "secondary",
  },
  {
    id: 3,
    title: "Sales Analytics Dashboard",
    category: "Data Science",
    description: "ML-powered predictive analytics dashboard for real-time sales forecasting and inventory optimization.",
    icon: "analytics",
    color: "primary-container",
  },
  {
    id: 4,
    title: "Social Media Campaign",
    category: "Digital Marketing",
    description: "Comprehensive social media strategy that increased client engagement by 340% in 6 months.",
    icon: "campaign",
    color: "secondary",
  },
  {
    id: 5,
    title: "Inventory Management System",
    category: "Web Development",
    description: "Custom ERP solution with barcode scanning, automated reordering, and multi-warehouse support.",
    icon: "inventory_2",
    color: "primary",
  },
  {
    id: 6,
    title: "Fitness Tracking App",
    category: "App Development",
    description: "Wearable-integrated fitness app with personalized workout plans and nutrition tracking.",
    icon: "fitness_center",
    color: "secondary",
  },
  {
    id: 7,
    title: "Customer Churn Prediction",
    category: "Data Science",
    description: "AI model that predicts customer churn with 92% accuracy, helping retain valuable customers.",
    icon: "psychology",
    color: "primary-container",
  },
  {
    id: 8,
    title: "SEO Optimization Project",
    category: "Digital Marketing",
    description: "Technical SEO overhaul that improved organic traffic by 250% within 4 months.",
    icon: "trending_up",
    color: "secondary",
  },
  {
    id: 9,
    title: "Fintech Security Auditing",
    category: "Cyber Security",
    description: "Conducted full-scale penetration testing, vulnerability assessments, and strict ISO 27001 compliance auditing for a high-volume payments client.",
    icon: "security",
    color: "red",
  },
];

const completedProjects = [
  {
    id: "green-build",
    title: "Green Build Interiors and Construction",
    clientName: "ER. Manjunath & ER. Buden Sab",
    location: "Davangere",
    services: ["Web Development", "Maintenance", "Digital Marketing"],
    description: "A comprehensive digital presence and marketing strategy for a premier construction and interior design firm. We delivered a high-performance website and ongoing marketing campaigns to enhance brand visibility and client acquisition.",
    testimonial: "Reliable digital partner for our construction business. A comprehensive digital presence and marketing strategy for a premier construction and interior design firm. We delivered a high-performance website and ongoing marketing campaigns to enhance brand visibility and client acquisition.",
    url: "https://www.greenbuild.space",
    logoUrl: "/greenbuild-logo.jpeg", // Original client logo
    techStack: ["React.js", "Tailwind", "Google Ads"],
    bgImage: "/construction-bg.png",
  },
  {
    id: "evay",
    title: "EVay EV Charging Solutions",
    clientName: "Manjunath Niranjan",
    location: "Davangere",
    services: ["Web Development", "Platform Engineering", "UI/UX Design"],
    description: "A modern electric vehicle charging network platform built in Davangere, enabling seamless charging location mapping and client services.",
    testimonial: "Highly professional and technical partner for our EV charging business. They designed and developed a high-performance platform using React and Vite that operates flawlessly and helps us connect with users in Davangere.",
    url: "https://www.evay.co.in",
    logoUrl: "/evay-logo.jpeg",
    techStack: ["React.js", "Vite", "Tailwind"],
    bgImage: "/ev-charging-bg.png",
  }
];

const categories = ["All", "Web Development", "App Development", "Data Science", "Digital Marketing", "Cyber Security"];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center px-4 md:px-6 py-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-3 md:px-4 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-headline tracking-widest uppercase">
            Our Portfolio
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-black tracking-tight mb-4 leading-tight">
            Projects That <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Speak Volumes</span>
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            From concept to deployment, explore our diverse portfolio of successful solutions that have transformed businesses.
          </p>
        </div>
      </section>

      {/* Hall of Fame / Completed Projects */}
      <section className="py-12 md:py-20 relative z-10 border-b border-white/5 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-headline font-bold mb-4">Hall of Fame</h2>
            <p className="text-on-surface-variant text-sm md:text-base max-w-2xl mx-auto">
              Real businesses, real results. See how we've helped our clients achieve their digital goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:gap-12">
            {completedProjects.map((project) => (
              <div key={project.id} className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row group hover:border-primary/50 transition-all duration-700 shadow-2xl relative">
                
                {/* Floating "Visit Site" Arrow (Top Right) */}
                <Link href={project.url} target="_blank" rel="noopener noreferrer" className="absolute top-6 right-6 z-30 w-12 h-12 bg-surface-container-highest/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 shadow-xl opacity-0 group-hover:opacity-100 translate-y-4">
                  <span className="material-symbols-outlined -rotate-45">arrow_forward</span>
                </Link>

                {/* Logo / Image Side */}
                <div className="md:w-1/2 p-6 md:p-14 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5 min-h-[250px] md:min-h-[350px]">
                  {/* Cinematic Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                    <Image 
                      src={project.bgImage || "/construction-bg.png"}
                      alt={`${project.title} Background`}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/80"></div>
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500"></div>
                  
                  {/* Glowing Backdrop for Logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-green-500/15 blur-[100px] rounded-full group-hover:bg-green-500/25 transition-colors duration-700"></div>

                  {/* Logo Container - Large & Transparent */}
                  <div className="relative w-full h-[250px] sm:h-[320px] flex items-center justify-center z-10 transition-transform duration-1000 ease-out group-hover:scale-110">
                     <Image 
                       src={project.logoUrl}
                       alt={project.title}
                       fill
                       className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                     />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-6 left-6 z-20">
                     <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-headline uppercase tracking-widest text-primary shadow-2xl backdrop-blur-xl">
                       <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                       Live Framework
                     </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative z-10 bg-surface-container-lowest/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-xl">verified</span>
                      <span className="text-xs font-headline uppercase tracking-[0.2em] text-on-surface-variant">Established Partner</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-headline font-black mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-container transition-all duration-500">
                    {project.title}
                  </h3>
                  
                  <div className="flex flex-col gap-1 mb-8">
                    <p className="text-sm font-headline text-primary">Strategic Partners: {project.clientName}</p>
                    <div className="flex items-center gap-2 opacity-60 mt-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span className="text-[10px] font-headline uppercase tracking-widest">{project.location}</span>
                    </div>
                  </div>
                  
                  {/* Client Testimonial Quote */}
                  <div className="relative mb-10 group/quote">
                    <span className="absolute -top-4 -left-4 text-4xl text-primary/20 font-serif group-hover/quote:text-primary/40 transition-colors">"</span>
                    <p className="text-on-surface-variant leading-relaxed italic text-sm md:text-base border-l-2 border-primary/20 pl-6 py-2">
                      {project.testimonial || `Reliable digital partner for our construction business. ${project.description}`}
                    </p>
                  </div>

                  {/* Services & Tech Stack */}
                  <div className="mb-10">
                    <p className="text-[10px] font-headline text-on-surface-variant/50 uppercase tracking-widest mb-3">Core Solutions & Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service, idx) => (
                         <span key={`srv-${idx}`} className="px-4 py-1.5 rounded-lg text-[9px] font-headline tracking-widest uppercase bg-surface-container-highest border border-white/5 text-on-surface">
                           {service}
                         </span>
                      ))}
                      {/* Animated Tech Stack Chips */}
                      {project.techStack?.map((tech, idx) => (
                         <span key={`tech-${idx}`} className={`px-4 py-1.5 rounded-lg text-[9px] font-headline tracking-widest uppercase border transition-colors ${
                           tech.toLowerCase().includes('react') 
                             ? 'bg-blue-500/10 border-blue-500/20 text-blue-300 group-hover:border-blue-500/50' 
                             : tech.toLowerCase().includes('vite')
                             ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 group-hover:border-purple-500/50'
                             : tech.toLowerCase().includes('tailwind')
                             ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 group-hover:border-cyan-500/50'
                             : tech.toLowerCase().includes('google')
                             ? 'bg-orange-500/10 border-orange-500/20 text-orange-300 group-hover:border-orange-500/50'
                             : 'bg-primary/10 border-primary/20 text-primary-container group-hover:border-primary/50'
                         }`}>
                           {tech}
                         </span>
                      ))}
                    </div>
                  </div>

                  {/* Main Action Button */}
                  <div className="flex items-center gap-6 mt-auto">
                    <Link href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:shadow-[0_0_50px_rgba(0,212,255,0.4)] hover:-translate-y-1 transition-all duration-300 text-xs">
                      Explore Live Project
                      <span className="material-symbols-outlined text-sm">rocket_launch</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Projects Grid (Concept Solutions) */}
      <section className="pb-24 pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
             <h2 className="text-xl md:text-3xl font-headline font-bold mb-2">Our Capabilities & Concepts</h2>
             <p className="text-on-surface-variant text-sm">Explore the wide range of digital solutions we engineer.</p>
          </div>
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8 mb-8 md:mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-headline tracking-widest uppercase transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-on-primary shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group glass-panel rounded-xl border border-white/5 ${
                  project.color === "red" ? "hover:border-red-500/30" : "hover:border-primary/30"
                } transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Project Image Placeholder */}
                <div className={`relative h-48 bg-gradient-to-br ${
                  project.color === "primary"
                    ? "from-primary/20 to-primary-container/20"
                    : project.color === "secondary"
                    ? "from-secondary/20 to-secondary-container/20"
                    : project.color === "red"
                    ? "from-red-500/20 to-red-900/20"
                    : "from-primary-container/20 to-primary/20"
                } flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>
                  <span className={`material-symbols-outlined text-7xl ${
                    project.color === "primary"
                      ? "text-primary"
                      : project.color === "secondary"
                      ? "text-secondary"
                      : project.color === "red"
                      ? "text-red-400"
                      : "text-primary-container"
                  } opacity-50 group-hover:opacity-80 transition-opacity`}>
                    {project.icon}
                  </span>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-headline tracking-widest uppercase ${
                      project.color === "primary"
                        ? "bg-primary/20 text-primary"
                        : project.color === "secondary"
                        ? "bg-secondary/20 text-secondary"
                        : project.color === "red"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-primary-container/20 text-primary-container"
                    }`}>
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-4 md:p-6">
                  <h3 className={`text-lg md:text-xl font-headline font-bold mb-2 md:mb-3 ${
                    project.color === "red" ? "group-hover:text-red-400" : "group-hover:text-primary"
                  } transition-colors`}>
                    {project.title}
                  </h3>
                  <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                    {project.description}
                  </p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-[45deg] ${
                      project.color === "primary"
                        ? "bg-primary/10 text-primary"
                        : project.color === "secondary"
                        ? "bg-secondary/10 text-secondary"
                        : project.color === "red"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-primary-container/10 text-primary-container"
                    }`}>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold mb-4 md:mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
            Let&apos;s discuss how we can transform your idea into a powerful digital solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              href="/consultation"
              className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:scale-105 transition-transform font-headline text-sm md:text-base"
            >
              Start Your Project
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 border border-outline-variant text-primary font-bold rounded-lg hover:bg-white/5 transition-colors font-headline uppercase text-xs md:text-sm tracking-widest"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
