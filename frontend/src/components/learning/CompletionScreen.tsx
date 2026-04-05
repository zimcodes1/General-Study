import { Trophy, ArrowRight, FileQuestion } from 'lucide-react';

interface CompletionScreenProps {
  topicTitle: string;
  pointsEarned: number;
  nextTopicTitle?: string;
  onContinue: () => void;
  onTakeQuiz?: () => void;
  quizAvailable?: boolean;
}

export default function CompletionScreen({
  topicTitle,
  pointsEarned,
  nextTopicTitle,
  onContinue,
  onTakeQuiz,
  quizAvailable = false,
}: CompletionScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-on-primary-fixed" />
          </div>
          <h1 className="text-4xl font-bold text-on-surface mb-3">Topic Completed! 🎉</h1>
          <p className="text-xl text-on-surface-variant mb-2">{topicTitle}</p>
        </div>

        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-5xl font-bold text-primary">+{pointsEarned}</span>
            <span className="text-2xl text-on-surface-variant">points</span>
          </div>
          <p className="text-sm text-on-surface-variant">Great job! Keep up the momentum</p>
        </div>

        {nextTopicTitle && (
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 mb-6">
            <p className="text-sm text-on-surface-variant mb-2">Up Next</p>
            <p className="text-lg font-semibold text-on-surface">{nextTopicTitle}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {quizAvailable && onTakeQuiz && (
            <button
              onClick={onTakeQuiz}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-container-low border border-outline-variant/10 text-on-surface font-semibold rounded-full hover:bg-surface-container transition-all font-jakarta"
            >
              <FileQuestion className="w-5 h-5" />
              Take Quiz
            </button>
          )}
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
          >
            Continue to Next Topic
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
