
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Music, ArrowRight, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';

interface LoginPageProps {
  onSkip?: () => void; // Optional for demo purposes if auth fails
}

const LoginPage: React.FC<LoginPageProps> = ({ onSkip }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleOAuthLogin = async (provider: 'spotify' | 'notion') => {
    setLoading(provider);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin,
          scopes: provider === 'spotify' 
            ? 'user-read-email user-top-read user-library-read streaming' 
            : undefined
        },
      });
      if (error) throw error;
    } catch (e: any) {
      console.error('Login error:', e);
      setError(e.message || 'Failed to login');
      setLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        // If successful, Supabase might require email confirmation depending on settings
        // For this UI, we'll assume auto-login or alert the user
        setError('Account created! Please check your email if confirmation is required.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex p-4 md:p-6 lg:p-8">
      
      {/* Left Panel - Floating Curved Edge */}
      <div className="hidden md:flex w-1/2 bg-black rounded-[48px] relative overflow-hidden flex-col justify-between p-12 lg:p-16 text-white shadow-2xl">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-8">
              <img src="https://iili.io/fIDzzRS.png" alt="Logo" className="w-10 h-10 rounded-xl" />
              <span className="text-2xl font-bold tracking-tight">Infinity</span>
           </div>
        </div>

        <div className="relative z-10 max-w-md">
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-8 tracking-tighter">
              Search your world, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">reimagined.</span>
            </h1>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Connect your apps, browse the web, and generate insights in one unified workspace powered by Gemini AI.
            </p>
        </div>

        <div className="relative z-10 text-sm text-gray-500 font-mono">
           © 2025 Infinity Search Inc.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
            
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  {mode === 'signin' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-slate-500">
                  {mode === 'signin' ? 'Sign in to continue to your workspace.' : 'Enter your details to get started.'}
                </p>
            </div>

            {error && (
                <div className={`p-4 rounded-2xl text-sm font-medium border flex items-center gap-2 ${error.includes('created') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${error.includes('created') ? 'bg-green-600' : 'bg-red-600'}`} />
                   {error}
                </div>
            )}

            {/* Email/Pass Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
               {mode === 'signup' && (
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all"
                        />
                    </div>
                 </div>
               )}

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all"
                      />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all"
                      />
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={!!loading}
                  className="w-full h-14 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
               >
                  {loading === 'email' ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
               </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center text-sm text-gray-500">
               {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
               <button 
                 type="button"
                 onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                 className="ml-2 font-bold text-blue-600 hover:underline"
               >
                 {mode === 'signin' ? 'Sign up' : 'Sign in'}
               </button>
            </div>

            <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Spotify Button */}
                <button 
                  onClick={() => handleOAuthLogin('spotify')}
                  disabled={!!loading}
                  className="h-14 bg-white border border-gray-200 hover:bg-gray-50 text-slate-900 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
                >
                    <Music size={20} className="text-[#1DB954]" />
                    <span>Spotify</span>
                </button>

                {/* Notion Button */}
                <button 
                  onClick={() => handleOAuthLogin('notion')}
                  disabled={!!loading}
                  className="h-14 bg-white border border-gray-200 hover:bg-gray-50 text-slate-900 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                     <svg viewBox="0 0 122.88 128.1" fill="currentColor" className="w-5 h-5">
                        <path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/>
                     </svg>
                    <span>Notion</span>
                </button>
            </div>

             {/* Demo Skip (Optional for Development) */}
             <div className="text-center pt-4">
                <button 
                    onClick={onSkip}
                    className="text-xs font-medium text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                    Skip login for demo <ArrowRight size={12} />
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
