import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LearningHeader from '../components/learning/LearningHeader';
import ContentArea from '../components/learning/ContentArea';
import NavigationControls from '../components/learning/NavigationControls';
import CompletionScreen from '../components/learning/CompletionScreen';
import { AlertCircle, Loader2 } from 'lucide-react';
import { catalogueAPI } from '../utils/learning/catalogueAPI';
import { getTopicIndex, getNextTopic } from '../utils/learning/progressUtils';
import type { CatalogueDetail, Topic } from '../utils/learning/types';

type ViewMode = 'content' | 'completion';

interface LoadingState {
  active: boolean;
  error: string | null;
}

export default function LearningSession() {
  const navigate = useNavigate();
  const { catalogueId, topicId } = useParams<{
    catalogueId: string;
    topicId: string;
  }>();

  const [viewMode, setViewMode] = useState<ViewMode>('content');
  const [catalogue, setCatalogue] = useState<CatalogueDetail | null>(null);
  const [progress, setProgress] = useState<CatalogueDetail['user_progress'] | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    active: true,
    error: null,
  });
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  // When navigating between topics, always start on content view.
  useEffect(() => {
    setViewMode('content');
  }, [topicId]);

  useEffect(() => {
    setRatingValue(null);
    setRatingSubmitted(false);
    setRatingSubmitting(false);
    setRatingError(null);
  }, [catalogueId]);

  // Load catalogue and progress
  useEffect(() => {
    if (!catalogueId) return;

    const loadData = async () => {
      try {
        setLoadingState({ active: true, error: null });
        const catalogueData = await catalogueAPI.getCatalogue(catalogueId);
        setCatalogue(catalogueData);
        setProgress(catalogueData.user_progress || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load learning data';
        setLoadingState({ active: false, error: message });
      } finally {
        setLoadingState({ active: false, error: null });
      }
    };

    loadData();
  }, [catalogueId]);

  // Get current topic
  const currentTopic: Topic | null = catalogue && topicId
    ? catalogue.topics.find((t) => t.id === topicId) || null
    : null;

  const currentTopicIndex = catalogue && topicId ? getTopicIndex(catalogue.topics, topicId) : -1;
  const totalTopics = catalogue?.topics.length || 0;
  const nextTopic = catalogue ? getNextTopic(catalogue.topics, currentTopicIndex) : null;
  const isLastTopic = currentTopicIndex === totalTopics - 1;

  const handleExit = () => {
    navigate(`/catalogue/${catalogueId}`);
  };

  const handleNext = async () => {
    if (!currentTopic || !catalogueId) return;

    // Mark topic as completed
    const alreadyCompleted = progress?.completed_topics?.includes(currentTopic.id);
    if (!alreadyCompleted) {
      try {
        const result = await catalogueAPI.completeTopic(catalogueId, currentTopic.id);
        setProgress(result.progress);
      } catch (err) {
        console.error('Failed to complete topic:', err);
        setLoadingState({
          active: false,
          error: err instanceof Error ? err.message : 'Failed to complete topic',
        });
        return;
      }
    }

    // If last topic, navigate to quiz instead of completion
    if (isLastTopic) {
      if (catalogue?.resource_id) {
        navigate(`/catalogue/${catalogue.resource_id}/quiz`);
      } else {
        setViewMode('completion');
      }
    } else if (nextTopic) {
      navigate(`/learn/${catalogueId}/${nextTopic.id}`);
    }
  };

  const handlePrevious = () => {
    // Navigate to previous topic
    const prevTopic = catalogue?.topics[currentTopicIndex - 1];
    if (prevTopic) {
      navigate(`/learn/${catalogueId}/${prevTopic.id}`);
    }
  };

  const handleContinueAfterCompletion = () => {
    navigate(`/catalogue/${catalogueId}`);
  };

  const handleSubmitRating = async () => {
    if (!catalogueId) return;
    if (!ratingValue) {
      setRatingError('Please select a rating to continue.');
      return;
    }

    setRatingSubmitting(true);
    setRatingError(null);
    try {
      await catalogueAPI.rateCatalogue(catalogueId, ratingValue);
      setRatingSubmitted(true);
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  // Loading state
  if (loadingState.active) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading learning session...</p>
      </div>
    );
  }

  // Error state
  if (loadingState.error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h1 className="text-2xl font-bold text-on-surface mb-2">Unable to Load Session</h1>
        <p className="text-on-surface-variant text-center mb-6 max-w-md">
          {loadingState.error}
        </p>
        <button
          onClick={handleExit}
          className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:shadow-lg transition-all"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  // Validation
  if (!catalogue || !currentTopic) {
    if (!catalogue) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-on-surface mb-2">Loading Catalogue...</h1>
        </div>
      );
    }

    // Topic not found, offer to navigate to first topic
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h1 className="text-2xl font-bold text-on-surface mb-2">Topic Not Found</h1>
        <p className="text-on-surface-variant text-center mb-6 max-w-md">
          The topic you're looking for doesn't exist. Let's start with the first topic!
        </p>
        {catalogue.topics.length > 0 ? (
          <button
            onClick={() => navigate(`/learn/${catalogueId}/${catalogue.topics[0].id}`)}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:shadow-lg transition-all"
          >
            Start Learning - {catalogue.topics[0].title}
          </button>
        ) : (
          <button
            onClick={handleExit}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:shadow-lg transition-all"
          >
            Return to Catalogue
          </button>
        )}
      </div>
    );
  }

  // Completion screen
  if (viewMode === 'completion') {
    const pointsEarned = progress?.points_earned || 0;
    const nextTopicTitle = nextTopic?.title || 'More Lectures';
    
    return (
      <div className="min-h-screen bg-surface">
        <CompletionScreen
          topicTitle={catalogue.title}
          pointsEarned={pointsEarned}
          nextTopicTitle={nextTopicTitle}
          onContinue={handleContinueAfterCompletion}
          quizAvailable={false}
          ratingValue={ratingValue}
          ratingSubmitted={ratingSubmitted}
          ratingSubmitting={ratingSubmitting}
          ratingError={ratingError}
          onRatingSelect={(value) => {
            setRatingValue(value);
            setRatingError(null);
          }}
          onSubmitRating={handleSubmitRating}
        />
      </div>
    );
  }

  const hasPrevious = currentTopicIndex > 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <LearningHeader
        topicTitle={catalogue.title}
        subtopicTitle={currentTopic.title}
        currentPosition={currentTopicIndex + 1}
        totalSections={totalTopics}
        onExit={handleExit}
      />

      <div className="flex-1 overflow-y-auto pb-24">
        <ContentArea content={currentTopic.content} />
      </div>

      <NavigationControls
        onPrevious={hasPrevious ? handlePrevious : undefined}
        onNext={handleNext}
        hasPrevious={hasPrevious}
        nextLabel={isLastTopic ? 'Take Quiz' : 'Next'}
      />
    </div>
  );
}
