import { FileText, Clock, Users, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface AdminStatsProps {
  totalResources: number;
  pendingApprovals: number;
  totalUsers: number;
  approvedToday: number;
  activeUsers?: number;
  openReports?: number;
}

export default function AdminStats({
  totalResources,
  pendingApprovals,
  totalUsers,
  approvedToday,
  activeUsers,
  openReports,
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
      icon: CheckCircle2,
      label: 'Approved Today',
      value: approvedToday,
      color: 'text-tertiary',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: totalUsers,
      color: 'text-primary',
    },
    ...(activeUsers !== undefined
      ? [{ icon: UserCheck, label: 'Active Users (30d)', value: activeUsers, color: 'text-tertiary' }]
      : []),
    ...(openReports !== undefined
      ? [{ icon: AlertTriangle, label: 'Open Reports', value: openReports, color: 'text-secondary' }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-on-surface mb-1">{stat.value}</p>
            <p className="text-xs text-on-surface-variant font-jakarta leading-tight">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
