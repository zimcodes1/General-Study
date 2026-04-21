// Utility functions for learning and progress management
import type { Topic, TopicStatus } from './types';

/**
 * Transform topics into status-aware topic list
 */
export const transformTopicsToStatusList = (
  topics: Topic[],
  completedTopicIds: string[]
): TopicStatus[] => {
  return topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    status: completedTopicIds.includes(topic.id)
      ? 'completed'
      : 'not-started',
    order: topic.order,
  }));
};

/**
 * Calculate progress statistics
 */
export const calculateProgress = (
  totalTopics: number,
  completedTopicCount: number
): { percentage: number; display: string } => {
  if (totalTopics === 0) {
    return { percentage: 0, display: '0%' };
  }

  const percentage = (completedTopicCount / totalTopics) * 100;
  return {
    percentage: Math.round(percentage),
    display: `${Math.round(percentage)}%`,
  };
};

/**
 * Get next topic after current one
 */
export const getNextTopic = (
  topics: Topic[],
  currentTopicIndex: number
): Topic | null => {
  if (currentTopicIndex + 1 < topics.length) {
    return topics[currentTopicIndex + 1];
  }
  return null;
};

/**
 * Check if topic has quiz questions
 */
export const hasQuiz = (topic: Topic): boolean => {
  return topic.quiz_questions && topic.quiz_questions.length > 0;
};

/**
 * Calculate points earned from quiz
 * 5 points per correct answer
 */
export const calculateQuizPoints = (
  correctAnswers: number,
  pointsPerQuestion: number = 5
): number => {
  return correctAnswers * pointsPerQuestion;
};

/**
 * Get topic by ID from list
 */
export const getTopicById = (
  topics: Topic[],
  topicId: string
): Topic | undefined => {
  return topics.find((t) => t.id === topicId);
};

/**
 * Get topic index by ID
 */
export const getTopicIndex = (
  topics: Topic[],
  topicId: string
): number => {
  return topics.findIndex((t) => t.id === topicId);
};

/**
 * Check if all topics are completed
 */
export const isCatalogueCompleted = (
  totalTopics: number,
  completedTopicCount: number
): boolean => {
  return totalTopics > 0 && completedTopicCount === totalTopics;
};
