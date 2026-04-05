import { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import StatCard from '../components/dashboard/StatCard';
import ResourceGrid from '../components/dashboard/ResourceGrid';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react';
import { auth } from '../utils/auth';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = auth.getUser();
    setUser(userData);
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'User';

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
      type: 'pdf' as const,
      subject: 'Computer Science',
      progress: 65,
      courseCode: 'CSC 201',
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      type: 'pdf' as const,
      subject: 'Computer Science',
      progress: 40,
      courseCode: 'CSC 301',
    },
    {
      id: '3',
      title: 'Neural Networks Deep Dive',
      type: 'document' as const,
      subject: 'AI & ML',
      progress: 80,
      courseCode: 'CSC 401',
    },
  ];

  const recommendedResources = [
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
  ];

  const recentlyAdded = [
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
