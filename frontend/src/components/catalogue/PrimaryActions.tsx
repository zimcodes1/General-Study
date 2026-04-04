import { BookOpen, Download, FileQuestion, Award } from 'lucide-react';

interface PrimaryActionsProps {
  onContinueLearning: () => void;
  onDownload: () => void;
  onTakeQuiz: () => void;
  onTakeExam: () => void;
}

export default function PrimaryActions({
  onContinueLearning,
  onDownload,
  onTakeQuiz,
  onTakeExam,
}: PrimaryActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <button
        onClick={onContinueLearning}
        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-2xl hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all font-jakarta"
      >
        <BookOpen className="w-5 h-5" />
        Continue Learning
      </button>

      <button
        onClick={onDownload}
        className="flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-low border border-outline-variant/10 text-on-surface font-semibold rounded-2xl hover:bg-surface-container transition-all font-jakarta"
      >
        <Download className="w-5 h-5" />
        Download
      </button>

      <button
        onClick={onTakeQuiz}
        className="flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-low border border-outline-variant/10 text-on-surface font-semibold rounded-2xl hover:bg-surface-container transition-all font-jakarta"
      >
        <FileQuestion className="w-5 h-5" />
        Take Quiz
      </button>

      <button
        onClick={onTakeExam}
        className="flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-low border border-outline-variant/10 text-on-surface font-semibold rounded-2xl hover:bg-surface-container transition-all font-jakarta"
      >
        <Award className="w-5 h-5" />
        Full Exam
      </button>
    </div>
  );
}
