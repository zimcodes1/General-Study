import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ResourceGrid from '../components/dashboard/ResourceGrid';
import RecentReadingsCarousel from '../components/dashboard/RecentReadingsCarousel';
import { Bookmark, Upload, Grid3x3, ChevronDown } from 'lucide-react';

type FilterType = 'all' | 'bookmarks' | 'uploads';

export default function MyCatalogues() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const recentReadings = [
    {
      id: 'r1',
      title: 'Advanced Algorithms',
      type: 'pdf' as const,
      subject: 'Computer Science',
      progress: 75,
      courseCode: 'CSC 401',
      thumbnail: '/images/algo.png',
    },
    {
      id: 'r2',
      title: 'Operating Systems Concepts',
      type: 'pdf' as const,
      subject: 'Computer Science',
      progress: 45,
      courseCode: 'CSC 305',
    },
    {
      id: 'r3',
      title: 'Software Engineering Principles',
      type: 'document' as const,
      subject: 'Software Engineering',
      progress: 90,
      courseCode: 'CSC 410',
    },
    {
      id: 'r4',
      title: 'Computer Networks',
      type: 'pdf' as const,
      subject: 'Networking',
      progress: 30,
      courseCode: 'CSC 320',
    },
  ];

  const allResources = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      type: 'pdf' as const,
      subject: 'Computer Science',
      courseCode: 'CSC 201',
      rating: 4.8,
      department: 'Computer Science',
      level: 'Advanced',
      isBookmarked: true,
      isUploaded: false,
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      type: 'pdf' as const,
      subject: 'Computer Science',
      courseCode: 'CSC 301',
      rating: 4.9,
      department: 'Computer Science',
      level: 'Intermediate',
      isBookmarked: true,
      isUploaded: false,
    },
    {
      id: '3',
      title: 'Neural Networks Deep Dive',
      type: 'document' as const,
      subject: 'AI & ML',
      courseCode: 'CSC 401',
      rating: 4.7,
      department: 'Computer Science',
      level: 'Advanced',
      isBookmarked: false,
      isUploaded: false,
    },
    {
      id: '4',
      title: 'Advanced Python Programming',
      type: 'pdf' as const,
      subject: 'Programming',
      courseCode: 'CSC 305',
      rating: 4.8,
      department: 'Computer Science',
      level: 'Advanced',
      isBookmarked: true,
      isUploaded: true,
    },
    {
      id: '5',
      title: 'Database Design Principles',
      type: 'pdf' as const,
      subject: 'Database Systems',
      courseCode: 'CSC 310',
      rating: 4.5,
      department: 'Computer Science',
      level: 'Intermediate',
      isBookmarked: false,
      isUploaded: true,
    },
    {
      id: '6',
      title: 'Web Development Fundamentals',
      type: 'document' as const,
      subject: 'Web Development',
      courseCode: 'CSC 205',
      rating: 4.7,
      department: 'Computer Science',
      level: 'Beginner',
      isBookmarked: false,
      isUploaded: false,
    },
    {
      id: '7',
      title: 'Cloud Computing Essentials',
      type: 'pdf' as const,
      subject: 'Cloud Computing',
      courseCode: 'CSC 405',
      rating: 4.6,
      department: 'Computer Science',
      level: 'Advanced',
      isBookmarked: true,
      isUploaded: false,
    },
    {
      id: '8',
      title: 'Cybersecurity Best Practices',
      type: 'pdf' as const,
      subject: 'Security',
      courseCode: 'CSC 320',
      rating: 4.9,
      department: 'Computer Science',
      level: 'Intermediate',
      isBookmarked: false,
      isUploaded: true,
    },
  ];

  const filteredResources = allResources.filter((resource) => {
    if (activeFilter === 'bookmarks') return resource.isBookmarked;
    if (activeFilter === 'uploads') return resource.isUploaded;
    return true;
  });

  const filters = [
    { id: 'all' as FilterType, label: 'All Resources', icon: Grid3x3 },
    { id: 'bookmarks' as FilterType, label: 'Bookmarks', icon: Bookmark },
    { id: 'uploads' as FilterType, label: 'My Uploads', icon: Upload },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            My Catalogues
          </h1>
          <p className="text-on-surface-variant">Manage your learning resources</p>
        </div>

        <RecentReadingsCarousel resources={recentReadings} />

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
              <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all border border-outline-variant/10 font-jakarta">
                Sort by
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-sm font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta">
                + Upload Resource
              </button>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            </p>
          </div>

          <ResourceGrid
            title=""
            resources={filteredResources}
            maxItems={filteredResources.length}
            showRemoveButton
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
