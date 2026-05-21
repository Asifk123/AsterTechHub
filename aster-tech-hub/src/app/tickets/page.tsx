"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { projectService } from "../../lib/projectService";
import { supabase } from "../../lib/supabase";

const statusColors = {
  New: "bg-red-500/20 text-red-400 border-red-500/30",
  Open: "bg-red-500/20 text-red-400 border-red-500/30",
  "In Progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Resolved: "bg-green-500/20 text-green-400 border-green-500/30",
  Read: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Replied: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const priorityColors = {
  High: "text-red-400",
  Medium: "text-yellow-400",
  Low: "text-green-400",
};

export default function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [confirmResolve, setConfirmResolve] = useState<string | null>(null);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "Medium",
  });

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setUserProfile(profile);
          fetchTickets(profile.email);
        }
      }
    };
    init();
  }, []);

  // REAL-TIME SUBSCRIPTION (Fixed closure issue)
  useEffect(() => {
    if (!userProfile?.email) return;

    const subscription = supabase
      .channel('tickets-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_email=eq.${userProfile.email}`
      }, () => fetchTickets(userProfile.email))
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userProfile]);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTickets = async (email?: string) => {
    try {
      setIsLoading(true);
      const targetEmail = email || userProfile?.email;
      if (!targetEmail) {
        setIsLoading(false);
        return;
      }

      const data = await projectService.getMessages();
      // Filter by sender_email primarily. If it's the user's message, show it.
      const myTickets = (data || []).filter((m: any) => 
        m.sender_email === targetEmail
      );
      
      console.log("Fetched tickets for", targetEmail, myTickets.length);
      setTickets([...myTickets]); // Use spread to force a new array reference

      // Also update selected ticket if it's open to show live replies
      if (selectedTicket) {
        const updatedTicket = myTickets.find((t: any) => t.id === selectedTicket.id);
        if (updatedTicket) setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = (tickets || []).filter((t: any) => {
    if (filterStatus === "All") return true;
    // Case-insensitive status match to be safe
    return t.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description || !userProfile) return;

    try {
      const ticketData = {
        sender_name: userProfile.full_name,
        sender_email: userProfile.email,
        subject: newTicket.subject,
        content: newTicket.description,
        priority: newTicket.priority,
        type: "Ticket",
        status: "Open"
      };

      await projectService.createMessage(ticketData);
      setNewTicket({ subject: "", description: "", priority: "Medium" });
      setShowCreateForm(false);
      fetchTickets();
      showNotify("Ticket raised successfully!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      showNotify("Failed to create ticket.", "error");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[150px] flex items-center justify-center px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.08),transparent_70%)]" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight mb-2">
            Support{" "}
            <span className="bg-gradient-to-r from-[#a8e8ff] to-[#d9b9ff] text-transparent bg-clip-text">
              Tickets
            </span>
          </h1>
          <p className="text-on-surface-variant text-sm">
            Track and manage your support requests
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-16 pt-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Filter and Create Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {["All", "Open", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-headline transition-all ${
                    filterStatus === status
                      ? "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40"
                      : "bg-surface-container-low text-on-surface-variant border border-white/5 hover:border-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#a8e8ff] to-[#00D4FF] text-[#0a0a0f] font-headline font-bold text-sm hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all flex items-center gap-2"
            >
              <span className="text-base font-bold">+</span>
              New Ticket
            </button>
          </div>

          {/* Tickets List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="w-full glass-panel rounded-xl p-4 border border-white/5 hover:border-[#00D4FF]/30 transition-all text-left group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-on-surface-variant">
                          #{ticket.id.slice(0, 8)}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusColors[ticket.status as keyof typeof statusColors] || 'bg-white/5'}`}>
                          {ticket.status}
                        </span>
                        <span className={`text-xs font-headline ${priorityColors[ticket.priority as keyof typeof priorityColors] || ''}`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-lg mb-1 group-hover:text-[#00D4FF] transition-colors">
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2">
                        {ticket.content}
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-on-surface-variant uppercase tracking-widest">
                      <p>{new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && filteredTickets.length === 0 && (
            <div className="glass-panel rounded-xl p-8 text-center border border-white/5">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">
                inbox
              </span>
              <p className="text-on-surface-variant">No tickets found</p>
            </div>
          )}
        </div>
      </section>

      {/* Create Ticket Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-white/10 p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-headline font-bold text-[#00D4FF]">
                Raise New Ticket
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-headline mb-2 text-on-surface">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of your issue"
                  maxLength={100}
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full p-4 rounded-lg bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#00D4FF]/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-headline mb-2 text-on-surface">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  maxLength={2000}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full p-4 rounded-lg bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#00D4FF]/50 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-headline mb-2 text-on-surface">
                  Priority
                </label>
                <div className="flex gap-3">
                  {["Low", "Medium", "High"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewTicket({ ...newTicket, priority })}
                      className={`flex-1 py-3 rounded-lg text-sm font-headline transition-all border ${
                        newTicket.priority === priority
                          ? priority === "High"
                            ? "bg-red-500/20 text-red-400 border-red-500/40"
                            : priority === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                            : "bg-green-500/20 text-green-400 border-green-500/40"
                          : "bg-surface-container-low text-on-surface-variant border-white/5"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateTicket}
                disabled={!newTicket.subject || !newTicket.description}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#a8e8ff] to-[#00D4FF] text-[#0a0a0f] font-headline font-bold text-sm hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl border border-white/10 p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-on-surface-variant">
                  #{selectedTicket.id.slice(0, 8)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[selectedTicket.status as keyof typeof statusColors] || 'bg-white/5'}`}>
                  {selectedTicket.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <h2 className="text-xl font-headline font-bold mb-4">
              {selectedTicket.subject}
            </h2>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className={`font-headline ${priorityColors[selectedTicket.priority as keyof typeof priorityColors] || ''}`}>
                {selectedTicket.priority} Priority
              </span>
              <span className="text-on-surface-variant">
                Created: {new Date(selectedTicket.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-surface-container-low border border-white/5 mb-6">
              <p className="text-sm text-on-surface-variant mb-2">Description</p>
              <p className="text-on-surface">{selectedTicket.content}</p>
            </div>

            {/* Admin Replies Section */}
            {selectedTicket.admin_reply && (
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-headline font-bold uppercase tracking-widest text-[#00D4FF] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  Aster Tech Team Reply
                </h4>
                <div className="p-4 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#00D4FF]/10 blur-2xl pointer-events-none" />
                  <p className="text-sm text-on-surface leading-relaxed relative z-10 italic">
                    "{selectedTicket.admin_reply}"
                  </p>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-3 font-bold">
                    Official Support Response
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setSelectedTicket(null)} className="flex-1 py-3 rounded-lg bg-surface-container-low border border-white/5 text-sm font-headline hover:border-[#00D4FF]/30 transition-colors">
                Back to List
              </button>
              {selectedTicket.status !== 'Resolved' && (
                <button 
                  onClick={() => setConfirmResolve(selectedTicket.id)}
                  className="flex-1 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-headline hover:bg-green-500/30 transition-all"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolve Confirmation Modal */}
      {confirmResolve && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.1)] text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-green-500">task_alt</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-2 text-white">Resolve Ticket?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              Are you sure this issue has been resolved to your satisfaction?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmResolve(null)}
                className="flex-1 py-3 rounded-xl bg-surface-container-low border border-white/5 text-sm font-headline text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    const { data, error, count } = await supabase
                      .from('messages')
                      .update({ status: 'Resolved' })
                      .eq('id', confirmResolve)
                      .select();

                    if (error) throw error;
                    if (!data || data.length === 0) {
                      throw new Error("Update failed: You might not have permission to resolve this ticket.");
                    }

                    setConfirmResolve(null);
                    setSelectedTicket(null);
                    await fetchTickets();
                    showNotify("Ticket marked as resolved! ✅");
                  } catch (err: any) {
                    console.error("Resolve error:", err);
                    showNotify(err.message || "Failed to resolve ticket.", "error");
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-green-500 text-white text-sm font-headline font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[300] px-6 py-4 rounded-xl border backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-6 duration-500 ${
          notification.type === 'success' 
            ? 'bg-slate-900/90 border-[#00D4FF]/30 text-[#00D4FF] shadow-[#00D4FF]/5' 
            : 'bg-slate-900/90 border-red-500/30 text-red-400 shadow-red-500/5'
        }`}>
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-[#00D4FF]/10' : 'bg-red-500/10'
            }`}>
              <span className="material-symbols-outlined text-sm font-bold">
                {notification.type === 'success' ? 'check_circle' : 'error'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-headline font-black uppercase tracking-[0.2em] opacity-50 mb-0.5">Ticket Update</span>
              <span className="font-headline font-bold text-xs uppercase tracking-widest">{notification.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
