// Type definitions for learning/catalogue features

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  explanation: string;
  order: number;
  correct_answer: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  summary: string;
  order: number;
  quiz_questions: QuizQuestion[];
}

export interface CatalogueDetail {
  id: string;
  title: string;
  summary: string;
  topics: Topic[];
  created_at: string;
  updated_at: string;
  user_progress?: {
    completed_topics: string[];
    current_topic_index: number;
    points_earned: number;
    completion_percent: number;
  };
}

export interface CatalogueProgress {
  id: string;
  catalogue: string;
  completed_topics: string[];
  current_topic_index: number;
  points_earned: number;
  completion_percent: number;
  started_at: string;
  last_accessed_at: string;
  completed_at: string | null;
}

export interface QuizAttempt {
  id: string;
  answers: Record<string, string>;
  score: number;
  total_questions: number;
  points_earned: number;
  attempted_at: string;
}

export interface QuizSubmitResponse {
  quiz_attempt: QuizAttempt;
  progress: CatalogueProgress;
  message: string;
}

export interface CompleteTopicResponse {
  progress: CatalogueProgress;
  message: string;
}

export interface CatalogueRatingResponse {
  rating_avg: number;
  rating_count: number;
  user_rating: number;
}

export interface TopicStatus {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
  order: number;
}
