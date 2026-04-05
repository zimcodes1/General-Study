import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ResourceCard from '../components/dashboard/ResourceCard';
import ResourceUploadModal from '../components/resources/ResourceUploadModal';
import { Search, SlidersHorizontal, Upload, X } from 'lucide-react';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const departments = ['All Departments', 'Computer Science', 'Engineering', 'Business', 'Mathematics'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
  const courses = ['All Courses', 'CSC 201', 'CSC 301', 'CSC 305', 'CSC 310', 'CSC 401', 'CSC 405'];

  const allResources = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      type: 'pdf' as const,
      subject: 'Artificial Intelligence',
      courseCode: 'CSC 201',
      rating: 4.8,
      department: 'Computer Science',
      level: 'Advanced',
      thumbnail: '/images/ml.png',
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      type: 'pdf' as const,
      subject: 'Programming',
      courseCode: 'CSC 301',
      rating: 4.9,
      department: 'Computer Science',
      level: 'Intermediate',
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
    },
    {
      id: '9',
      title: 'Mobile App Development',
      type: 'document' as const,
      subject: 'Mobile Development',
      courseCode: 'CSC 315',
      rating: 4.4,
      department: 'Computer Science',
      level: 'Intermediate',
    },
    {
      id: '10',
      title: 'Software Engineering Principles',
      type: 'pdf' as const,
      subject: 'Software Engineering',
      courseCode: 'CSC 410',
      rating: 4.7,
      department: 'Computer Science',
      level: 'Advanced',
    },
    {
      id: '11',
      title: 'Operating Systems Concepts',
      type: 'pdf' as const,
      subject: 'Systems',
      courseCode: 'CSC 305',
      rating: 4.6,
      department: 'Computer Science',
      level: 'Intermediate',
    },
    {
      id: '12',
      title: 'Computer Networks',
      type: 'document' as const,
      subject: 'Networking',
      courseCode: 'CSC 320',
      rating: 4.5,
      department: 'Computer Science',
      level: 'Intermediate',
    },
  ];

  const filteredResources = allResources.filter((resource) => {
    const matchesSearch =
      searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'all' || resource.department === selectedDepartment;

    const matchesLevel = selectedLevel === 'all' || resource.level === selectedLevel;

    const matchesCourse = selectedCourse === 'all' || resource.courseCode === selectedCourse;

    return matchesSearch && matchesDepartment && matchesLevel && matchesCourse;
  });

  const clearFilters = () => {
    setSelectedDepartment('all');
    setSelectedLevel('all');
    setSelectedCourse('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedDepartment !== 'all' || selectedLevel !== 'all' || selectedCourse !== 'all' || searchQuery !== '';

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
                    className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-on-surface text-sm focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept === 'All Departments' ? 'all' : dept}>
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
                    {levels.map((level) => (
                      <option key={level} value={level === 'All Levels' ? 'all' : level}>
                        {level}
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
                    {courses.map((course) => (
                      <option key={course} value={course === 'All Courses' ? 'all' : course}>
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
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-on-surface-variant/40" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">No resources found</h3>
            <p className="text-on-surface-variant mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-surface-container-low text-on-surface rounded-full hover:bg-surface-container transition-all font-jakarta text-sm"
            >
              Clear filters
            </button>
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
