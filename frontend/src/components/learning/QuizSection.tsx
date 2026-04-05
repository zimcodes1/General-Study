import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export default function QuizSection({ questions, onComplete }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0));
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
      <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-on-surface">Quick Quiz</h2>
            <span className="text-sm text-on-surface-variant font-jakarta">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-lg text-on-surface mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all border ${
                  showCorrect
                    ? 'bg-tertiary-container border-tertiary text-on-surface'
                    : showIncorrect
                    ? 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant'
                    : isSelected
                    ? 'bg-surface-container-high border-primary text-on-surface'
                    : 'bg-surface-container border-outline-variant/10 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-tertiary" />}
                  {showIncorrect && <XCircle className="w-5 h-5 text-on-surface-variant" />}
                </div>
              </button>
            );
          })}
        </div>

        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-jakarta"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
          >
            {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
