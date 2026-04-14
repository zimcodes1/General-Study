import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, Trash2, ArrowRight } from 'lucide-react';

interface Report {
  id: string;
  resourceTitle: string;
  courseCode: string;
  reason: string;
  reportedBy?: string;
  dateReported: string;
}

interface ReportsManagementProps {
  reports: Report[];
  onDismiss: (id: string) => void;
  onRemoveResource: (id: string) => void;
  limit?: number;
  showViewAll?: boolean;
}

export default function ReportsManagement({
  reports,
  onDismiss,
  onRemoveResource,
  limit,
  showViewAll = false,
}: ReportsManagementProps) {
  const navigate = useNavigate();
  const displayed = limit !== undefined ? reports.slice(0, limit) : reports;

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
      <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-on-surface">Reports &amp; Flags</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Review reported resources</p>
          </div>
        </div>
        {showViewAll && (
          <button
            onClick={() => navigate('/admin/reports')}
            className="flex items-center gap-1.5 text-sm text-primary font-jakarta hover:opacity-80 transition-opacity"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="divide-y divide-outline-variant/10">
        {displayed.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-on-surface-variant">No reports at this time</p>
          </div>
        ) : (
          displayed.map((report) => (
            <div key={report.id} className="p-6 hover:bg-surface-container/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-on-surface">{report.resourceTitle}</h3>
                    <span className="px-2 py-0.5 bg-surface-container rounded text-xs text-on-surface-variant">
                      {report.courseCode}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-2">{report.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                    {report.reportedBy && <span>Reported by: {report.reportedBy}</span>}
                    <span>{report.dateReported}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDismiss(report.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface text-sm font-jakarta"
                  >
                    <X className="w-4 h-4" />
                    Dismiss
                  </button>
                  <button
                    onClick={() => onRemoveResource(report.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface text-sm font-jakarta"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
