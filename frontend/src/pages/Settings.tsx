import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AccountInformation from '../components/settings/AccountInformation';
import SecuritySettings from '../components/settings/SecuritySettings';
import { Save } from 'lucide-react';

export default function Settings() {
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    console.log('Saving settings...');
    setHasChanges(false);
  };

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            Settings
          </h1>
          <p className="text-on-surface-variant">Manage your account preferences and security</p>
        </div>

        <div className="max-w-4xl space-y-6">
          <AccountInformation onChange={() => setHasChanges(true)} />
          <SecuritySettings onChange={() => setHasChanges(true)} />

          {hasChanges && (
            <div className="sticky bottom-8 bg-surface-container-low/80 backdrop-blur-[40px] rounded-2xl p-4 border border-outline-variant/10 flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">You have unsaved changes</p>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
