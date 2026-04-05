import { Edit2, MapPin, GraduationCap, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  full_name: string;
  email: string;
  school: string;
  department: string;
  current_level: string;
  avatar?: string;
  onEdit: () => void;
}

const getInitials = (name: string) => {
  if (!name) return "U";
  const names = name.split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function ProfileHeader({
  full_name,
  email,
  school,
  department,
  current_level,
  avatar,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={full_name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-outline-variant/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed text-3xl font-bold">
              {getInitials(full_name)}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-tertiary rounded-full border-4 border-surface-container-low"></div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-on-surface mb-1 tracking-tight">{full_name}</h1>
          <p className="text-on-surface-variant mb-4">{email}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin className="w-4 h-4" />
              <span>{school}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Building2 className="w-4 h-4" />
              <span>{department}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <GraduationCap className="w-4 h-4" />
              <span>{current_level}</span>
            </div>
          </div>
        </div>

        <Link
          to='/settings'
          onClick={onEdit}
          className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-full text-on-surface hover:bg-surface-container-highest transition-all border border-outline-variant/10 font-jakarta text-sm"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
