import { Star, Calendar, User, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getFileTypeMeta, type ResourceFileType } from '../dashboard/ResourceCard';
import { tokenStorage } from '../../utils/auth';
import Toast from '../Toast';

interface ResourceHeaderProps {
  title: string;
  courseCode?: string;
  courseName?: string;
  description?: string;
  coverImage?: string | null;
  fileType?: ResourceFileType;
  rating?: number;
  uploadedBy?: string;
  uploadDate?: string;
  resourceId?: string;
}

export default function ResourceHeader({
  title,
  courseCode,
  courseName,
  description,
  coverImage,
  fileType,
  rating,
  uploadedBy,
  uploadDate,
  resourceId,
}: ResourceHeaderProps) {
  const fileTypeMeta = getFileTypeMeta(fileType ?? 'other');
  const FileIcon = fileTypeMeta.icon;
  
  const accessToken = tokenStorage.getAccessToken();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch bookmark status on component mount
  useEffect(() => {
    if (resourceId && accessToken) {
      checkBookmarkStatus();
    }
  }, [resourceId, accessToken]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resources/${resourceId}/is_bookmarked/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.is_bookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    console.log('Toggling bookmark for resource:', resourceId);
    if (!resourceId || !accessToken) return;
    
    setLoadingBookmark(true);
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resources/${resourceId}/bookmark/`,
        {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.ok) {
        const newBookmarkState = !isBookmarked;
        setIsBookmarked(newBookmarkState);
        setToastMessage(newBookmarkState ? 'Resource bookmarked successfully!' : 'Bookmark removed');
        setShowToast(true);
      } else {
        console.error('Bookmark toggle failed:', response.statusText);
        setToastMessage('Failed to update bookmark');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setToastMessage('Failed to update bookmark');
      setShowToast(true);
    } finally {
      setLoadingBookmark(false);
    }
  };

  return(
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover min-h-[300px]"
            />
          ) : (
            <div className="w-full h-full min-h-[300px] bg-surface-container-high flex items-center justify-center">
              <div
                className={`w-24 h-24 rounded-3xl border ${fileTypeMeta.className} flex items-center justify-center`}
              >
                <FileIcon className="w-10 h-10" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-8 lg:col-span-2">
          <div className="flex items-start gap-3 mb-4">
            {courseCode && (
              <div className="px-4 py-1.5 bg-tertiary-container/80 backdrop-blur-md rounded-full text-sm text-tertiary font-semibold font-jakarta">
                {courseCode}
              </div>
            )}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${fileTypeMeta.className}`}
            >
              <FileIcon className="w-3.5 h-3.5" />
              {fileTypeMeta.label}
            </div>
            {rating !== undefined && (
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
            )}
            {accessToken && (
              <button
                onClick={toggleBookmark}
                disabled={loadingBookmark}
                className={`ml-auto inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-tertiary-container text-tertiary border-tertiary'
                    : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-outline'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-tertiary' : ''}`}
                />
                {loadingBookmark ? 'Loading...' : isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            {title}
          </h1>
          {courseName && (
            <p className="text-lg text-on-surface-variant mb-6">{courseName}</p>
          )}

          {description && (
            <p className="text-on-surface-variant mb-6 leading-relaxed">{description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
            {uploadedBy && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Uploaded by {uploadedBy}</span>
              </div>
            )}
            {uploadDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{uploadDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
