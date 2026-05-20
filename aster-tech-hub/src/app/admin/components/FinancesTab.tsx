import React, { useState, useEffect } from "react";
import { projectService } from "../../../lib/projectService";
import { supabase } from "../../../lib/supabase";

export default function FinancesTab() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchInvoices();

    const subscription = supabase
      .channel('finances-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchInvoices())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await projectService.getInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.client || !newInvoice.amount) return;

    try {
      const numericAmount = parseFloat(newInvoice.amount.replace(/[^0-9.]/g, ''));
      if (isNaN(numericAmount)) {
        showNotify("Please enter a valid amount.", 'error');
        return;
      }

      const invoice = {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        client: newInvoice.client,
        amount: numericAmount,
        status: newInvoice.status,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      await projectService.createInvoice(invoice);
      setShowModal(false);
      setNewInvoice({ client: "", amount: "", status: "Pending" });
      showNotify("Invoice generated successfully!");
    } catch (error) {
      showNotify("Failed to create invoice.", 'error');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val) {
      const formatted = new Intl.NumberFormat('en-IN').format(parseInt(val));
      setNewInvoice({ ...newInvoice, amount: formatted });
    } else {
      setNewInvoice({ ...newInvoice, amount: "" });
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Pending" ? "Paid" : "Pending";
    try {
      await projectService.updateInvoiceStatus(id, nextStatus);
      showNotify(`Invoice status updated to ${nextStatus}`);
    } catch (error) {
      showNotify("Failed to update status.", 'error');
    }
  };

  const totalPaid = invoices.filter(inv => inv.status === "Paid").reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);
  const totalPending = invoices.filter(inv => inv.status === "Pending").reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);
  const totalOverdue = invoices.filter(inv => inv.status === "Overdue").reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
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

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-headline font-bold">Financial Overview</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-headline font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">add_card</span> Generate Bill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-400">payments</span>
            </div>
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">Total Paid</span>
          </div>
          <div className="text-3xl font-headline text-white font-black">₹{totalPaid.toLocaleString()}</div>
        </div>

        <div className="glass-panel rounded-xl p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">pending_actions</span>
            </div>
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">Pending</span>
          </div>
          <div className="text-3xl font-headline text-primary font-black">₹{totalPending.toLocaleString()}</div>
        </div>

        <div className="glass-panel rounded-xl p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-400">warning</span>
            </div>
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">Overdue</span>
          </div>
          <div className="text-3xl font-headline text-red-400 font-black">₹{totalOverdue.toLocaleString()}</div>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6 border border-white/5">
        <h4 className="font-headline mb-6 text-lg font-bold">Recent Invoices</h4>
        
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-on-surface-variant border-b border-white/10">
                <th className="pb-4 font-headline uppercase tracking-wider text-[10px] font-bold">Invoice</th>
                <th className="pb-4 font-headline uppercase tracking-wider text-[10px] font-bold">Client</th>
                <th className="pb-4 font-headline uppercase tracking-wider text-[10px] font-bold">Amount</th>
                <th className="pb-4 font-headline uppercase tracking-wider text-[10px] font-bold">Status</th>
                <th className="pb-4 font-headline uppercase tracking-wider text-[10px] font-bold">Date</th>
                <th className="pb-4 font-headline uppercase tracking-wider text-[10px] font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-headline text-sm font-bold text-primary">{invoice.id}</td>
                  <td className="py-4 text-sm font-medium">{invoice.client}</td>
                  <td className="py-4 text-sm font-bold">₹{(invoice.amount || 0).toLocaleString()}</td>
                  <td className="py-4">
                    <button 
                      onClick={() => handleStatusChange(invoice.id, invoice.status)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all hover:scale-105 ${
                        invoice.status === "Paid" 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : invoice.status === "Overdue"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      {invoice.status}
                    </button>
                  </td>
                  <td className="py-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">{invoice.date}</td>
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => setSelectedInvoice(invoice)}
                      className="text-xs text-on-surface-variant hover:text-primary font-bold uppercase tracking-widest transition-colors flex items-center gap-1 mx-auto"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-headline font-black text-primary text-sm">{invoice.id}</span>
                <button 
                  onClick={() => handleStatusChange(invoice.id, invoice.status)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                    invoice.status === "Paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  {invoice.status}
                </button>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-white mb-1">{invoice.client}</p>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">₹{(invoice.amount || 0).toLocaleString()}</p>
                  <button 
                    onClick={() => setSelectedInvoice(invoice)}
                    className="text-[9px] text-primary font-bold uppercase tracking-widest mt-1"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <div className="py-12 text-center text-on-surface-variant italic">No invoices found.</div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.2)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Invoice Details</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-on-surface-variant hover:text-white bg-surface-container-low p-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Invoice ID</span>
                <span className="text-primary font-headline font-black">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Client</span>
                <span className="text-white font-bold">{selectedInvoice.client}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Amount</span>
                <span className="text-xl font-black text-white">₹{selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Status</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  selectedInvoice.status === "Paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-primary/10 text-primary border-primary/20"
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Issue Date</span>
                <span className="text-on-surface-variant font-bold">{selectedInvoice.date}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedInvoice(null)}
              className="w-full mt-8 py-4 bg-surface-container-high text-white rounded-xl font-headline font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Generate Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-primary/30 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Generate Bill</h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-white bg-surface-container-low p-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="space-y-5">
              <div>
                <label htmlFor="client-name" className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Client Name</label>
                <input id="client-name" name="client-name" required type="text" value={newInvoice.client} onChange={e => setNewInvoice({...newInvoice, client: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm" placeholder="e.g. Green Build" />
              </div>
              <div>
                <label htmlFor="billing-amount" className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₹</span>
                  <input 
                    id="billing-amount"
                    name="billing-amount"
                    required 
                    type="text" 
                    value={newInvoice.amount} 
                    onChange={handleAmountChange} 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm font-bold" 
                    placeholder="e.g. 50,000" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="initial-status" className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Initial Status</label>
                <select id="initial-status" name="initial-status" value={newInvoice.status} onChange={e => setNewInvoice({...newInvoice, status: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
