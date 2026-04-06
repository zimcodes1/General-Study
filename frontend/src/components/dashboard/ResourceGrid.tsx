import ResourceCard, { type ResourceFileType } from './ResourceCard';

interface Resource {
  id: string;
  title: string;
  type: ResourceFileType;
  thumbnail?: string;
  subject: string;
  progress?: number;
  courseCode?: string;
  rating?: number;
  department?: string;
  level?: string;
}

interface ResourceGridProps {
  title: string;
  resources: Resource[];
  maxItems?: number;
  showRemoveButton?: boolean;
}

export default function ResourceGrid({ title, resources, maxItems = 3, showRemoveButton = false }: ResourceGridProps) {
  const displayedResources = resources.slice(0, maxItems);

  const handleRemove = (id: string) => {
    console.log('Remove resource:', id);
  };

  return (
    <section className="mb-12">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">{title}</h2>
          <button className="text-sm text-tertiary hover:text-tertiary/80 transition-colors font-jakarta">
            View All →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            {...resource}
            showRemoveButton={showRemoveButton}
            onRemove={() => handleRemove(resource.id)}
          />
        ))}
      </div>
    </section>
  );
}
