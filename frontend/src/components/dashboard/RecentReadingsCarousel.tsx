import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ResourceCard from './ResourceCard';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'document';
  thumbnail?: string;
  subject: string;
  progress?: number;
  courseCode?: string;
}

interface RecentReadingsCarouselProps {
  resources: Resource[];
}

export default function RecentReadingsCarousel({ resources }: RecentReadingsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Function to determine items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 768) return 1;      // Mobile
    if (width < 1024) return 2;     // Tablet
    return 3;                        // Desktop
  };

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, resources.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };


  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-on-surface tracking-tight">Continue Reading</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex  transition-all duration-500"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className="flex-shrink-0"
              style={{
                width: `${100 / itemsPerPage}%`,
                padding: '0 12px',
                boxSizing: 'border-box',
              }}
            >
              <ResourceCard {...resource} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-gradient-to-r from-primary to-secondary'
                : 'w-1.5 bg-surface-container-high hover:bg-surface-container-highest'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
