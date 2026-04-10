import { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import StatCard from '../components/dashboard/StatCard';
import ResourceGrid from '../components/dashboard/ResourceGrid';
import { BookOpen, Zap, TrendingUp, Award, AlertCircle, Loader2 } from 'lucide-react';
import { auth } from '../utils/auth';
import { authAPI, progressAPI, resourceAPI, type Resource as BackendResource, type Progress, type DashboardStats } from '../utils/auth/api';

type FileType = 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'txt' | 'image' | 'video' | 'audio' | 'other';

interface DisplayResource {
  id: string;
  title: string;
  type: FileType;
  subject: string;
  courseCode: string;
  rating: number;
  department?: string;
  level: string;
  progress?: number;
}

const mapFileType = (fileType: string): FileType => {
  const lowerType = fileType.toLowerCase();
  const typeMap: Record<string, FileType> = {
    pdf: 'pdf',
    doc: 'doc',
    docx: 'docx',
    ppt: 'ppt',
    pptx: 'pptx',
    txt: 'txt',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    webp: 'image',
    image: 'image',
    video: 'video',
    audio: 'audio',
    document: 'docx',
    other: 'other',
  };
  return typeMap[lowerType] || 'other';
};

const convertProgressToResource = (progress: Progress): DisplayResource => ({
  id: progress.resource_id,
  title: progress.resource_title,
  type: mapFileType(progress.resource_file_type),
  subject: progress.resource_faculty_name,
  courseCode: progress.resource_course_code,
  rating: 0,
  level: 'Intermediate',
  progress: Math.round(progress.completion_percent),
});

const convertBackendResource = (apiResource: BackendResource): DisplayResource => ({
  id: apiResource.id,
  title: apiResource.title,
  type: mapFileType(apiResource.file_type),
  subject: apiResource.department_name || apiResource.faculty_name,
  courseCode: apiResource.course_code,
  rating: apiResource.rating_avg,
  department: apiResource.department_name || undefined,
  level: apiResource.level,
});

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [continueReading, setContinueReading] = useState<DisplayResource[]>([]);
  const [recommendedResources, setRecommendedResources] = useState<DisplayResource[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<DisplayResource[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Dashboard - General Study';
  }, []);

  useEffect(() => {
    const userData = auth.getUser();
    setUser(userData);
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setErrorStats(null);
        const statsData = await authAPI.getDashboardStats();
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setErrorStats('Failed to load dashboard statistics');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch continue reading (recent progress)
  useEffect(() => {
    const fetchContinueReading = async () => {
      try {
        const response = await progressAPI.getRecentReadings(3, 0);
        const resources = response.results.map(convertProgressToResource);
        setContinueReading(resources);
      } catch (err) {
        console.error('Failed to fetch continue reading:', err);
      }
    };

    fetchContinueReading();
  }, []);

  // Fetch recommended resources
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await authAPI.getRecommendedResources(3, 0);
        const resources = response.results.map(convertBackendResource);
        setRecommendedResources(resources);
      } catch (err) {
        console.error('Failed to fetch recommended resources:', err);
      }
    };

    fetchRecommended();
  }, []);

  // Fetch recently added
  useEffect(() => {
    const fetchRecentlyAdded = async () => {
      try {
        const response = await resourceAPI.getRecentlyAdded(3, 0);
        const resources = response.results.map(convertBackendResource);
        setRecentlyAdded(resources);
      } catch (err) {
        console.error('Failed to fetch recently added:', err);
      }
    };

    fetchRecentlyAdded();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'User';

  const defaultStats = [
    { icon: BookOpen, label: 'Active Catalogues', value: stats?.active_catalogues?.toString() || '-', change: '+0', trend: 'up' as const },
    { icon: Zap, label: 'Total Points', value: stats?.total_points?.toString() || '0', change: '+0', trend: 'up' as const },
    { icon: TrendingUp, label: 'Avg. Score', value: `${stats?.avg_score || 0}%`, change: '+0', trend: 'up' as const },
    { icon: Award, label: 'Completed', value: stats?.completed?.toString() || '0', change: '+0', trend: 'up' as const },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-on-surface-variant">Continue your learning journey</p>
          </div>

          {/* Stats Section */}
          {loadingStats ? (
            <div className="flex flex-col items-center justify-center py-12 mb-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
              <p className="text-sm text-on-surface-variant">Loading your statistics...</p>
            </div>
          ) : errorStats ? (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-12">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">{errorStats}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {defaultStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          )}

          {/* Continue Reading Section */}
          {continueReading.length > 0 ? (
            <ResourceGrid title="Continue Reading" resources={continueReading} maxItems={3} />
          ) : (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-on-surface mb-6">Continue Reading</h2>
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-on-surface-variant" />
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-1">No active readings yet</h3>
                <p className="text-sm text-on-surface-variant text-center max-w-sm">
                  Start exploring resources and begin your learning journey!
                </p>
              </div>
            </div>
          )}

          {/* Recommended Resources Section */}
          {recommendedResources.length > 0 ? (
            <ResourceGrid title="Recommended for You" resources={recommendedResources} maxItems={3} />
          ) : (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-on-surface mb-6">Recommended for You</h2>
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-on-surface-variant" />
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-1">No recommendations available</h3>
                <p className="text-sm text-on-surface-variant text-center max-w-sm">
                  Check back soon as we discover great resources for your faculty!
                </p>
              </div>
            </div>
          )}

          {/* Recently Added Section */}
          {recentlyAdded.length > 0 ? (
            <ResourceGrid title="Recently Added" resources={recentlyAdded} maxItems={3} />
          ) : (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-on-surface mb-6">Recently Added</h2>
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-on-surface-variant" />
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-1">No resources added yet</h3>
                <p className="text-sm text-on-surface-variant text-center max-w-sm">
                  Check back later for new educational materials!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
