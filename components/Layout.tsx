import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Home, FileText, Settings, LogOut, Map, UserCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar on Login Page
  if (location.pathname === '/login') {
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
              מעין עולם הבא
            </Link>
            {isAuthenticated && <span className="bg-secondary-100 text-secondary-600 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium">בית</Link>
            {isAuthenticated ? (
              <>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <Link to="/dashboard" className={`text-sm font-medium hover:text-primary-600 ${location.pathname === '/dashboard' ? 'text-primary-600' : 'text-slate-600'}`}>דשבורד</Link>
                <Link to="/admin/yishuvim" className={`text-sm font-medium hover:text-primary-600 ${location.pathname.includes('yishuvim') ? 'text-primary-600' : 'text-slate-600'}`}>יישובים</Link>
                <Link to="/admin/units" className={`text-sm font-medium hover:text-primary-600 ${location.pathname.includes('units') ? 'text-primary-600' : 'text-slate-600'}`}>יחידות</Link>
                <Link to="/admin/billing" className={`text-sm font-medium hover:text-primary-600 ${location.pathname.includes('billing') ? 'text-primary-600' : 'text-slate-600'}`}>חיובים</Link>
                <Link to="/admin/affiliates" className={`text-sm font-medium hover:text-primary-600 ${location.pathname.includes('affiliates') ? 'text-primary-600' : 'text-slate-600'}`}>שותפים</Link>
                
                <div className="flex items-center gap-3 mr-4 pl-4 border-r border-slate-200">
                    <div className="text-left hidden lg:block">
                        <div className="text-xs font-bold text-slate-700">{user?.name}</div>
                        <div className="text-[10px] text-slate-400">{user?.email}</div>
                    </div>
                    <img src={user?.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                    <button onClick={logout} className="text-slate-400 hover:text-red-500 transition" title="התנתק">
                        <LogOut size={18} />
                    </button>
                </div>
              </>
            ) : (
             <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 flex items-center gap-1">
               <UserCircle size={18} /> כניסת מנהלים
             </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-600 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-16 shadow-lg py-4 px-4 flex flex-col gap-4 z-50">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-700">
               <Home size={18} /> דף הבית
            </Link>
            {isAuthenticated ? (
              <>
                <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 mb-2">
                    <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div className="text-sm">
                        <div className="font-bold text-slate-700">{user?.name}</div>
                        <div className="text-xs text-slate-500">{user?.email}</div>
                    </div>
                </div>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-700">
                  <LayoutDashboard size={18} /> דשבורד
                </Link>
                <Link to="/admin/yishuvim" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-700">
                  <Map size={18} /> ניהול יישובים
                </Link>
                <Link to="/admin/units" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-700">
                  <Settings size={18} /> ניהול יחידות
                </Link>
                <Link to="/admin/billing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-700">
                  <FileText size={18} /> חיובים
                </Link>
                <Link to="/admin/affiliates" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-700">
                  <Users size={18} /> שותפים
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-red-500 mt-2 border-t pt-4">
                  <LogOut size={18} /> התנתק
                </button>
              </>
            ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-700 border-t pt-4">
                  <UserCircle size={18} /> כניסת מנהלים
                </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-lg mb-2">מעין עולם הבא</p>
          <p className="text-sm opacity-70">חופשה משפחתית מושלמת לשומרי מצוות</p>
          <div className="mt-4 text-xs text-slate-500">
            © {new Date().getFullYear()} כל הזכויות שמורות.
          </div>
        </div>
      </footer>
    </div>
  );
};