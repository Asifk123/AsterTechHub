'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AccessTab() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchProfiles();
    
    const subscription = supabase
      .channel('profiles-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchProfiles())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error("AccessTab Full Error:", error);
        showNotify(`DB Error (${status}): ${error.message} - ${error.details || ''}`, 'error');
        setIsLoading(false);
        return;
      }
      
      if (!data || data.length === 0) {
        showNotify("Connected, but no profiles found. Try refreshing.", 'error');
      }
      setProfiles(data || []);
    } catch (error: any) {
      showNotify(error.message || "Unknown error occurred", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateStatus = async (id: string, status: string, role: string) => {
    try {
      console.log(`DEBUG: Updating user ${id} to ${status}/${role}`);
      const { error } = await supabase
        .from('profiles')
        .update({ status: status, role: role })
        .eq('id', id);

      if (error) {
        console.error("DEBUG: Update Error Object:", error);
        showNotify(error.message || "Database refused update", 'error');
        return;
      }
      
      showNotify(`User approved as ${role}!`, 'success');
      fetchProfiles(); 
    } catch (error: any) {
      console.error("DEBUG: Update Catch Error:", error);
      showNotify(error.message || "Update Crash", 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingUsers = profiles.filter(p => p.status === 'pending');
  const otherUsers = profiles.filter(p => p.status !== 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
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

      {/* Header */}
      <div>
        <h3 className="text-xl font-headline font-bold mb-1">Access Management</h3>
        <p className="text-sm text-on-surface-variant">Review signups and grant access permissions.</p>
      </div>

      {/* ERROR ALERT */}
      {notification?.type === 'error' && (
        <div className="p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-xl flex items-start gap-3 animate-in shake duration-500">
          <span className="material-symbols-outlined">warning</span>
          <div>
            <p className="font-bold text-sm">Database Sync Issue</p>
            <p className="text-xs opacity-80">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Pending Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          <h4 className="text-sm font-headline font-bold uppercase tracking-widest text-on-surface-variant">Pending Approval ({pendingUsers.length})</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingUsers.map(user => (
            <div key={user.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                  {user.full_name?.[0] || '?'}
                </div>
                <div>
                  <h5 className="font-headline font-bold text-on-surface">{user.full_name || 'New User'}</h5>
                  <p className="text-xs text-on-surface-variant truncate max-w-[150px]">{user.id}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(user.id, 'approved', 'client')}
                  className="flex-1 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-headline font-bold hover:bg-primary hover:text-on-primary transition-all"
                >
                  Approve Client
                </button>
                <button 
                  onClick={() => updateStatus(user.id, 'approved', 'team')}
                  className="flex-1 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg text-xs font-headline font-bold hover:bg-secondary hover:text-on-secondary transition-all"
                >
                  Approve Team
                </button>
              </div>
              <button 
                onClick={() => updateStatus(user.id, 'rejected', 'guest')}
                className="w-full mt-2 py-2 text-on-surface-variant hover:text-red-400 text-xs font-headline font-bold transition-all"
              >
                Reject
              </button>
            </div>
          ))}
          {pendingUsers.length === 0 && (
            <div className="col-span-full py-8 text-center glass-panel rounded-2xl border border-dashed border-white/10 text-on-surface-variant italic">
              No pending requests at the moment.
            </div>
          )}
        </div>
      </section>

      {/* All Users Table */}
      <section className="space-y-4">
        <h4 className="text-sm font-headline font-bold uppercase tracking-widest text-on-surface-variant">Approved Users ({otherUsers.length})</h4>
        
        {/* Desktop View: Table */}
        <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {otherUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                        {user.full_name?.[0] || '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.full_name || 'Unnamed'}</span>
                        <span className="text-[10px] text-on-surface-variant opacity-60 truncate max-w-[120px]">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      user.role === 'admin' || user.role === 'CEO' ? 'text-primary' : user.role === 'team' ? 'text-secondary' : 'text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      user.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      value={user.role}
                      onChange={(e) => updateStatus(user.id, user.status, e.target.value)}
                      className="bg-surface-container-low border border-white/10 rounded px-2 py-1.5 text-[10px] text-on-surface outline-none focus:border-primary/50 cursor-pointer"
                    >
                      <option value="guest">Guest</option>
                      <option value="client">Client</option>
                      <option value="team">Team Member</option>
                      <option value="admin">Generic Admin</option>
                      <option value="CEO">CEO</option>
                      <option value="MD">Managing Director (MD)</option>
                      <option value="OD">Operations Director (OD)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
          {otherUsers.map(user => (
            <div key={user.id} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                    {user.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <h5 className="text-sm font-headline font-bold">{user.full_name || 'Unnamed'}</h5>
                    <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                  user.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {user.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">Current Role</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'admin' || user.role === 'CEO' ? 'text-primary' : 'text-secondary'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="flex flex-col items-end">
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">Change Role</p>
                  <select 
                    value={user.role}
                    onChange={(e) => updateStatus(user.id, user.status, e.target.value)}
                    className="bg-surface-container-high border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none"
                  >
                    <option value="guest">Guest</option>
                    <option value="client">Client</option>
                    <option value="team">Team Member</option>
                    <option value="admin">Admin</option>
                    <option value="CEO">CEO</option>
                    <option value="MD">MD</option>
                    <option value="OD">OD</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {otherUsers.length === 0 && (
            <div className="py-12 text-center glass-panel rounded-2xl border border-dashed border-white/10 text-on-surface-variant italic">
              No approved users found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
