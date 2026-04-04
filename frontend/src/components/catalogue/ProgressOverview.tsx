import { Clock, CheckCircle2 } from 'lucide-react';

interface ProgressOverviewProps {
  percentageCompleted: number;
  lastStudiedSection: string;
  totalTopics: number;
  completedTopics: number;
}

export default function ProgressOverview({
  percentageCompleted,
  lastStudiedSection,
  totalTopics,
  completedTopics,
}: ProgressOverviewProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
      <h3 className="text-lg font-semibold text-on-surface mb-4">Your Progress</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-on-surface-variant">Overall Completion</span>
            <span className="text-lg font-bold text-primary">{percentageCompleted}%</span>
          </div>
          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
              style={{ width: `${percentageCompleted}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <CheckCircle2 className="w-4 h-4 text-tertiary" />
          <span>
            {completedTopics} of {totalTopics} topics completed
          </span>
        </div>

        {lastStudiedSection && (
          <div className="pt-4 border-t border-outline-variant/10">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-on-surface-variant mt-0.5" />
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-jakarta">
                  Last Studied
                </p>
                <p className="text-sm text-on-surface font-semibold">{lastStudiedSection}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
