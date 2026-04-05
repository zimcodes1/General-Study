import { Check, X, Trash2, Eye } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  courseCode: string;
  uploadedBy: string;
  dateUploaded: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ResourceModerationProps {
  resources: Resource[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function ResourceModeration({
  resources,
  onApprove,
  onReject,
  onDelete,
  onView,
}: ResourceModerationProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-primary/20 text-primary',
      approved: 'bg-tertiary-container text-tertiary',
      rejected: 'bg-surface-container-high text-on-surface-variant',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
      <div className="p-6 border-b border-outline-variant/10">
        <h2 className="text-xl font-bold text-on-surface">Resource Moderation</h2>
        <p className="text-sm text-on-surface-variant mt-1">Review and manage uploaded resources</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-on-surface">{resource.title}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-on-surface-variant">{resource.courseCode}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-on-surface-variant">{resource.uploadedBy}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-on-surface-variant">{resource.dateUploaded}</span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(resource.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(resource.id)}
                      className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {resource.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(resource.id)}
                          className="p-2 rounded-lg bg-tertiary-container hover:bg-tertiary-container/80 transition-colors text-tertiary"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onReject(resource.id)}
                          className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete(resource.id)}
                      className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
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
      </div>
    </div>
  );
}
