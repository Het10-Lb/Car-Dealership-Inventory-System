import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Car, 
  Heart, 
  History, 
  Settings, 
  Headset, 
  LogOut, 
  Search, 
  Bell, 
  MessageSquare,
  LayoutDashboard
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isLinkActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/home?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* SideNavBar */}
      <aside className="w-[280px] h-screen fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="bg-primary-container text-white p-1 rounded-lg">
            <img src="/image.png" alt="logo" height={32} width={32} />
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface leading-tight">EliteDrive</h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant opacity-60">Inventory Management</p>
          </div>
        </div>
        
        <nav className="flex-grow space-y-1">
          <p className="px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-4 opacity-40">Menu</p>
          
          <Link 
            to="/home" 
            className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${isLinkActive('/home') ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <Car size={24} />
            <span className="font-label-md text-label-md">Cars Inventory</span>
          </Link>
          
          <Link 
            to="/purchase-history" 
            className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${isLinkActive('/purchase-history') ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <History size={24} />
            <span className="font-label-md text-label-md">Purchase History</span>
          </Link>

          {role === 'admin' && (
            <Link 
              to="/admin/inventory" 
              className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${isLinkActive('/admin/inventory') ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            >
              <LayoutDashboard size={24} />
              <span className="font-label-md text-label-md">Admin Dashboard</span>
            </Link>
          )}
        </nav>

        <div className="mt-auto space-y-1 pb-4">
          <p className="px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-4 opacity-40">Support</p>
          <Link 
            to="/settings"
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${isLinkActive('/settings') ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <Settings size={24} />
            <span className="font-label-md text-label-md">Settings</span>
          </Link>
          <Link 
            to="/support"
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${isLinkActive('/support') ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <Headset size={24} />
            <span className="font-label-md text-label-md">Support & Ticket</span>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-6 py-3 text-error transition-colors duration-200 mt-4 cursor-pointer hover:bg-error/10">
            <LogOut size={24} />
            <span className="font-label-md text-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <main className="ml-[280px] flex-grow flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="flex justify-between items-center px-8 py-4 bg-surface border-b border-outline-variant sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or type a Command" 
                className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-10 pr-24 py-2 text-body-md font-body-md focus:outline-none focus:border-primary transition-all text-on-surface"
              />

            </form>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/notifications')}
              className="hover:bg-surface-container-high rounded-full p-2 transition-all text-on-surface-variant"
            >
              <Bell size={24} />
            </button>
            <button 
              onClick={() => navigate('/support', { state: { tab: 'tickets' } })}
              className="hover:bg-surface-container-high rounded-full p-2 transition-all text-on-surface-variant"
            >
              <MessageSquare size={24} />
            </button>
            <div className="h-8 w-[1px] bg-outline-variant"></div>
            <div 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-high p-2 rounded-xl transition-all"
            >
              <div className="text-right">
                <p className="font-label-md text-label-md font-bold text-on-surface">{user?.name || 'User'}</p>
                <p className="text-[10px] text-on-surface-variant opacity-60">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container-high text-primary-container font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <section className="p-8 space-y-8 flex-grow overflow-y-auto custom-scrollbar">
          {children}
        </section>
      </main>
    </div>
  );
}
