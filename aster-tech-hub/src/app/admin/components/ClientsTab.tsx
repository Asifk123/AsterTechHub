import React, { useState, useEffect } from "react";
import { projectService } from "../../../lib/projectService";
import { supabase } from "../../../lib/supabase";

export default function ClientsTab() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [newClient, setNewClient] = useState<any>({ name: "", contact: "", email: "", phone: "", status: "Active" });

  useEffect(() => {
    fetchClients();
    
    const subscription = supabase
      .channel('clients-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchClients())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all necessary data in parallel for speed
      const [profilesRes, projectsRes, invoicesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('status', 'approved').order('full_name', { ascending: true }),
        projectService.getAllProjects(),
        projectService.getInvoices()
      ]);

      if (profilesRes.error) throw profilesRes.error;
      
      const profiles = profilesRes.data || [];
      const allProjects = projectsRes || [];
      const allInvoices = invoicesRes || [];
      
      // Map and calculate stats for each client
      const mappedData = (profiles as any[])
        .filter((p: any) => p.role === 'client' || p.role === 'guest' || !p.role)
        .map((p: any) => {
          // Calculate total revenue from PAID invoices for THIS specific client
          // Note: matching by name as we don't have a strict client_id in invoices yet
          const clientPaidInvoices = (allInvoices as any[]).filter((inv: any) => 
            inv.status === 'Paid' && 
            (inv.client === p.full_name || inv.client === p.email)
          );
          
          const totalRevenue = clientPaidInvoices.reduce((sum: number, inv: any) => sum + (parseFloat(inv.amount) || 0), 0);
          
          // Count projects for this client
          const clientProjects = (allProjects as any[]).filter((proj: any) => proj.client_id === p.id || proj.client === p.full_name);
          
          return {
            ...p,
            name: p.full_name || p.email?.split('@')[0] || 'Unnamed Client',
            contact: p.full_name || 'No Name Provided',
            status: 'Active',
            revenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
            revenueRaw: totalRevenue,
            projects: clientProjects.length
          };
        });
      
      setClients(mappedData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      showNotify("Could not load clients.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return;

    try {
      const { error } = await supabase.from('clients').insert([newClient]);
      if (error) throw error;
      setShowAddModal(false);
      setNewClient({ name: "", contact: "", email: "", phone: "", status: "Active" });
      showNotify("Client added successfully!");
    } catch (error) {
      showNotify("Error adding client.", 'error');
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const { error } = await supabase.from('profiles').update({
        full_name: selectedClient.name,
        email: selectedClient.email,
        phone: selectedClient.phone,
        status: selectedClient.status === 'Active' ? 'approved' : 'pending'
      }).eq('id', selectedClient.id);
      
      if (error) throw error;
      setShowEditModal(false);
      showNotify("Client details updated!");
      fetchClients();
    } catch (error) {
      showNotify("Error updating client.", 'error');
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
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
        <div>
          <h3 className="text-xl font-headline font-bold mb-1">Client CRM</h3>
          <p className="text-sm text-on-surface-variant">Manage your customer relationships and contacts.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface-container-low border border-white/5 text-white text-sm focus:border-primary/50 focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg text-sm font-headline shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2 font-bold"
          >
            <span className="material-symbols-outlined text-sm">person_add</span> Add Client
          </button>
        </div>
      </div>

      {/* CRM Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-surface-container-low border-b border-white/10">
              <tr className="text-left text-sm text-on-surface-variant">
                <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Company</th>
                <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Primary Contact</th>
                <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Contact Info</th>
                <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs">Revenue</th>
                <th className="px-6 py-4 font-headline uppercase tracking-wider text-xs text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs shrink-0">
                        {client.name[0]}
                      </div>
                      <span className="font-headline font-bold text-sm text-on-surface">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{client.contact}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-on-surface flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-[12px] text-primary">mail</span> {client.email}</span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">call</span> {client.phone || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        client.status === "Active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-surface-container-high text-on-surface-variant border-white/10"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-headline font-bold text-white">{client.revenue}</span>
                      <span className="text-[10px] text-on-surface-variant">{client.projects} Projects</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => { setSelectedClient(client); setShowEditModal(true); }}
                      className="p-2 bg-surface-container-low hover:bg-primary/20 hover:text-primary rounded-lg transition-colors border border-white/5 text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    No clients found. Click "Add Client" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-8">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.2)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Edit Client Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-on-surface-variant hover:text-white bg-surface-container-low p-2 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleUpdateClient} className="space-y-4">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Company Name</label>
                <input required type="text" value={selectedClient.name} onChange={e => setSelectedClient({...selectedClient, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Primary Contact</label>
                <input type="text" value={selectedClient.contact} onChange={e => setSelectedClient({...selectedClient, contact: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Email Address</label>
                <input required type="email" value={selectedClient.email} onChange={e => setSelectedClient({...selectedClient, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Phone Number</label>
                <input type="text" value={selectedClient.phone || ""} onChange={e => setSelectedClient({...selectedClient, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Status</label>
                <select value={selectedClient.status || "Active"} onChange={e => setSelectedClient({...selectedClient, status: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-8">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-primary/30 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Add New Client</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white bg-surface-container-low p-2 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Company Name *</label>
                <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Primary Contact Person</label>
                <input type="text" value={newClient.contact} onChange={e => setNewClient({...newClient, contact: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. Sarah Martinez" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Email Address *</label>
                <input required type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. contact@acme.com" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Phone Number</label>
                <input type="text" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. +91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Initial Status</label>
                <select value={newClient.status || "Active"} onChange={e => setNewClient({...newClient, status: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
