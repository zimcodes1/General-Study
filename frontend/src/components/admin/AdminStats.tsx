import { FileText, Clock, Users, CheckCircle2 } from 'lucide-react';

interface AdminStatsProps {
  totalResources: number;
  pendingApprovals: number;
  totalUsers: number;
  approvedToday: number;
}

export default function AdminStats({
  totalResources,
  pendingApprovals,
  totalUsers,
  approvedToday,
}: AdminStatsProps) {
  const stats = [
    {
      icon: FileText,
      label: 'Total Resources',
      value: totalResources,
      color: 'text-primary',
    },
    {
      icon: Clock,
      label: 'Pending Approvals',
      value: pendingApprovals,
      color: 'text-secondary',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: totalUsers,
      color: 'text-tertiary',
    },
    {
      icon: CheckCircle2,
      label: 'Approved Today',
      value: approvedToday,
      color: 'text-tertiary',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">{stat.value}</p>
            <p className="text-sm text-on-surface-variant font-jakarta">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
