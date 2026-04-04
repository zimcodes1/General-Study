import DashboardLayout from '../components/dashboard/DashboardLayout';
import ResourceHeader from '../components/catalogue/ResourceHeader';
import PrimaryActions from '../components/catalogue/PrimaryActions';
import ProgressOverview from '../components/catalogue/ProgressOverview';
import TopicsList from '../components/catalogue/TopicsList';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CatalogueOverview() {
  const navigate = useNavigate();

  const resourceData = {
    title: 'Introduction to Machine Learning',
    courseCode: 'CSC 201',
    courseName: 'Artificial Intelligence Fundamentals',
    description:
      'A comprehensive guide to machine learning concepts, algorithms, and practical applications. This resource covers supervised and unsupervised learning, neural networks, and real-world case studies.',
    coverImage: '/images/ml-cover.png',
    rating: 4.8,
    uploadedBy: 'Dr. Sarah Chen',
    uploadDate: 'January 15, 2024',
  };

  const progressData = {
    percentageCompleted: 65,
    lastStudiedSection: 'Neural Networks - Backpropagation',
    totalTopics: 12,
    completedTopics: 8,
  };

  const topics = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      status: 'completed' as const,
      subtopics: [
        { id: '1-1', title: 'What is Machine Learning?', status: 'completed' as const },
        { id: '1-2', title: 'Types of Machine Learning', status: 'completed' as const },
        { id: '1-3', title: 'Applications and Use Cases', status: 'completed' as const },
      ],
    },
    {
      id: '2',
      title: 'Supervised Learning',
      status: 'completed' as const,
      subtopics: [
        { id: '2-1', title: 'Linear Regression', status: 'completed' as const },
        { id: '2-2', title: 'Logistic Regression', status: 'completed' as const },
        { id: '2-3', title: 'Decision Trees', status: 'completed' as const },
      ],
    },
    {
      id: '3',
      title: 'Neural Networks',
      status: 'in-progress' as const,
      subtopics: [
        { id: '3-1', title: 'Perceptrons', status: 'completed' as const },
        { id: '3-2', title: 'Activation Functions', status: 'completed' as const },
        { id: '3-3', title: 'Backpropagation', status: 'in-progress' as const },
        { id: '3-4', title: 'Training Neural Networks', status: 'not-started' as const },
      ],
    },
    {
      id: '4',
      title: 'Deep Learning',
      status: 'not-started' as const,
      subtopics: [
        { id: '4-1', title: 'Convolutional Neural Networks', status: 'not-started' as const },
        { id: '4-2', title: 'Recurrent Neural Networks', status: 'not-started' as const },
        { id: '4-3', title: 'Transfer Learning', status: 'not-started' as const },
      ],
    },
    {
      id: '5',
      title: 'Unsupervised Learning',
      status: 'not-started' as const,
      subtopics: [
        { id: '5-1', title: 'K-Means Clustering', status: 'not-started' as const },
        { id: '5-2', title: 'Hierarchical Clustering', status: 'not-started' as const },
        { id: '5-3', title: 'Principal Component Analysis', status: 'not-started' as const },
      ],
    },
  ];

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
          <ResourceHeader {...resourceData} />

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
