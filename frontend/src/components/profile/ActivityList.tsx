import { FileText, BookOpen, Award, Upload, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'quiz' | 'exam' | 'upload' | 'bookmark' | 'complete';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

interface ActivityListProps {
  activities?: Activity[];
}

const activityIcons = {
  quiz: Award,
  exam: Award,
  upload: Upload,
  bookmark: BookOpen,
  complete: FileText,
};

const activityColors = {
  quiz: 'text-tertiary',
  exam: 'text-primary',
  upload: 'text-secondary',
  bookmark: 'text-tertiary',
  complete: 'text-primary',
};

export default function ActivityList({ activities = [] }: ActivityListProps) {
  // Use provided activities or show placeholder
  const displayActivities = activities.length > 0 ? activities : [
    {
      id: '1',
      type: 'quiz' as const,
      title: 'Machine Learning Quiz',
      description: 'Completed quiz on CSC 201',
      timestamp: '2 hours ago',
      score: 92,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-on-surface tracking-tight">Recent Activity</h2>

      {displayActivities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-variant">No activities yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayActivities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div
                key={activity.id}
                className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10 hover:bg-surface-container transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center ${colorClass} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-on-surface">{activity.title}</h3>
                      {activity.score !== undefined && (
                        <span className="text-sm font-bold text-tertiary flex-shrink-0">
                          {activity.score}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant mb-2">{activity.description}</p>
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                      <Clock className="w-3 h-3" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
