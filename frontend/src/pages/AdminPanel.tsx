import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AdminStats from '../components/admin/AdminStats';
import ResourceModeration from '../components/admin/ResourceModeration';
import ReportsManagement from '../components/admin/ReportsManagement';
import UserManagement from '../components/admin/UserManagement';

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminPanel() {
  const [resourceFilter, setResourceFilter] = useState<FilterType>('all');

  // Mock data
  const allResources = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      courseCode: 'CSC 201',
      uploadedBy: 'Dr. Sarah Chen',
      dateUploaded: 'Jan 15, 2024',
      status: 'pending' as const,
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      courseCode: 'CSC 301',
      uploadedBy: 'Prof. John Smith',
      dateUploaded: 'Jan 14, 2024',
      status: 'pending' as const,
    },
    {
      id: '3',
      title: 'Neural Networks Deep Dive',
      courseCode: 'CSC 401',
      uploadedBy: 'Dr. Emily Wang',
      dateUploaded: 'Jan 13, 2024',
      status: 'approved' as const,
    },
    {
      id: '4',
      title: 'Database Design Principles',
      courseCode: 'CSC 310',
      uploadedBy: 'Prof. Michael Brown',
      dateUploaded: 'Jan 12, 2024',
      status: 'approved' as const,
    },
    {
      id: '5',
      title: 'Web Development Basics',
      courseCode: 'CSC 205',
      uploadedBy: 'Dr. Lisa Anderson',
      dateUploaded: 'Jan 11, 2024',
      status: 'rejected' as const,
    },
  ];

  const reports = [
    {
      id: 'r1',
      resourceTitle: 'Introduction to Python',
      courseCode: 'CSC 101',
      reason: 'Contains outdated information and broken code examples',
      reportedBy: 'John Doe',
      dateReported: 'Jan 16, 2024',
    },
    {
      id: 'r2',
      resourceTitle: 'Advanced Algorithms',
      courseCode: 'CSC 405',
      reason: 'Inappropriate content',
      reportedBy: 'Jane Smith',
      dateReported: 'Jan 15, 2024',
    },
  ];

  const users = [
    {
      id: 'u1',
      name: 'Sarah Chen',
      email: 'sarah.chen@university.edu',
      department: 'Computer Science',
      level: 'Undergraduate',
      status: 'active' as const,
    },
    {
      id: 'u2',
      name: 'Michael Johnson',
      email: 'michael.j@university.edu',
      department: 'Engineering',
      level: 'Graduate',
      status: 'active' as const,
    },
    {
      id: 'u3',
      name: 'Emily Davis',
      email: 'emily.d@university.edu',
      department: 'Computer Science',
      level: 'Undergraduate',
      status: 'disabled' as const,
    },
  ];

  const filteredResources = allResources.filter((resource) => {
    if (resourceFilter === 'all') return true;
    return resource.status === resourceFilter;
  });

  const handleApprove = (id: string) => {
    console.log('Approve resource:', id);
  };

  const handleReject = (id: string) => {
    console.log('Reject resource:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete resource:', id);
  };

  const handleView = (id: string) => {
    console.log('View resource:', id);
  };

  const handleDismissReport = (id: string) => {
    console.log('Dismiss report:', id);
  };

  const handleRemoveResource = (id: string) => {
    console.log('Remove resource:', id);
  };

  const handleDisableUser = (id: string) => {
    console.log('Disable user:', id);
  };

  const handleEnableUser = (id: string) => {
    console.log('Enable user:', id);
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            Admin Panel
          </h1>
          <p className="text-on-surface-variant">Manage platform content and users</p>
        </div>

        <div className="space-y-8">
          <AdminStats
            totalResources={allResources.length}
            pendingApprovals={allResources.filter((r) => r.status === 'pending').length}
            totalUsers={users.length}
            approvedToday={2}
          />

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-on-surface">Resources</h2>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant/10">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setResourceFilter(filter.id)}
                    className={`px-4 py-2 rounded-xl transition-all font-jakarta text-sm ${
                      resourceFilter === filter.id
                        ? 'bg-surface-container-high text-on-surface shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <ResourceModeration
              resources={filteredResources}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>

          <ReportsManagement
            reports={reports}
            onDismiss={handleDismissReport}
            onRemoveResource={handleRemoveResource}
          />

          <UserManagement
            users={users}
            onDisableUser={handleDisableUser}
            onEnableUser={handleEnableUser}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
