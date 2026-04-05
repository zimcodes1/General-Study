import { ChevronLeft, ChevronRight, Send, Grid3x3 } from 'lucide-react';
import { useState } from 'react';

interface AssessmentNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number[];
  onPrevious?: () => void;
  onNext?: () => void;
  onJumpToQuestion?: (index: number) => void;
  onSubmit?: () => void;
  isExamMode: boolean;
}

export default function AssessmentNavigation({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onPrevious,
  onNext,
  onJumpToQuestion,
  onSubmit,
  isExamMode,
}: AssessmentNavigationProps) {
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  return (
    <>
      {showQuestionGrid && isExamMode && onJumpToQuestion && (
        <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-on-surface">Jump to Question</h3>
              <button
                onClick={() => setShowQuestionGrid(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const questionNum = i + 1;
                const isAnswered = answeredQuestions.includes(i);
                const isCurrent = questionNum === currentQuestion;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      onJumpToQuestion(i);
                      setShowQuestionGrid(false);
                    }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-primary to-secondary text-on-primary-fixed'
                        : isAnswered
                        ? 'bg-tertiary-container text-tertiary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {questionNum}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-tertiary-container"></div>
                <span className="text-on-surface-variant">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-surface-container"></div>
                <span className="text-on-surface-variant">Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 bg-surface-container-low/80 backdrop-blur-[40px] border-t border-outline-variant/15 px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="flex items-center gap-2 px-6 py-3 bg-surface-container rounded-full text-on-surface hover:bg-surface-container-high transition-all font-jakarta"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
            )}
            
            {isExamMode && onJumpToQuestion && (
              <button
                onClick={() => setShowQuestionGrid(true)}
                className="flex items-center gap-2 px-4 py-3 bg-surface-container rounded-full text-on-surface hover:bg-surface-container-high transition-all"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onNext && (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-full text-on-surface hover:bg-surface-container-highest transition-all font-jakarta"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {onSubmit && (
              <button
                onClick={onSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
              >
                Submit
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
