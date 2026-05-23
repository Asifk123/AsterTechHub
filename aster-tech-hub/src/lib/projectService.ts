import { supabase } from './supabase';
import { sanitizeInput } from './sanitize';

export const projectService = {
  // Get all projects (for Admin)
  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*, activity_logs(*) ')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get projects for a specific client
  async getClientProjects(clientId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, activity_logs(*) ')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create a new project
  async createProject(project: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Update project details
  async updateProject(id: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Add activity log
  async addActivityLog(projectId: string, log: any) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ project_id: projectId, ...log }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // --- MILESTONE MANAGEMENT ---
  async getProjectMilestones(projectId: string) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('project_id', projectId)
      .eq('type', 'milestone')
      .order('time', { ascending: true });
    
    if (error) throw error;
    
    // Parse status from text prefix
    return (data || []).map((m: any) => {
      const isCompleted = m.text.startsWith('[COMPLETED] ');
      return {
        ...m,
        status: isCompleted ? 'completed' : 'pending',
        text: isCompleted ? m.text.replace('[COMPLETED] ', '') : m.text.replace('[PENDING] ', '')
      };
    });
  },

  async addMilestone(projectId: string, milestone: any) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ 
        project_id: projectId, 
        text: `[PENDING] ${milestone.title}`, 
        type: 'milestone', 
        time: new Date().toISOString(),
        created_by: 'Admin'
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateMilestoneStatus(milestoneId: string, title: string, status: 'pending' | 'completed') {
    const prefix = status === 'completed' ? '[COMPLETED] ' : '[PENDING] ';
    const { data, error } = await supabase
      .from('activity_logs')
      .update({ text: `${prefix}${title}` })
      .eq('id', milestoneId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteMilestone(milestoneId: string) {
    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .eq('id', milestoneId);
    
    if (error) throw error;
    return true;
  },

  // Delete project
  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // --- TASK MANAGEMENT ---
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateTaskStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async createTask(task: any) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- MEETING MANAGEMENT ---
  async getTeamMeetings() {
    const { data, error } = await supabase
      .from('team_meetings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getClientMeetings(clientId: string) {
    const { data, error } = await supabase
      .from('team_meetings')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createTeamMeeting(meeting: any) {
    const { data, error } = await supabase
      .from('team_meetings')
      .insert([meeting])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateMeetingStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('team_meetings')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // --- MESSAGE & TICKET MANAGEMENT ---
  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateMessageStatus(id: string, status: string) {
    const { error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async sendReply(messageId: string, reply: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ 
        admin_reply: sanitizeInput(reply),
        status: 'Replied'
      })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createMessage(message: any) {
    const sanitizedMessage = {
      ...message,
      sender_name: sanitizeInput(message.sender_name),
      sender_email: sanitizeInput(message.sender_email),
      subject: sanitizeInput(message.subject),
      content: sanitizeInput(message.content),
    };
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([sanitizedMessage])
        .select();
      
      if (!error && data && data.length > 0) {
        return data[0];
      }
      if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          const { error: insertError } = await supabase
            .from('messages')
            .insert([sanitizedMessage]);
          if (insertError) throw insertError;
          return { ...sanitizedMessage, id: 'temp-message-id' };
        }
        throw error;
      }
    } catch (err: any) {
      if (err.code === '42501' || (err.message && err.message.includes('row-level security'))) {
        const { error: insertError } = await supabase
          .from('messages')
          .insert([sanitizedMessage]);
        if (insertError) throw insertError;
        return { ...sanitizedMessage, id: 'temp-message-id' };
      }
      throw err;
    }
  },

  // --- REVIEW MANAGEMENT ---
  async getReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createReview(review: any) {
    const sanitizedReview = {
      ...review,
      name: sanitizeInput(review.name),
      review: sanitizeInput(review.review),
    };
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([sanitizedReview])
        .select();
      
      if (!error && data && data.length > 0) {
        return data[0];
      }
      if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          const { error: insertError } = await supabase
            .from('reviews')
            .insert([sanitizedReview]);
          if (insertError) throw insertError;
          return { ...sanitizedReview, id: 'temp-review-id' };
        }
        throw error;
      }
    } catch (err: any) {
      if (err.code === '42501' || (err.message && err.message.includes('row-level security'))) {
        const { error: insertError } = await supabase
          .from('reviews')
          .insert([sanitizedReview]);
        if (insertError) throw insertError;
        return { ...sanitizedReview, id: 'temp-review-id' };
      }
      throw err;
    }
  },

  async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- TEAM MANAGEMENT ---
  async getTeamMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addTeamMember(member: any) {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateMemberStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('team_members')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteTeamMember(id: string) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async updateTeamMember(id: string, updates: any) {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // --- ANALYTICS ---
  async getVisitStats() {
    const { count, error } = await supabase
      .from('stats')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') return 0;
      throw error;
    }
    return count || 0;
  },

  async getAnalyticsTrends() {
    try {
      // Get last 7 days of visits
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('stats')
        .select('created_at, path')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (error) throw error;

      // Group by day for the trend chart
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const trendData = days.map(day => ({ name: day, visits: 0 }));

      data?.forEach((visit: any) => {
        const dayIndex = new Date(visit.created_at).getDay();
        trendData[dayIndex].visits++;
      });

      // Sort trend data so today is at the end
      const today = new Date().getDay();
      const sortedTrend = [
        ...trendData.slice(today + 1),
        ...trendData.slice(0, today + 1)
      ];

      // Group by page for top pages chart
      const pageCounts: { [key: string]: number } = {};
      data?.forEach((visit: any) => {
        const path = visit.path === '/' ? 'Home' : visit.path.replace('/', '');
        pageCounts[path] = (pageCounts[path] || 0) + 1;
      });

      const topPages = Object.entries(pageCounts)
        .map(([name, visits]) => ({ name, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 5);

      return { trend: sortedTrend, topPages };
    } catch (error) {
      console.error("Analytics error:", error);
      return { trend: [], topPages: [] };
    }
  },

  // --- DASHBOARD OVERVIEW ---
  async getDashboardStats() {
    // Fetch all counts in parallel for performance
    const results = await Promise.allSettled([
      this.getAllProjects(),
      this.getMessages(),
      this.getTeamMembers(),
      this.getTasks(),
      this.getInvoices(),
      this.getVisitStats(),
      // Fetch Approved Clients from Profiles
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client').eq('status', 'approved'),
      // Fetch Pending Profiles!
      supabase.from('profiles').select('*').eq('status', 'pending')
    ]);

    const stats = {
      projects: results[0].status === 'fulfilled' ? results[0].value : [],
      messages: results[1].status === 'fulfilled' ? results[1].value : [],
      members: results[2].status === 'fulfilled' ? results[2].value : [],
      tasks: results[3].status === 'fulfilled' ? results[3].value : [],
      invoices: results[4].status === 'fulfilled' ? results[4].value : [],
      visits: results[5].status === 'fulfilled' ? results[5].value : 0,
      clientCount: results[6].status === 'fulfilled' ? (results[6].value as any).count : 0,
      pendingProfiles: results[7].status === 'fulfilled' ? (results[7].value as any).data || [] : [],
      pendingCount: 0
    };

    stats.pendingCount = stats.pendingProfiles.length;

    return stats;
  },

  // --- INVOICES ---
  async getInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createInvoice(invoice: any) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateInvoiceStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },
  
  async deleteInvoice(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
