import { Trophy, RotateCcw, Eye, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import QuestionArea from './QuestionArea';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ResultsScreenProps {
  mode: 'quiz' | 'exam';
  score: number;
  correct: number;
  incorrect: number;
  total: number;
  questions: Question[];
  userAnswers: { [key: number]: number };
  onRetake: () => void;
  onReviewAnswers: () => void;
  onReturnToCatalogue: () => void;
}

export default function ResultsScreen({
  mode,
  score,
  correct,
  incorrect,
  total,
  questions,
  userAnswers,
  onRetake,
  onReturnToCatalogue,
}: ResultsScreenProps) {
  const [showReview, setShowReview] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const getScoreColor = () => {
    if (score >= 80) return 'text-tertiary';
    if (score >= 60) return 'text-primary';
    return 'text-on-surface-variant';
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'Outstanding! 🎉';
    if (score >= 80) return 'Great job! 🌟';
    if (score >= 70) return 'Well done! 👏';
    if (score >= 60) return 'Good effort! 💪';
    return 'Keep practicing! 📚';
  };

  const incorrectQuestions = questions.filter((_, index) => userAnswers[index] !== questions[index].correctAnswer);

  if (showReview) {
    const currentQuestion = incorrectQuestions[reviewIndex];
    const originalIndex = questions.findIndex(q => q.id === currentQuestion.id);

    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <div className="sticky top-0 z-40 bg-surface-container-low/80 backdrop-blur-[40px] border-b border-outline-variant/15 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowReview(false)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-jakarta">Back to Results</span>
            </button>
            <span className="text-sm text-on-surface-variant font-jakarta">
              {reviewIndex + 1} of {incorrectQuestions.length} incorrect
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <QuestionArea
            question={currentQuestion}
            questionNumber={originalIndex + 1}
            selectedAnswer={userAnswers[originalIndex]}
            onAnswerSelect={() => {}}
            showExplanation={true}
            correctAnswer={currentQuestion.correctAnswer}
          />
        </div>

        <div className="sticky bottom-0 bg-surface-container-low/80 backdrop-blur-[40px] border-t border-outline-variant/15 px-4 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
              disabled={reviewIndex === 0}
              className="px-6 py-3 bg-surface-container rounded-full text-on-surface hover:bg-surface-container-high transition-all disabled:opacity-50 disabled:cursor-not-allowed font-jakarta"
            >
              Previous
            </button>
            <button
              onClick={() => setReviewIndex(Math.min(incorrectQuestions.length - 1, reviewIndex + 1))}
              disabled={reviewIndex === incorrectQuestions.length - 1}
              className="px-6 py-3 bg-surface-container rounded-full text-on-surface hover:bg-surface-container-high transition-all disabled:opacity-50 disabled:cursor-not-allowed font-jakarta"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-on-primary-fixed" />
          </div>
          <h1 className="text-4xl font-bold text-on-surface mb-2">{getScoreMessage()}</h1>
          <p className="text-lg text-on-surface-variant">
            {mode === 'exam' ? 'Exam' : 'Quiz'} Completed
          </p>
        </div>

        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 mb-6">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>{score}%</div>
            <p className="text-on-surface-variant">Your Score</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <div className="text-2xl font-bold text-on-surface mb-1">{total}</div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-jakarta">
                Total
              </p>
            </div>
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-tertiary" />
                <div className="text-2xl font-bold text-on-surface">{correct}</div>
              </div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-jakarta">
                Correct
              </p>
            </div>
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-on-surface-variant" />
                <div className="text-2xl font-bold text-on-surface">{incorrect}</div>
              </div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-jakarta">
                Incorrect
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {incorrect > 0 && (
            <button
              onClick={() => setShowReview(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
            >
              <Eye className="w-5 h-5" />
              Review Incorrect Answers
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onRetake}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-low border border-outline-variant/10 text-on-surface font-semibold rounded-full hover:bg-surface-container transition-all font-jakarta"
            >
              <RotateCcw className="w-5 h-5" />
              Retake {mode === 'exam' ? 'Exam' : 'Quiz'}
            </button>

            <button
              onClick={onReturnToCatalogue}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-low border border-outline-variant/10 text-on-surface font-semibold rounded-full hover:bg-surface-container transition-all font-jakarta"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Catalogue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
