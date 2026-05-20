"use client";

import { useState } from "react";
import Link from "next/link";
import OverviewTab from "./components/OverviewTab";
import ClientsTab from "./components/ClientsTab";
import ProjectsTab from "./components/ProjectsTab";
import TeamTab from "./components/TeamTab";
import MessagesTab from "./components/MessagesTab";
import FinancesTab from "./components/FinancesTab";
import ReviewsTab from "./components/ReviewsTab";
import AccessTab from "./components/AccessTab";
import { projectService } from "../../lib/projectService";
import { supabase } from "../../lib/supabase";
import { useEffect } from "react";

type TabType = "overview" | "access" | "clients" | "projects" | "team" | "messages" | "finances" | "reviews";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    fetchNotifications();

    const subscription = supabase
      .channel('header-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchNotifications())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, () => fetchNotifications())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'team_members' }, () => fetchNotifications())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    // Auto-close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const stats = await projectService.getDashboardStats();
      const combined: any[] = [];

      // New Messages
      stats.messages.slice(0, 3).forEach((m: any) => {
        combined.push({
          id: `msg-${m.id}`,
          text: `New message from ${m.sender_name}`,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: "mail",
          type: "message"
        });
      });

      // New Members (Pending)
      stats.members.filter((m: any) => m.status === 'Pending').slice(0, 2).forEach((m: any) => {
        combined.push({
          id: `mem-${m.id}`,
          text: `New member request: ${m.name}`,
          time: "Just now",
          icon: "person_add",
          type: "member"
        });
      });

      // New Projects
      stats.projects.slice(0, 2).forEach((p: any) => {
        combined.push({
          id: `prj-${p.id}`,
          text: `New project added: ${p.name}`,
          time: "Recent",
          icon: "folder_shared",
          type: "project"
        });
      });

      setNotifications(combined);
      setHasNew(combined.length > 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "access", label: "Verification", icon: "verified_user" },
    { id: "clients", label: "Clients", icon: "business_center" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "team", label: "Team", icon: "group" },
    { id: "messages", label: "Messages", icon: "mail" },
    { id: "finances", label: "Finances", icon: "payments" },
    { id: "reviews", label: "Reviews", icon: "rate_review" },
  ];

  return (
    <div className="h-screen bg-background overflow-hidden flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative top-0 left-0 h-full z-50 transition-all duration-300 flex flex-col bg-surface-container-low border-r border-white/5 overflow-hidden shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Logo & Close Button */}
        <div className={`border-b border-white/5 h-20 flex items-center justify-between shrink-0 transition-all duration-300 ${sidebarOpen ? 'p-6' : 'px-5 py-6'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary-container flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="text-xl font-black text-on-primary">A</span>
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${sidebarOpen ? 'opacity-100 w-auto ml-0' : 'opacity-0 w-0 ml-0 pointer-events-none'}`}>
              <h1 className="font-headline font-bold text-lg leading-tight whitespace-nowrap">Aster Tech</h1>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black opacity-60 whitespace-nowrap">Admin Hub</p>
            </div>
          </div>
          
          {/* Mobile Close Button (Inside) */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className={`p-2 lg:hidden text-on-surface-variant hover:text-white ${!sidebarOpen && 'hidden'}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                    }`}
                >
                  <span className="material-symbols-outlined text-xl shrink-0">{tab.icon}</span>
                  {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
                    <span className="font-headline text-sm whitespace-nowrap">{tab.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-white/5 shrink-0 hidden lg:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low hover:bg-white/10 transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">
              {sidebarOpen ? "chevron_left" : "chevron_right"}
            </span>
            {sidebarOpen && <span className="text-sm whitespace-nowrap">Collapse</span>}
          </button>
        </div>

        {/* Admin User */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <span className="font-headline text-secondary">AK</span>
            </div>
            {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
              <div className="whitespace-nowrap">
                <p className="text-sm font-headline">Asif K</p>
                <p className="text-xs text-on-surface-variant">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300`}
      >
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-surface/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            {(!sidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-primary"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            )}
            <h2 className="text-sm md:text-lg font-headline font-bold capitalize truncate">
              {activeTab} Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setHasNew(false); }}
                className={`p-2 rounded-lg transition-colors relative ${showNotifications ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined">notifications</span>
                {hasNew && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface animate-bounce" />}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-[#131318] rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center">
                      <span className="text-xs font-headline font-bold uppercase tracking-widest text-primary">Notifications</span>
                      <button 
                        onClick={() => { setNotifications([]); setHasNew(false); }}
                        className="text-[10px] text-on-surface-variant hover:text-white uppercase tracking-tighter"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm text-primary">{n.icon}</span>
                          </div>
                          <div>
                            <p className="text-xs text-on-surface leading-tight mb-1">{n.text}</p>
                            <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => { setActiveTab('messages'); setShowNotifications(false); }}
                      className="w-full py-2 text-[10px] text-on-surface-variant hover:text-white uppercase tracking-widest font-bold bg-white/5 border-t border-white/5"
                    >
                      View All Notifications
                    </button>
                  </div>
                </>
              )}
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg glass-panel border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-sm font-headline flex items-center gap-2 shadow-lg group"
            >
              <span className="material-symbols-outlined text-sm text-primary group-hover:scale-110 transition-transform">home</span>
              <span className="font-bold group-hover:text-primary transition-colors">Home</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === "overview" && <OverviewTab setActiveTab={setActiveTab} />}
            {activeTab === "access" && <AccessTab />}
            {activeTab === "clients" && <ClientsTab />}
            {activeTab === "projects" && <ProjectsTab />}
            {activeTab === "team" && <TeamTab />}
            {activeTab === "messages" && <MessagesTab />}
            {activeTab === "finances" && <FinancesTab />}
            {activeTab === "reviews" && <ReviewsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
