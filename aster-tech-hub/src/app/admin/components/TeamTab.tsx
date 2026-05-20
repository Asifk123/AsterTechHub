import React, { useState, useEffect } from "react";
import { projectService } from "../../../lib/projectService";
import { supabase } from "../../../lib/supabase";
import { KanbanTask, TaskStatus, Meeting } from "../data";

export default function TeamTab() {
  const [team, setTeam] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal States
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showRegisterMember, setShowRegisterMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form States
  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "", priority: "Medium" as "High" | "Medium" | "Low" });
  const [newMeeting, setNewMeeting] = useState({ 
    title: "", 
    description: "", 
    time: "", 
    date: "",
    type: "Video Call",
    priority: "High" as "High" | "Normal",
    attendees: [] as string[],
    clientId: ""
  });
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "", // In real app, we'd use Supabase Auth, but user asked for these fields
    role: "Developer"
  });
  const [movingTask, setMovingTask] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchData();

    // Real-time subscription for everything
    const subscription = supabase
      .channel('team-tab-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_meetings' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, meetingsData, membersData, { data: clientsData }] = await Promise.all([
        projectService.getTasks(),
        projectService.getTeamMeetings(),
        projectService.getTeamMembers(),
        supabase.from('profiles').select('*').eq('role', 'client').eq('status', 'approved')
      ]);
      setTasks(tasksData);
      setMeetings(meetingsData);
      setClients(clientsData || []);
      
      // Separate Active and Pending members
      setTeam(membersData.filter((m: any) => m.status === 'Active'));
      setPending(membersData.filter((m: any) => m.status === 'Pending'));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    try {
      const memberData = {
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        status: 'Pending', // All new members start as pending
        avatar: newMember.name.split(" ").map(n => n[0]).join("").toUpperCase()
      };

      await projectService.addTeamMember(memberData);
      setShowRegisterMember(false);
      setNewMember({ name: "", email: "", password: "", role: "Developer" });
      showNotify("Member registered! They are now in the 'Pending Onboarding' section.");
      fetchData();
    } catch (error) {
      console.error("Error registering member:", error);
      showNotify("Error registering member.", 'error');
    }
  };

  const handleApproveMember = async (id: string) => {
    try {
      await projectService.updateMemberStatus(id, 'Active');
      showNotify("Member access granted!");
      fetchData();
    } catch (error) {
      console.error("Error approving member:", error);
      showNotify("Error approving member.", 'error');
    }
  };

  const handleDeleteMember = (id: string) => {
    setMemberToDelete(id);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      await projectService.deleteTeamMember(memberToDelete);
      showNotify("Member removed successfully.");
      setMemberToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting member:", error);
      showNotify("Error removing member.", 'error');
      setMemberToDelete(null);
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      const { id, created_at, ...updates } = selectedMember;
      await projectService.updateTeamMember(id, updates);
      setShowEditMember(false);
      showNotify("Member details updated!");
      fetchData();
    } catch (error) {
      console.error("Error updating member:", error);
      showNotify("Error updating member.", 'error');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        status: "Todo",
        assignee: newTask.assignee,
        priority: newTask.priority,
      };
      
      await projectService.createTask(taskData);
      setShowAddTask(false);
      setNewTask({ title: "", description: "", assignee: "", priority: "Medium" });
      fetchData();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await projectService.deleteTask(taskToDelete);
      showNotify("Task deleted successfully!");
      setTaskToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
      showNotify("Error deleting task.", 'error');
      setTaskToDelete(null);
    }
  };

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.date) return;
    
    try {
      const meeting = {
        title: newMeeting.title,
        description: `Type: ${newMeeting.type} | ${newMeeting.description || 'Project Discussion'}`,
        time: newMeeting.time,
        date: newMeeting.date,
        status: "Active",
        priority: newMeeting.priority,
        attendees: newMeeting.attendees.join(","),
        client_id: newMeeting.clientId || null
      };
      
      await projectService.createTeamMeeting(meeting);
      setShowAddMeeting(false);
      setNewMeeting({ title: "", description: "", time: "", date: "", type: "Video Call", priority: "High", attendees: [], clientId: "" });
      showNotify("Meeting scheduled successfully!");
      fetchData();
    } catch (error) {
      console.error("Error adding meeting:", error);
      showNotify("Error scheduling meeting.", 'error');
    }
  };

  const handleCompleteMeeting = async (meetingId: string) => {
    try {
      await projectService.updateMeetingStatus(meetingId, 'Completed');
      showNotify("Meeting marked as completed.");
      fetchData();
    } catch (error) {
      console.error("Error completing meeting:", error);
      showNotify("Error updating status.", 'error');
    }
  };

  const toggleAttendee = (avatar: string) => {
    setNewMeeting(prev => ({
      ...prev,
      attendees: prev.attendees.includes(avatar) 
        ? prev.attendees.filter(a => a !== avatar)
        : [...prev.attendees, avatar]
    }));
  };

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: "Todo", title: "To Do", color: "bg-surface-container-low" },
    { id: "InProgress", title: "In Progress", color: "bg-primary/10 border-primary/20" },
    { id: "Review", title: "Review", color: "bg-secondary/10 border-secondary/20" },
    { id: "Done", title: "Done", color: "bg-green-500/10 border-green-500/20" },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Notification */}
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

      {/* Pending Team Onboarding Section */}
      {pending.length > 0 && (
        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500 mb-8">
          <div className="px-4 py-4 md:px-6 border-b border-secondary/10 flex flex-col sm:flex-row sm:items-center justify-between bg-secondary/5 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-base font-bold">badge</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-headline font-bold text-secondary text-sm md:text-base truncate">Pending Team Onboarding</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter opacity-80">Approved members waiting for profile setup</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-lg text-[10px] font-black uppercase tracking-widest w-fit shrink-0">
              {pending.length} New Requests
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((request) => (
              <div key={request.id} className="glass-panel border-white/5 p-5 rounded-xl flex flex-col gap-4 group hover:border-secondary/30 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="font-headline font-bold text-sm text-white group-hover:text-secondary transition-colors truncate">{request.name}</p>
                    <p className="text-[10px] text-on-surface-variant mb-2 truncate opacity-70">{request.email}</p>
                    <span className="text-[9px] font-black text-secondary bg-secondary/10 px-2 py-1 rounded uppercase tracking-wider">{request.role}</span>
                  </div>
                  <span className="text-[9px] text-on-surface-variant bg-white/5 px-2 py-1 rounded shrink-0 font-bold">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <button 
                    onClick={() => handleApproveMember(request.id)}
                    className="w-full py-2.5 bg-secondary text-on-secondary rounded-lg text-[10px] font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-secondary/20"
                  >
                    Verify & Grant Team Access
                  </button>
                  <button 
                    onClick={() => handleDeleteMember(request.id)}
                    className="w-full py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Remove Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Overview Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-headline">Team Overview</h3>
          <p className="text-xs text-on-surface-variant">Manage your elite engineering team</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowRegisterMember(true)} className="px-5 py-2.5 bg-white/5 border border-white/10 text-on-surface rounded-lg text-sm font-headline hover:bg-white/10 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Register Member
          </button>
          <button onClick={() => setShowAddMeeting(true)} className="px-5 py-2.5 bg-secondary/10 border border-secondary/30 text-secondary rounded-lg text-sm font-headline hover:bg-secondary/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm font-bold">broadcast_on_home</span>
            Broadcast
          </button>
          <button 
            onClick={() => {
              setNewTask({ ...newTask, assignee: team.length > 0 ? team[0].avatar : "" });
              setShowAddTask(true);
            }} 
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg text-sm font-headline shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Active Team Slider */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {team.map((member) => (
          <div key={member.id} className="flex-shrink-0 w-64 p-4 rounded-xl glass-panel border border-white/5 flex items-center gap-4 group hover:border-primary/30 transition-all relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-surface to-surface-container-high border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="font-headline text-primary text-sm font-bold">{member.avatar}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-headline text-sm text-on-surface">{member.name}</h4>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{member.role}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setSelectedMember(member); setShowEditMember(true); }} className="p-1 hover:bg-white/10 rounded text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[14px]">edit</span>
              </button>
              <button onClick={() => handleDeleteMember(member.id)} className="p-1 hover:bg-red-500/10 rounded text-on-surface-variant hover:text-red-400 transition-colors">
                <span className="material-symbols-outlined text-[14px]">delete</span>
              </button>
            </div>
          </div>
        ))}
        {team.length === 0 && !isLoading && (
          <p className="text-sm text-on-surface-variant italic py-4">No active members yet.</p>
        )}
      </div>

      {/* Meetings Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-headline">Upcoming Meetings</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {meetings.filter(m => m.status !== 'Completed').map((meeting) => (
              <div key={meeting.id} className="p-5 rounded-2xl glass-panel border-white/5 hover:border-secondary/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-[30px] rounded-full pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-headline font-bold text-sm text-white group-hover:text-secondary transition-colors">{meeting.title}</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Broadcast</p>
                  </div>
                  <button 
                    onClick={() => handleCompleteMeeting(meeting.id.toString())}
                    className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-all"
                    title="Mark as Completed"
                  >
                    <span className="material-symbols-outlined text-sm font-black">check</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium mb-4">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> {meeting.time}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">event</span> {meeting.date}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meeting.priority === 'High' && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">High Priority</span>
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">Active</span>
                </div>
              </div>
            ))}
            {meetings.filter(m => m.status !== 'Completed').length === 0 && (
              <div className="col-span-full py-12 px-6 rounded-3xl bg-surface-container-low border border-dashed border-white/10 text-center">
                 <p className="text-sm text-on-surface-variant">No active meetings or broadcasts.</p>
              </div>
            )}
          </div>
        </div>

        {/* Meeting Stats/History Summary */}
        <div className="glass-panel p-6 rounded-2xl border-white/5 h-fit">
          <h4 className="font-headline font-bold text-sm mb-6 uppercase tracking-widest text-on-surface-variant">Meeting Insights</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Total Sessions</span>
              <span className="text-sm font-bold text-white">{meetings.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Completed</span>
              <span className="text-sm font-bold text-green-400">{meetings.filter(m => m.status === 'Completed').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Active Broadcasts</span>
              <span className="text-sm font-bold text-secondary">{meetings.filter(m => m.status !== 'Completed').length}</span>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-on-surface-variant leading-relaxed italic">
                Marking a meeting as completed will remove it from the live dashboards of all assigned attendees and clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-headline">Task Board <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full ml-2 align-middle uppercase tracking-widest">CEO Live Control</span></h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 items-start select-none scrollbar-hide -mx-2 px-2">
            {columns.map((col) => (
              <div
                key={col.id}
                className={`flex-shrink-0 w-80 rounded-xl p-4 border border-white/5 ${col.color} min-h-[500px] flex flex-col`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const taskId = e.dataTransfer.getData("taskId");
                  projectService.updateTaskStatus(taskId, col.id).then(() => fetchData());
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-headline text-xs uppercase tracking-widest font-bold">{col.title}</h4>
                  <span className="px-2 py-1 rounded-full bg-black/40 text-[10px] text-on-surface-variant font-black border border-white/5">
                    {tasks.filter(t => t.status === col.id).length}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {tasks.filter(t => t.status === col.id).map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                      className="p-5 rounded-xl bg-surface border border-white/10 hover:border-primary/50 shadow-lg cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          task.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                          task.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {task.priority}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                            className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete Task"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                          <div className="w-7 h-7 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                      <h5 className="font-headline text-sm mb-1.5 text-on-surface leading-tight font-bold">{task.title}</h5>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">{task.description}</p>
                      
                      {/* Mobile Move Button */}
                      <button 
                        onClick={() => setMovingTask(task)}
                        className="md:hidden w-full py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">move_item</span>
                        Move Status
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      
      {/* Register Member Modal */}
      {showRegisterMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Add Team Member</h3>
              <button onClick={() => setShowRegisterMember(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors bg-surface-container-low p-2 rounded-lg">close</button>
            </div>
            <form onSubmit={handleRegisterMember} className="space-y-5">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Full Name</label>
                <input required type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. Priya Nayak" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Email Address</label>
                <input required type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="priya@astertech.com" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Temporary Password</label>
                <input required type="text" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="Create a temporary password" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Department / Role</label>
                <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="Junior Developer">Junior Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Marketing Lead">Marketing Lead</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                  <option value="Digital Marketer">Digital Marketer</option>
                  <option value="Intern - Software Development">Intern - Software Development</option>
                  <option value="Intern - Digital Marketing">Intern - Digital Marketing</option>
                  <option value="Intern - Cyber Security">Intern - Cyber Security</option>
                  <option value="Intern - Data Analytics">Intern - Data Analytics</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowRegisterMember(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] transition-all">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Assign New Task</h3>
              <button onClick={() => setShowAddTask(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors bg-surface-container-low p-2 rounded-lg">close</button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-5">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Task Title</label>
                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. Optimize Database" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Task Details & Instructions</label>
                <textarea required value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm min-h-[100px] resize-y" placeholder="Provide clear instructions for the team member..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Assign To</label>
                  <select value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                    {team.map(m => (
                      <option key={m.id} value={m.avatar}>{m.name}</option>
                    ))}
                    {team.length === 0 && <option value="">No Team Members</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowAddTask(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Meeting Modal */}
      {showAddMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-secondary/30 shadow-[0_0_50px_rgba(255,100,255,0.15)] transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-pink-500">Schedule Meeting</h3>
              <button onClick={() => setShowAddMeeting(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors bg-surface-container-low p-2 rounded-lg">close</button>
            </div>
            <form onSubmit={handleAddMeeting} className="space-y-5">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Select Client (Specific Broadcast)</label>
                <select 
                  value={newMeeting.clientId} 
                  onChange={e => setNewMeeting({...newMeeting, clientId: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-sm"
                >
                  <option value="">Global (All Team Members)</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Meeting Title</label>
                <input required type="text" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-sm" placeholder="e.g. Project Kickoff" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Date</label>
                  <input required type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Time</label>
                  <input required type="text" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-sm" placeholder="e.g. 10:30 AM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Meeting Type</label>
                  <select value={newMeeting.type} onChange={e => setNewMeeting({...newMeeting, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-sm">
                    <option value="Video Call">Video Call</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Priority</label>
                  <select value={newMeeting.priority} onChange={e => setNewMeeting({...newMeeting, priority: e.target.value as any})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-sm">
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Description / Meeting Link</label>
                <textarea value={newMeeting.description} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-sm resize-none" rows={3} placeholder="e.g. Discussing project milestone updates..." />
              </div>
              
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Notify Attendees (Team)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {team.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleAttendee(m.avatar)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                        newMeeting.attendees.includes(m.avatar)
                          ? "bg-secondary text-on-secondary border-secondary"
                          : "bg-white/5 text-on-surface-variant border-white/10 hover:border-secondary/30"
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowAddMeeting(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-secondary to-pink-500 text-on-secondary font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,100,255,0.3)] transition-all">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Move Modal for Mobile */}
      {movingTask && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm md:hidden p-4 animate-in fade-in duration-300">
          <div className="glass-panel w-full rounded-t-3xl p-6 border-t border-primary/30 animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest mb-1">Quick Move</p>
                <h3 className="text-lg font-headline font-bold text-white line-clamp-1">{movingTask.title}</h3>
              </div>
              <button onClick={() => setMovingTask(null)} className="p-2 bg-white/5 rounded-full">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {columns.map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    projectService.updateTaskStatus(movingTask.id, col.id).then(() => {
                      fetchData();
                      setMovingTask(null);
                    });
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    movingTask.status === col.id 
                      ? "bg-primary text-[#0a0a0f] border-primary" 
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {col.id === 'Todo' ? 'list' : col.id === 'InProgress' ? 'bolt' : col.id === 'Review' ? 'visibility' : 'check_circle'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{col.title}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setMovingTask(null)}
              className="w-full py-4 rounded-xl bg-white/5 text-on-surface font-headline font-bold uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Edit Member Modal */}
      {showEditMember && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Edit Team Member</h3>
              <button onClick={() => setShowEditMember(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors bg-surface-container-low p-2 rounded-lg">close</button>
            </div>
            <form onSubmit={handleUpdateMember} className="space-y-5">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Full Name</label>
                <input required type="text" value={selectedMember.name} onChange={e => setSelectedMember({...selectedMember, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Email Address</label>
                <input required type="email" value={selectedMember.email} onChange={e => setSelectedMember({...selectedMember, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Department / Role</label>
                <select value={selectedMember.role} onChange={e => setSelectedMember({...selectedMember, role: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="Junior Developer">Junior Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Marketing Lead">Marketing Lead</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                  <option value="Digital Marketer">Digital Marketer</option>
                  <option value="Intern - Software Development">Intern - Software Development</option>
                  <option value="Intern - Digital Marketing">Intern - Digital Marketing</option>
                  <option value="Intern - Cyber Security">Intern - Cyber Security</option>
                  <option value="Intern - Data Analytics">Intern - Data Analytics</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Onboarding Status</label>
                <select value={selectedMember.status} onChange={e => setSelectedMember({...selectedMember, status: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending Onboarding</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowEditMember(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-xl font-headline font-black text-white mb-2">Delete Task?</h3>
              <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">
                Are you sure you want to delete this task? This action cannot be undone and it will be removed from all team dashboards permanently.
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setTaskToDelete(null)} 
                  className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteTask} 
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <span className="material-symbols-outlined text-3xl">person_remove</span>
              </div>
              <h3 className="text-xl font-headline font-black text-white mb-2">Remove Member?</h3>
              <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">
                Are you sure you want to remove this member? This action cannot be undone and they will lose access to the team dashboard instantly.
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setMemberToDelete(null)} 
                  className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteMember} 
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
