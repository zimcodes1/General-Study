import { X, Clock, FileQuestion, Award } from 'lucide-react';

interface AssessmentHeaderProps {
  mode: 'quiz' | 'exam';
  title: string;
  courseCode: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number | null;
  onExit: () => void;
}

export default function AssessmentHeader({
  mode,
  title,
  courseCode,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onExit,
}: AssessmentHeaderProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const isLowTime = timeRemaining !== null && timeRemaining < 300; // Less than 5 minutes

  return (
    <div className="sticky top-0 z-40 bg-surface-container-low/80 backdrop-blur-[40px] border-b border-outline-variant/15">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              mode === 'exam' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-tertiary-container text-tertiary'
            }`}>
              {mode === 'exam' ? <Award className="w-4 h-4" /> : <FileQuestion className="w-4 h-4" />}
              <span className="text-xs font-semibold uppercase font-jakarta">
                {mode === 'exam' ? 'Exam' : 'Quiz'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-on-surface">{title}</p>
              <p className="text-xs text-on-surface-variant">{courseCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isLowTime 
                  ? 'bg-surface-container-high text-on-surface' 
                  : 'bg-surface-container text-on-surface-variant'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold font-jakarta">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            
            <button
              onClick={onExit}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-on-surface-variant font-jakarta whitespace-nowrap">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
}
