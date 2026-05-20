"use client";

import React, { useState, useEffect } from "react";
import { projectService } from "../../../lib/projectService";
import { supabase } from "../../../lib/supabase";

export default function ProjectsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [movingProject, setMovingProject] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isMilestonesLoading, setIsMilestonesLoading] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectLogsToClear, setProjectLogsToClear] = useState<any | null>(null);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    setMounted(true);
    fetchProjects();
    fetchClients();

    const subscription = supabase
      .channel('admin-projects-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchProjects())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => fetchProjects())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchClients())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getAllProjects();
      // Map activity_logs to activityLog for backward compatibility with UI
      const mappedData = (data as any[]).map((p: any) => ({
        ...p,
        activityLog: p.activity_logs || []
      }));
      setProjects(mappedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('status', 'approved')
        .order('full_name');
      
      if (error) throw error;
      setAvailableClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // For pushing new updates to client
  const [newUpdateText, setNewUpdateText] = useState("");
  
  // For scheduling meetings
  const [meetingForm, setMeetingForm] = useState({ title: "", date: "", time: "", type: "Video Call" });

  // For filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("All Clients");

  const [newProject, setNewProject] = useState({
    name: "",
    client: "", 
    status: "Planning",
    progress: 0,
    value: "",
    deadline: "",
    team: "",
    deliverables: "",
    client_id: "",
  });

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) return;

    try {
      const projectData = {
        name: newProject.name,
        client: newProject.client, 
        client_id: newProject.client_id,
        status: newProject.status,
        progress: parseInt(newProject.progress.toString()) || 0,
        budget: parseFloat(newProject.value.replace(/[^0-9.]/g, '')) || 0,
        deadline: newProject.deadline,
        team: newProject.team,
        deliverables: newProject.deliverables,
      };

      const createdProject = await projectService.createProject(projectData);
      
      // Add initial log
      await projectService.addActivityLog(createdProject.id, {
        text: "Project created in system",
        time: new Date().toISOString(),
        type: "add_circle"
      });

      setShowAddModal(false);
      setNewProject({ name: "", client: "", client_id: "", status: "Planning", progress: 0, value: "", deadline: "", team: "", deliverables: "" });
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
      showNotify("Failed to add project.", 'error');
    }
  };

  const openViewModal = (project: any) => {
    setSelectedProject(project);
    setShowViewModal(true);
    fetchMilestones(project.id);
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

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !selectedProject) return;

    try {
      await projectService.addMilestone(selectedProject.id, { title: newMilestoneTitle });
      setNewMilestoneTitle("");
      fetchMilestones(selectedProject.id);
      showNotify("Milestone added!");
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  const handleToggleMilestone = async (milestone: any) => {
    try {
      const newStatus = milestone.status === 'completed' ? 'pending' : 'completed';
      await projectService.updateMilestoneStatus(milestone.id, milestone.text, newStatus);
      
      // AUTO-PROGRESS CALCULATION
      if (selectedProject) {
        const allMilestones = await projectService.getProjectMilestones(selectedProject.id);
        const completedCount = allMilestones.filter((m: any) => m.status === 'completed').length;
        const totalCount = allMilestones.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        
        // Update Project Progress in DB
        await projectService.updateProject(selectedProject.id, { progress: newProgress });
        
        // Update local state to reflect change immediately
        setSelectedProject({ ...selectedProject, progress: newProgress });
        setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, progress: newProgress } : p));
        
        showNotify(`Progress updated to ${newProgress}%`, 'success');
      }
      
      fetchMilestones(selectedProject.id);
    } catch (error) {
      console.error("Error toggling milestone:", error);
      showNotify("Failed to update milestone", 'error');
    }
  };

  const deleteProject = (id: string) => {
    setProjectToDelete(id);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete);
      setShowViewModal(false);
      setProjectToDelete(null);
      fetchProjects();
      showNotify("Project deleted successfully.");
    } catch (error) {
      console.error("Error deleting project:", error);
      showNotify("Failed to delete project.", 'error');
      setProjectToDelete(null);
    }
  };

  const confirmClearProjectLogs = async () => {
    if (!projectLogsToClear) return;
    try {
      await supabase.from('activity_logs').delete().eq('project_id', projectLogsToClear.id).neq('type', 'milestone');
      fetchProjects();
      setSelectedProject({
        ...projectLogsToClear,
        activityLog: []
      });
      showNotify("Activity log cleared successfully.");
      setProjectLogsToClear(null);
    } catch (error) {
      console.error("Error clearing logs:", error);
      showNotify("Failed to clear activity logs.", 'error');
      setProjectLogsToClear(null);
    }
  };

  const updateProjectStatus = async (id: string, newStatus: string) => {
    try {
      await projectService.updateProject(id, { status: newStatus });
      fetchProjects();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  const handleProjectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    try {
      const { activityLog, activity_logs, ...updateData } = selectedProject;
      await projectService.updateProject(selectedProject.id, updateData);
      showNotify("Project details saved! These updates will be synced to the Client Dashboard.");
      setShowViewModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const pushActivityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateText.trim() || !selectedProject) return;
    
    try {
      const newLog = {
        text: newUpdateText,
        time: new Date().toISOString(),
        type: "chat",
        created_by: "Admin"
      };
      
      await projectService.addActivityLog(selectedProject.id, newLog);
      
      // Local update for immediate feedback
      const updatedProject = {
        ...selectedProject,
        activityLog: [...(selectedProject.activityLog || []), { ...newLog, id: Date.now() }]
      };
      setSelectedProject(updatedProject);
      setNewUpdateText("");
      fetchProjects();
    } catch (error) {
      console.error("Error pushing update:", error);
    }
  };

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time) return;
    
    try {
      // 1. Create the actual meeting in the database (embed type in description to avoid nonexistent database column PGRST204 error)
      const meetingData = {
        title: meetingForm.title,
        description: `Type: ${meetingForm.type} | Project Discussion: ${selectedProject.name} (Client: ${selectedProject.client || 'Unknown'})`,
        date: meetingForm.date,
        time: meetingForm.time,
        status: "Active",
        client_id: selectedProject.client_id || null
      };
      await projectService.createTeamMeeting(meetingData);

      // 2. Add an activity log entry for the project timeline
      const meetingText = `Scheduled a ${meetingForm.type}: ${meetingForm.title} on ${meetingForm.date} at ${meetingForm.time}`;
      await projectService.addActivityLog(selectedProject.id, {
        text: meetingText,
        time: new Date().toISOString(),
        type: "event",
        created_by: "Admin"
      });

      setMeetingForm({ title: "", date: "", time: "", type: "Video Call" });
      showNotify("Meeting scheduled and synced to client dashboard!");
      fetchProjects();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      showNotify("Failed to schedule meeting.", "error");
    }
  };

  const statusColumns = ["Planning", "In Progress", "Review", "Completed"];

  // Derive unique clients for the filter dropdown
  const uniqueClients = ["All Clients", ...availableClients.map(c => c.full_name)];

  // Filter projects based on search and client selection
  const filteredProjects = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter(p => {
      const projectName = (p.name || "").toLowerCase();
      const clientName = (p.client || "").toLowerCase();
      const teamMembers = (p.team || "").toLowerCase();
      const status = (p.status || "").toLowerCase();
      
      const matchesSearch = query === "" || 
                           projectName.includes(query) || 
                           clientName.includes(query) ||
                           teamMembers.includes(query) ||
                           status.includes(query);
                           
      const matchesClient = clientFilter === "All Clients" || p.client === clientFilter;
      
      return matchesSearch && matchesClient;
    });
  }, [projects, searchQuery, clientFilter]);

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("projectId");
    if (projectId) {
      updateProjectStatus(projectId, newStatus);
    }
  };

  if (!mounted) return null;

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

      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <h3 className="text-xl font-headline font-bold">Project Management</h3>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search & Filter Group */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-none">
            <div className="relative flex-1 lg:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface-container-low border border-white/5 text-white text-sm focus:border-primary/50 focus:outline-none transition-all"
              />
            </div>

            <div className="relative flex-1 sm:w-48">
              <select 
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-surface-container-low border border-white/5 text-white text-sm focus:border-primary/50 focus:outline-none transition-all cursor-pointer"
              >
                {uniqueClients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">filter_list</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggles */}
            <div className="bg-surface-container-low p-1 rounded-lg border border-white/5 flex gap-1 shrink-0">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors flex items-center ${
                  viewMode === "list" ? "bg-white/10 text-white" : "text-on-surface-variant hover:text-white"
                }`}
                title="List View"
              >
                <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={`p-2 rounded-md transition-colors flex items-center ${
                  viewMode === "board" ? "bg-white/10 text-white" : "text-on-surface-variant hover:text-white"
                }`}
                title="Kanban Board View"
              >
                <span className="material-symbols-outlined text-sm">view_kanban</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg text-sm font-headline shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2 font-bold whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add Project
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Main Content Area */}
          {viewMode === "list" ? (
            <div className="glass-panel rounded-xl overflow-hidden border border-white/5 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-surface-container-low border-b border-white/10">
                    <tr className="text-left text-sm text-on-surface-variant">
                      <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Project</th>
                      <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Client</th>
                      <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Progress</th>
                      <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Value</th>
                      <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => openViewModal(project)}>
                        <td className="px-6 py-4">
                          <span className="font-headline text-sm text-on-surface group-hover:text-primary transition-colors">{project.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{project.client || "No Client"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
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
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${project.progress}%` }} />
                            </div>
                            <span className="text-xs text-primary font-bold">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-headline text-on-surface">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(project.budget || 0)}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="p-2 bg-surface-container-low hover:bg-red-500/20 rounded-lg transition-colors border border-white/5"
                              title="Delete Project"
                            >
                              <span className="material-symbols-outlined text-sm text-red-400">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                          No projects found matching your search/filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* KANBAN BOARD VIEW */
            <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide">
              {statusColumns.map((status) => (
                <div 
                  key={status} 
                  className="bg-surface-container-lowest border border-white/5 rounded-xl p-4 min-w-[280px] w-[280px] flex flex-col h-full shadow-lg transition-colors hover:bg-surface-container-low/50 snap-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <h4 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          status === "In Progress"
                            ? "bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]"
                            : status === "Review"
                            ? "bg-secondary shadow-[0_0_8px_rgba(217,185,255,0.8)]"
                            : status === "Planning"
                            ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                            : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                        }`}
                      ></span>
                      {status}
                    </h4>
                    <span className="text-xs font-bold bg-surface-container-high px-2 py-1 rounded-md text-on-surface-variant">
                      {filteredProjects.filter((p) => p.status === status).length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1 min-h-[150px]">
                    {filteredProjects
                      .filter((p) => p.status === status)
                      .map((project) => (
                        <div
                          key={project.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("projectId", project.id)}
                          onClick={() => openViewModal(project)}
                          className="bg-surface-container-low border border-white/5 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)] group relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-headline text-sm font-bold text-white group-hover:text-primary transition-colors leading-tight pr-2">
                              {project.name}
                            </h5>
                            <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md whitespace-nowrap font-bold">
                              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(project.budget || 0)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">domain</span> {project.client || "No Client"}
                            </p>
                            
                            {/* Mobile Quick Status Switcher */}
                            <div className="sm:hidden">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMovingProject(project);
                                }}
                                className="flex items-center gap-1 text-[10px] bg-primary/10 border border-primary/20 px-2 py-1 rounded-md text-primary font-bold active:scale-95 transition-all"
                              >
                                <span className="material-symbols-outlined text-[12px]">swap_horiz</span>
                                Move
                              </button>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-1.5">
                            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                            <span className="uppercase tracking-widest">Progress</span>
                            <span className={project.progress === 100 ? "text-green-400" : "text-primary"}>{project.progress}%</span>
                          </div>
                        </div>
                      ))}
                    
                    {filteredProjects.filter((p) => p.status === status).length === 0 && (
                      <div className="h-full min-h-[100px] border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-xs text-on-surface-variant/50">
                        No projects here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Mobile Move Status Modal */}
      {movingProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
          <div className="glass-panel rounded-2xl p-6 w-full max-w-xs border border-primary/30">
            <h4 className="text-sm font-headline font-bold mb-4 text-center">Move "{movingProject.name}" to:</h4>
            <div className="grid grid-cols-1 gap-2">
              {statusColumns.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    updateProjectStatus(movingProject.id, status);
                    setMovingProject(null);
                  }}
                  className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                    movingProject.status === status ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-container-low border-white/5 text-on-surface-variant'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button onClick={() => setMovingProject(null)} className="w-full mt-4 py-2 text-[10px] text-on-surface-variant uppercase font-black">Cancel</button>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-8 overflow-y-auto">
          <div className="glass-panel rounded-2xl p-6 md:p-8 w-full max-w-2xl border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] transform transition-all my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Create New Project</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white transition-colors bg-surface-container-low p-2 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddProject} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Project Name</label>
                  <input required type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. Website Redesign" />
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Client</label>
                  <select 
                    required 
                    value={newProject.client_id} 
                    onChange={e => {
                      const client = availableClients.find(c => c.id === e.target.value);
                      setNewProject({
                        ...newProject, 
                        client_id: e.target.value,
                        client: client?.full_name || ""
                      });
                    }} 
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm"
                  >
                    <option value="" className="bg-[#0a0a0f]">Select a Client</option>
                    {availableClients.map(client => (
                      <option key={client.id} value={client.id} className="bg-[#0a0a0f]">{client.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Status</label>
                  <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                    <option value="Planning" className="bg-[#0a0a0f]">Planning</option>
                    <option value="In Progress" className="bg-[#0a0a0f]">In Progress</option>
                    <option value="Review" className="bg-[#0a0a0f]">Review</option>
                    <option value="Completed" className="bg-[#0a0a0f]">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Progress (%)</label>
                  <input type="number" min="0" max="100" value={newProject.progress} onChange={e => setNewProject({...newProject, progress: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Budget / Value</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₹</span>
                    <input required type="text" value={newProject.value.replace('₹', '')} onChange={e => setNewProject({...newProject, value: e.target.value})} className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="5000" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Deadline Date</label>
                  <input type="text" value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm" placeholder="e.g. Aug 25, 2026" />
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Assigned Team (comma separated)</label>
                  <input type="text" value={newProject.team} onChange={e => setNewProject({...newProject, team: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm" placeholder="e.g. Asif, Priya" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Deliverables (comma separated)</label>
                <textarea rows={2} value={newProject.deliverables} onChange={e => setNewProject({...newProject, deliverables: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-none" placeholder="e.g. Figma Design, React Codebase" />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] transition-all">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details View Modal (Advanced Sync Editor) */}
      {showViewModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-8">
          <div className="glass-panel rounded-2xl w-full max-w-4xl border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-start justify-between bg-surface/50 rounded-t-2xl relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none"></div>
              <div className="relative z-10 w-full flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-3xl font-headline font-black text-white">{selectedProject.name}</h3>
                    <div className="relative group">
                      <select 
                        value={selectedProject.status}
                        onChange={(e) => {
                          updateProjectStatus(selectedProject.id, e.target.value);
                          setSelectedProject({...selectedProject, status: e.target.value});
                        }}
                        className={`appearance-none px-4 py-1 pr-8 rounded-full text-[10px] font-bold uppercase tracking-widest border outline-none cursor-pointer transition-all ${
                          selectedProject.status === "In Progress" ? "bg-primary/10 text-primary border-primary/20" : 
                          selectedProject.status === "Review" ? "bg-secondary/10 text-secondary border-secondary/20" : 
                          selectedProject.status === "Planning" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                          "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}
                      >
                        <option value="Planning" className="bg-[#0a0a0f] text-white">Planning</option>
                        <option value="In Progress" className="bg-[#0a0a0f] text-white">In Progress</option>
                        <option value="Review" className="bg-[#0a0a0f] text-white">Review</option>
                        <option value="Completed" className="bg-[#0a0a0f] text-white">Completed</option>
                      </select>
                      <span className="material-symbols-outlined text-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">expand_more</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">domain</span>
                    <select 
                      value={selectedProject.client_id || ""}
                      onChange={(e) => {
                        const client = availableClients.find(c => c.id === e.target.value);
                        setSelectedProject({
                          ...selectedProject, 
                          client_id: e.target.value,
                          client: client?.full_name || ""
                        });
                      }}
                      className="bg-transparent border-none text-on-surface-variant text-sm font-medium focus:ring-0 cursor-pointer hover:text-primary transition-colors outline-none"
                    >
                      <option value="" className="bg-[#0a0a0f]">No Client Assigned</option>
                      {availableClients.map(client => (
                        <option key={client.id} value={client.id} className="bg-[#0a0a0f]">{client.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-on-surface-variant hover:text-white p-2 bg-surface-container-low rounded-lg transition-colors relative z-10">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8">
              
              <form id="project-details-form" onSubmit={handleProjectUpdate} className="grid md:grid-cols-2 gap-8">
                
                {/* Left Side: Client Facing Details */}
                <div className="space-y-6">
                  <h4 className="text-xs font-headline font-bold uppercase tracking-widest text-primary flex items-center gap-2 pb-2 border-b border-primary/10">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Client Dashboard Data
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Overall Progress (%)</label>
                      <div className="flex gap-4 items-center">
                        <input type="range" min="0" max="100" value={selectedProject.progress} onChange={(e) => setSelectedProject({...selectedProject, progress: parseInt(e.target.value)})} className="flex-1 accent-primary" />
                        <span className="text-lg font-black text-primary w-12 text-right">{selectedProject.progress}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Project Value / Budget</label>
                      <input type="text" value={selectedProject.budget || ""} onChange={e => setSelectedProject({...selectedProject, budget: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Deadline Date</label>
                      <input type="text" value={selectedProject.deadline || ""} onChange={e => setSelectedProject({...selectedProject, deadline: e.target.value})} placeholder="e.g. Aug 25, 2026" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Assigned Team (comma separated)</label>
                      <input type="text" value={selectedProject.team || ""} onChange={e => setSelectedProject({...selectedProject, team: e.target.value})} placeholder="Asif, Priya" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Deliverables (Public List)</label>
                      <textarea rows={2} value={selectedProject.deliverables || ""} onChange={e => setSelectedProject({...selectedProject, deliverables: e.target.value})} placeholder="Wireframes, Codebase" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm resize-none" />
                    </div>
                  </div>

                  {/* Milestone Manager */}
                  <div className="pt-4 mt-2 border-t border-white/5">
                    <h4 className="text-xs font-headline font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      Milestone Tracker (Synced)
                    </h4>
                    
                    <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {isMilestonesLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                      ) : milestones.length === 0 ? (
                        <p className="text-[10px] text-on-surface-variant italic">No specific milestones added for this project.</p>
                      ) : (
                        milestones.map((m) => (
                          <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-white/5 group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                              <button 
                                type="button"
                                onClick={() => handleToggleMilestone(m)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                  m.status === 'completed' ? 'bg-primary border-primary text-background' : 'border-white/20 hover:border-primary/50'
                                }`}
                              >
                                {m.status === 'completed' && <span className="material-symbols-outlined text-[14px] font-black">check</span>}
                              </button>
                              <span className={`text-xs font-medium ${m.status === 'completed' ? 'text-on-surface-variant line-through' : 'text-white'}`}>
                                {m.text}
                              </span>
                            </div>
                            <button type="button" className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-red-400 transition-all">
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newMilestoneTitle}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMilestone(e))}
                        placeholder="Add a new milestone..." 
                        className="flex-1 px-4 py-2 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-xs" 
                      />
                      <button 
                        type="button"
                        onClick={handleAddMilestone}
                        className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all text-[10px] font-bold uppercase tracking-widest"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Activity Log & Updates */}
                <div className="space-y-6 flex flex-col h-full">
                  <h4 className="text-xs font-headline font-bold uppercase tracking-widest text-secondary flex items-center gap-2 pb-2 border-b border-secondary/10 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">campaign</span>
                    Client Communication
                  </h4>
                  
                  {/* Activity Log Area */}
                  <div className="flex-1 bg-surface-container-lowest border border-white/5 rounded-xl p-4 flex flex-col max-h-[350px] min-h-[300px]">
                      <div className="flex items-center justify-between mb-4 shrink-0">
                        <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">History</span>
                        {selectedProject.activityLog && selectedProject.activityLog.length > 0 && (
                          <button 
                            type="button"
                            onClick={() => {
                              setProjectLogsToClear(selectedProject);
                            }}
                            className="text-[9px] font-black uppercase tracking-tighter text-red-400 hover:text-red-300 transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
                        {(!selectedProject.activityLog || selectedProject.activityLog.length === 0) && (
                          <div className="flex flex-col items-center justify-center h-32 opacity-30 w-full">
                            <span className="material-symbols-outlined text-4xl mb-2">history</span>
                            <p className="text-xs">No activity logged yet.</p>
                          </div>
                        )}
                        {selectedProject.activityLog
                          ?.slice()
                          ?.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())
                          ?.map((log: any) => (
                          <div key={log.id} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20 group-hover:border-secondary/40 transition-all">
                              <span className="material-symbols-outlined text-sm text-secondary">
                                {log.type === 'milestone' ? 'task_alt' : log.type === 'meeting' ? 'event' : 'campaign'}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between items-start">
                                <p className="text-xs text-on-surface font-semibold leading-relaxed mb-1">{log.text}</p>
                                <button 
                                  type="button"
                                  onClick={async () => {
                                    await supabase.from('activity_logs').delete().eq('id', log.id);
                                    const filtered = selectedProject.activityLog.filter((l: any) => l.id !== log.id);
                                    setSelectedProject({...selectedProject, activityLog: filtered});
                                    fetchProjects();
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-red-400 transition-all"
                                >
                                  <span className="material-symbols-outlined text-xs">delete</span>
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-on-surface-variant uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                                  {new Date(log.time).toLocaleDateString()}
                                </span>
                                <span className="text-[9px] text-on-surface-variant/50">
                                  {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    
                    <div className="pt-3 border-t border-white/10 shrink-0">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newUpdateText}
                          onChange={(e) => setNewUpdateText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && pushActivityUpdate(e)}
                          placeholder="Type a quick status update..." 
                          className="flex-1 px-3 py-2 rounded-lg bg-surface-container-low border border-white/10 text-white focus:border-secondary/50 focus:outline-none transition-all text-xs" 
                        />
                        <button 
                          type="button"
                          onClick={pushActivityUpdate}
                          className="px-3 py-2 rounded-lg bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors"
                          title="Send Update"
                        >
                          <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Meeting Area */}
                  <div className="bg-surface-container-lowest border border-white/5 rounded-xl p-4 shrink-0">
                    <h5 className="text-[10px] font-headline font-bold text-on-surface uppercase tracking-widest mb-3 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">event</span> Schedule Meeting
                    </h5>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Meeting Title (e.g. Design Review)" 
                        value={meetingForm.title}
                        onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-xs"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="date" 
                          value={meetingForm.date}
                          onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})}
                          className="flex-1 px-3 py-2 rounded-lg bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-xs"
                        />
                        <input 
                          type="time" 
                          value={meetingForm.time}
                          onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})}
                          className="w-24 px-3 py-2 rounded-lg bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select 
                          value={meetingForm.type}
                          onChange={(e) => setMeetingForm({...meetingForm, type: e.target.value})}
                          className="flex-1 px-3 py-2 rounded-lg bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-xs"
                        >
                          <option value="Video Call">Video Call</option>
                          <option value="In-Person">In-Person</option>
                          <option value="Phone Call">Phone Call</option>
                        </select>
                        <button 
                          type="button"
                          onClick={handleScheduleMeeting}
                          className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-[10px] font-bold uppercase tracking-widest"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 border-t border-white/5 bg-surface/30 rounded-b-2xl flex justify-between items-center gap-3 shrink-0">
               <button onClick={() => deleteProject(selectedProject.id)} className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-xs font-headline font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                 <span className="material-symbols-outlined text-sm">delete</span> Delete
               </button>
               <button type="submit" form="project-details-form" className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl text-xs font-headline font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:scale-105 transition-all">
                 Save & Sync
               </button>
            </div>
            
          </div>
        </div>
      )}
      {/* Quick Move Modal (Mobile) */}
      {movingProject && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div 
            className="fixed inset-0" 
            onClick={() => setMovingProject(null)}
          ></div>
          <div className="glass-panel w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 border border-primary/30 shadow-[0_-10px_40px_rgba(0,212,255,0.2)] relative z-10 animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-headline font-black text-primary uppercase tracking-widest text-xs mb-1">Move Project</h4>
                <p className="text-sm font-bold text-white truncate max-w-[200px]">{movingProject.name}</p>
              </div>
              <button onClick={() => setMovingProject(null)} className="p-2 bg-white/5 rounded-full text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {statusColumns.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    updateProjectStatus(movingProject.id, status);
                    setMovingProject(null);
                    showNotify(`Moved to ${status}`);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    movingProject.status === status 
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,212,255,0.2)]' 
                      : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'
                  }`}
                >
                  <span className="font-headline font-bold text-sm">{status}</span>
                  {movingProject.status === status && (
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                  )}
                </button>
              ))}
            </div>
            
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="text-xl font-headline font-black text-white mb-2">Delete Project?</h3>
            <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">
              Are you sure you want to delete this project? This action cannot be undone and will permanently remove all associated milestones, team mappings, and customer dashboards.
            </p>
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setProjectToDelete(null)} 
                className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteProject} 
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Logs Confirmation Modal */}
      {projectLogsToClear && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <span className="material-symbols-outlined text-3xl">delete_sweep</span>
            </div>
            <h3 className="text-xl font-headline font-black text-white mb-2">Clear Activity Logs?</h3>
            <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">
              Are you sure you want to clear all history and activity logs for this project? Milestones will remain intact, but client communication history will be wiped.
            </p>
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setProjectLogsToClear(null)} 
                className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClearProjectLogs} 
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-headline font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
