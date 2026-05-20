"use client";

import React, { useState, useEffect } from "react";
import { projectService } from "../../../lib/projectService";
import { supabase } from "../../../lib/supabase";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchReviews();

    const subscription = supabase
      .channel('admin-reviews-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchReviews())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getReviews();
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = (id: string) => {
    setReviewToDelete(id);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      await projectService.deleteReview(reviewToDelete);
      showNotify("Review deleted successfully.");
      setReviewToDelete(null);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      showNotify("Failed to delete review.", "error");
      setReviewToDelete(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-10 right-10 z-[100] px-6 py-4 rounded-xl border shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
          notification.type === 'success' ? 'bg-primary/20 border-primary text-primary' : 'bg-red-500/20 border-red-500 text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">{notification.type === 'success' ? 'check_circle' : 'error'}</span>
            <span className="font-headline font-bold text-sm tracking-wide">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-headline font-bold mb-1">Client Feedback</h3>
          <p className="text-sm text-on-surface-variant">Manage and moderate reviews from your clients.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="glass-panel rounded-2xl border border-white/5 p-6 flex flex-col hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-black border border-white/5">
                    {review.avatar || review.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-white">{review.name}</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{review.company || 'Verified Client'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteReview(review.id)}
                  className="p-2 text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-primary text-sm">★</span>
                ))}
              </div>

              <p className="text-sm text-on-surface-variant italic mb-6 flex-grow leading-relaxed">
                "{review.review}"
              </p>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Verified
                </span>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-dashed border-white/10">
              <span className="material-symbols-outlined text-4xl text-white/10 mb-4">rate_review</span>
              <p className="text-on-surface-variant">No reviews found in the database.</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-xl font-headline font-black text-white mb-2">Delete Review?</h3>
              <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">
                Are you sure you want to delete this review? This action cannot be undone and it will remove this review from the public showcase permanently.
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setReviewToDelete(null)} 
                  className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteReview} 
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
