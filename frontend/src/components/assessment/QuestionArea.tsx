import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuestionAreaProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | undefined;
  onAnswerSelect: (index: number) => void;
  showExplanation?: boolean;
  correctAnswer?: number;
}

export default function QuestionArea({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  showExplanation = false,
  correctAnswer,
}: QuestionAreaProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
        <div className="mb-6">
          <span className="text-sm text-on-surface-variant font-jakarta">
            Question {questionNumber}
          </span>
          <h2 className="text-xl text-on-surface mt-2 leading-relaxed">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = correctAnswer !== undefined && index === correctAnswer;
            const isIncorrect = showExplanation && isSelected && correctAnswer !== undefined && index !== correctAnswer;

            return (
              <button
                key={index}
                onClick={() => !showExplanation && onAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all border ${
                  isCorrect && showExplanation
                    ? 'bg-tertiary-container border-tertiary'
                    : isIncorrect
                    ? 'bg-surface-container-high border-outline-variant/30'
                    : isSelected
                    ? 'bg-surface-container-high border-primary'
                    : 'bg-surface-container border-outline-variant/10 hover:bg-surface-container-high hover:border-outline-variant/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isCorrect && showExplanation
                        ? 'bg-tertiary text-on-primary-fixed'
                        : isSelected
                        ? 'bg-primary text-on-primary-fixed'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-on-surface">{option}</span>
                  </div>
                  {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-tertiary" />}
                  {isIncorrect && <XCircle className="w-5 h-5 text-on-surface-variant" />}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && question.explanation && (
          <div className="mt-6 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">Explanation</p>
                <p className="text-sm text-on-surface-variant">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
