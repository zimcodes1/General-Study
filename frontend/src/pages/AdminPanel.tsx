import { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AdminStats from '../components/admin/AdminStats';
import ResourceModeration from '../components/admin/ResourceModeration';
import ReportsManagement from '../components/admin/ReportsManagement';
import UserManagement from '../components/admin/UserManagement';
import { adminAPI, type AdminStats as AdminStatsData } from '../utils/auth/api';

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

// Adapter helpers to map API shape → component shape
const toResourceShape = (r: any) => ({
  id: String(r.id),
  title: r.title,
  courseCode: r.course_code,
  uploadedBy: r.uploaded_by?.full_name ?? '—',
  dateUploaded: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  status: r.status as 'pending' | 'approved' | 'rejected',
});

const toReportShape = (r: any) => ({
  id: String(r.id),
  resourceTitle: r.resource_title,
  courseCode: r.course_code,
  reason: r.reason,
  reportedBy: r.reported_by,
  dateReported: r.date_reported,
});

const toUserShape = (u: any) => ({
  id: String(u.id),
  name: u.full_name,
  email: u.email,
  department: u.department,
  level: `${u.current_level}L`,
  status: u.status as 'active' | 'disabled',
});

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [resourceFilter, setResourceFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsData, resData, repData, usersData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getResources({ limit: 10 }),
        adminAPI.getReports({ status: 'open', limit: 5 }),
        adminAPI.getUsers({ limit: 5 }),
      ]);
      setStats(statsData);
      setResources(resData.results);
      setReports(repData.results);
      setUsers(usersData.results);
    } catch (e) {
      console.error('Admin panel fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredResources = resources.filter((r) =>
    resourceFilter === 'all' ? true : r.status === resourceFilter
  );

  const handleApprove = async (id: string) => {
    try { await adminAPI.approveResource(id); await fetchAll(); } catch (e) { console.error(e); }
  };
  const handleReject = async (id: string) => {
    try { await adminAPI.rejectResource(id); await fetchAll(); } catch (e) { console.error(e); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this resource?')) return;
    try { await adminAPI.deleteResource(id); await fetchAll(); } catch (e) { console.error(e); }
  };
  const handleView = (id: string) => { console.log('View resource:', id); };

  const handleDismissReport = async (id: string) => {
    try { await adminAPI.dismissReport(id); await fetchAll(); } catch (e) { console.error(e); }
  };
  const handleRemoveResource = async (id: string) => {
    if (!confirm('This will delete the reported resource. Continue?')) return;
    try { await adminAPI.removeReportedResource(id); await fetchAll(); } catch (e) { console.error(e); }
  };

  const handleDisableUser = async (id: string) => {
    try { await adminAPI.disableUser(id); await fetchAll(); } catch (e) { console.error(e); }
  };
  const handleEnableUser = async (id: string) => {
    try { await adminAPI.enableUser(id); await fetchAll(); } catch (e) { console.error(e); }
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
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">Admin Panel</h1>
          <p className="text-on-surface-variant">Manage platform content and users</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading…</div>
        ) : (
          <div className="space-y-8">
            <AdminStats
              totalResources={stats?.total_resources ?? 0}
              pendingApprovals={stats?.pending_approvals ?? 0}
              totalUsers={stats?.total_users ?? 0}
              approvedToday={stats?.approved_today ?? 0}
              activeUsers={stats?.active_users ?? 0}
              openReports={stats?.open_reports ?? 0}
            />

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-on-surface">Resources</h2>
                <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant/10">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setResourceFilter(filter.id)}
                      className={`px-4 py-2 rounded-xl transition-all font-jakarta text-sm ${resourceFilter === filter.id
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
                resources={filteredResources.map(toResourceShape)}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onView={handleView}
                limit={5}
                showViewAll
              />
            </div>

            <ReportsManagement
              reports={reports.map(toReportShape)}
              onDismiss={handleDismissReport}
              onRemoveResource={handleRemoveResource}
              limit={5}
              showViewAll
            />

            <UserManagement
              users={users.map(toUserShape)}
              onDisableUser={handleDisableUser}
              onEnableUser={handleEnableUser}
              limit={5}
              showViewAll
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
