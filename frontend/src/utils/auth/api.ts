const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Faculty {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  faculty_id: string;
  faculty_name: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  school: string;
  faculty_id: string;
  department_id: string;
  degree_level: string;
  current_level: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    school: string;
    faculty: Faculty;
    department: Department;
    degree_level: string;
    current_level: string;
    courses: string[];
    points: number;
    streak: number;
    last_active_date: string | null;
    created_at: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  getFaculties: async (): Promise<Faculty[]> => {
    const response = await fetch(`${API_BASE_URL}/users/faculties/`);
    if (!response.ok) {
      throw new Error('Failed to fetch faculties');
    }
    return response.json();
  },

  getDepartments: async (facultyId?: string): Promise<Department[]> => {
    const url = facultyId 
      ? `${API_BASE_URL}/users/departments/?faculty_id=${facultyId}`
      : `${API_BASE_URL}/users/departments/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }
    return response.json();
  },
};
