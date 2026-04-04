import { Star, Calendar, User } from 'lucide-react';

interface ResourceHeaderProps {
  title: string;
  courseCode: string;
  courseName: string;
  description: string;
  coverImage?: string;
  rating: number;
  uploadedBy: string;
  uploadDate: string;
}

export default function ResourceHeader({
  title,
  courseCode,
  courseName,
  description,
  coverImage,
  rating,
  uploadedBy,
  uploadDate,
}: ResourceHeaderProps) {
  return (
    <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {coverImage && (
          <div className="lg:col-span-1">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
        )}
        
        <div className={`p-8 ${coverImage ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-start gap-3 mb-4">
            <div className="px-4 py-1.5 bg-tertiary-container/80 backdrop-blur-md rounded-full text-sm text-tertiary font-semibold font-jakarta">
              {courseCode}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-tertiary text-tertiary'
                      : 'text-surface-container-high'
                  }`}
                />
              ))}
              <span className="text-sm text-on-surface-variant ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-on-surface-variant mb-6">{courseName}</p>

          <p className="text-on-surface-variant mb-6 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Uploaded by {uploadedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{uploadDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
