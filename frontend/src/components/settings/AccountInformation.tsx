import { User, Mail, Phone, MapPin, Building2, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, authAPI, type Faculty, type Department } from '../../utils/auth';

interface AccountInformationProps {
  onChange: (data: any) => void;
}

export default function AccountInformation({ onChange }: AccountInformationProps) {
  const [user, setUser] = useState<any>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    school: '',
    faculty_id: '',
    department_id: '',
    degree_level: '',
    current_level: '',
  });

  useEffect(() => {
    const userData = auth.getUser();
    setUser(userData);
    if (userData) {
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        school: userData.school || '',
        faculty_id: userData.faculty?.id || '',
        department_id: userData.department?.id || '',
        degree_level: userData.degree_level || '',
        current_level: userData.current_level || '',
      });
      if (userData.faculty?.id) {
        loadDepartments(userData.faculty.id);
      }
    }
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      const data = await authAPI.getFaculties();
      setFaculties(data);
    } catch (err) {
      console.error('Failed to load faculties:', err);
    }
  };

  const loadDepartments = async (facultyId: string) => {
    setLoadingDepartments(true);
    try {
      const data = await authAPI.getDepartments(facultyId);
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const updatedData = { ...formData, [name]: value };
    
    if (name === 'faculty_id' && value) {
      updatedData.department_id = '';
      setFormData(updatedData);
      setDepartments([]);
      loadDepartments(value);
    } else {
      setFormData(updatedData);
    }
    
    onChange(updatedData);
  };

  return (
    <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface mb-1">Account Information</h2>
        <p className="text-sm text-on-surface-variant">Update your personal details</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface-variant focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              School
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Faculty
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <select
                name="faculty_id"
                value={formData.faculty_id}
                onChange={handleChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Department
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                disabled={!formData.faculty_id || loadingDepartments}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingDepartments ? 'Loading...' : 'Select Department'}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Degree Level
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <select
                name="degree_level"
                value={formData.degree_level}
                onChange={handleChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              >
                <option value="">Select Degree Level</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-jakarta">
              Current Level
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <select
                name="current_level"
                value={formData.current_level}
                onChange={handleChange}
                className="w-full bg-surface-container rounded-xl pl-12 pr-4 py-3 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all border border-outline-variant/10"
              >
                <option value="">Select Current Level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
                <option value="600">600 Level</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
