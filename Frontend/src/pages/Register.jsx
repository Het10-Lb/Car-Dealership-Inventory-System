import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { registerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerAPI({ name, email, password });
      login(data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'User already exists');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden p-6 relative w-full">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[540px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="glass-panel p-6 md:p-10 rounded-xl flex flex-col items-center">
              <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary-container flex items-center justify-center rounded-lg shadow-lg">
                      <Car className="text-white" size={32} strokeWidth={2} />
                  </div>
                  <div className="text-center">
                      <h1 className="font-display text-display text-white tracking-tight">EliteDrive</h1>
                      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-[0.2em]">Partner Registration</p>
                  </div>
              </div>

              <div className="w-full space-y-5">
                  <div className="space-y-2 text-center">
                      <h2 className="font-headline-lg text-headline-lg text-white">Join the Network</h2>
                  </div>

                  {error && (
                      <div className="bg-error-container/20 border border-error text-error px-4 py-3 rounded-lg font-body-md shadow-sm">
                          {error}
                      </div>
                  )}

                  <form className="space-y-3" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                          <label htmlFor="reg-name" className="font-label-md text-label-md text-on-surface-variant px-1">Full Name</label>
                          <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors" size={20} />
                              <input 
                                type="text" 
                                id="reg-name" 
                                placeholder="John Doe" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-[48px] pl-12 pr-4 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-body-md transition-all focus:border-primary-container focus:bg-surface-container-high placeholder:text-on-surface-variant/40" 
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label htmlFor="reg-email" className="font-label-md text-label-md text-on-surface-variant px-1">Email Address</label>
                          <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors" size={20} />
                              <input 
                                type="email" 
                                id="reg-email" 
                                placeholder="name@elitedrive.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[48px] pl-12 pr-4 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-body-md transition-all focus:border-primary-container focus:bg-surface-container-high placeholder:text-on-surface-variant/40" 
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label htmlFor="reg-password" className="font-label-md text-label-md text-on-surface-variant px-1">Create Password</label>
                          <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors" size={20} />
                              <input 
                                type={showPassword ? "text" : "password"}
                                id="reg-password" 
                                placeholder="At least 8 characters" 
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
                      </div>

                      <button type="submit" className="w-full h-[50px] bg-primary-container text-white font-headline-md rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary-container/20 mt-5">
                          <UserPlus size={20} />
                          Create Account
                      </button>
                  </form>   

                  <div className="pt-6 text-center border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                          Already a member? 
                          <Link to="/login" className="text-primary-container font-bold hover:underline transition-all ml-1">Sign in here</Link>
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
