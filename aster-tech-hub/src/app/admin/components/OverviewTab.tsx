import React, { useState, useEffect } from "react";
import { projectService } from "../../../lib/projectService";
import { supabase } from "../../../lib/supabase";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

interface OverviewTabProps {
  setActiveTab: (tab: any) => void;
}

export default function OverviewTab({ setActiveTab }: OverviewTabProps) {
  // 1. Data States
  const [data, setData] = useState<any>({
    projects: [],
    messages: [],
    members: [],
    tasks: [],
    invoices: [],
    visits: 0,
    clientCount: 0,
    pendingCount: 0,
    analytics: { trend: [], topPages: [] }
  });
  
  // 2. UI States
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Effects
  useEffect(() => {
    setIsMounted(true);
    fetchStats();

    // 20-second polling fallback for dashboard metrics
    const pollInterval = setInterval(() => {
      fetchStats();
    }, 20000);

    const subscription = supabase
      .channel('overview-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stats' }, () => fetchStats())
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const stats = await projectService.getDashboardStats();
      const analytics = await projectService.getAnalyticsTrends();
      
      if (stats) {
        setData({
          projects: stats.projects || [],
          messages: stats.messages || [],
          members: stats.members || [],
          tasks: stats.tasks || [],
          invoices: stats.invoices || [],
          visits: stats.visits || 0,
          clientCount: stats.clientCount || 0,
          pendingCount: stats.pendingCount || 0,
          analytics: analytics || { trend: [], topPages: [] }
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Professional Loading State (with auto-resolve)
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 3000); // Safety fallback
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // 5. Protection: Don't render until mounted (Client-side)
  if (!isMounted) return null;
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,212,255,0.2)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-primary animate-pulse">A</span>
          </div>
        </div>
        <p className="mt-6 text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-primary/60 animate-pulse text-center">
          Initializing Aster Control...
        </p>
      </div>
    );
  }

  const totalProjects = data?.projects?.length || 0;
  const totalRevenue = data?.projects?.reduce((acc: number, p: any) => {
    return acc + (parseFloat(p?.budget) || 0);
  }, 0) || 0;

  const statsCards = [
    { label: "Total Projects", value: totalProjects, icon: "folder", change: "+1 today", color: "primary" },
    { label: "Active Clients", value: data.clientCount || 0, icon: "group", change: "Verified", color: "secondary" },
    { label: "Total Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: "payments", change: "Est. Total", color: "primary" },
    { label: "Total Visits", value: data.visits, icon: "monitoring", change: "Live Tracking", color: "secondary" },
    { label: "Pending Approvals", value: data.pendingCount || 0, icon: "verified_user", change: (data.pendingCount || 0) > 0 ? "Action Required" : "All Clear", color: "secondary" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="glass-panel rounded-xl p-6 group hover:border-primary/30 transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 pointer-events-none" />
            <div className="relative z-10">
              <div
                className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color === "primary" ? "bg-primary/20" : "bg-secondary/20"
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl ${stat.color === "primary" ? "text-primary" : "text-secondary"
                    }`}
                >
                  {stat.icon}
                </span>
              </div>
              <div className="text-3xl font-headline mb-1 font-black tracking-tight">{stat.value}</div>
              <div className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 glass-panel rounded-xl p-5 md:p-6 border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              Traffic Trend
            </h3>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded w-fit">Live Sync</span>
          </div>
          <div className="h-[200px] md:h-[250px] w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.analytics.trend}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#8F9199', fontSize: 9}} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1A1C1E', border: '1px solid #ffffff10', borderRadius: '8px', fontSize: '10px'}}
                  itemStyle={{color: '#00D4FF'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#00D4FF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 md:p-6 border border-white/5">
          <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-6 md:mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm">analytics</span>
            Top Sections
          </h3>
          <div className="space-y-5">
            {data.analytics.topPages.map((page: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-on-surface truncate pr-4">{page.name}</span>
                  <span className="text-primary">{page.visits} hits</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${(page.visits / Math.max(...data.analytics.topPages.map((p:any)=>p.visits))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Projects */}
        <div className="glass-panel rounded-xl p-5 md:p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h3 className="text-lg font-headline font-bold">Recent Projects</h3>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs text-primary hover:underline font-bold uppercase tracking-widest"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {data.projects.slice(0, 3).map((project: any) => (
              <div
                key={project.id}
                className="p-4 rounded-xl bg-surface-container-low border border-white/5 hover:border-primary/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-headline text-sm font-bold truncate pr-2">{project.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shrink-0 ${project.status === "In Progress"
                      ? "bg-primary/20 text-primary"
                      : project.status === "Review"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-green-500/20 text-green-400"
                      }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant mb-4 uppercase tracking-widest font-bold opacity-60">{project.client}</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-primary font-black">
                    {project.progress || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass-panel rounded-xl p-5 md:p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h3 className="text-lg font-headline font-bold">Recent Inquiries</h3>
            <button
              onClick={() => setActiveTab("messages")}
              className="text-xs text-primary hover:underline font-bold uppercase tracking-widest"
            >
              Inbox
            </button>
          </div>
          <div className="space-y-3">
            {data.messages.slice(0, 5).map((message: any) => (
              <div
                key={message.id}
                className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 ${message.status === "New" ? "bg-primary/5 border-primary/10" : "bg-surface-container-low"
                  }`}
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 border border-white/5 shadow-inner">
                  <span className="text-xs font-headline font-black text-primary">
                    {message.sender_name?.split(" ").map((n: string) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-headline font-bold truncate">{message.sender_name}</h4>
                    {message.status === "New" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate opacity-70">
                    {message.subject}
                  </p>
                </div>
                <span className="text-[9px] text-on-surface-variant flex-shrink-0 uppercase font-black opacity-50">
                  {isMounted && message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Overview */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h3 className="text-lg font-headline font-bold">Active Team Performance</h3>
          <button
            onClick={() => setActiveTab("team")}
            className="text-xs text-primary hover:underline font-bold uppercase tracking-widest"
          >
            Management
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {data.members.filter((m: any) => m.status === 'Active').slice(0, 4).map((member: any) => {
            const memberTasks = data.tasks.filter((t: any) => t.assignee === member.avatar);
            const completedTasks = memberTasks.filter((t: any) => t.status === 'Done').length;
            
            return (
              <div
                key={member.id}
                className="p-4 rounded-lg bg-surface-container-low border border-white/5 text-center group hover:border-secondary/30 transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-headline text-lg font-black text-primary">
                    {member.avatar}
                  </span>
                </div>
                <h4 className="font-headline text-sm mb-1 font-bold">{member.name}</h4>
                <p className="text-[10px] text-on-surface-variant mb-3 uppercase tracking-widest font-bold">{member.role}</p>
                <div className="flex justify-center gap-2 text-xs">
                  <span className="text-primary font-black">{completedTasks}</span>
                  <span className="text-on-surface-variant opacity-50">/</span>
                  <span className="text-white font-bold">{memberTasks.length}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase ml-1">tasks</span>
                </div>
              </div>
            );
          })}
          {data.members.filter((m: any) => m.status === 'Active').length === 0 && (
            <div className="col-span-4 py-6 text-center text-on-surface-variant italic text-sm">No active members to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}
