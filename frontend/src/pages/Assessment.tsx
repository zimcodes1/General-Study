import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssessmentHeader from '../components/assessment/AssessmentHeader';
import QuestionArea from '../components/assessment/QuestionArea';
import AssessmentNavigation from '../components/assessment/AssessmentNavigation';
import ResultsScreen from '../components/assessment/ResultsScreen';

type AssessmentMode = 'quiz' | 'exam';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export default function Assessment() {
  const { catalogueId, mode } = useParams<{ catalogueId: string; mode: AssessmentMode }>();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const isExamMode = mode === 'exam';

  // Mock data - replace with actual data fetching
  const assessmentData = {
    title: 'Introduction to Machine Learning',
    courseCode: 'CSC 201',
    totalQuestions: isExamMode ? 50 : 10,
    timeLimit: isExamMode ? 90 * 60 : null, // 90 minutes for exam, null for quiz
  };

  const questions: Question[] = Array.from({ length: assessmentData.totalQuestions }, (_, i) => ({
    id: `q${i + 1}`,
    question: `Question ${i + 1}: What is the primary purpose of ${
      i % 3 === 0 ? 'supervised learning' : i % 3 === 1 ? 'neural networks' : 'backpropagation'
    }?`,
    options: [
      'To process data without labels',
      'To learn patterns from labeled data',
      'To visualize data distributions',
      'To compress data efficiently',
    ],
    correctAnswer: 1,
    explanation: 'This is the correct answer because it accurately describes the fundamental concept.',
  }));

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Timer for exam mode
  useEffect(() => {
    if (isExamMode && assessmentData.timeLimit && !showResults) {
      setTimeRemaining(assessmentData.timeLimit);
      
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isExamMode, showResults]);

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

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    if (isExamMode) {
      const confirmed = window.confirm(
        'Are you sure you want to submit? You cannot change your answers after submission.'
      );
      if (!confirmed) return;
    }
    setShowResults(true);
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      incorrect: totalQuestions - correct,
      percentage: Math.round((correct / totalQuestions) * 100),
    };
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    if (isExamMode && assessmentData.timeLimit) {
      setTimeRemaining(assessmentData.timeLimit);
    }
  };

  const handleReviewAnswers = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const handleReturnToCatalogue = () => {
    navigate(`/catalogue/${catalogueId}`);
  };

  if (showResults) {
    const results = calculateResults();
    return (
      <ResultsScreen
        mode={mode as AssessmentMode}
        score={results.percentage}
        correct={results.correct}
        incorrect={results.incorrect}
        total={totalQuestions}
        questions={questions}
        userAnswers={answers}
        onRetake={handleRetake}
        onReviewAnswers={handleReviewAnswers}
        onReturnToCatalogue={handleReturnToCatalogue}
      />
    );
  }

  const answeredCount = Object.keys(answers).length;
  const canSubmit = isExamMode ? answeredCount > 0 : answeredCount === totalQuestions;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AssessmentHeader
        mode={mode as AssessmentMode}
        title={assessmentData.title}
        courseCode={assessmentData.courseCode}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
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
        onNext={currentQuestionIndex < totalQuestions - 1 ? handleNext : undefined}
        onJumpToQuestion={isExamMode ? handleJumpToQuestion : undefined}
        onSubmit={canSubmit ? handleSubmit : undefined}
        isExamMode={isExamMode}
      />
    </div>
  );
}
