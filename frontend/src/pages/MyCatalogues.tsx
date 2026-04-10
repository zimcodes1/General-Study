import { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ResourceGrid from '../components/dashboard/ResourceGrid';
import RecentReadingsCarousel from '../components/dashboard/RecentReadingsCarousel';
import ResourceUploadModal from '../components/resources/ResourceUploadModal';
import { Bookmark, Upload, Grid3x3, ChevronDown, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import { resourceAPI, progressAPI, type Resource as BackendResource, type Progress } from '../utils/auth/api';

type FilterType = 'all' | 'bookmarks' | 'uploads';
type SortType = 'newest' | 'oldest';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Map file types from backend to frontend
const mapFileType = (
  fileType: string
): 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'txt' | 'image' | 'video' | 'audio' | 'other' => {
  const lowerType = fileType.toLowerCase();
  const typeMap: Record<string, 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'txt' | 'image' | 'video' | 'audio' | 'other'> = {
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

// Convert backend Resource to ResourceGrid Resource
const convertResource = (apiResource: BackendResource) => ({
  id: apiResource.id,
  title: apiResource.title,
  type: mapFileType(apiResource.file_type),
  subject: apiResource.department_name || apiResource.faculty_name,
  courseCode: apiResource.course_code,
  rating: apiResource.rating_avg,
  department: apiResource.department_name || undefined,
  level: apiResource.level,
});

export default function MyCatalogues() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [resources, setResources] = useState<BackendResource[]>([]);
  const [displayedResources, setDisplayedResources] = useState<ReturnType<typeof convertResource>[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: true, error: null });
  const [displayCount, setDisplayCount] = useState(9);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  
  // Recent readings state
  const [recentReadings, setRecentReadings] = useState<any[]>([]);
  const [recentReadingsLoading, setRecentReadingsLoading] = useState(true);
  const [recentReadingsError, setRecentReadingsError] = useState<string | null>(null);

  // Fetch resources based on current filter
  useEffect(() => {
    const fetchResources = async () => {
      setLoadingState({ isLoading: true, error: null });
      try {
        const response = await resourceAPI.getResources(
          100,
          0,
          activeFilter === 'all' ? undefined : activeFilter
        );
        setResources(response.results);
        setDisplayCount(9);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setLoadingState({
          isLoading: false,
          error: 'Failed to load resources. Please try again later.',
        });
        setResources([]);
      }
      setLoadingState({ isLoading: false, error: null });
    };

    fetchResources();
  }, [activeFilter]);

  // Fetch recent readings
  useEffect(() => {
    const fetchRecentReadings = async () => {
      setRecentReadingsLoading(true);
      setRecentReadingsError(null);
      try {
        const response = await progressAPI.getRecentReadings(10, 0);
        // Convert Progress to RecentReading format
        const converted = response.results.map((progress: Progress) => ({
          id: progress.resource_id,
          title: progress.resource_title,
          type: mapFileType(progress.resource_file_type) as any,
          subject: progress.resource_faculty_name,
          progress: Math.round(progress.completion_percent),
          courseCode: progress.resource_course_code,
        }));
        setRecentReadings(converted);
      } catch (err) {
        console.error('Failed to fetch recent readings:', err);
        setRecentReadingsError('Failed to load recent readings');
        setRecentReadings([]);
      } finally {
        setRecentReadingsLoading(false);
      }
    };

    fetchRecentReadings();
  }, []);

  // Update displayed resources based on sort and display count
  useEffect(() => {
    let sorted = [...resources];

    // Apply sorting
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Convert and slice
    const converted = sorted.slice(0, displayCount).map(convertResource);
    setDisplayedResources(converted);
  }, [resources, sortBy, displayCount]);

  const filters = [
    { id: 'all' as FilterType, label: 'All Resources', icon: Grid3x3 },
    { id: 'bookmarks' as FilterType, label: 'Bookmarks', icon: Bookmark },
    { id: 'uploads' as FilterType, label: 'My Uploads', icon: Upload },
  ];

  return (
    <DashboardLayout>
      <ResourceUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />

      <div className="px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            My Catalogues
          </h1>
          <p className="text-on-surface-variant">Manage your learning resources</p>
        </div>

        {/* Recent Readings Section */}
        <div className="mb-8">
          {/* Loading State */}
          {recentReadingsLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
              <p className="text-sm text-on-surface-variant">Loading your readings...</p>
            </div>
          )}

          {/* Error State */}
          {recentReadingsError && !recentReadingsLoading && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-6">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700">{recentReadingsError}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!recentReadingsLoading && !recentReadingsError && recentReadings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-on-surface-variant" />
              </div>
              <h3 className="text-base font-semibold text-on-surface mb-1">No active readings yet</h3>
              <p className="text-sm text-on-surface-variant text-center max-w-sm">
                Start exploring resources and bookmark your favorites to begin your learning journey.
              </p>
            </div>
          )}

          {/* Carousel - only show if there's data and not loading */}
          {!recentReadingsLoading && recentReadings.length > 0 && (
            <RecentReadingsCarousel resources={recentReadings} />
          )}
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant/10">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-jakarta text-sm ${
                      activeFilter === filter.id
                        ? 'bg-surface-container-high text-on-surface shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setSortMenuOpen(!sortMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all border border-outline-variant/10 font-jakarta"
                >
                  Sort by
                  <ChevronDown className="w-4 h-4" />
                </button>
                {sortMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-surface-container rounded-xl shadow-lg border border-outline-variant/20 z-50">
                    <button
                      onClick={() => {
                        setSortBy('newest');
                        setSortMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm rounded-t-xl transition-all ${
                        sortBy === 'newest'
                          ? 'bg-surface-container-high text-on-surface'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('oldest');
                        setSortMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm rounded-b-xl transition-all ${
                        sortBy === 'oldest'
                          ? 'bg-surface-container-high text-on-surface'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-sm font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
              >
                + Upload Resource
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loadingState.isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-on-surface-variant">Loading resources...</p>
            </div>
          )}

          {/* Error State */}
          {loadingState.error && !loadingState.isLoading && (
            <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">{loadingState.error}</p>
                <p className="text-xs text-red-600/80 mt-1">Please check your connection and try again.</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loadingState.isLoading && !loadingState.error && resources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                {activeFilter === 'uploads' ? (
                  <Upload className="w-8 h-8 text-on-surface-variant" />
                ) : activeFilter === 'bookmarks' ? (
                  <Bookmark className="w-8 h-8 text-on-surface-variant" />
                ) : (
                  <Grid3x3 className="w-8 h-8 text-on-surface-variant" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">
                {activeFilter === 'uploads'
                  ? "You haven't uploaded any resources yet"
                  : activeFilter === 'bookmarks'
                  ? 'No bookmarked resources'
                  : 'No resources available'}
              </h3>
              <p className="text-sm text-on-surface-variant max-w-sm">
                {activeFilter === 'uploads'
                  ? 'Share your study materials by uploading resources to help other students.'
                  : activeFilter === 'bookmarks'
                  ? 'Bookmark resources to save them for later access.'
                  : 'Check back soon for more learning materials.'}
              </p>
              {activeFilter === 'uploads' && (
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-sm font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
                >
                  + Upload Your First Resource
                </button>
              )}
            </div>
          )}

          {/* Resources Grid */}
          {!loadingState.isLoading && !loadingState.error && resources.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-on-surface-variant">
                  Showing {displayedResources.length} of {resources.length} resource
                  {resources.length !== 1 ? 's' : ''}
                </p>
              </div>

              <ResourceGrid
                title=""
                resources={displayedResources}
                maxItems={displayedResources.length}
                showRemoveButton={activeFilter === 'uploads'}
              />

              {/* View More Button */}
              {displayCount < resources.length && (
                <div className="flex justify-center mt-8 pt-6 border-t border-outline-variant/20">
                  <button
                    onClick={() => setDisplayCount(displayCount + 9)}
                    className="px-8 py-3 bg-surface-container text-on-surface rounded-full hover:bg-surface-container-high transition-all font-jakarta text-sm font-medium border border-outline-variant/20"
                  >
                    Load More ({resources.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
