import { useState, useEffect } from 'react';
import { X, Upload, FileText, File, Image, FileSpreadsheet, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { authAPI, type Faculty, type Department } from '../../utils/auth';

interface ResourceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FileType = 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'txt' | 'image' | null;

const getFileTypeFromName = (filename: string): FileType => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'doc' || ext === 'docx') return 'doc';
  if (ext === 'ppt' || ext === 'pptx') return 'ppt';
  if (ext === 'txt') return 'txt';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
  return null;
};

const getFileIcon = (fileType: FileType) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="w-6 h-6" />;
    case 'doc':
    case 'docx':
      return <File className="w-6 h-6" />;
    case 'ppt':
    case 'pptx':
      return <FileSpreadsheet className="w-6 h-6" />;
    case 'image':
      return <Image className="w-6 h-6" />;
    case 'txt':
      return <FileText className="w-6 h-6" />;
    default:
      return <Upload className="w-6 h-6" />;
  }
};

const getFileColor = (fileType: FileType) => {
  switch (fileType) {
    case 'pdf':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'doc':
    case 'docx':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'ppt':
    case 'pptx':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'image':
      return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'txt':
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    default:
      return 'text-on-surface-variant bg-surface-container border-outline-variant/20';
  }
};

export default function ResourceUploadModal({ isOpen, onClose }: ResourceUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'processing'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    course_code: '',
    course_name: '',
    faculty_id: '',
    department_id: '',
    level: '',
    attribution: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadFaculties();
    }
  }, [isOpen]);

  const loadFaculties = async () => {
    try {
      console.log('Fetching faculties...');
      const data = await authAPI.getFaculties();
      console.log('Faculties loaded:', data);
      setFaculties(data);
    } catch (err) {
      console.error('Failed to load faculties:', err);
    }
  };

  const loadDepartments = async (facultyId: string) => {
    setLoadingDepartments(true);
    try {
      console.log('Fetching departments for faculty:', facultyId);
      const data = await authAPI.getDepartments(facultyId);
      console.log('Departments loaded:', data);
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const type = getFileTypeFromName(file.name);
      setFileType(type);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'faculty_id' && value) {
      setFormData({ ...formData, faculty_id: value, department_id: '' });
      setDepartments([]);
      loadDepartments(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate upload and processing
    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log('Upload complete', { formData, selectedFile });
      // Reset and close after processing
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    setStep('upload');
    setSelectedFile(null);
    setFileType(null);
    setFormData({
      title: '',
      course_code: '',
      course_name: '',
      faculty_id: '',
      department_id: '',
      level: '',
      attribution: '',
    });
    setDepartments([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-low rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-outline-variant/20 shadow-2xl">
        {step === 'upload' ? (
          <>
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Upload Resource</h2>
                <p className="text-sm text-on-surface-variant mt-1">Share your study materials with others</p>
              </div>
              <button
                onClick={handleClose}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-5">
                {/* File Upload */}
                <div>
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-3 font-jakarta">
                    Select File *
                  </label>
                  <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
                    selectedFile 
                      ? getFileColor(fileType) 
                      : 'border-outline-variant/30 hover:border-outline-variant/50'
                  }`}>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedFile ? getFileColor(fileType) : 'bg-surface-container'
                      }`}>
                        {getFileIcon(fileType)}
                      </div>
                      {selectedFile ? (
                        <>
                          <p className="text-on-surface font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-on-surface font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-on-surface-variant">
                            PDF, DOC, PPT, TXT, or Images (Max 50MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Python Programming"
                    required
                    className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                  />
                </div>

                {/* Course Code & Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleChange}
                      placeholder="e.g., CSC 301"
                      required
                      className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleChange}
                      placeholder="e.g., Data Structures"
                      required
                      className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                    />
                  </div>
                </div>

                {/* Faculty & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                      Faculty *
                    </label>
                    <select
                      name="faculty_id"
                      value={formData.faculty_id}
                      onChange={handleChange}
                      required
                      className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                      Department (Optional)
                    </label>
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      disabled={!formData.faculty_id || loadingDepartments}
                      className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loadingDepartments ? 'Loading...' : 'General (All Departments)'}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                    Academic Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
                  >
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="600">600 Level</option>
                  </select>
                </div>

                {/* Attribution */}
                <div>
                  <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
                    Attribution (Optional)
                  </label>
                  <textarea
                    name="attribution"
                    value={formData.attribution}
                    onChange={handleChange}
                    placeholder="Credit the original author or source if applicable"
                    rows={3}
                    className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-surface-container text-on-surface rounded-full hover:bg-surface-container-high transition-all font-jakarta"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 font-jakarta disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  Upload Resource
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center min-h-[500px]">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-on-primary-fixed" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-tertiary flex items-center justify-center animate-bounce">
                <Loader2 className="w-5 h-5 text-on-primary-fixed animate-spin" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-on-surface mb-2">Processing Your Resource</h3>
            <p className="text-on-surface-variant text-center mb-8 max-w-md">
              We're uploading your file and generating an AI-powered learning catalogue. This may take a moment...
            </p>

            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-on-surface">File uploaded successfully</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
                <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                <span className="text-on-surface">Generating learning catalogue...</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl opacity-50">
                <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex-shrink-0" />
                <span className="text-on-surface-variant">Creating quiz questions</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
