import { useState } from 'react';
import { Trophy, ArrowRight, FileQuestion, Star } from 'lucide-react';

interface CompletionScreenProps {
  topicTitle: string;
  pointsEarned: number;
  nextTopicTitle?: string;
  onContinue: () => void;
  onTakeQuiz?: () => void;
  quizAvailable?: boolean;
  ratingValue: number | null;
  ratingSubmitted: boolean;
  ratingSubmitting: boolean;
  ratingError?: string | null;
  onRatingSelect: (value: number) => void;
  onSubmitRating: () => void;
}

export default function CompletionScreen({
  topicTitle,
  pointsEarned,
  nextTopicTitle,
  onContinue,
  onTakeQuiz,
  quizAvailable = false,
  ratingValue,
  ratingSubmitted,
  ratingSubmitting,
  ratingError,
  onRatingSelect,
  onSubmitRating,
}: CompletionScreenProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const displayRating = hoveredRating ?? ratingValue ?? 0;

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

        <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-2">Rate this catalogue</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Your rating helps us improve. Rating is required to continue.
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(null)}
                onClick={() => onRatingSelect(value)}
                disabled={ratingSubmitting || ratingSubmitted}
                className="p-1"
                aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
              >
                <Star
                  className={`w-8 h-8 ${
                    displayRating >= value
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-outline-variant'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onSubmitRating}
              disabled={ratingSubmitting || ratingSubmitted || !ratingValue}
              className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface font-semibold border border-outline-variant/20 hover:bg-surface-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ratingSubmitted ? 'Rating Submitted' : ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            {ratingError && (
              <p className="text-sm text-error">{ratingError}</p>
            )}
          </div>
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
            disabled={!ratingSubmitted}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Next Topic
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
