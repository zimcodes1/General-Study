import { Edit2, MapPin, GraduationCap, Building2 } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  email: string;
  school: string;
  department: string;
  level: string;
  avatar?: string;
  onEdit: () => void;
}

export default function ProfileHeader({
  name,
  email,
  school,
  department,
  level,
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
              alt={name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-outline-variant/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed text-3xl font-bold">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-tertiary rounded-full border-4 border-surface-container-low"></div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-on-surface mb-1 tracking-tight">{name}</h1>
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
              <span>{level}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-full text-on-surface hover:bg-surface-container-highest transition-all border border-outline-variant/10 font-jakarta text-sm"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}
