import { ChevronRight, CheckCircle2, Circle, PlayCircle, Loader2 } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
  order: number;
  hasQuiz?: boolean;
}

interface TopicsListProps {
  topics: Topic[];
  hasCatalogue?: boolean;
  loading?: boolean;
  creatingCatalogue?: boolean;
  createError?: string | null;
  onCreateCatalogue?: () => void;
  onTopicClick: (topicId: string) => void;
}

export default function TopicsList({
  topics,
  hasCatalogue = true,
  loading = false,
  creatingCatalogue = false,
  createError = null,
  onCreateCatalogue,
  onTopicClick,
}: TopicsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-tertiary" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-primary" />;
      default:
        return <Circle className="w-5 h-5 text-surface-container-high" />;
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
      <h3 className="text-lg font-semibold text-on-surface mb-4">Topics & Sections</h3>

      {loading || creatingCatalogue ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-primary animate-spin mb-2" />
          <p className="text-sm text-on-surface-variant">
            {creatingCatalogue ? 'Creating Catalogue...' : 'Loading topics...'}
          </p>
        </div>
      ) : !hasCatalogue ? (
        <div className="text-center py-8">
          <div className="text-sm text-on-surface-variant mb-4">
            Catalogue not created yet.
          </div>
          {createError && (
            <div className="text-xs text-error mb-3">{createError}</div>
          )}
          <button
            onClick={onCreateCatalogue}
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed rounded-full text-sm font-semibold hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
          >
            Create catalogue
          </button>
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-sm text-on-surface-variant">
            No topics available for this catalogue yet.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicClick(topic.id)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-all group"
            >
              {getStatusIcon(topic.status)}
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {topic.title}
                </span>
                {topic.hasQuiz && (
                  <span className="text-xs text-on-surface-variant ml-2">
                    • Has Quiz
                  </span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
