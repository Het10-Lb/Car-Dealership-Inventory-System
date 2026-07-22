import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginAPI } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginAPI({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[540px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="glass-panel p-6 md:p-10 rounded-xl flex flex-col items-center">
              <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-primary-container flex items-center justify-center rounded-lg shadow-lg">
                      <Car className="text-white" size={32} strokeWidth={2} />
                  </div>
                  <div className="text-center">
                      <h1 className="font-display text-display text-white tracking-tight">EliteDrive</h1>
                      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-[0.2em]">Management Portal</p>
                  </div>
              </div>

              <div className="w-full space-y-5">
                  <div className="space-y-2">
                      <h2 className="font-headline-lg text-headline-lg text-white">Welcome back</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">Access your inventory dashboard</p>
                  </div>

                  {error && (
                      <div className="bg-error-container/20 border border-error text-error px-4 py-3 rounded-lg font-body-md shadow-sm">
                          {error}
                      </div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                          <label htmlFor="login-email" className="font-label-md text-label-md text-on-surface-variant px-1">Email Address</label>
                          <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors" size={20} />
                              <input 
                                type="email" 
                                id="login-email" 
                                placeholder="name@elitedrive.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[48px] pl-12 pr-4 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-body-md transition-all focus:border-primary-container focus:bg-surface-container-high placeholder:text-on-surface-variant/40" 
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                              <label htmlFor="login-password" className="font-label-md text-label-md text-on-surface-variant">Password</label>
                          </div>
                          <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors" size={20} />
                              <input 
                                type={showPassword ? "text" : "password"}
                                id="login-password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[48px] pl-12 pr-12 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-body-md transition-all focus:border-primary-container focus:bg-surface-container-high placeholder:text-on-surface-variant/40" 
                              />
                              <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                              >
                                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                          </div>
                          <a href="#" className="font-label-sm text-label-sm text-primary-container hover:underline">Forgot password?</a>
                      </div>

                      <button type="submit" className="w-full h-[50px] bg-primary-container text-white font-headline-md rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary-container/20 mt-6">
                          Sign In
                          <ArrowRight size={20} />
                      </button>
                  </form>

                  <div className="pt-8 text-center border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                          Don't have an account? 
                          <Link to="/register" className="text-primary-container font-bold hover:underline transition-all ml-1">Create account</Link>
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}
