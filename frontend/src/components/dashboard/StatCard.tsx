import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
}

export default function StatCard({ icon: Icon, label, value, change, trend }: StatCardProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 hover:border-outline-variant/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend === 'up'
                ? 'bg-tertiary-container text-tertiary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-on-surface mb-1">{value}</p>
      <p className="text-sm text-on-surface-variant font-jakarta">{label}</p>
    </div>
  );
}
