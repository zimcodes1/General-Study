import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, X, Trash2, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { adminAPI, type AdminReport } from '../utils/auth/api';

type StatusFilter = 'all' | 'open' | 'dismissed';

export default function AdminReports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const limit = 15;

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminAPI.getReports({ status: statusFilter, limit, offset });
            setReports(data.results);
            setTotalCount(data.count);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, limit, offset]);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    const handleDismiss = async (id: string) => {
        setActionLoading(id + '-dismiss');
        try {
            await adminAPI.dismissReport(id);
            await fetchReports();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
    };

    const handleRemove = async (id: string) => {
        if (!confirm('This will permanently delete the reported resource. Continue?')) return;
        setActionLoading(id + '-remove');
        try {
            await adminAPI.removeReportedResource(id);
            await fetchReports();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
    };

    const openCount = reports.filter((r) => r.status === 'open').length;
    const dismissedCount = reports.filter((r) => r.status === 'dismissed').length;

    const statusFilters: { id: StatusFilter; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open' },
        { id: 'dismissed', label: 'Dismissed' },
    ];

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
                    <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">Reports &amp; Flags</h1>
                    <p className="text-on-surface-variant">Review and act on user-submitted resource reports</p>
                </div>

                <div className="space-y-8">
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Reports', value: totalCount, icon: AlertTriangle, color: 'text-primary' },
                            { label: 'Open', value: openCount, icon: AlertTriangle, color: 'text-primary' },
                            { label: 'Dismissed', value: dismissedCount, icon: CheckCircle2, color: 'text-tertiary' },
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

                    {/* Reports list */}
                    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-on-surface">Reports</h2>
                            </div>
                            {/* Filter */}
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

                        <div className="divide-y divide-outline-variant/10">
                            {loading ? (
                                <div className="p-16 text-center text-on-surface-variant">Loading…</div>
                            ) : reports.length === 0 ? (
                                <div className="p-16 text-center text-on-surface-variant">No reports found</div>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="p-6 hover:bg-surface-container/50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="text-sm font-semibold text-on-surface">{report.resource_title}</h3>
                                                    <span className="px-2 py-0.5 bg-surface-container rounded text-xs text-on-surface-variant shrink-0">
                                                        {report.course_code}
                                                    </span>
                                                    {report.status !== 'open' && (
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${report.status === 'dismissed' ? 'bg-surface-container text-on-surface-variant' : 'bg-tertiary-container text-tertiary'}`}>
                                                            {report.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-on-surface-variant mb-2 line-clamp-2">{report.reason}</p>
                                                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                                                    <span>Reported by: {report.reported_by}</span>
                                                    <span>{report.date_reported}</span>
                                                </div>
                                            </div>

                                            {report.status === 'open' && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleDismiss(report.id)}
                                                        disabled={!!actionLoading}
                                                        className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface text-sm font-jakarta disabled:opacity-50"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Dismiss
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(report.id)}
                                                        disabled={!!actionLoading}
                                                        className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface text-sm font-jakarta disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
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
