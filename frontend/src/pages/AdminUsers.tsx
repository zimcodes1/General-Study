import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserPlus, Search, UserX, Mail, TrendingUp, GraduationCap } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import BarChart from '../components/admin/BarChart';
import { adminAPI, type AdminUser, type AdminUserAnalytics } from '../utils/auth/api';

type StatusFilter = 'all' | 'active' | 'disabled';

export default function AdminUsers() {
    const navigate = useNavigate();

    // Users table state
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [offset, setOffset] = useState(0);
    const [tableLoading, setTableLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Analytics state
    const [analytics, setAnalytics] = useState<AdminUserAnalytics | null>(null);
    const limit = 15;

    // Fetch user list
    const fetchUsers = useCallback(async () => {
        setTableLoading(true);
        try {
            const data = await adminAPI.getUsers({ search, status: statusFilter, limit, offset });
            setUsers(data.results);
            setTotalCount(data.count);
        } catch (e) {
            console.error(e);
        } finally {
            setTableLoading(false);
        }
    }, [search, statusFilter, limit, offset]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // Fetch analytics once
    useEffect(() => {
        adminAPI.getUserAnalytics().then(setAnalytics).catch(console.error);
    }, []);

    const handleDisable = async (id: string) => {
        setActionLoading(id + '-disable');
        try {
            await adminAPI.disableUser(id);
            await fetchUsers();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
    };

    const handleEnable = async (id: string) => {
        setActionLoading(id + '-enable');
        try {
            await adminAPI.enableUser(id);
            await fetchUsers();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
    };

    const statusFilters: { id: StatusFilter; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'disabled', label: 'Disabled' },
    ];

    // Degree level breakdown as mini horizontal bars
    const degreeTotal = analytics
        ? Object.values(analytics.degree_breakdown).reduce((s, v) => s + v, 0)
        : 0;

    const degreeColors: Record<string, string> = {
        undergraduate: '#6750a4',
        graduate: '#7c5dab',
        postgraduate: '#9775b5',
    };

    return (
        <DashboardLayout>
            <div className="px-4 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-4 transition-colors font-jakarta text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
                    </button>
                    <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">User Management</h1>
                    <p className="text-on-surface-variant">Monitor user activity and manage platform accounts</p>
                </div>

                <div className="space-y-8">
                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Users', value: analytics?.total_users ?? '—', icon: Users, color: 'text-primary' },
                            { label: 'Active (30d)', value: analytics?.active_users ?? '—', icon: UserCheck, color: 'text-tertiary' },
                            { label: 'New This Week', value: analytics?.new_this_week ?? '—', icon: UserPlus, color: 'text-secondary' },
                        ].map((card) => {
                            const Icon = card.icon;
                            return (
                                <div key={card.label} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
                                    <div className={`w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center mb-3 ${card.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-2xl font-bold text-on-surface">{card.value}</p>
                                    <p className="text-sm text-on-surface-variant font-jakarta">{card.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts row */}
                    {analytics && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Signups chart (spans 2 cols) */}
                            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 lg:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-bold text-on-surface">Weekly Signups (Last 8 Weeks)</h2>
                                </div>
                                <BarChart
                                    data={analytics.weekly_signups}
                                    label="New user registrations per week"
                                />
                            </div>

                            {/* Degree breakdown */}
                            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
                                <div className="flex items-center gap-2 mb-5">
                                    <GraduationCap className="w-5 h-5 text-secondary" />
                                    <h2 className="text-lg font-bold text-on-surface">By Degree Level</h2>
                                </div>
                                <div className="space-y-4">
                                    {Object.entries(analytics.degree_breakdown).map(([level, count]) => {
                                        const pct = degreeTotal > 0 ? (count / degreeTotal) * 100 : 0;
                                        return (
                                            <div key={level}>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm text-on-surface capitalize">{level}</span>
                                                    <span className="text-sm font-semibold text-on-surface">{count}</span>
                                                </div>
                                                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${pct}%`, backgroundColor: degreeColors[level] ?? '#6750a4' }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {Object.keys(analytics.degree_breakdown).length === 0 && (
                                        <p className="text-sm text-on-surface-variant">No data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Table */}
                    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-xl font-bold text-on-surface">All Users</h2>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                                        <input
                                            type="text"
                                            placeholder="Search name or email…"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setOffset(0); } }}
                                            className="w-full pl-9 pr-4 py-2 bg-surface-container rounded-xl text-sm text-on-surface placeholder-on-surface-variant border border-outline-variant/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1 border border-outline-variant/10">
                                        {statusFilters.map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => { setStatusFilter(f.id); setOffset(0); }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-jakarta transition-all ${statusFilter === f.id ? 'bg-surface-container-high text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {tableLoading ? (
                                <div className="p-16 text-center text-on-surface-variant">Loading…</div>
                            ) : users.length === 0 ? (
                                <div className="p-16 text-center text-on-surface-variant">No users found</div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-surface-container">
                                        <tr>
                                            {['Name', 'Email', 'Department', 'Level', 'Joined', 'Last Active', 'Status', 'Actions'].map((h, i) => (
                                                <th key={h} className={`px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${i === 7 ? 'text-right' : 'text-left'}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-surface-container/50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-on-surface">{user.full_name}</p>
                                                    <p className="text-xs text-on-surface-variant capitalize">{user.degree_level}</p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                                                        <span className="text-sm text-on-surface-variant">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-on-surface-variant">{user.department || '—'}</td>
                                                <td className="px-5 py-4 text-sm text-on-surface-variant">{user.current_level}L</td>
                                                <td className="px-5 py-4 text-sm text-on-surface-variant">{user.joined}</td>
                                                <td className="px-5 py-4 text-sm text-on-surface-variant">{user.last_active ?? 'Never'}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${user.status === 'active' ? 'bg-tertiary-container text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end">
                                                        {user.status === 'active' ? (
                                                            <button
                                                                onClick={() => handleDisable(user.id)}
                                                                disabled={!!actionLoading}
                                                                className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface text-xs font-jakarta disabled:opacity-50"
                                                            >
                                                                <UserX className="w-3.5 h-3.5" /> Disable
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleEnable(user.id)}
                                                                disabled={!!actionLoading}
                                                                className="flex items-center gap-2 px-3 py-2 bg-tertiary-container rounded-lg hover:bg-tertiary-container/80 transition-colors text-tertiary text-xs font-jakarta disabled:opacity-50"
                                                            >
                                                                Enable
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalCount > limit && (
                            <div className="p-4 border-t border-outline-variant/10 flex items-center justify-between">
                                <p className="text-sm text-on-surface-variant">
                                    Showing {offset + 1}–{Math.min(offset + limit, totalCount)} of {totalCount}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setOffset((o) => Math.max(0, o - limit))}
                                        disabled={offset === 0}
                                        className="px-4 py-2 bg-surface-container rounded-lg text-sm font-jakarta text-on-surface-variant hover:text-on-surface disabled:opacity-40 transition-colors"
                                    >Previous</button>
                                    <button
                                        onClick={() => setOffset((o) => o + limit)}
                                        disabled={offset + limit >= totalCount}
                                        className="px-4 py-2 bg-surface-container rounded-lg text-sm font-jakarta text-on-surface-variant hover:text-on-surface disabled:opacity-40 transition-colors"
                                    >Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
