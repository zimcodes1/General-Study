import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ResourceHeader from '../components/catalogue/ResourceHeader';
import PrimaryActions from '../components/catalogue/PrimaryActions';
import ProgressOverview from '../components/catalogue/ProgressOverview';
import TopicsList from '../components/catalogue/TopicsList';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokenStorage } from '../utils/auth';
import type { ResourceFileType } from '../components/dashboard/ResourceCard';

type CatalogueData = {
    id: string;
    title: string;
    summary?: string | null;
    content_json?: {
      subtopics?: string[];
      summaries?: string[];
      quiz_questions?: Array<Record<string, unknown>>;
    } | null;
};

type ResourceDetail = {
    id: string;
    title: string;
    course_code?: string | null;
    course_name?: string | null;
    faculty_name?: string | null;
    department_name?: string | null;
    level?: string | null;
    file_type?: string | null;
    cover_image?: string | null;
    rating_avg?: number | null;
    rating_count?: number;
    uploaded_by?: { full_name?: string | null };
    created_at?: string | null;
    catalogue?: CatalogueData | null;
};

export default function CatalogueOverview() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState<ResourceDetail | null>(null);

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

  useEffect(() => {
    const loadResource = async () => {
      if (!id) return;
      setLoading(true);
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
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load resource';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [apiUrl, id]);

  const topics = useMemo(() => {
    const rawContent = resource?.catalogue?.content_json;
    let content: CatalogueData['content_json'] | null = null;

    if (typeof rawContent === 'string') {
      try {
        content = JSON.parse(rawContent) as CatalogueData['content_json'];
      } catch (err) {
        console.error('Failed to parse catalogue content_json:', err);
      }
    } else if (rawContent && typeof rawContent === 'object') {
      content = rawContent;
    }

    const subtopics = content?.subtopics ?? [];
    if (!Array.isArray(subtopics)) return [];

    return subtopics
      .filter((title): title is string => typeof title === 'string' && title.trim().length > 0)
      .map((title, index) => ({
        id: `topic-${index + 1}`,
        title,
        status: 'not-started' as const,
        subtopics: [],
      }));
  }, [resource]);

  const hasCatalogue = !loading && Boolean(resource?.catalogue);
  const ratingValue =
    resource?.rating_count && resource.rating_count > 0 ? resource.rating_avg ?? undefined : undefined;
  const uploadDate = resource?.created_at
    ? new Date(resource.created_at).toLocaleDateString()
    : undefined;

  const progressData = {
    percentageCompleted: 0,
    lastStudiedSection: '',
    totalTopics: topics.length,
    completedTopics: 0,
  };

  const handleContinueLearning = () => {
    console.log('Continue learning');
  };

  const handleDownload = () => {
    console.log('Download resource');
  };

  const handleTakeQuiz = () => {
    console.log('Take quiz');
  };

  const handleTakeExam = () => {
    console.log('Take exam');
  };

  const handleTopicClick = (topicId: string) => {
    console.log('Topic clicked:', topicId);
  };

  const handleSubtopicClick = (topicId: string, subtopicId: string) => {
    console.log('Subtopic clicked:', topicId, subtopicId);
  };

  const handleCreateCatalogue = () => {
    console.log('Create catalogue requested');
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
              description={resource.catalogue?.summary ?? 'No summary available yet.'}
              coverImage={resource.cover_image ?? undefined}
              fileType={normalizeFileType(resource.file_type)}
              rating={ratingValue}
              uploadedBy={resource.uploaded_by?.full_name ?? 'Unknown'}
              uploadDate={uploadDate}
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
                topics={topics}
                hasCatalogue={hasCatalogue}
                onCreateCatalogue={handleCreateCatalogue}
                onTopicClick={handleTopicClick}
                onSubtopicClick={handleSubtopicClick}
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
