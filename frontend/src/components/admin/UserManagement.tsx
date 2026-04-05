import { UserX, Mail } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  level: string;
  status: 'active' | 'disabled';
}

interface UserManagementProps {
  users: User[];
  onDisableUser: (id: string) => void;
  onEnableUser: (id: string) => void;
}

export default function UserManagement({ users, onDisableUser, onEnableUser }: UserManagementProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
      <div className="p-6 border-b border-outline-variant/10">
        <h2 className="text-xl font-bold text-on-surface">User Management</h2>
        <p className="text-sm text-on-surface-variant mt-1">Manage platform users</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-sm text-on-surface-variant">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-on-surface-variant">{user.department}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-on-surface-variant">{user.level}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      user.status === 'active'
                        ? 'bg-tertiary-container text-tertiary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => onDisableUser(user.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface text-sm font-jakarta"
                      >
                        <UserX className="w-4 h-4" />
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => onEnableUser(user.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-tertiary-container rounded-lg hover:bg-tertiary-container/80 transition-colors text-tertiary text-sm font-jakarta"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
