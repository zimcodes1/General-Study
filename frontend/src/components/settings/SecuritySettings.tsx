import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface SecuritySettingsProps {
  onChange: () => void;
}

export default function SecuritySettings({ onChange }: SecuritySettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, label: '' };
    if (pass.length < 6) return { strength: 1, label: 'WEAK' };
    if (pass.length < 10) return { strength: 2, label: 'MEDIUM' };
    return { strength: 3, label: 'STRONG' };
  };

  const { strength, label } = getPasswordStrength(newPassword);

  return (
    <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface mb-1">Security</h2>
        <p className="text-sm text-on-surface-variant">Manage your password and security settings</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              onChange={onChange}
              className="w-full bg-surface-container rounded-xl pl-12 pr-12 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                onChange();
              }}
              className="w-full bg-surface-container rounded-xl pl-12 pr-12 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {newPassword && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-surface-container-high'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant font-jakarta">{label}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              onChange={onChange}
              className="w-full bg-surface-container rounded-xl pl-12 pr-12 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant">
            Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
          </p>
        </div>
      </div>
    </div>
  );
}
