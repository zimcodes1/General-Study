// API service for catalogue and learning features
import type {
  CatalogueDetail,
  Topic,
  CatalogueProgress,
  QuizSubmitResponse,
  CompleteTopicResponse,
  CatalogueRatingResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAccessToken = (): string => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Unauthorized');
  }
  return token;
};

export const catalogueAPI = {
  /**
   * Get catalogue with all topics and user's progress
   */
  getCatalogue: async (catalogueId: string): Promise<CatalogueDetail> => {
    const accessToken = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/catalogues/${catalogueId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch catalogue');
    }

    return response.json();
  },

  /**
   * Get a specific topic
   */
  getTopic: async (topicId: string): Promise<Topic> => {
    const accessToken = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/topics/${topicId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch topic');
    }

    return response.json();
  },

  /**
   * Get user's progress on a catalogue
   */
  getProgress: async (catalogueId: string): Promise<CatalogueProgress> => {
    const accessToken = getAccessToken();
    const response = await fetch(
      `${API_BASE_URL}/progress/current_catalogue/?catalogue_id=${catalogueId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }

    return response.json();
  },

  /**
   * Submit quiz answers and get results
   * Automatically updates progress and user points
   */
  submitQuiz: async (
    catalogueId: string,
    topicId: string,
    answers: Record<string, string>
  ): Promise<QuizSubmitResponse> => {
    const accessToken = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/progress/submit_quiz/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        catalogue_id: catalogueId,
        topic_id: topicId,
        answers,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit quiz');
    }

    return response.json();
  },

  /**
   * Mark a topic as completed when it has no quiz
   */
  completeTopic: async (
    catalogueId: string,
    topicId: string
  ): Promise<CompleteTopicResponse> => {
    const accessToken = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/progress/complete_topic/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        catalogue_id: catalogueId,
        topic_id: topicId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to complete topic');
    }

    return response.json();
  },

  /**
   * Submit a rating for a catalogue (1-5 stars)
   */
  rateCatalogue: async (
    catalogueId: string,
    rating: number
  ): Promise<CatalogueRatingResponse> => {
    const accessToken = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/catalogues/${catalogueId}/rate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit rating');
    }

    return response.json();
  },
};
