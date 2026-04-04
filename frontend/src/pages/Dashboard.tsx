import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import StatCard from '../components/dashboard/StatCard';
import ResourceGrid from '../components/dashboard/ResourceGrid';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { icon: BookOpen, label: 'Active Catalogues', value: '8', change: '+2', trend: 'up' as const },
    { icon: Clock, label: 'Study Hours', value: '42h', change: '+12%', trend: 'up' as const },
    { icon: TrendingUp, label: 'Avg. Score', value: '87%', change: '+5%', trend: 'up' as const },
    { icon: Award, label: 'Completed', value: '24', change: '+8', trend: 'up' as const },
  ];

  const continueReading = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      type: 'video' as const,
      duration: '45 min',
      subject: 'Computer Science',
      progress: 65,
      courseCode: 'CS101',
      thumbnail: '/images/course_thumbnail1.png'
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      type: 'pdf' as const,
      duration: '2h read',
      subject: 'Computer Science',
      progress: 40,
      courseCode: 'DTS-211'
    },
    {
      id: '3',
      title: 'Neural Networks Deep Dive',
      type: 'video' as const,
      duration: '1h 20min',
      subject: 'AI & ML',
      progress: 80,
      courseCode: 'AI-301',
    },
  ];

  const recommendedResources = [
    {
      id: '4',
      title: 'Advanced Python Programming',
      type: 'pdf' as const,
      duration: '3h read',
      subject: 'Programming',
    },
    {
      id: '5',
      title: 'Database Design Principles',
      type: 'video' as const,
      duration: '55 min',
      subject: 'Database',
    },
    {
      id: '6',
      title: 'Web Development Fundamentals',
      type: 'article' as const,
      duration: '30 min',
      subject: 'Web Dev',
    },
  ];

  const recentlyAdded = [
    {
      id: '7',
      title: 'Cloud Computing Essentials',
      type: 'video' as const,
      duration: '1h 15min',
      subject: 'Cloud',
    },
    {
      id: '8',
      title: 'Cybersecurity Best Practices',
      type: 'pdf' as const,
      duration: '2h read',
      subject: 'Security',
    },
    {
      id: '9',
      title: 'Mobile App Development',
      type: 'video' as const,
      duration: '50 min',
      subject: 'Mobile',
    },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
              Welcome back, Sarah
            </h1>
            <p className="text-on-surface-variant">Continue your learning journey</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <ResourceGrid title="Continue Reading" resources={continueReading} maxItems={3} />
          <ResourceGrid title="Recommended for You" resources={recommendedResources} maxItems={3} />
          <ResourceGrid title="Recently Added" resources={recentlyAdded} maxItems={3} />
        </main>
      </div>
    </div>
  );
}
