"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { projectService } from "../../lib/projectService";

const projectTypes = [
  "Web Development",
  "App Development",
  "Data Analytics",
  "Digital Marketing",
  "Cyber Security",
  "Other"
];

const budgetRanges = [
  "Under ₹15,000",
  "₹15,000 - ₹50,000",
  "₹50,000 - ₹1 Lakh",
  "₹1 Lakh - ₹5 Lakh",
  "₹5 Lakh+"
];

export default function Consultation() {
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCallNumbers, setShowCallNumbers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: "",
    customBudget: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateForm = (field: string, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1 && (!formData.name || !formData.email)) {
      setError("Please fill in your name and email.");
      return;
    }
    if (step === 2 && (!formData.projectType || (!formData.budget && !formData.customBudget))) {
      setError("Please select a service and budget range.");
      return;
    }
    setError(null);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please provide some project details.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save to database
      const msgData = {
        sender_name: formData.name,
        sender_email: formData.email,
        subject: `New Consultation: ${formData.projectType}`,
        content: `Phone: ${formData.phone}\nBudget: ${formData.budget === 'Custom' ? '₹' + formData.customBudget : formData.budget}\n\nMessage: ${formData.message}`,
        type: "Potential Client",
        status: "New"
      };

      await projectService.createMessage(msgData);
      setShowSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-primary/30 text-center shadow-[0_0_50px_rgba(0,212,255,0.2)] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
              <span className="material-symbols-outlined text-4xl text-primary animate-bounce">check_circle</span>
            </div>
            <h2 className="text-3xl font-headline font-black mb-4 text-white">Inquiry Received!</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Thank you {formData.name}! Our strategy team will review your requirements and get back to you within 24 hours.
            </p>
            <Link
              href="/"
              className="block w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-headline font-bold uppercase tracking-widest text-sm shadow-lg hover:scale-[1.02] transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[350px] flex items-center justify-center px-6 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-headline tracking-widest uppercase">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2"></span>
            Partner With Us
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight mb-6 leading-tight">
            Let&apos;s Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Something Amazing</span>
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/70">
            Tell us about your vision. Our interactive process ensures we understand exactly what you need before we even say hello.
          </p>
        </div>
      </section>

      {/* Interactive Form Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative">
        <div className="max-w-3xl mx-auto relative z-10">

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-2 px-2">
              <span className={`text-[9px] sm:text-xs font-headline uppercase tracking-widest ${step >= 1 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}><span className="hidden sm:inline">Step 01: </span>Contact</span>
              <span className={`text-[9px] sm:text-xs font-headline uppercase tracking-widest ${step >= 2 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}><span className="hidden sm:inline">Step 02: </span>Needs</span>
              <span className={`text-[9px] sm:text-xs font-headline uppercase tracking-widest ${step >= 3 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}><span className="hidden sm:inline">Step 03: </span>Details</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden flex">
              <div className={`h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl border border-white/10 p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10">

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              {/* STEP 1: Basic Info */}
              <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 translate-x-0 block' : 'opacity-0 translate-x-10 hidden'}`}>
                <h3 className="text-2xl font-headline font-bold mb-8 text-white">Who are we speaking with?</h3>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="full-name" className="block text-xs font-headline mb-2 text-on-surface-variant uppercase tracking-widest">Full Name *</label>
                    <input
                      id="full-name"
                      name="full-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full p-4 rounded-xl bg-background/50 border border-white/5 text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email-address" className="block text-xs font-headline mb-2 text-on-surface-variant uppercase tracking-widest">Email Address *</label>
                      <input
                        id="email-address"
                        name="email-address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full p-4 rounded-xl bg-background/50 border border-white/5 text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone-number" className="block text-xs font-headline mb-2 text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                      <input
                        id="phone-number"
                        name="phone-number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full p-4 rounded-xl bg-background/50 border border-white/5 text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Project Needs */}
              <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 translate-x-0 block' : 'opacity-0 translate-x-10 hidden'}`}>
                <h3 className="text-2xl font-headline font-bold mb-8 text-white">What are you looking for?</h3>
                <div className="space-y-8">

                  <div>
                    <label className="block text-xs font-headline mb-4 text-on-surface-variant uppercase tracking-widest">Primary Service Required *</label>
                    <div className="flex flex-wrap gap-3">
                      {projectTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateForm('projectType', type)}
                          className={`px-5 py-3 rounded-xl border font-headline text-sm transition-all duration-300 ${formData.projectType === type
                              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                              : 'bg-background/50 border-white/5 text-on-surface hover:border-white/20 hover:bg-white/5 text-white/70'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-headline mb-4 text-on-surface-variant uppercase tracking-widest">Expected Budget Range *</label>
                    <div className="flex flex-wrap gap-3">
                      {budgetRanges.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => updateForm('budget', range)}
                          className={`px-5 py-3 rounded-xl border font-headline text-sm transition-all duration-300 ${formData.budget === range
                              ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(217,185,255,0.2)]'
                              : 'bg-background/50 border-white/5 text-on-surface hover:border-white/20 hover:bg-white/5 text-white/70'
                            }`}
                        >
                          {range}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateForm('budget', 'Custom')}
                        className={`px-5 py-3 rounded-xl border font-headline text-sm transition-all duration-300 ${formData.budget === 'Custom'
                            ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(217,185,255,0.2)]'
                            : 'bg-background/50 border-white/5 text-on-surface hover:border-white/20 hover:bg-white/5 text-white/70'
                          }`}
                      >
                        Custom Amount
                      </button>
                    </div>
                    {formData.budget === 'Custom' && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-bold">₹</span>
                          <input
                            id="custom-budget"
                            name="custom-budget"
                            type="number"
                            value={formData.customBudget}
                            onChange={(e) => updateForm('customBudget', e.target.value)}
                            placeholder="Enter your budget"
                            className="w-full pl-8 pr-4 py-4 rounded-xl bg-background/50 border border-secondary/30 text-white placeholder:text-white/20 focus:border-secondary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 3: Message */}
              <div className={`transition-all duration-500 ${step === 3 ? 'opacity-100 translate-x-0 block' : 'opacity-0 translate-x-10 hidden'}`}>
                <h3 className="text-2xl font-headline font-bold mb-8 text-white">Tell us the details.</h3>
                <div>
                  <label htmlFor="project-description" className="block text-xs font-headline mb-2 text-on-surface-variant uppercase tracking-widest">Project Description *</label>
                  <textarea
                    id="project-description"
                    name="project-description"
                    value={formData.message}
                    onChange={(e) => updateForm('message', e.target.value)}
                    rows={6}
                    placeholder="Describe your goals, features you need, timeline, or any reference websites..."
                    className="w-full p-4 rounded-xl bg-background/50 border border-white/5 text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/5">
                {step > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="px-6 py-3 border border-white/10 rounded-lg text-sm font-headline tracking-widest uppercase hover:bg-white/5 transition-colors text-white"
                  >
                    Back
                  </button>
                ) : <div></div>}

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-white text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-transform font-headline tracking-widest uppercase text-sm"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] hover:scale-105 transition-all font-headline tracking-widest uppercase text-sm flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <>Launching... <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></>
                    ) : (
                      <>Launch Project <span className="material-symbols-outlined text-sm">rocket_launch</span></>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tight mb-4 text-white">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch Directly</span>
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Prefer speaking with us directly? Find our contact details and location below.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* HQ Location Card */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Anjaneya+Badavane,+Davanagere"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel rounded-xl p-8 text-center hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 block cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">location_on</span>
              </div>
              <h3 className="font-headline text-xl mb-2 text-on-surface text-white">Aster Tech HQ</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Anjaneya Badavane<br />
                Davanagere, Karnataka, India
              </p>
            </a>

            {/* Email Card */}
            <a 
              href="mailto:astertechhub@gmail.com"
              className="glass-panel rounded-xl p-8 text-center hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 block cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">mail</span>
              </div>
              <h3 className="font-headline text-xl mb-2 text-on-surface text-white">Email Us</h3>
              <span className="text-on-surface-variant hover:text-primary transition-colors text-sm">
                astertechhub@gmail.com
              </span>
            </a>

            {/* Call Us Card */}
            <div 
              onClick={() => !showCallNumbers && setShowCallNumbers(true)}
              className={`glass-panel rounded-xl p-8 text-center hover:border-primary/30 transition-all duration-500 flex flex-col justify-between cursor-pointer ${
                showCallNumbers ? "border-primary/30 -translate-y-1 bg-surface-container-high/40" : "hover:-translate-y-1"
              }`}
            >
              <div>
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 transition-all duration-500">
                  <span className="material-symbols-outlined text-3xl text-primary">call</span>
                </div>
                <h3 className="font-headline text-xl text-on-surface text-white mb-2">Call Us</h3>
                {!showCallNumbers && (
                  <p className="text-[10px] text-primary tracking-widest uppercase font-headline animate-pulse mt-2">
                    Click to Reveal Contacts
                  </p>
                )}
              </div>
              
              {showCallNumbers ? (
                <div 
                  className="space-y-3 text-left mt-6 animate-in fade-in slide-in-from-bottom-5 duration-500"
                  onClick={(e) => e.stopPropagation()} // Prevent card click propagation
                >
                  {/* Managing Director (Buden Sab I) */}
                  <a 
                    href="tel:+918880459740" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-secondary/30 hover:bg-secondary/5 transition-all group/call block"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover/call:bg-secondary/20 transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined text-base">call</span>
                    </div>
                    <div>
                      <div className="text-[9px] text-secondary tracking-widest uppercase font-headline">Buden Sab I (MD)</div>
                      <div className="text-xs text-on-surface-variant group-hover/call:text-white transition-colors font-mono">+91 88804 59740</div>
                    </div>
                  </a>

                  {/* Operations Director (Manjunath N) */}
                  <a 
                    href="tel:+919886606880" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary-container/30 hover:bg-primary-container/5 transition-all group/call block"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover/call:bg-primary-container/20 transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined text-base">call</span>
                    </div>
                    <div>
                      <div className="text-[9px] text-primary-container tracking-widest uppercase font-headline">Manjunath N (OD)</div>
                      <div className="text-xs text-on-surface-variant group-hover/call:text-white transition-colors font-mono">+91 98866 06880</div>
                    </div>
                  </a>

                  {/* Hide Button to close numbers again */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCallNumbers(false);
                    }}
                    className="w-full py-1 text-[9px] font-headline uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors mt-2"
                  >
                    Hide Contacts
                  </button>
                </div>
              ) : (
                <div className="h-0 opacity-0 overflow-hidden transition-all duration-500"></div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
