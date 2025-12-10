import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Copy, Check, Trash2, ArrowLeft, Shield } from 'lucide-react';
import { createInbox, checkInbox } from '../services/mailService';
import { TempMailbox, Email } from '../types';

const MailView: React.FC = () => {
  const [mailbox, setMailbox] = useState<TempMailbox | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Restore mailbox from local storage on mount
  useEffect(() => {
      const saved = localStorage.getItem('infinity_temp_mail');
      if (saved) {
          try {
              setMailbox(JSON.parse(saved));
          } catch (e) {
              localStorage.removeItem('infinity_temp_mail');
          }
      }
  }, []);

  // Poll for new emails if mailbox exists
  useEffect(() => {
      if (!mailbox) return;

      const fetchEmails = async () => {
          setRefreshing(true);
          const newEmails = await checkInbox(mailbox.token);
          setEmails(newEmails);
          setRefreshing(false);
      };

      fetchEmails(); // Initial check
      const interval = setInterval(fetchEmails, 10000); // Check every 10s

      return () => clearInterval(interval);
  }, [mailbox]);

  const handleCreate = async () => {
      setLoading(true);
      const newBox = await createInbox();
      if (newBox) {
          setMailbox(newBox);
          setEmails([]);
          setSelectedEmail(null);
          localStorage.setItem('infinity_temp_mail', JSON.stringify(newBox));
      }
      setLoading(false);
  };

  const handleCopy = () => {
      if (mailbox) {
          navigator.clipboard.writeText(mailbox.address);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const handleReset = () => {
      if (window.confirm("Are you sure you want to generate a new address? Your current emails will be lost.")) {
          handleCreate();
      }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-white animate-fadeIn">
        
        {/* Header Bar */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-900/30 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <Mail size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold leading-tight">Infinity Mail</h2>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Shield size={10} className="text-green-500" />
                        <span>Anonymous & Disposable</span>
                    </div>
                </div>
            </div>

            {mailbox && (
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full pl-4 pr-1 py-1">
                        <span className="font-mono text-sm text-zinc-300 select-all">{mailbox.address}</span>
                        <button 
                            onClick={handleCopy}
                            className={`p-1.5 rounded-full transition-all ${copied ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => { setRefreshing(true); checkInbox(mailbox.token).then(setEmails).then(() => setRefreshing(false)); }}
                        className={`p-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all ${refreshing ? 'animate-spin' : ''}`}
                        title="Refresh Inbox"
                    >
                        <RefreshCw size={18} />
                    </button>

                    <button 
                        onClick={handleReset}
                        className="p-2 rounded-full border border-zinc-700 text-red-400 hover:text-white hover:bg-red-900/50 transition-all"
                        title="Generate New Address"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>

        {/* Content Area */}
        {!mailbox ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-md text-center space-y-8">
                    <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mx-auto relative">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                        <Mail size={48} className="text-white relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-3">Disposable Inbox</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Protect your real identity. Generate a secure, temporary email address instantly for sign-ups, verifications, and testing.
                        </p>
                    </div>
                    <button 
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'Creating...' : 'Generate Secure Address'}
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex overflow-hidden">
                
                {/* Email List (Sidebar) */}
                <div className={`w-full md:w-96 border-r border-zinc-800 bg-black flex flex-col ${selectedEmail ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <span>Inbox ({emails.length})</span>
                        {refreshing && <span>Syncing...</span>}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {emails.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-zinc-600 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                                    <RefreshCw size={24} className={refreshing ? 'animate-spin' : ''} />
                                </div>
                                <p>Waiting for emails...</p>
                            </div>
                        ) : (
                            emails.map((email) => (
                                <div 
                                    key={email._id}
                                    onClick={() => setSelectedEmail(email)}
                                    className={`p-4 border-b border-zinc-800 cursor-pointer transition-colors hover:bg-zinc-900 ${selectedEmail?._id === email._id ? 'bg-zinc-900 border-l-4 border-l-purple-500' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-white text-sm truncate max-w-[180px]">{email.from}</h4>
                                        <span className="text-[10px] text-zinc-500">{new Date(email.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="text-zinc-300 text-sm font-medium mb-1 truncate">{email.subject || '(No Subject)'}</div>
                                    <p className="text-zinc-600 text-xs line-clamp-2">{email.body}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Email Content (Main) */}
                <div className={`flex-1 bg-zinc-900/30 flex flex-col ${!selectedEmail ? 'hidden md:flex' : 'flex'}`}>
                    {selectedEmail ? (
                        <>
                            {/* Toolbar */}
                            <div className="h-14 border-b border-zinc-800 flex items-center px-4 bg-zinc-900 shrink-0">
                                <button 
                                    onClick={() => setSelectedEmail(null)}
                                    className="md:hidden mr-4 p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-400"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex-1"></div>
                                <span className="text-xs text-zinc-500 font-mono">
                                    ID: {selectedEmail._id.substring(0, 8)}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                                <h1 className="text-2xl font-bold text-white mb-6 leading-tight">{selectedEmail.subject}</h1>
                                
                                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                                        {selectedEmail.from.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{selectedEmail.from}</div>
                                        <div className="text-zinc-500 text-sm">To: <span className="text-zinc-400">{selectedEmail.to}</span></div>
                                    </div>
                                    <div className="ml-auto text-zinc-500 text-sm text-right">
                                        <div>{new Date(selectedEmail.date).toLocaleDateString()}</div>
                                        <div>{new Date(selectedEmail.date).toLocaleTimeString()}</div>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-sm max-w-none">
                                    {selectedEmail.html ? (
                                        <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                                    ) : (
                                        <pre className="whitespace-pre-wrap font-sans text-zinc-300">{selectedEmail.body}</pre>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 p-8">
                            <Mail size={64} className="mb-6 opacity-20" />
                            <p className="text-lg">Select an email to read</p>
                        </div>
                    )}
                </div>

            </div>
        )}
    </div>
  );
};

export default MailView;
