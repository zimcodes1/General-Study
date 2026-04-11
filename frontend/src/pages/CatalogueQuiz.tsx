import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssessmentHeader from '../components/assessment/AssessmentHeader';
import QuestionArea from '../components/assessment/QuestionArea';
import AssessmentNavigation from '../components/assessment/AssessmentNavigation';
import ResultsScreen from '../components/assessment/ResultsScreen';
import { tokenStorage } from '../utils/auth';
import { catalogueAPI } from '../utils/learning/catalogueAPI';
import type { CatalogueDetail } from '../utils/learning/types';

type ResourceDetail = {
  id: string;
  title: string;
  course_code?: string | null;
  catalogue?: { id: string } | null;
};

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export default function CatalogueQuiz() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [catalogue, setCatalogue] = useState<CatalogueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const loadResource = async () => {
      if (!resourceId) return;
      setLoading(true);
      setError(null);
      try {
        const accessToken = tokenStorage.getAccessToken();
        const response = await fetch(`${apiUrl}/resources/${resourceId}/`, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        });

        if (!response.ok) {
          throw new Error('Failed to load resource');
        }

        const data = await response.json();
        setResource(data);

        if (!data?.catalogue?.id) {
          throw new Error('No catalogue is available for this resource.');
        }

        const catalogueData = await catalogueAPI.getCatalogue(data.catalogue.id);
        setCatalogue(catalogueData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load quiz';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [apiUrl, resourceId]);

  const questions: Question[] = useMemo(() => {
    if (!catalogue) return [];

    const topics = [...catalogue.topics].sort((a, b) => a.order - b.order);
    const flattened = topics.flatMap((topic) =>
      (topic.quiz_questions || [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((question) => {
          const correctAnswerText = question.correct_answer?.trim().toLowerCase();
          const correctAnswerIndex = question.options.findIndex(
            (option) => option.trim().toLowerCase() === correctAnswerText
          );

          return {
            id: question.id,
            question: question.question,
            options: question.options,
            correctAnswer: correctAnswerIndex,
            explanation: question.explanation,
          };
        })
    );

    return flattened;
  }, [catalogue]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isCurrentAnswered = answers[currentQuestionIndex] !== undefined;
  const canSubmit = totalQuestions > 0 && answeredCount === totalQuestions && isLastQuestion;

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const handleReturnToCatalogue = () => {
    if (resourceId) {
      navigate(`/catalogue/${resourceId}`);
      return;
    }
    navigate('/catalogues');
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct += 1;
      }
    });
    return {
      correct,
      incorrect: totalQuestions - correct,
      percentage: totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-on-surface-variant">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 text-center">
          <p className="text-on-surface font-semibold mb-2">Unable to load quiz</p>
          <p className="text-on-surface-variant text-sm mb-6">{error}</p>
          <button
            onClick={handleReturnToCatalogue}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:shadow-lg transition-all"
          >
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 text-center">
          <p className="text-on-surface font-semibold mb-2">No quiz questions available</p>
          <p className="text-on-surface-variant text-sm mb-6">
            This catalogue does not have quiz questions yet.
          </p>
          <button
            onClick={handleReturnToCatalogue}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:shadow-lg transition-all"
          >
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <ResultsScreen
        mode="quiz"
        score={results.percentage}
        correct={results.correct}
        incorrect={results.incorrect}
        total={totalQuestions}
        questions={questions}
        userAnswers={answers}
        onRetake={handleRetake}
        onReviewAnswers={() => {}}
        onReturnToCatalogue={handleReturnToCatalogue}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AssessmentHeader
        mode="quiz"
        title={resource?.title || 'Catalogue Quiz'}
        courseCode={resource?.course_code || 'Catalogue Quiz'}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeRemaining={null}
        onExit={handleReturnToCatalogue}
      />

      <div className="flex-1 overflow-y-auto pb-24">
        <QuestionArea
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedAnswer={answers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          showExplanation={false}
        />
      </div>

      <AssessmentNavigation
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        answeredQuestions={Object.keys(answers).map(Number)}
        onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
        onNext={currentQuestionIndex < totalQuestions - 1 && isCurrentAnswered ? handleNext : undefined}
        onSubmit={canSubmit ? handleSubmit : undefined}
        isExamMode={false}
      />
    </div>
  );
}
