import React, { useState, useEffect } from "react";
import { projectService } from "../../../lib/projectService";
import { supabase } from "../../../lib/supabase";

export default function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, id: string | null}>({show: false, id: null});

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel('admin-messages-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    try {
      setIsSendingReply(true);
      // Update with reply AND mark as Resolved automatically
      await supabase
        .from('messages')
        .update({ 
          admin_reply: replyText,
          status: 'Resolved' 
        })
        .eq('id', selectedMessage.id);

      setReplyText("");
      setSelectedMessage(null);
      fetchMessages();
      showNotify("Reply sent and ticket resolved! ✅");
    } catch (error) {
      console.error("Error sending reply:", error);
      showNotify("Failed to send reply.", "error");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.to || !newMessage.subject) return;

    try {
      const msgData = {
        sender_name: "Admin",
        sender_email: newMessage.to.trim(), // Route to client's email so it filters perfectly on their dashboard
        subject: newMessage.subject,
        content: newMessage.body,
        type: "Ticket",
        status: "Open"
      };

      await projectService.createMessage(msgData);
      setShowCompose(false);
      setNewMessage({ to: "", subject: "", body: "" });
      fetchMessages();
      showNotify("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      showNotify("Failed to send message.", "error");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setIsUpdating(true);
      await projectService.updateMessageStatus(id, status);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      fetchMessages();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await supabase.from('messages').delete().eq('id', id);
      setDeleteConfirm({show: false, id: null});
      showNotify("Message deleted successfully.");
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      showNotify("Failed to delete message.", "error");
    }
  };

  const clearAllMessages = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('messages')
        .delete()
        .gt('created_at', '1970-01-01T00:00:00Z'); 
        
      if (error) throw error;
      
      setShowClearConfirm(false);
      fetchMessages();
      showNotify("All messages cleared.");
    } catch (error) {
      console.error("Error clearing messages:", error);
      showNotify("Failed to clear messages.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-headline font-bold text-white">Messages & Support Tickets</h3>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-headline hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Clear All
          </button>
          <button 
            onClick={() => setShowCompose(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg text-sm font-headline shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all"
          >
            + New Message
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-panel rounded-xl divide-y divide-white/5 border border-white/5 overflow-hidden">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group ${
                message.status === 'New' || message.status === 'Open' ? "bg-primary/5" : ""
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                message.sender_name === "Admin" ? "bg-secondary/20 border border-secondary/30" : "bg-primary/20 border border-primary/30"
              }`}>
                <span className={`font-headline font-bold ${message.sender_name === "Admin" ? "text-secondary" : "text-primary"}`}>
                  {message.sender_name?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-headline text-sm md:text-base ${(message.status === 'New' || message.status === 'Open') ? "font-bold text-white" : "text-on-surface"} truncate`}>
                    {message.sender_name} 
                    <span className="hidden md:inline-block text-[10px] ml-2 text-on-surface-variant font-normal">({message.type})</span>
                  </h4>
                  {(message.status === 'New' || message.status === 'Open') && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-[10px] font-bold uppercase tracking-wider text-on-primary">
                      {message.status}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${(message.status === 'New' || message.status === 'Open') ? "text-white" : "text-on-surface-variant"}`}>
                  {message.subject}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm({show: true, id: message.id}); }}
                    className="p-1.5 bg-surface-container-low hover:bg-red-500/20 border border-white/5 rounded-lg transition-colors" title="Delete"
                  >
                    <span className="material-symbols-outlined text-xs text-red-400">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="p-20 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">inbox</span>
              </div>
              <p className="text-on-surface-variant font-headline">Inbox is clean. No messages to display.</p>
            </div>
          )}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-red-500">delete_forever</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-2 text-white">Clear All Messages?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              This will permanently delete all messages and support tickets from your database. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-surface-container-low border border-white/5 text-sm font-headline text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={clearAllMessages}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-headline font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-300">
          <div className="glass-panel rounded-xl p-8 w-full max-w-lg border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] overflow-hidden">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-bold text-primary">{selectedMessage.subject}</h3>
              <button onClick={() => setSelectedMessage(null)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">From: <b className="text-white">{selectedMessage.sender_name} ({selectedMessage.sender_email})</b></span>
                <span className="text-on-surface-variant">{new Date(selectedMessage.created_at).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-low border border-white/5 text-on-surface text-sm leading-relaxed">
                {selectedMessage.content}
              </div>

              {/* Show Previous Reply if exists */}
              {selectedMessage.admin_reply && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-on-surface text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sm text-primary">reply</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Your Previous Reply</span>
                  </div>
                  <p className="italic text-on-surface-variant">{selectedMessage.admin_reply}</p>
                </div>
              )}

              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="w-full space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Send New Reply</h4>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to the client..."
                    rows={3}
                    className="w-full p-3 rounded-lg bg-surface-container-low border border-white/10 text-sm text-white focus:border-primary/50 outline-none resize-none transition-colors"
                  />
                  <button 
                    disabled={isSendingReply || !replyText.trim()}
                    onClick={handleSendReply}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-headline font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                  >
                    {isSendingReply ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Send Reply</span>
                        <span className="material-symbols-outlined text-sm">send</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full">
                  <button 
                    disabled={isUpdating}
                    onClick={() => updateStatus(selectedMessage.id, 'Open')}
                    className={`py-2 rounded-lg text-[10px] font-headline transition-all border flex items-center justify-center gap-2 ${
                      selectedMessage.status === 'Open' 
                        ? 'bg-red-500 text-white border-red-400' 
                        : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-white/20'
                    }`}
                  >
                    Set Open
                  </button>
                  <button 
                    disabled={isUpdating}
                    onClick={() => updateStatus(selectedMessage.id, 'In Progress')}
                    className={`py-2 rounded-lg text-[10px] font-headline transition-all border flex items-center justify-center gap-2 ${
                      selectedMessage.status === 'In Progress' 
                        ? 'bg-yellow-500 text-black border-yellow-400' 
                        : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-white/20'
                    }`}
                  >
                    In Progress
                  </button>
                  <button 
                    disabled={isUpdating}
                    onClick={() => updateStatus(selectedMessage.id, 'Resolved')}
                    className={`py-2 rounded-lg text-[10px] font-headline transition-all border flex items-center justify-center gap-2 ${
                      selectedMessage.status === 'Resolved' 
                        ? 'bg-green-500 text-white border-green-400' 
                        : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-white/20'
                    }`}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Message Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-300">
          <div className="glass-panel rounded-xl p-6 w-full max-w-lg border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] transform transition-all">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-white">Compose Message</h3>
              <button onClick={() => setShowCompose(false)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-5">
              <div>
                <label className="block text-xs font-headline mb-1.5 text-on-surface-variant uppercase tracking-wider">To</label>
                <input required type="text" value={newMessage.to} onChange={e => setNewMessage({...newMessage, to: e.target.value})} className="w-full p-3 rounded-lg bg-surface-container-low border border-white/10 focus:border-primary/50 outline-none text-sm transition-colors text-white" placeholder="Recipient email" />
              </div>
              <div>
                <label className="block text-xs font-headline mb-1.5 text-on-surface-variant uppercase tracking-wider">Subject</label>
                <input required type="text" value={newMessage.subject} onChange={e => setNewMessage({...newMessage, subject: e.target.value})} className="w-full p-3 rounded-lg bg-surface-container-low border border-white/10 focus:border-primary/50 outline-none text-sm transition-colors text-white" placeholder="Subject" />
              </div>
              <div>
                <label className="block text-xs font-headline mb-1.5 text-on-surface-variant uppercase tracking-wider">Message</label>
                <textarea required value={newMessage.body} onChange={e => setNewMessage({...newMessage, body: e.target.value})} className="w-full p-3 rounded-lg bg-surface-container-low border border-white/10 focus:border-primary/50 outline-none text-sm transition-colors text-white resize-none" rows={4} placeholder="Type your message here..." />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-white/5 mt-6">
                <button type="button" onClick={() => setShowCompose(false)} className="flex-1 py-3 rounded-lg bg-surface-container-low text-white hover:bg-white/10 text-sm font-headline transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg text-sm font-headline font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <span>Send Message</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Single Message Confirmation */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="glass-panel rounded-2xl p-8 w-full max-w-sm border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-red-500">delete</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-2 text-white">Delete Message?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm({show: false, id: null})}
                className="flex-1 py-3 rounded-xl bg-surface-container-low border border-white/5 text-sm font-headline text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteConfirm.id && deleteMessage(deleteConfirm.id)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-headline font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-10 right-10 z-[120] px-6 py-4 rounded-xl border shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
          notification.type === 'success' ? 'bg-primary/20 border-primary text-primary' : 'bg-red-500/20 border-red-500 text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">{notification.type === 'success' ? 'check_circle' : 'error'}</span>
            <span className="font-headline font-bold text-sm tracking-wide">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
