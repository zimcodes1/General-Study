import { User, Mail, Phone, MapPin, Building2, GraduationCap } from 'lucide-react';

interface AccountInformationProps {
  onChange: () => void;
}

export default function AccountInformation({ onChange }: AccountInformationProps) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface mb-1">Account Information</h2>
        <p className="text-sm text-on-surface-variant">Update your personal details</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                defaultValue="Sarah Chen"
                onChange={onChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="email"
                defaultValue="sarah.chen@university.edu"
                onChange={onChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                onChange={onChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              School
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                defaultValue="Tech University"
                onChange={onChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Department
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <select
                defaultValue="Computer Science"
                onChange={onChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              >
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Business</option>
                <option>Mathematics</option>
                <option>Physics</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Level
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <select
                defaultValue="Undergraduate"
                onChange={onChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              >
                <option>Undergraduate</option>
                <option>Graduate</option>
                <option>PhD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
