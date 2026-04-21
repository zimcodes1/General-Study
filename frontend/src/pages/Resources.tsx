import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ResourceCard, { type ResourceFileType } from '../components/dashboard/ResourceCard';
import ResourceUploadModal from '../components/resources/ResourceUploadModal';
import { Search, SlidersHorizontal, Upload, X } from 'lucide-react';
import { auth, authAPI, tokenStorage, type Department } from '../utils/auth';

type ResourceListItem = {
  id: string;
  title: string;
  course_code?: string | null;
  course_name?: string | null;
  faculty_name?: string | null;
  department_name?: string | null;
  level?: string | null;
  file_type?: string | null;
  rating_avg?: number | null;
  rating_count?: number;
  created_at?: string;
};

const PAGE_SIZE = 16;

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

const formatLevel = (level?: string | null) => {
  if (!level) return undefined;
  return `${level} Level`;
};

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resources, setResources] = useState<ResourceListItem[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const user = auth.getUser();
  const userFacultyName = user?.faculty?.name;
  const userFacultyId = user?.faculty?.id;

  useEffect(() => {
    const loadResources = async () => {
      setLoadingResources(true);
      setResourceError(null);
      try {
        const accessToken = tokenStorage.getAccessToken();
        const response = await fetch(`${apiUrl}/resources/`, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        });

        if (!response.ok) {
          throw new Error('Failed to load resources');
        }

        const data = await response.json();
        setResources(data.results || data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load resources';
        setResourceError(message);
      } finally {
        setLoadingResources(false);
      }
    };

    loadResources();
  }, [apiUrl]);

  useEffect(() => {
    const loadDepartments = async () => {
      if (!userFacultyId) return;
      setLoadingDepartments(true);
      try {
        const data = await authAPI.getDepartments(userFacultyId);
        setAvailableDepartments(data);
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, [userFacultyId]);

  const facultyResources = useMemo(() => {
    if (!userFacultyName) return resources;
    return resources.filter((resource) => resource.faculty_name === userFacultyName);
  }, [resources, userFacultyName]);

  const derivedDepartmentNames = useMemo(() => {
    if (availableDepartments.length > 0) {
      return availableDepartments.map((dept) => dept.name);
    }
    const names = facultyResources
      .map((resource) => resource.department_name)
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(names));
  }, [availableDepartments, facultyResources]);

  const hasGeneralResources = useMemo(
    () => facultyResources.some((resource) => !resource.department_name),
    [facultyResources]
  );

  const levelOptions = useMemo(() => {
    const levels = facultyResources
      .map((resource) => resource.level)
      .filter((level): level is string => Boolean(level));
    const uniqueLevels = Array.from(new Set(levels));
    return uniqueLevels.sort((a, b) => Number(a) - Number(b));
  }, [facultyResources]);

  const courseOptions = useMemo(() => {
    const courses = facultyResources
      .map((resource) => resource.course_code)
      .filter((course): course is string => Boolean(course));
    return Array.from(new Set(courses)).sort();
  }, [facultyResources]);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return facultyResources.filter((resource) => {
      const title = resource.title?.toLowerCase() || '';
      const courseCode = resource.course_code?.toLowerCase() || '';
      const courseName = resource.course_name?.toLowerCase() || '';
      const departmentName = resource.department_name?.toLowerCase() || '';
      const facultyName = resource.faculty_name?.toLowerCase() || '';

      const matchesSearch =
        query === '' ||
        title.includes(query) ||
        courseCode.includes(query) ||
        courseName.includes(query) ||
        departmentName.includes(query) ||
        facultyName.includes(query);

      const matchesDepartment =
        selectedDepartment === 'all' ||
        (selectedDepartment === 'general'
          ? !resource.department_name
          : resource.department_name === selectedDepartment);

      const matchesLevel = selectedLevel === 'all' || resource.level === selectedLevel;

      const matchesCourse = selectedCourse === 'all' || resource.course_code === selectedCourse;

      return matchesSearch && matchesDepartment && matchesLevel && matchesCourse;
    });
  }, [facultyResources, searchQuery, selectedDepartment, selectedLevel, selectedCourse]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedDepartment, selectedLevel, selectedCourse, facultyResources.length]);

  const displayedResources = filteredResources.slice(0, visibleCount);

  const clearFilters = () => {
    setSelectedDepartment('all');
    setSelectedLevel('all');
    setSelectedCourse('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedDepartment !== 'all' || selectedLevel !== 'all' || selectedCourse !== 'all' || searchQuery !== '';

  const emptyStateTitle = hasActiveFilters ? 'No resources found' : 'No resources available';
  const emptyStateDescription = hasActiveFilters
    ? 'Try adjusting your search or filters'
    : 'Check back later or upload a resource to get started';

  const canLoadMore = filteredResources.length > displayedResources.length;

  return (
    <DashboardLayout>
      <ResourceUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
      <div className="px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            Resources
          </h1>
          <p className="text-on-surface-variant">Discover and explore study materials</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search resources, courses, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low rounded-2xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl transition-all font-jakarta border ${
                showFilters
                  ? 'bg-surface-container-high text-on-surface border-outline-variant/30'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-outline-variant/10'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    disabled={loadingDepartments}
                    className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-on-surface text-sm focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10 disabled:opacity-70"
                  >
                    <option value="all">All Departments</option>
                    {hasGeneralResources && <option value="general">General (Faculty-wide)</option>}
                    {derivedDepartmentNames.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-on-surface text-sm focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                  >
                    <option value="all">All Levels</option>
                    {levelOptions.map((level) => (
                      <option key={level} value={level}>
                        {formatLevel(level)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                    Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-on-surface text-sm focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                  >
                    <option value="all">All Courses</option>
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-tertiary hover:text-tertiary/80 transition-colors font-jakarta"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              {loadingResources
                ? 'Loading resources...'
                : `${filteredResources.length} resource${filteredResources.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>

        {!loadingResources && resourceError && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-on-surface-variant/40" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Unable to load resources</h3>
            <p className="text-on-surface-variant mb-6">{resourceError}</p>
          </div>
        )}

        {!loadingResources && !resourceError && displayedResources.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  type={normalizeFileType(resource.file_type)}
                  subject={resource.course_name || resource.course_code || 'Faculty Resource'}
                  courseCode={resource.course_code || undefined}
                  rating={resource.rating_avg ?? undefined}
                  department={resource.department_name || 'General'}
                  level={formatLevel(resource.level)}
                />
              ))}
            </div>

            {canLoadMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="px-8 py-3 bg-surface-container-low text-on-surface rounded-full hover:bg-surface-container transition-all font-jakarta text-sm"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}

        {!loadingResources && !resourceError && filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-on-surface-variant/40" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">{emptyStateTitle}</h3>
            <p className="text-on-surface-variant mb-6">{emptyStateDescription}</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-surface-container-low text-on-surface rounded-full hover:bg-surface-container transition-all font-jakarta text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-on-primary-fixed shadow-[0_8px_32px_rgba(155,168,255,0.4)] hover:shadow-[0_12px_48px_rgba(155,168,255,0.6)] hover:scale-110 transition-all duration-300 z-30"
      >
        <Upload className="w-6 h-6" />
      </button>
    </DashboardLayout>
  );
}
