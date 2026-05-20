"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { initialTasks, TaskStatus, KanbanTask, teamMeetings } from "../admin/data";
import { projectService } from "../../lib/projectService";
import { supabase } from "../../lib/supabase";
import MeetingsTab from "./components/MeetingsTab";

export default function TeamDashboard() {
  const [activeTab, setActiveTab] = useState<"tasks" | "meetings">("tasks");
  const [meetings, setMeetings] = useState<any[]>([]);
  const [hasNewMeeting, setHasNewMeeting] = useState(false);
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    avatar: string;
    role: string;
    email: string;
  }>({
    name: "Loading...",
    avatar: "??",
    role: "Loading Workspace...",
    email: "",
  });

  const fetchActiveUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Fetch profile role and status
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch team member details matching by authenticated email address
      const { data: member } = await supabase
        .from('team_members')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      const name = member?.name || profile?.full_name || user.email?.split('@')[0] || "Team Member";
      const avatar = member?.avatar || name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || "TM";
      const role = member?.role || profile?.role || "Team Member";

      const updatedUser = {
        name,
        avatar,
        role,
        email: user.email || ""
      };
      
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Error fetching active user:", err);
      return null;
    }
  };

  const fetchBoardData = async (userAvatar: string) => {
    try {
      setIsLoading(true);
      const [tasksData, meetingsData] = await Promise.all([
        projectService.getTasks(),
        projectService.getTeamMeetings()
      ]);
      
      // Filter tasks where task assignee matches current user avatar (initials like "PN")
      setTasks(tasksData.filter((task: any) => task.assignee === userAvatar));
      
      // Filter meetings: Show only if invited or if it's for "All"
      const myMeetings = meetingsData.filter((m: any) => 
        m.attendees === "All" || 
        m.attendees?.split(",").map((a: string) => a.trim()).includes(userAvatar)
      );
      setMeetings(myMeetings);
    } catch (error) {
      console.error("Error fetching board data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    const initialize = async () => {
      const activeUser = await fetchActiveUser();
      if (activeUser) {
        await fetchBoardData(activeUser.avatar);
      } else {
        setIsLoading(false);
      }
    };

    initialize();

    // Real-time subscription
    const subscription = supabase
      .channel('team-dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        initialize();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_meetings' }, () => {
        initialize();
        setHasNewMeeting(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: "Todo", title: "To Do", color: "bg-surface-container-low" },
    { id: "InProgress", title: "In Progress", color: "bg-primary/10 border-primary/20" },
    { id: "Review", title: "Review (Wait for Admin)", color: "bg-secondary/10 border-secondary/20" },
    { id: "Done", title: "Completed", color: "bg-green-500/10 border-green-500/20" },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    try {
      await projectService.updateTaskStatus(taskId, status);
      // Local update for snappiness
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Simplified for Team */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-surface border-r border-white/5 flex flex-col transition-all duration-300 z-20`}
      >
        <div className="p-6 border-b border-white/5 h-20 flex items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary to-primary flex items-center justify-center shrink-0">
              <span className="text-xl font-black text-on-primary">W</span>
            </div>
            {sidebarOpen && (
              <div className="whitespace-nowrap">
                <h1 className="font-headline font-bold text-lg">Workspace</h1>
                <p className="text-xs text-on-surface-variant">Team Portal</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab("tasks")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "tasks" 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10" 
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">task_alt</span>
                {sidebarOpen && <span className="font-headline text-sm">My Tasks</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab("meetings");
                  setHasNewMeeting(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                  activeTab === "meetings" 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10" 
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">event</span>
                {sidebarOpen && <span className="font-headline text-sm">Meetings</span>}
                {hasNewMeeting && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-surface animate-pulse" />
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* Current Logged In User Profile */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <span className="font-headline text-on-primary">{currentUser.avatar}</span>
            </div>
            {sidebarOpen && (
              <div className="whitespace-nowrap">
                <p className="text-sm font-headline text-white">{currentUser.name}</p>
                <p className="text-xs text-on-surface-variant">{currentUser.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-headline">Hello, <span className="text-primary font-bold">{currentUser.name}</span> 👋</h2>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-white/10 transition-colors text-sm font-headline flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Logout</span>
          </Link>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "tasks" ? (
            <>
              <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <h3 className="text-xl font-headline mb-2">My Task Board</h3>
                <p className="text-sm text-on-surface-variant">
                  Move tasks to update your manager. You cannot create or delete tasks here.
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex gap-6 overflow-x-auto pb-8 items-start select-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      className={`flex-shrink-0 w-80 rounded-xl p-4 border border-white/5 ${col.color} min-h-[500px] flex flex-col`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-headline text-sm uppercase tracking-wider">{col.title}</h4>
                        <span className="px-2 py-1 rounded-full bg-black/40 text-xs text-on-surface-variant font-bold border border-white/5">
                          {tasks.filter(t => t.status === col.id).length}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        {tasks.filter(t => t.status === col.id).map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => setSelectedTask(task)}
                            className="p-5 rounded-xl bg-surface border border-white/10 hover:border-primary/50 shadow-lg cursor-pointer hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                            <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                task.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                task.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                                'bg-green-500/20 text-green-400 border border-green-500/30'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="material-symbols-outlined text-xs text-on-surface-variant/40 group-hover:text-primary group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-300">
                                open_in_new
                              </span>
                            </div>
                            <h5 className="font-headline text-sm mb-1.5 text-on-surface group-hover:text-primary transition-colors leading-tight">{task.title}</h5>
                            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{task.description}</p>
                          </div>
                        ))}
                        {tasks.filter(t => t.status === col.id).length === 0 && (
                          <div className="h-24 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-xs text-on-surface-variant/50">
                            Drag here
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <MeetingsTab initialMeetings={meetings} />
          )}
        </div>
      </main>

      {/* Premium Task Details Modal */}
      {selectedTask && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedTask(null)}
        >
          <div 
            className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-primary" />
            
            {/* Header */}
            <div className="p-6 pb-4 flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  selectedTask.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                  selectedTask.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                  'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {selectedTask.priority} Priority
                </span>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              <div>
                <h4 className="text-xl font-headline font-bold text-white mb-2">{selectedTask.title}</h4>
                <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className={`material-symbols-outlined text-sm ${
                      selectedTask.status === 'Todo' ? 'text-gray-400' :
                      selectedTask.status === 'InProgress' ? 'text-primary' :
                      selectedTask.status === 'Review' ? 'text-secondary' :
                      'text-green-500'
                    }`}>
                      {selectedTask.status === 'Todo' ? 'circle' :
                       selectedTask.status === 'InProgress' ? 'play_circle' :
                       selectedTask.status === 'Review' ? 'pending' :
                       'check_circle'}
                    </span>
                    <span>Status: <strong className="text-white">
                      {selectedTask.status === 'Todo' ? 'To Do' :
                       selectedTask.status === 'InProgress' ? 'In Progress' :
                       selectedTask.status === 'Review' ? 'In Review' :
                       'Completed'}
                    </strong></span>
                  </div>
                  {selectedTask.due_date && (
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-secondary">calendar_today</span>
                      <span>Due: <strong className="text-white">{new Date(selectedTask.due_date).toLocaleDateString()}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h5 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-2">Detailed Description</h5>
                <div className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 max-h-60 overflow-y-auto font-sans">
                  {selectedTask.description || "No description provided for this task."}
                </div>
              </div>

              {/* Status Update Options directly in the modal */}
              <div className="border-t border-white/5 pt-4">
                <h5 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-3">Update Status</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {columns.map((col) => (
                    <button
                      key={col.id}
                      onClick={async () => {
                        try {
                          await projectService.updateTaskStatus(selectedTask.id, col.id);
                          setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: col.id } : t));
                          setSelectedTask((prev: any) => prev ? { ...prev, status: col.id } : null);
                        } catch (error) {
                          console.error("Error updating status:", error);
                        }
                      }}
                      className={`px-2 py-2 rounded-lg text-xs font-bold transition-all border ${
                        selectedTask.status === col.id
                          ? "bg-primary/20 text-primary border-primary"
                          : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {col.id === 'Todo' ? 'To Do' :
                       col.id === 'InProgress' ? 'In Progress' :
                       col.id === 'Review' ? 'In Review' :
                       'Completed'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
