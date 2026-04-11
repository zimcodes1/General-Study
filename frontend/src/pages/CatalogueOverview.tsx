import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ResourceHeader from '../components/catalogue/ResourceHeader';
import PrimaryActions from '../components/catalogue/PrimaryActions';
import ProgressOverview from '../components/catalogue/ProgressOverview';
import TopicsList from '../components/catalogue/TopicsList';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokenStorage } from '../utils/auth';
import { catalogueAPI } from '../utils/learning/catalogueAPI';
import { transformTopicsToStatusList, calculateProgress, hasQuiz } from '../utils/learning/progressUtils';
import type { ResourceFileType } from '../components/dashboard/ResourceCard';
import type { CatalogueDetail } from '../utils/learning/types';

type ResourceDetail = {
  id: string;
  title: string;
  course_code?: string | null;
  course_name?: string | null;
  faculty_name?: string | null;
  department_name?: string | null;
  level?: string | null;
  file_type?: string | null;
  file?: string | null;
  file_url?: string | null;
  cover_image?: string | null;
  rating_avg?: number | null;
  rating_count?: number;
  uploaded_by?: { full_name?: string | null };
  created_at?: string | null;
  catalogue?: { id: string } | null;
};

export default function CatalogueOverview() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [catalogue, setCatalogue] = useState<CatalogueDetail | null>(null);
  const [progress, setProgress] = useState<CatalogueDetail['user_progress'] | null>(null);
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const [catalogueCreating, setCatalogueCreating] = useState(false);
  const [catalogueCreateError, setCatalogueCreateError] = useState<string | null>(null);
  const pollTimeoutRef = useRef<number | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const normalizeFileType = (fileType?: string | null): ResourceFileType => {
    if (!fileType) return 'other';
    const normalized = fileType.toLowerCase();
    if (
      ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'image', 'document', 'other'].includes(
        normalized
      )
    ) {
      return normalized as ResourceFileType;
    }
    return 'other';
  };

  const loadResource = async (showLoader: boolean = true) => {
    if (!id) return;
    if (showLoader) {
      setLoading(true);
    }
    setError(null);
    try {
      const accessToken = tokenStorage.getAccessToken();
      const response = await fetch(`${apiUrl}/resources/${id}/`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (!response.ok) {
        throw new Error('Failed to load resource');
      }

      const data = await response.json();
      setResource(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load resource';
      setError(message);
      return null;
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // Load resource
  useEffect(() => {
    loadResource();
  }, [apiUrl, id]);

  const loadCatalogueData = async (catalogueId: string) => {
    setCatalogueLoading(true);
    try {
      const catalogueData = await catalogueAPI.getCatalogue(catalogueId);
      setCatalogue(catalogueData);
      setProgress(catalogueData.user_progress || null);
    } catch (err) {
      console.error('Failed to load catalogue data:', err);
      // Don't show error to user - old content_json fallback will be used
    } finally {
      setCatalogueLoading(false);
    }
  };

  // Load catalogue and progress when resource is loaded
  useEffect(() => {
    if (!resource?.catalogue?.id) return;
    loadCatalogueData(resource.catalogue.id);
  }, [resource?.catalogue?.id]);

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        window.clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  // Transform topics into display format
  const displayTopics = catalogue
    ? transformTopicsToStatusList(
        catalogue.topics,
        progress?.completed_topics || []
      ).map((topicStatus) => {
        const fullTopic = catalogue.topics.find((t) => t.id === topicStatus.id);
        return {
          id: topicStatus.id,
          title: topicStatus.title,
          status: topicStatus.status,
          order: topicStatus.order,
          hasQuiz: fullTopic ? hasQuiz(fullTopic) : false,
        };
      })
    : [];

  const hasCatalogue = !loading && Boolean(resource?.catalogue);
  const ratingValue =
    resource?.rating_count && resource.rating_count > 0 ? resource.rating_avg ?? undefined : undefined;
  const uploadDate = resource?.created_at
    ? new Date(resource.created_at).toLocaleDateString()
    : undefined;

  // Calculate progress
  const progressCalc = catalogue
    ? calculateProgress(catalogue.topics.length, progress?.completed_topics?.length || 0)
    : { percentage: 0, display: '0%' };

  const progressData = {
    percentageCompleted: progressCalc.percentage,
    lastStudiedSection: catalogue?.topics[progress?.current_topic_index || 0]?.title || '',
    totalTopics: catalogue?.topics.length || 0,
    completedTopics: progress?.completed_topics?.length || 0,
  };

  const handleContinueLearning = () => {
    if (!catalogue || displayTopics.length === 0) return;
    const firstIncompleteTopic =
      displayTopics.find((t) => t.status !== 'completed') || displayTopics[0];
    navigate(
      `/learn/${resource?.catalogue?.id}/${firstIncompleteTopic.id}`
    );
  };

  const handleDownload = async () => {
    if (!resource || !id) return;
    
    try {
      const accessToken = tokenStorage.getAccessToken();
      const fileField = resource.file || resource.file_url;
      
      if (!fileField) {
        alert('This resource does not have a downloadable file.');
        return;
      }
      
      // Determine the download URL
      let downloadUrl = fileField;
      if (fileField && !fileField.startsWith('http')) {
        // Construct the full URL for media files
        const baseUrl = apiUrl.replace('/api', '');
        downloadUrl = `${baseUrl}/media/${fileField}`;
      }
      
      console.log('Downloading from:', downloadUrl);
      
      // Fetch the file
      const response = await fetch(downloadUrl, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      
      if (!response.ok) {
        console.error(`Download failed with status ${response.status}:`, response.statusText);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Get filename from resource title and file extension
      const contentDisposition = response.headers.get('content-disposition');
      let filename = resource.title || 'download';
      
      // Extract extension from fileField if available
      const extension = fileField.split('.').pop() || 'pdf';
      if (!filename.includes('.')) {
        filename = `${filename}.${extension}`;
      }
      
      if (contentDisposition) {
        const filenamePart = contentDisposition.split('filename=')[1];
        if (filenamePart) {
          filename = filenamePart.replace(/[";]/g, '');
        }
      }
      
      // Create blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download resource';
      console.error('Download error:', err);
      alert(`Download Error: ${message}`);
    }
  };

  const handleTakeQuiz = () => {
    if (!resource?.id) return;
    if (!catalogue || catalogue.topics.every((topic) => !topic.quiz_questions?.length)) {
      alert('This catalogue does not have any quiz questions yet.');
      return;
    }
    navigate(`/catalogue/${resource.id}/quiz`);
  };

  const handleTakeExam = () => {
    console.log('Take exam');
  };

  const handleTopicClick = (topicId: string) => {
    if (!resource?.catalogue?.id) return;
    navigate(`/learn/${resource.catalogue.id}/${topicId}`);
  };

  const handleCreateCatalogue = () => {
    if (!resource?.id) return;
    setCatalogueCreateError(null);
    setCatalogueCreating(true);

    const startCreation = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();
        const response = await fetch(`${apiUrl}/resources/${resource.id}/create_catalogue/`, {
          method: 'POST',
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.detail || 'Failed to start catalogue creation');
        }

        pollCatalogueStatus(0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start catalogue creation';
        setCatalogueCreateError(message);
        setCatalogueCreating(false);
      }
    };

    const pollCatalogueStatus = async (attempt: number) => {
      const maxAttempts = 20;
      const intervalMs = 4000;

      if (!resource?.id) return;
      if (attempt >= maxAttempts) {
        setCatalogueCreateError('Catalogue creation is taking longer than expected. Please refresh.');
        setCatalogueCreating(false);
        return;
      }

      try {
        const accessToken = tokenStorage.getAccessToken();
        const statusResponse = await fetch(`${apiUrl}/resources/${resource.id}/status/`, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to check catalogue status');
        }

        const statusData = await statusResponse.json();
        const status = statusData.status;

        if (status === 'failed') {
          setCatalogueCreateError(statusData.processing_error || 'Catalogue creation failed');
          setCatalogueCreating(false);
          return;
        }

        if (status === 'pending' || status === 'approved' || status === 'rejected') {
          const updatedResource = await loadResource(false);
          if (updatedResource?.catalogue?.id) {
            await loadCatalogueData(updatedResource.catalogue.id);
          }
          setCatalogueCreating(false);
          return;
        }
      } catch (err) {
        if (attempt >= maxAttempts - 1) {
          const message = err instanceof Error ? err.message : 'Failed to check catalogue status';
          setCatalogueCreateError(message);
          setCatalogueCreating(false);
          return;
        }
      }

      pollTimeoutRef.current = window.setTimeout(() => {
        pollCatalogueStatus(attempt + 1);
      }, intervalMs);
    };

    startCreation();
  };

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-jakarta">Back</span>
        </button>

        <div className="space-y-6">
          {loading && (
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
              <p className="text-on-surface-variant">Loading resource details...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-on-surface-variant/50" />
              </div>
              <p className="text-on-surface font-semibold mb-2">Unable to load resource</p>
              <p className="text-on-surface-variant text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && resource && (
            <ResourceHeader
              title={resource.title}
              courseCode={resource.course_code ?? undefined}
              courseName={resource.course_name ?? undefined}
              description={catalogue?.summary ?? 'No summary available yet.'}
              coverImage={resource.cover_image ?? undefined}
              fileType={normalizeFileType(resource.file_type)}
              rating={ratingValue}
              uploadedBy={resource.uploaded_by?.full_name ?? 'Unknown'}
              uploadDate={uploadDate}
              resourceId={id}
            />
          )}

          <PrimaryActions
            onContinueLearning={handleContinueLearning}
            onDownload={handleDownload}
            onTakeQuiz={handleTakeQuiz}
            onTakeExam={handleTakeExam}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TopicsList
                topics={displayTopics}
                hasCatalogue={hasCatalogue}
                loading={catalogueLoading}
                creatingCatalogue={catalogueCreating}
                createError={catalogueCreateError}
                onCreateCatalogue={handleCreateCatalogue}
                onTopicClick={handleTopicClick}
              />
            </div>

            <div className="lg:col-span-1">
              <ProgressOverview {...progressData} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
