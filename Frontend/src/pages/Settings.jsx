import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { updateProfileAPI, updatePasswordAPI } from '../services/api';
import { Save, Lock, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Feedback State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const response = await updateProfileAPI({ name, email });
      if (response.token) {
        login(response.token);
      }
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setPasswordLoading(true);
    try {
      await updatePasswordAPI({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {toast && (
        <div className={`fixed top-24 right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl animate-bounce ${toast.type === 'success' ? 'bg-surface-container-high border-primary text-primary' : 'bg-error-container border-error text-on-error-container'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-label-md">{toast.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-display-sm font-display-sm text-on-surface mb-2">Settings</h1>
          <p className="text-body-lg text-on-surface-variant opacity-70">Manage your account preferences and security.</p>
        </div>

        <div className="bg-surface-container rounded-2xl border border-outline-variant overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Tabs */}
          <div className="md:w-64 bg-surface-container-low border-r border-outline-variant p-6 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
            >
              <UserIcon size={20} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
            >
              <Lock size={20} />
              <span>Security</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 md:p-12">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-headline-md font-headline-md text-on-surface mb-6">Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface-variant">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface-variant">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
                  >
                    {profileLoading ? <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-headline-md font-headline-md text-on-surface mb-6">Update Password</h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface-variant">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface-variant">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface-variant">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
                  >
                    {passwordLoading ? <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : <Lock size={20} />}
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
