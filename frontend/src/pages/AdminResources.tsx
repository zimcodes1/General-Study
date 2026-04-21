import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Search, Check, X, Trash2, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import BarChart from '../components/admin/BarChart';
import {
    adminAPI,
    type AdminResource,
    type AdminResourceAnalytics,
} from '../utils/auth/api';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'processing';

export default function AdminResources() {
    const navigate = useNavigate();
    const [resources, setResources] = useState<AdminResource[]>([]);
    const [analytics, setAnalytics] = useState<AdminResourceAnalytics | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const limit = 15;

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminAPI.getResources({ status: statusFilter, search, limit, offset });
            setResources(data.results);
            setTotalCount(data.count);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, limit, offset]);

    useEffect(() => { fetchResources(); }, [fetchResources]);

    useEffect(() => {
        adminAPI.getResourceAnalytics().then(setAnalytics).catch(console.error);
    }, []);

    const handleApprove = async (id: string) => {
        setActionLoading(id + '-approve');
        try {
            await adminAPI.approveResource(id);
            await fetchResources();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id + '-reject');
        try {
            await adminAPI.rejectResource(id);
            await fetchResources();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this resource?')) return;
        setActionLoading(id + '-delete');
        try {
            await adminAPI.deleteResource(id);
            await fetchResources();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
    };

    const statusFilters: { id: StatusFilter; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'pending', label: 'Pending' },
        { id: 'approved', label: 'Approved' },
        { id: 'rejected', label: 'Rejected' },
        { id: 'processing', label: 'Processing' },
    ];

    const statusBadge = (s: string) => {
        const map: Record<string, string> = {
            pending: 'bg-primary/20 text-primary',
            approved: 'bg-tertiary-container text-tertiary',
            rejected: 'bg-surface-container-high text-on-surface-variant',
            processing: 'bg-secondary/20 text-secondary',
            failed: 'bg-surface-container-high text-on-surface-variant',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${map[s] ?? 'bg-surface-container text-on-surface-variant'}`}>
                {s}
            </span>
        );
    };

    const statsCards = analytics
        ? [
            { label: 'Approved', value: analytics.status_breakdown.approved, icon: CheckCircle2, color: 'text-tertiary' },
            { label: 'Pending', value: analytics.status_breakdown.pending, icon: Clock, color: 'text-primary' },
            { label: 'Rejected', value: analytics.status_breakdown.rejected, icon: XCircle, color: 'text-on-surface-variant' },
            { label: 'Processing', value: analytics.status_breakdown.processing, icon: FileText, color: 'text-secondary' },
        ]
        : [];

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
                    <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">Resource Management</h1>
                    <p className="text-on-surface-variant">Review, approve and moderate all platform resources</p>
                </div>

                <div className="space-y-8">
                    {/* Analytics Cards */}
                    {analytics && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {statsCards.map((card) => {
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
                    )}

                    {/* Uploads Chart */}
                    {analytics && analytics.weekly_uploads.length > 0 && (
                        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-on-surface">Weekly Uploads (Last 8 Weeks)</h2>
                            </div>
                            <BarChart data={analytics.weekly_uploads} label="Resources uploaded per week" />
                        </div>
                    )}

                    {/* Resources Table */}
                    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-xl font-bold text-on-surface">All Resources</h2>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    {/* Search */}
                                    <div className="relative flex-1 sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                                        <input
                                            type="text"
                                            placeholder="Search title or course…"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setOffset(0); } }}
                                            className="w-full pl-9 pr-4 py-2 bg-surface-container rounded-xl text-sm text-on-surface placeholder-on-surface-variant border border-outline-variant/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    {/* Status Filter */}
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
                            {loading ? (
                                <div className="p-16 text-center text-on-surface-variant">Loading…</div>
                            ) : resources.length === 0 ? (
                                <div className="p-16 text-center text-on-surface-variant">No resources found</div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-surface-container">
                                        <tr>
                                            {['Resource', 'Course', 'Uploaded By', 'Date', 'Status', 'Actions'].map((h, i) => (
                                                <th key={h} className={`px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {resources.map((r) => (
                                            <tr key={r.id} className="hover:bg-surface-container/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-on-surface">{r.title}</p>
                                                    <p className="text-xs text-on-surface-variant">{r.file_type.toUpperCase()}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-on-surface-variant">{r.course_code}</td>
                                                <td className="px-6 py-4 text-sm text-on-surface-variant">{r.uploaded_by?.full_name ?? '—'}</td>
                                                <td className="px-6 py-4 text-sm text-on-surface-variant">
                                                    {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">{statusBadge(r.status)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {r.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(r.id)}
                                                                    disabled={!!actionLoading}
                                                                    className="p-2 rounded-lg bg-tertiary-container hover:bg-tertiary-container/80 transition-colors text-tertiary disabled:opacity-50"
                                                                    title="Approve"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(r.id)}
                                                                    disabled={!!actionLoading}
                                                                    className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant disabled:opacity-50"
                                                                    title="Reject"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(r.id)}
                                                            disabled={!!actionLoading}
                                                            className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
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
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setOffset((o) => o + limit)}
                                        disabled={offset + limit >= totalCount}
                                        className="px-4 py-2 bg-surface-container rounded-lg text-sm font-jakarta text-on-surface-variant hover:text-on-surface disabled:opacity-40 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
