import { Search, Bell, Menu } from 'lucide-react';
import { auth } from '../../utils/auth';
import { useEffect, useState } from 'react';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = auth.getUser();
    setUser(userData);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const firstName = user?.full_name?.split(' ')[0] || 'User';

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

          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-on-surface">{user?.full_name || 'User'}</p>
              <p className="text-xs text-on-surface-variant">{user?.department || 'Student'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed font-bold text-sm">
              {user ? getInitials(user.full_name) : 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
