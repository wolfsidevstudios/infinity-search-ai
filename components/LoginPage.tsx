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

  const handleOAuthLogin = async (provider: 'spotify' | 'notion' | 'google') => {
    setLoading(provider);
    setError(null);
    localStorage.setItem('connecting_provider', provider); // Set flag

    try {
      const options: any = {
          redirectTo: window.location.origin,
      };

      if (provider === 'spotify') {
          options.scopes = 'user-read-email user-top-read user-library-read streaming';
      } else if (provider === 'google') {
          // Request access to create/edit files created by this app
          options.scopes = 'https://www.googleapis.com/auth/drive.file';
          options.queryParams = {
            access_type: 'offline',
            prompt: 'consent',
          };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: options,
      });
      if (error) throw error;
    } catch (e: any) {
      console.error('Login error:', e);
      setError(e.message || 'Failed to login');
      setLoading(null);
      localStorage.removeItem('connecting_provider');
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
    <div className="min-h-screen w-full bg-black text-white flex animate-fadeIn">
      
      {/* Left Side - Abstract Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black p-4">
          <div className="absolute inset-4 rounded-[40px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                alt="Abstract Background" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" /> {/* Subtle Overlay */}
              
              {/* Logo */}
              <div className="absolute top-10 left-10">
                  <div className="w-12 h-12 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                      <span className="font-bold text-lg">a.</span>
                  </div>
              </div>

              {/* Bottom Text */}
              <div className="absolute bottom-16 left-10 max-w-md">
                  <h1 className="text-6xl font-normal leading-tight tracking-tight">
                      Be a Part of<br />
                      <span className="font-bold">Something Beautiful</span>
                  </h1>
              </div>
          </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-black">
          
          <div className="w-full max-w-md space-y-8">
              
              <div className="text-center lg:text-left space-y-2">
                  <h2 className="text-4xl font-bold text-white">Login</h2>
                  <p className="text-zinc-500">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2 ${error.includes('created') ? 'bg-green-900/20 text-green-400 border-green-900/50' : 'bg-red-900/20 text-red-400 border-red-900/50'}`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${error.includes('created') ? 'bg-green-500' : 'bg-red-500'}`} />
                   {error}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-6">
                  
                  {mode === 'signup' && (
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-zinc-400">Full Name</label>
                          <input 
                            type="text" 
                            required 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full p-4 bg-[#111] border border-[#333] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                          />
                      </div>
                  )}

                  <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400">Email</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full p-4 bg-[#111] border border-[#333] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400">Password</label>
                      <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-4 bg-[#111] border border-[#333] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                      />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-transparent text-white focus:ring-0 focus:ring-offset-0" />
                          <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Remember me</span>
                      </label>
                      {/* Forgot Password link could go here */}
                  </div>

                  <button 
                    type="submit"
                    disabled={!!loading}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      {loading === 'email' ? <Loader2 className="animate-spin mx-auto" /> : (mode === 'signin' ? 'Login' : 'Create Account')}
                  </button>

                  <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-zinc-800"></div>
                      <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs uppercase tracking-wider">Or continue with</span>
                      <div className="flex-grow border-t border-zinc-800"></div>
                  </div>

                  <button 
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      disabled={!!loading}
                      className="w-full py-4 bg-[#111] text-white border border-[#333] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#222] transition-all"
                  >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                      Google
                  </button>

              </form>

              <div className="text-center mt-8">
                  <span className="text-zinc-500">
                      {mode === 'signin' ? "Not a member?" : "Already have an account?"} 
                  </span>
                  <button 
                    onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                    className="text-white font-bold ml-2 hover:underline focus:outline-none"
                  >
                      {mode === 'signin' ? 'Create an account' : 'Login'}
                  </button>
              </div>

              {/* Demo Skip */}
              <div className="text-center mt-12">
                <button 
                    onClick={onSkip}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-400 transition-colors flex items-center justify-center gap-1 mx-auto"
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