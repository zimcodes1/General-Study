import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { QuizQuestion } from '../../utils/learning/types';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (answers: Record<string, string>, score: { correct: number; total: number }) => void;
  isSubmitting?: boolean;
}

export default function QuizSection({ questions, onComplete, isSubmitting = false }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answeredCount, setAnsweredCount] = useState(0);

  // Defensive check for currentQuestion
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 text-center">
          <p className="text-on-surface-variant">No quiz questions available for this topic.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 text-center">
          <p className="text-on-surface-variant">Error loading quiz question.</p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const isCorrect = isAnswered && 
    answers[currentQuestion.id]?.trim().toLowerCase() === currentQuestion.correct_answer?.trim().toLowerCase();
  
  // Safely get options array
  const options = Array.isArray(currentQuestion.options) ? currentQuestion.options.filter((o) => o) : [];

  const handleAnswerSelect = (option: string) => {
    if (showFeedback || isSubmitting || !option) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion?.id) return;
    
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: selectedAnswer,
    };
    setAnswers(newAnswers);
    
    setShowFeedback(true);
    if (!isAnswered) {
      setAnsweredCount(answeredCount + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion && showFeedback) {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q) => {
        const userAnswer = answers[q.id]?.trim().toLowerCase();
        const correctAnswer = q.correct_answer?.trim().toLowerCase();
        if (userAnswer && correctAnswer && userAnswer === correctAnswer) {
          correctCount += 1;
        }
      });

      onComplete(answers, { correct: correctCount, total: questions.length });
    } else if (showFeedback) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
      <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-on-surface">Topic Quiz</h2>
            <span className="text-sm text-on-surface-variant font-jakarta">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <h3 className="text-lg text-on-surface mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3 mb-6">
          {options.map((option) => {
            if (!option) return null;
            const isSelected = selectedAnswer === option;
            const correctAnswerText = currentQuestion.correct_answer?.trim() || '';
            const isAnswerCorrect = option.trim().toLowerCase() === correctAnswerText.toLowerCase();
            const shouldShowAsCorrect = showFeedback && isAnswerCorrect;
            const shouldShowAsIncorrect = showFeedback && isSelected && !isAnswerCorrect;

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback || isSubmitting}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all border ${
                  shouldShowAsCorrect
                    ? 'bg-green-500/10 border-green-500/40 text-green-700'
                    : shouldShowAsIncorrect
                    ? 'bg-red-500/10 border-red-500/40 text-red-700'
                    : isSelected
                    ? 'bg-surface-container-high border-primary text-on-surface'
                    : 'bg-surface-container border-outline-variant/10 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {shouldShowAsCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {shouldShowAsIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && currentQuestion.explanation && (
          <div className="mb-6 p-4 bg-surface-container rounded-xl border-l-4 border-tertiary">
            <p className="text-sm text-on-surface">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}

        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-jakarta flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
