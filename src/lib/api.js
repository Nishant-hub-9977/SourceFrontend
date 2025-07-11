// Complete API client for RecruitAI - FIXED LOGIN VERSION
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
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log(`Making ${config.method || 'GET'} request to:`, url);
      
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
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
            errorMessage = data.detail.map(err => err.msg || err.message || 'Field required').join(', ');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else {
            errorMessage = data.detail.message || 'Field required';
          }
        } else if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        }

        throw new APIError(errorMessage, response.status, data);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      throw new APIError(
        error.message || 'Network error occurred',
        0,
        null
      );
    }
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email || credentials.username_or_email, // FIXED: Use 'email' field
          password: credentials.password
        })
      });

      if (response.access_token) {
        this.token = response.access_token;
        localStorage.setItem('auth_token', this.token);
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
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          first_name: userData.first_name || userData.firstName,
          last_name: userData.last_name || userData.lastName
        })
      });

      if (response.access_token) {
        this.token = response.access_token;
        localStorage.setItem('auth_token', this.token);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return { success: true };
  }

  // Dashboard methods
  async getDashboardOverview() {
    return this.request('/api/dashboard/overview');
  }

  async getDashboardStats() {
    return this.request('/api/dashboard/stats');
  }

  // Job methods
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/jobs?${queryString}` : '/api/jobs';
    return this.request(endpoint);
  }

  async getJob(jobId) {
    return this.request(`/api/jobs/${jobId}`);
  }

  async createJob(jobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  async updateJob(jobId, jobData) {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData)
    });
  }

  async deleteJob(jobId) {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'DELETE'
    });
  }

  async getJobApplications(jobId) {
    return this.request(`/api/jobs/${jobId}/applications`);
  }

  // Resume methods
  async getResumes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/resumes?${queryString}` : '/api/resumes';
    return this.request(endpoint);
  }

  async getResume(resumeId) {
    return this.request(`/api/resumes/${resumeId}`);
  }

  async uploadResume(file, metadata = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    return this.request('/api/resumes/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      body: formData
    });
  }

  async bulkUploadResumes(files, metadata = {}) {
    const formData = new FormData();
    
    // Add multiple files
    files.forEach((file, index) => {
      formData.append('files', file);
    });
    
    // Add metadata
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    return this.request('/api/resumes/bulk-upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      body: formData
    });
  }

  async deleteResume(resumeId) {
    return this.request(`/api/resumes/${resumeId}`, {
      method: 'DELETE'
    });
  }

  async getResumeMatches(resumeId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `/api/resumes/${resumeId}/matches?${queryString}` : 
      `/api/resumes/${resumeId}/matches`;
    return this.request(endpoint);
  }

  async reprocessResume(resumeId) {
    return this.request(`/api/resumes/${resumeId}/reprocess`, {
      method: 'POST'
    });
  }

  // Search methods
  async searchCandidates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/search?${queryString}` : '/api/search';
    return this.request(endpoint);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  async getApiStatus() {
    return this.request('/api/status');
  }
}

// Create API client instance
const apiClient = new APIClient();

// Export individual API modules for better organization
export const auth = {
  login: (credentials) => apiClient.login(credentials),
  register: (userData) => apiClient.register(userData),
  logout: () => apiClient.logout()
};

export const dashboard = {
  getOverview: () => apiClient.getDashboardOverview(),
  getStats: () => apiClient.getDashboardStats()
};

export const jobs = {
  getAll: (params) => apiClient.getJobs(params),
  getById: (id) => apiClient.getJob(id),
  create: (data) => apiClient.createJob(data),
  update: (id, data) => apiClient.updateJob(id, data),
  delete: (id) => apiClient.deleteJob(id),
  getApplications: (id) => apiClient.getJobApplications(id)
};

export const resumes = {
  getAll: (params) => apiClient.getResumes(params),
  getById: (id) => apiClient.getResume(id),
  upload: (file, metadata) => apiClient.uploadResume(file, metadata),
  bulkUpload: (files, metadata) => apiClient.bulkUploadResumes(files, metadata),
  delete: (id) => apiClient.deleteResume(id),
  getMatches: (id, params) => apiClient.getResumeMatches(id, params),
  reprocess: (id) => apiClient.reprocessResume(id)
};

export const search = {
  candidates: (params) => apiClient.searchCandidates(params)
};

export const health = {
  check: () => apiClient.healthCheck(),
  status: () => apiClient.getApiStatus()
};

// Export the main client for direct access if needed
export default apiClient;

