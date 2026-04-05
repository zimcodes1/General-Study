import { X } from 'lucide-react';

interface LearningHeaderProps {
  topicTitle: string;
  subtopicTitle: string;
  currentPosition: number;
  totalSections: number;
  onExit: () => void;
}

export default function LearningHeader({
  topicTitle,
  subtopicTitle,
  currentPosition,
  totalSections,
  onExit,
}: LearningHeaderProps) {
  const progressPercentage = (currentPosition / totalSections) * 100;

  return (
    <div className="sticky top-0 z-40 bg-surface-container-low/80 backdrop-blur-[40px] border-b border-outline-variant/15">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-on-surface truncate">{subtopicTitle}</h1>
            <p className="text-sm text-on-surface-variant truncate">{topicTitle}</p>
          </div>
          <button
            onClick={onExit}
            className="ml-4 w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-on-surface-variant font-jakarta whitespace-nowrap">
            {currentPosition} of {totalSections}
          </span>
        </div>
      </div>
    </div>
  );
}
