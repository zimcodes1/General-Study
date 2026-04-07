import { Search, Bell, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { auth } from '../../utils/auth';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = auth.getUser();
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };


  return (
    <header className="sticky top-0 z-30 bg-surface-container-low/60 backdrop-blur-[40px] border-b border-outline-variant/15">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-on-surface-variant hover:text-on-surface"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search courses, resources..."
              className="w-full bg-surface-container-low rounded-full pl-12 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20 relative" ref={dropdownRef}>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-on-surface">{user?.full_name || 'User'}</p>
              <p className="text-xs text-on-surface-variant">{user?.faculty?.name || user?.department?.name || 'Student'}</p>
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed font-bold text-sm">
                {user ? getInitials(user.full_name) : 'U'}
              </div>
              <ChevronDown className="w-4 h-4 text-on-surface-variant hidden sm:block" />
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-low rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden z-50">
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-jakarta">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-jakarta">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
