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

export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface Resource {
  id: string;
  title: string;
  course_code: string;
  course_name: string;
  faculty_name: string;
  department_name: string | null;
  level: string;
  file_type: string;
  status: string;
  rating_avg: number;
  rating_count: number;
  uploaded_by: User;
  created_at: string;
}

export interface ResourceListResponse {
  count: number;
  limit: number;
  offset: number;
  results: Resource[];
}

export interface Progress {
  id: string;
  resource_id: string;
  resource_title: string;
  resource_file_type: string;
  resource_course_code: string;
  resource_faculty_name: string;
  completion_percent: number;
  updated_at: string;
}

export interface ProgressListResponse {
  count: number;
  limit: number;
  offset: number;
  results: Progress[];
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

  updateProfile: async (data: any, accessToken: string): Promise<AuthResponse['user']> => {
    const response = await fetch(`${API_BASE_URL}/users/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Profile update failed');
    }

    return response.json();
  },
};

export const resourceAPI = {
  getResources: async (
    limit: number = 9,
    offset: number = 0,
    filterType?: 'bookmarks' | 'uploads'
  ): Promise<ResourceListResponse> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Unauthorized');
    }

    let url = `${API_BASE_URL}/resources/`;

    // Use different endpoints based on filter type
    if (filterType === 'bookmarks') {
      url = `${API_BASE_URL}/resources/bookmarks/`;
    } else if (filterType === 'uploads') {
      url = `${API_BASE_URL}/resources/?uploaded_by=me`;
    }

    // Add pagination params if not already in URL
    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}limit=${limit}&offset=${offset}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }

    return response.json();
  },

  getResourceStatus: async (resourceId: string): Promise<any> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/status/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resource status');
    }

    return response.json();
  },

  bookmarkResource: async (resourceId: string): Promise<void> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/bookmark/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to bookmark resource');
    }
  },

  removeBookmark: async (resourceId: string): Promise<void> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/bookmark/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove bookmark');
    }
  },
};

export const progressAPI = {
  getRecentReadings: async (limit: number = 10, offset: number = 0): Promise<ProgressListResponse> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(
      `${API_BASE_URL}/progress/?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recent readings');
    }

    return response.json();
  },
};
