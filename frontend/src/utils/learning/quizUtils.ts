// Quiz handling utilities
import { type QuizQuestion } from './types';

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  answered: Set<string>;
}

/**
 * Initialize quiz state
 */
export const initializeQuizState = (): QuizState => ({
  currentQuestionIndex: 0,
  answers: {},
  answered: new Set(),
});

/**
 * Add answer to quiz state
 */
export const recordAnswer = (
  state: QuizState,
  questionId: string,
  answer: string
): QuizState => {
  const newState = {
    ...state,
    answers: {
      ...state.answers,
      [questionId]: answer,
    },
    answered: new Set(state.answered),
  };
  newState.answered.add(questionId);
  return newState;
};

/**
 * Move to next question
 */
export const nextQuestion = (
  state: QuizState,
  totalQuestions: number
): QuizState => ({
  ...state,
  currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, totalQuestions - 1),
});

/**
 * Move to previous question
 */
export const previousQuestion = (state: QuizState): QuizState => ({
  ...state,
  currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
});

/**
 * Check if all questions are answered
 */
export const allQuestionsAnswered = (
  state: QuizState,
  totalQuestions: number
): boolean => {
  return state.answered.size === totalQuestions;
};

/**
 * Calculate quiz score
 */
export const calculateScore = (
  questions: QuizQuestion[],
  answers: Record<string, string>
): { correct: number; total: number; percentage: number } => {
  let correct = 0;
  const total = questions.length;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (
      userAnswer &&
      userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()
    ) {
      correct += 1;
    }
  });

  const percentage = total > 0 ? (correct / total) * 100 : 0;

  return {
    correct,
    total,
    percentage: Math.round(percentage),
  };
};

/**
 * Validate quiz answers format
 */
export const validateAnswers = (
  answers: Record<string, string>,
  questions: QuizQuestion[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const questionIds = new Set(questions.map((q) => q.id));

  // Check if all answers have corresponding questions
  Object.keys(answers).forEach((answerId) => {
    if (!questionIds.has(answerId)) {
      errors.push(`Invalid question ID: ${answerId}`);
    }
  });

  // Check if all questions have answers
  questions.forEach((question) => {
    if (!answers[question.id] || answers[question.id].trim() === '') {
      errors.push(`Question ${question.order + 1} not answered`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
