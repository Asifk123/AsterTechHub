"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { projectService } from "@/lib/projectService";
import { reviews as mockReviews, reviewStats as stats, featuredReview } from "@/lib/mockData";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    company: "",
    role: "",
    rating: 5,
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await projectService.getReviews();
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        setReviews(mockReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews(mockReviews);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorFromName = (name: string) => {
    const colors = ["primary", "secondary", "primary-container"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.review.length < 10) {
      showNotify("Please write a bit more about your experience (min 10 characters).", 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const reviewData = {
        name: newReview.name,
        rating: newReview.rating,
        review: newReview.review,
        date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      await projectService.createReview(reviewData);
      setShowReviewModal(false);
      setNewReview({ name: "", company: "", role: "", rating: 5, review: "" });
      fetchReviews();
      showNotify("Review submitted for moderation! Thank you.");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      showNotify(error.message || "Failed to submit review.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aster Tech Hub",
    "url": "https://astertechhub.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "24",
      "reviewCount": "24"
    },
    "review": reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : "2024-11-15",
      "reviewBody": r.review,
      "reviewRating": { "@type": "Rating", "ratingValue": r.rating || "5", "bestRating": "5" },
      "publisher": { "@type": "Organization", "name": "Aster Tech Hub" }
    }))
  };

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* JSON-LD: Reviews & AggregateRating Schema (AEO - Rich Snippets) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-6 md:right-10 z-[101] px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
          notification.type === 'success' ? 'bg-primary/20 border-primary text-primary' : 'bg-red-500/20 border-red-500 text-red-400'
        } backdrop-blur-xl`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">{notification.type === 'success' ? 'check_circle' : 'error'}</span>
            <span className="font-headline font-bold text-sm tracking-wide">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Animated Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse:60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.1),transparent_50%)]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-headline tracking-widest uppercase shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            Client Success Stories
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-black tracking-tight mb-6 leading-tight">
            Trusted by <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#a8e8ff] to-secondary animate-gradient-x">
              Industry Leaders
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover how Aster Tech Hub transforms complex challenges into elegant digital solutions for businesses worldwide.
          </p>
          
          <button 
            onClick={() => setShowReviewModal(true)}
            className="mt-10 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-headline font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-[#0a0a0f] hover:border-primary transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Leave Your Feedback
          </button>
        </div>
      </section>

      {/* Featured Review Section */}
      <section className="px-6 pb-20 relative z-10 -mt-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shrink-0">
                <div className="w-full h-full bg-[#0a0a0f] rounded-full flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {featuredReview.image}
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex gap-1 justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-2xl drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">★</span>
                  ))}
                </div>
                <h3 className="text-xl md:text-3xl font-headline font-bold text-white mb-6 leading-relaxed italic">
                  "{featuredReview.review}"
                </h3>
                <div>
                  <p className="font-headline font-black text-primary text-lg tracking-wide uppercase">{featuredReview.name}</p>
                  <p className="text-on-surface-variant text-sm">{featuredReview.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-12 px-6 border-y border-white/5 bg-surface/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 md:divide-x md:divide-white/5">
            {stats.map((stat, index) => (
              <div key={index} className="px-4 group flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-white group-hover:text-primary transition-colors">{stat.icon}</span>
                </div>
                <div className="text-3xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-2">
                  {stat.value}
                </div>
                <div className="text-on-surface-variant text-xs md:text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(217,185,255,0.05),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-headline font-black mb-4">More Voices</h2>
             <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent mx-auto rounded-full"></div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{ animationDelay: `${review.delay || 0}ms` }}
                  className="group glass-panel rounded-2xl border border-white/5 hover:border-primary/40 transition-all duration-500 p-8 flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black tracking-wider border transition-colors duration-300 ${
                      (review.color || getColorFromName(review.name)) === "primary"
                        ? "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20"
                        : (review.color || getColorFromName(review.name)) === "secondary"
                        ? "bg-secondary/10 text-secondary border-secondary/20 group-hover:bg-secondary/20"
                        : "bg-[#a8e8ff]/10 text-[#a8e8ff] border-[#a8e8ff]/20 group-hover:bg-[#a8e8ff]/20"
                    }`}>
                      {review.avatar || review.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-white group-hover:text-primary transition-colors text-lg">
                        {review.name}
                      </h3>
                      <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                        {review.role || 'Verified'} <span className="text-white/30">•</span> {review.company || 'Client'}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <span key={i} className="text-primary text-sm">★</span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-on-surface-variant text-sm leading-relaxed flex-grow italic">
                    "{review.review}"
                  </p>

                  {/* Verified Badge */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/80">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Verified Client
                    </span>
                    <span className="material-symbols-outlined text-white/10 text-4xl leading-none">format_quote</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4">
          <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.2)] animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-headline font-black text-white">Leave a Review</h2>
              <button onClick={() => setShowReviewModal(false)} className="material-symbols-outlined text-white/50 hover:text-white transition-colors">close</button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reviewer-name" className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Your Name</label>
                  <input 
                    id="reviewer-name"
                    name="reviewer-name"
                    required 
                    type="text" 
                    value={newReview.name} 
                    onChange={e => setNewReview({...newReview, name: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="reviewer-company" className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Company / Project</label>
                  <input 
                    id="reviewer-company"
                    name="reviewer-company"
                    required 
                    type="text" 
                    value={newReview.company} 
                    onChange={e => setNewReview({...newReview, company: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" 
                    placeholder="e.g. Acme Inc"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="reviewer-role" className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Your Role</label>
                <input 
                  id="reviewer-role"
                  name="reviewer-role"
                  required 
                  type="text" 
                  value={newReview.role} 
                  onChange={e => setNewReview({...newReview, role: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" 
                  placeholder="e.g. CEO / Manager"
                />
              </div>

              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className={`text-2xl transition-all ${newReview.rating >= star ? "text-primary scale-110" : "text-white/20"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="review-content" className="block text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Your Experience</label>
                  <span className={`text-[10px] font-bold ${newReview.review.length > 500 ? 'text-red-400' : 'text-primary/60'}`}>
                    {newReview.review.length} / 500
                  </span>
                </div>
                <textarea 
                  id="review-content"
                  name="review-content"
                  required 
                  maxLength={500}
                  value={newReview.review} 
                  onChange={e => setNewReview({...newReview, review: e.target.value})} 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm resize-none" 
                  placeholder="Share your thoughts about working with us..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-4 rounded-xl bg-white/5 text-white font-headline font-bold uppercase tracking-widest text-xs border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-[#0a0a0f] font-headline font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-headline font-black mb-6 text-white">
            Ready to Be Our Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Success Story?</span>
          </h2>
          <p className="text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto">
            Join the ranks of industry leaders who have scaled their operations with our bespoke technology solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/consultation"
              className="px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-[#0a0a0f] font-black rounded-xl shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:scale-105 transition-all duration-300 font-headline uppercase tracking-wider text-sm"
            >
              Start Your Project
            </Link>
            <Link
              href="/projects"
              className="px-10 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 hover:border-white/30 transition-all duration-300 font-headline uppercase text-sm tracking-widest"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
