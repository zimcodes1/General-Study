import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  onPrevious?: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  nextLabel?: string;
}

export default function NavigationControls({
  onPrevious,
  onNext,
  hasPrevious,
  nextLabel = 'Next',
}: NavigationControlsProps) {
  return (
    <div className="sticky bottom-0 bg-surface-container-low/80 backdrop-blur-[40px] border-t border-outline-variant/15 px-4 lg:px-8 py-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        {hasPrevious && onPrevious ? (
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-8 py-3 text-on-surface font-jakarta"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 text-on-surface font-semibold font-jakarta ml-auto"
        >
          {nextLabel}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
