import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, FileText, User, Settings, Sparkles, X, Shield } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'My Catalogues', path: '/catalogues' },
    { icon: FileText, label: 'Resources', path: '/resources' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Shield, label: 'Admin Panel', path: '/admin', adminOnly: true },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-surface-container-low border-r border-outline-variant/15 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img src="/images/logo.png" alt="General Study Logo" />
            </div>
            <span className="text-lg font-bold text-on-surface">General Study</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface border-r-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-jakarta text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-3 bg-surface-container rounded-xl border border-outline-variant/15">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center flex-shrink-0">
              <img src="/images/logo.png" alt="General Study Logo" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface mb-1">AI Study Assistant</p>
              <p className="text-xs text-on-surface-variant">Get personalized help</p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-xs font-semibold py-2 rounded-lg hover:shadow-[0_0_20px_rgba(155,168,255,0.3)] transition-all font-jakarta">
            Try Now
          </button>
        </div>

        <div className="p-4 text-xs text-on-surface-variant">
          © 2026 General Study
        </div>
      </aside>
    </>
  );
}
