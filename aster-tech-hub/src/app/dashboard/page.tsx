"use client";

import { useState, useEffect, useRef } from "react";
import { projectService } from "../../lib/projectService";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isMilestonesLoading, setIsMilestonesLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [confirmComplete, setConfirmComplete] = useState<string | null>(null);

  const activeProjectRef = useRef<any>(null);
  const userProfileRef = useRef<any>(null);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    userProfileRef.current = userProfile;
  }, [userProfile]);


  
  useEffect(() => {
    setMounted(true);
    
    const initializeData = async () => {
      try {
        const profile = await fetchUserProfile();
        if (profile) {
          fetchClientProjects(profile).catch(console.error);
          fetchMeetings(profile).catch(console.error);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // REAL-TIME SUBSCRIPTION (Separate effect to handle profile updates)
  useEffect(() => {
    if (!userProfile) return;

    const subscription = supabase
      .channel('dashboard-sync')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'projects' 
      }, (payload: any) => {
        fetchClientProjects(userProfileRef.current);
        const msg = `Project "${payload.new?.name || 'Update'}" has been updated!`;
        setNotification({ message: msg, type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'activity_logs' 
      }, (payload: any) => {
        if (payload.eventType === 'DELETE' && payload.old?.id) {
          // Optimistic UI update: instantly filter out the deleted log from state
          setProjects(prevProjects => 
            prevProjects.map((p: any) => p.activityLog ? {
              ...p,
              activityLog: p.activityLog.filter((log: any) => log.id !== payload.old.id)
            } : p)
          );

          setActiveProject((prevActive: any) => {
            if (prevActive && prevActive.activityLog) {
              return {
                ...prevActive,
                activityLog: prevActive.activityLog.filter((log: any) => log.id !== payload.old.id)
              };
            }
            return prevActive;
          });
        }

        // Fetch fresh database records to ensure full sync
        fetchClientProjects(userProfileRef.current);

        if (payload.eventType === 'INSERT') {
          setNotification({ message: "New activity updated in your project!", type: 'success' });
          setTimeout(() => setNotification(null), 3000);
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'team_meetings' 
      }, (payload: any) => {
        fetchMeetings(userProfileRef.current);
        const status = (payload.new?.status || '').toLowerCase();
        const msg = status === 'completed' ? "Meeting marked as attended! ✅" : "Meeting details updated.";
        setNotification({ message: msg, type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'team_meetings' 
      }, () => {
        fetchMeetings(userProfileRef.current);
        setNotification({ message: "New meeting scheduled!", type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userProfile]);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      if (profile) {
        setUserProfile(profile);
        return profile;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setIsLoading(false);
    }
    return null;
  };

  const fetchClientProjects = async (profile?: any) => {
    try {
      const activeProfile = profile || userProfileRef.current;
      if (!activeProfile) return;

      const { data: allProjects, error } = await supabase
        .from('projects')
        .select('*, activity_logs(*) ')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedData = (allProjects || []).map((p: any) => ({
        ...p,
        activityLog: p.activity_logs || []
      }));

      // Filter projects where client matches user's name or client_id matches user's ID
      const myProjects = mappedData.filter((p: any) => 
        p.client_id === activeProfile.id || 
        p.client === activeProfile.full_name
      );
      
      setProjects(myProjects);
      
      if (myProjects.length > 0) {
        const currentActive = activeProjectRef.current;
        if (currentActive) {
          const updatedActive = myProjects.find((p: any) => p.id === currentActive.id);
          if (updatedActive) setActiveProject(updatedActive);
        } else {
          setActiveProject(myProjects[0]);
          fetchMilestones(myProjects[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMilestones = async (projectId: string) => {
    try {
      setIsMilestonesLoading(true);
      const data = await projectService.getProjectMilestones(projectId);
      setMilestones(data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    } finally {
      setIsMilestonesLoading(false);
    }
  };

  const fetchMeetings = async (profile?: any) => {
    try {
      const activeProfile = profile || userProfileRef.current;
      if (!activeProfile) return;

      // Try fetching with client_id filter
      const { data, error } = await supabase
        .from('team_meetings')
        .select('*')
        .eq('client_id', activeProfile.id)
        .neq('status', 'Completed')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback: If column doesn't exist (code 42703), fetch all meetings
        if (error.code === '42703') {
          console.warn("client_id column missing, falling back to global meetings.");
          const globalData = await projectService.getTeamMeetings();
          setSubmittedMeetings(globalData || []);
          return;
        }
        throw error;
      }
      setSubmittedMeetings(data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const [submittedMeetings, setSubmittedMeetings] = useState<any[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    name: "",
    review: "",
  });
  const [submittedReviews, setSubmittedReviews] = useState<any[]>([]);
  const [serviceForm, setServiceForm] = useState({
    serviceType: "",
    projectName: "",
    description: "",
    budget: "",
    timeline: "",
  });

  const handleCompleteMeeting = async (meetingId: string) => {
    try {
      await projectService.updateMeetingStatus(meetingId, 'Completed');
      fetchMeetings();
      showNotify("Meeting marked as attended.");
    } catch (error) {
      console.error("Error completing meeting:", error);
      showNotify("Failed to update status.", "error");
    }
  };

  const handleRequestService = async (e: any) => {
    e.preventDefault();
    if (serviceForm.serviceType && serviceForm.projectName && serviceForm.description) {
      try {
        const msgData = {
          sender_name: userProfile?.full_name || "Unknown Client",
          sender_email: userProfile?.email || "",
          subject: `Service Request: ${serviceForm.projectName}`,
          content: `Type: ${serviceForm.serviceType}\nBudget: ${serviceForm.budget}\nTimeline: ${serviceForm.timeline}\n\nDescription: ${serviceForm.description}`,
          type: "Service Request",
          status: "New"
        };
        await projectService.createMessage(msgData);
        setServiceForm({ serviceType: "", projectName: "", description: "", budget: "", timeline: "" });
        setShowServiceModal(false);
        showNotify("Service request submitted successfully!");
      } catch (error) {
        console.error("Error requesting service:", error);
        showNotify("Failed to submit request.", "error");
      }
    }
  };

  const handleSubmitReview = async (e: any) => {
    e.preventDefault();
    if (reviewForm.name && reviewForm.review) {
      try {
        const newReview = {
          rating: reviewForm.rating,
          name: reviewForm.name,
          review: reviewForm.review,
          date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        await projectService.createReview(newReview);
        setReviewForm({ rating: 5, name: "", review: "" });
        setShowReviewModal(false);
        showNotify("Thank you for your review!");
      } catch (error) {
        console.error("Error submitting review:", error);
        showNotify("Failed to submit review.", "error");
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[250px] flex items-center justify-center px-6 py-12 overflow-hidden border-b border-white/5 mb-12">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.05),transparent_70%)]" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-headline tracking-widest uppercase shadow-[0_0_15px_rgba(0,212,255,0.2)]">
             Client Portal
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight mb-4">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
              {userProfile?.full_name || "Valued Client"}
            </span>
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Track your project milestones, upcoming schedules, and recent updates.
          </p>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column - Services & Details */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Services Overview List */}
                <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl">
                  <h2 className="text-lg font-headline font-bold mb-6 text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">work</span>
                    Active Projects
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setActiveProject(project);
                          fetchMilestones(project.id);
                        }}
                        className={`p-5 rounded-2xl text-left transition-all duration-300 border relative overflow-hidden group hover:-translate-y-1 ${
                          activeProject?.id === project.id
                            ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(0,212,255,0.15)]"
                            : "bg-surface-container-low border-white/5 hover:border-primary/20"
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[30px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activeProject?.id === project.id ? 'bg-primary/20' : 'bg-surface-container-high'}`}>
                            <span className={`material-symbols-outlined text-xl ${activeProject?.id === project.id ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                              {project.status === "In Progress" ? "rocket_launch" : "design_services"}
                            </span>
                          </div>
                          <span className="font-headline font-bold text-sm uppercase tracking-wide text-on-surface">
                            {project.name}
                          </span>
                        </div>
                        
                        <div className="mb-3 relative z-10">
                          <div className="flex justify-between text-[10px] mb-1 font-bold tracking-widest uppercase">
                            <span className="text-on-surface-variant">Progress</span>
                            <span className="text-primary">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 relative"
                              style={{ width: `${project.progress}%` }}
                            >
                            </div>
                          </div>
                        </div>
                        
                        <span className={`relative z-10 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                            project.status === "In Progress"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : project.status === "Review"
                              ? "bg-secondary/10 text-secondary border-secondary/20"
                              : project.status === "Planning"
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              : "bg-green-500/10 text-green-400 border-green-500/20"
                          }`}
                        >
                          {project.status}
                        </span>
                      </button>
                    ))}
                    {projects.length === 0 && (
                      <div className="col-span-full py-12 px-6 rounded-3xl bg-surface-container-low border border-dashed border-white/10 text-center animate-in fade-in duration-700">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                          <span className="material-symbols-outlined text-4xl text-primary animate-pulse">explore</span>
                        </div>
                        <h3 className="text-xl font-headline font-bold text-white mb-2">Ready to Start Your Journey?</h3>
                        <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-8">
                          You don't have any active projects yet. Once our team initializes your project, it will appear here for you to track.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                          <button onClick={() => setShowServiceModal(true)} className="px-6 py-3 bg-primary text-background rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">Request a Service</button>
                          <Link href="/tickets" className="px-6 py-3 bg-surface-container-high text-white rounded-xl text-xs font-bold uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">Contact Support</Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Service Details */}
                 {activeProject && (
                  <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <div>
                         <h2 className="text-2xl font-headline font-black text-white mb-1">
                           {activeProject.name}
                         </h2>
                         <p className="text-on-surface-variant text-sm">
                           Comprehensive development and strategy for your digital presence.
                         </p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                        <span className="material-symbols-outlined text-3xl text-primary">
                          {activeProject.status === "In Progress" ? "rocket" : "auto_fix"}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Milestones Checklist */}
                      <div>
                        <h3 className="text-[10px] font-headline font-bold mb-4 uppercase tracking-widest text-on-surface-variant flex items-center justify-between">
                          <span>Project Milestones</span>
                          {milestones.length > 0 && (
                            <span className="text-primary">{milestones.filter(m => m.status === 'completed').length}/{milestones.length} Done</span>
                          )}
                        </h3>
                        <div className="flex flex-col gap-3">
                          {isMilestonesLoading ? (
                             <div className="flex justify-center py-6">
                               <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                             </div>
                          ) : milestones.length === 0 ? (
                            <div className="p-4 rounded-xl bg-surface-container-low border border-dashed border-white/10 text-center">
                              <p className="text-xs text-on-surface-variant">No specific milestones tracked yet.</p>
                            </div>
                          ) : (
                            milestones.map((item: any) => (
                              <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                item.status === 'completed' ? 'bg-primary/5 border-primary/20' : 'bg-surface-container-low border-white/5'
                              }`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                  item.status === 'completed' ? 'bg-primary text-background shadow-[0_0_10px_rgba(0,212,255,0.4)]' : 'border border-white/20'
                                }`}>
                                  {item.status === 'completed' ? (
                                    <span className="material-symbols-outlined text-[16px] font-black">check</span>
                                  ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                                  )}
                                </div>
                                <div>
                                  <span className={`text-sm font-medium transition-all ${item.status === 'completed' ? 'text-on-surface-variant line-through' : 'text-white'}`}>
                                    {item.text}
                                  </span>
                                  {item.status === 'completed' && (
                                    <p className="text-[9px] text-primary uppercase tracking-tighter mt-0.5">Completed</p>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Team & Deadline */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-[10px] font-headline font-bold mb-4 uppercase tracking-widest text-on-surface-variant">
                            Assigned Team
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {activeProject.team?.split(",").map((member: string, index: number) => (
                              <div
                                key={index}
                                className="px-4 py-2 rounded-full bg-surface-container-low border border-white/5 flex items-center gap-2 text-sm font-headline"
                              >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-center text-[#0a0a0f] font-black text-[10px]">
                                  {member.trim()[0]}
                                </div>
                                {member.trim()}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[10px] font-headline font-bold mb-4 uppercase tracking-widest text-on-surface-variant">
                            Expected Delivery
                          </h3>
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-primary/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="material-symbols-outlined text-primary">event</span>
                            </div>
                            <div>
                              <p className="text-xs text-on-surface-variant mb-0.5">Deadline Date</p>
                              <p className="text-sm font-headline font-bold text-white">
                                {activeProject.deadline || "TBD"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                
                {/* Upcoming Meetings */}
                <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl">
                  <h2 className="text-sm font-headline font-bold mb-6 text-on-surface flex items-center gap-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-secondary">calendar_month</span>
                    Upcoming Meetings
                  </h2>
                  <div className="space-y-4">
                    {submittedMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-4 rounded-xl bg-surface-container-low border border-white/5 hover:border-secondary/30 transition-all hover:-translate-y-1 group relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-headline font-bold text-sm text-white group-hover:text-secondary transition-colors">
                            {meeting.title}
                          </h3>
                          <button 
                            onClick={() => setConfirmComplete(meeting.id)}
                            title="Mark as Attended"
                            className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px] font-black">check</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> {meeting.date}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {meeting.time}</span>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border bg-secondary/10 text-secondary border-secondary/20">
                            {meeting.type || (meeting.description?.includes('Type: ') ? meeting.description.split(' | ')[0].replace('Type: ', '') : 'Video Call')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {submittedMeetings.length === 0 && (
                      <p className="text-xs text-on-surface-variant text-center py-4">No meetings scheduled.</p>
                    )}
                  </div>
                </div>

                {/* Recent Updates */}
                <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl">
                  <h2 className="text-sm font-headline font-bold mb-6 text-on-surface flex items-center gap-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-primary">history</span>
                    Activity Log
                  </h2>
                   <div className="space-y-5">
                    {activeProject?.activityLog
                      ?.filter((log: any) => log.type !== 'milestone')
                      ?.slice()
                      ?.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())
                      ?.map((update: any) => (
                        <div
                          key={update.id}
                          className="flex items-start gap-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                            <span className="material-symbols-outlined text-sm text-primary">
                              {update.type === 'chat' ? 'message' : update.type === 'event' ? 'event' : 'check'}
                            </span>
                          </div>
                          <div className="pt-1">
                            <p className="text-sm text-on-surface font-medium leading-tight mb-1">{update.text}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                              {new Date(update.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • by {update.created_by || 'Admin'}
                            </p>
                          </div>
                        </div>
                    ))}
                    {(!activeProject?.activityLog || activeProject.activityLog.filter((log: any) => log.type !== 'milestone').length === 0) && (
                      <p className="text-xs text-on-surface-variant text-center py-4">No recent activity.</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl">
                  <h2 className="text-sm font-headline font-bold mb-5 text-on-surface uppercase tracking-wider">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <Link
                      href="/tickets"
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">support_agent</span>
                        <span className="text-sm font-medium">Get Support</span>
                      </div>
                      <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-white transition-colors group-hover:translate-x-1">arrow_forward</span>
                    </Link>
                    <button
                      onClick={() => setShowServiceModal(true)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">add_circle</span>
                        <span className="text-sm font-medium">Request Service</span>
                      </div>
                      <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-white transition-colors group-hover:translate-x-1">arrow_forward</span>
                    </button>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">star</span>
                        <span className="text-sm font-medium">Leave a Review</span>
                      </div>
                      <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-white transition-colors group-hover:translate-x-1">arrow_forward</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODALS */}

      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-6 md:p-8 w-full max-w-md mx-4 border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Request Service</h3>
              <button onClick={() => setShowServiceModal(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors bg-surface-container-low p-2 rounded-lg">close</button>
            </div>
            <form onSubmit={handleRequestService} className="space-y-4">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Service Type</label>
                <select required value={serviceForm.serviceType} onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm">
                  <option value="">Select a service</option>
                  <option value="web">Web Development</option>
                  <option value="app">App Development</option>
                  <option value="data">Data Analytics</option>
                  <option value="marketing">Digital Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Project Name</label>
                <input required type="text" maxLength={100} value={serviceForm.projectName} onChange={(e) => setServiceForm({ ...serviceForm, projectName: e.target.value })} placeholder="e.g., E-commerce Platform" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Project Description</label>
                <textarea required maxLength={2000} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Describe requirements..." rows={3} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
                <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] transition-all">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-6 md:p-8 w-full max-w-md mx-4 border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Leave Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors bg-surface-container-low p-2 rounded-lg">close</button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Your Name</label>
                <input required type="text" maxLength={100} value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="material-symbols-outlined text-3xl transition-all hover:scale-110"
                      style={{ color: star <= reviewForm.rating ? "#00D4FF" : "rgba(255,255,255,0.1)" }}
                    >
                      star
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Your Review</label>
                <textarea required maxLength={1000} value={reviewForm.review} onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })} placeholder="Share your experience..." rows={4} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] transition-all">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Complete Confirmation Modal */}
      {confirmComplete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-secondary/30 shadow-[0_0_50px_rgba(0,212,255,0.1)] text-center">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-secondary">check_circle</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-2 text-white">Meeting Attended?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              Have you attended this meeting? Marking it as complete will move it to history.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmComplete(null)}
                className="flex-1 py-3 rounded-xl bg-surface-container-low border border-white/5 text-sm font-headline text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleCompleteMeeting(confirmComplete);
                  setConfirmComplete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-secondary text-background text-sm font-headline font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all"
              >
                Yes, Attended
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[300] px-6 py-4 rounded-xl border backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-6 duration-500 ${
          notification.type === 'success' 
            ? 'bg-slate-900/90 border-secondary/30 text-secondary shadow-secondary/5' 
            : 'bg-slate-900/90 border-red-500/30 text-red-400 shadow-red-500/5'
        }`}>
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-secondary/10' : 'bg-red-500/10'
            }`}>
              <span className="material-symbols-outlined text-sm font-bold">
                {notification.type === 'success' ? 'check_circle' : 'error'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-headline font-black uppercase tracking-[0.2em] opacity-50 mb-0.5">Notification</span>
              <span className="font-headline font-bold text-xs uppercase tracking-widest">{notification.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
