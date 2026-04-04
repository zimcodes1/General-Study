import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
}

function StatItem({ icon: Icon, label, value, subtitle }: StatItemProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-bold text-on-surface mb-1">{value}</p>
      <p className="text-sm text-on-surface-variant font-jakarta">{label}</p>
      {subtitle && <p className="text-xs text-tertiary mt-1">{subtitle}</p>}
    </div>
  );
}

export default function ProfileStats() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-on-surface tracking-tight">Your Stats</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem icon={Trophy} label="Total Points" value="2,450" subtitle="+120 this week" />
        <StatItem icon={Flame} label="Day Streak" value="15" subtitle="Keep it up!" />
        <StatItem icon={Target} label="Completed" value="24" subtitle="Resources" />
        <StatItem icon={TrendingUp} label="Avg. Score" value="87%" subtitle="+5% from last month" />
      </div>

      <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-1">Weekly Progress</h3>
            <p className="text-sm text-on-surface-variant">You're doing great this week!</p>
          </div>
          <span className="text-2xl font-bold text-primary">68%</span>
        </div>
        <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
            style={{ width: '68%' }}
          />
        </div>
      </div>
    </div>
  );
}
