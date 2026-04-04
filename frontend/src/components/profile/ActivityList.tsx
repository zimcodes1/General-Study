import { FileText, BookOpen, Award, Upload, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'quiz' | 'exam' | 'upload' | 'bookmark' | 'complete';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
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

export default function ActivityList() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'quiz',
      title: 'Machine Learning Quiz',
      description: 'Completed quiz on CSC 201',
      timestamp: '2 hours ago',
      score: 92,
    },
    {
      id: '2',
      type: 'upload',
      title: 'Uploaded Resource',
      description: 'Data Structures Notes - CSC 301',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      type: 'complete',
      title: 'Completed Reading',
      description: 'Neural Networks Deep Dive',
      timestamp: '1 day ago',
    },
    {
      id: '4',
      type: 'exam',
      title: 'Database Systems Exam',
      description: 'Final exam on CSC 310',
      timestamp: '2 days ago',
      score: 88,
    },
    {
      id: '5',
      type: 'bookmark',
      title: 'Bookmarked Resource',
      description: 'Cloud Computing Essentials',
      timestamp: '3 days ago',
    },
    {
      id: '6',
      type: 'quiz',
      title: 'Python Programming Quiz',
      description: 'Completed quiz on CSC 305',
      timestamp: '4 days ago',
      score: 95,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-on-surface tracking-tight">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((activity) => {
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
    </div>
  );
}
