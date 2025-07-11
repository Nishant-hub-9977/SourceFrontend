// Complete API client for RecruitAI frontend
// File: src/lib/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cleanfilesbackend.onrender.com';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    // Handle FormData (for file uploads)
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    console.log(`Making ${config.method || 'GET'} request to: ${url}`);

    try {
      const response = await fetch(url, config);
      console.log(`Response status: ${response.status}`);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Response data:', data);

      if (!response.ok) {
        let errorMessage = 'Request failed';
        
        if (typeof data === 'object' && data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map(err => err.msg || err.message || err).join(', ');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (typeof data.detail === 'object') {
            errorMessage = data.detail.message || JSON.stringify(data.detail);
          }
        } else if (typeof data === 'object' && data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }

        throw new APIError(errorMessage, response.status, data);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new APIError('Network error - please check your connection', 0, null);
      }
      
      throw new APIError(error.message || 'Unknown error occurred', 0, null);
    }
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.access_token) {
        this.setToken(response.access_token);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.access_token) {
        this.setToken(response.access_token);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    this.setToken(null);
    return { success: true };
  }

  // Jobs methods
  async getJobs(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/jobs${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async getJob(jobId) {
    return this.request(`/api/jobs/${jobId}`);
  }

  async createJob(jobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId, jobData) {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId) {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getJobApplications(jobId) {
    return this.request(`/api/jobs/${jobId}/applications`);
  }

  // Resumes methods
  async getResumes(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/resumes${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async getResume(resumeId) {
    return this.request(`/api/resumes/${resumeId}`);
  }

  async uploadResume(file, jobId = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (jobId) {
      formData.append('job_id', jobId);
    }

    return this.request('/api/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async bulkUploadResumes(files, jobId = null) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    if (jobId) {
      formData.append('job_id', jobId);
    }

    return this.request('/api/resumes/bulk-upload', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteResume(resumeId) {
    return this.request(`/api/resumes/${resumeId}`, {
      method: 'DELETE',
    });
  }

  async getResumeMatches(resumeId) {
    return this.request(`/api/resumes/${resumeId}/matches`);
  }

  async reprocessResume(resumeId) {
    return this.request(`/api/resumes/${resumeId}/reprocess`, {
      method: 'POST',
    });
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request('/api/dashboard/stats');
  }

  async getDashboardOverview() {
    return this.request('/api/dashboard/overview');
  }

  // Search methods
  async searchCandidates(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/search${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  // Health check methods
  async getHealth() {
    return this.request('/health');
  }

  async getStatus() {
    return this.request('/api/status');
  }
}

// Create and export API instance
const api = new APIClient();

// Export individual methods for convenience
export const auth = {
  login: (credentials) => api.login(credentials),
  register: (userData) => api.register(userData),
  logout: () => api.logout(),
};

export const jobs = {
  getAll: (params) => api.getJobs(params),
  getById: (id) => api.getJob(id),
  create: (data) => api.createJob(data),
  update: (id, data) => api.updateJob(id, data),
  delete: (id) => api.deleteJob(id),
  getApplications: (id) => api.getJobApplications(id),
};

export const resumes = {
  getAll: (params) => api.getResumes(params),
  getById: (id) => api.getResume(id),
  upload: (file, jobId) => api.uploadResume(file, jobId),
  bulkUpload: (files, jobId) => api.bulkUploadResumes(files, jobId),
  delete: (id) => api.deleteResume(id),
  getMatches: (id) => api.getResumeMatches(id),
  reprocess: (id) => api.reprocessResume(id),
};

export const dashboard = {
  getStats: () => api.getDashboardStats(),
  getOverview: () => api.getDashboardOverview(),
};

export const search = {
  candidates: (params) => api.searchCandidates(params),
};

export const system = {
  health: () => api.getHealth(),
  status: () => api.getStatus(),
};

// Export the main API client
export default api;

