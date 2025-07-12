// Complete API client for RecruitAI Frontend
// File: src/lib/api.js
// Version: 2.0.0 - Production Ready

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cleanfilesbackend.onrender.com';

// Enhanced logging for development
const isDevelopment = import.meta.env.DEV;
const log = (message, data = null) => {
  if (isDevelopment) {
    console.log(`[API] ${message}`, data || '');
  }
};

const logError = (message, error = null) => {
  console.error(`[API Error] ${message}`, error || '');
};

// Token management
class TokenManager {
  static getToken() {
    return localStorage.getItem('auth_token');
  }

  static setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  static getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  static setRefreshToken(token) {
    localStorage.setItem('refresh_token', token);
  }

  static clearTokens() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  static getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  static setUserData(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }
}

// Enhanced API client class
class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Enhanced request method with retry logic and better error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();
    
    const config = {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Handle FormData (for file uploads)
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    log(`${config.method} ${endpoint}`, config.body ? 'with body' : '');

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request with new token
            return this.request(endpoint, options);
          } else {
            // Refresh failed, redirect to login
            TokenManager.clearTokens();
            window.location.href = '/login';
            throw new Error('Authentication failed');
          }
        }

        // Handle other HTTP errors
        const errorMessage = data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`;
        logError(`Request failed: ${config.method} ${endpoint}`, { status: response.status, data });
        throw new Error(errorMessage);
      }

      log(`${config.method} ${endpoint} - Success`, data);
      return data;

    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        logError('Network error - server may be down', error);
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      
      logError(`Request error: ${config.method} ${endpoint}`, error);
      throw error;
    }
  }

  // Token refresh method
  async refreshToken() {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        TokenManager.setToken(data.access_token);
        if (data.refresh_token) {
          TokenManager.setRefreshToken(data.refresh_token);
        }
        log('Token refreshed successfully');
        return true;
      }
    } catch (error) {
      logError('Token refresh failed', error);
    }

    return false;
  }

  // GET request helper
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request helper
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // PUT request helper
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // DELETE request helper
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new APIClient();

// Authentication API
export const auth = {
  // Login with enhanced error handling
  async login(credentials) {
    try {
      log('Attempting login', { email: credentials.email });
      
      const response = await apiClient.post('/api/auth/login', {
        email: credentials.email || credentials.username_or_email, // Support both field names
        password: credentials.password,
      });

      if (response.access_token) {
        TokenManager.setToken(response.access_token);
        if (response.refresh_token) {
          TokenManager.setRefreshToken(response.refresh_token);
        }
        if (response.user) {
          TokenManager.setUserData(response.user);
        }
        log('Login successful', { user: response.user?.email });
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      logError('Login failed', error);
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      log('Attempting registration', { email: userData.email });
      
      const response = await apiClient.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name || userData.name,
        role: userData.role || 'candidate',
      });

      if (response.access_token) {
        TokenManager.setToken(response.access_token);
        if (response.refresh_token) {
          TokenManager.setRefreshToken(response.refresh_token);
        }
        if (response.user) {
          TokenManager.setUserData(response.user);
        }
        log('Registration successful', { user: response.user?.email });
        return response;
      }

      return response;
    } catch (error) {
      logError('Registration failed', error);
      throw error;
    }
  },

  // Get current user info
  async me() {
    try {
      const response = await apiClient.get('/api/auth/me');
      if (response.user) {
        TokenManager.setUserData(response.user);
      }
      return response;
    } catch (error) {
      logError('Failed to get user info', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      // Try to call logout endpoint
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if server call fails
      logError('Logout endpoint failed, continuing with local logout', error);
    } finally {
      TokenManager.clearTokens();
      log('Logout completed');
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!TokenManager.getToken();
  },

  // Get current user data
  getCurrentUser() {
    return TokenManager.getUserData();
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      log('Password changed successfully');
      return response;
    } catch (error) {
      logError('Password change failed', error);
      throw error;
    }
  },

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/api/auth/request-password-reset', {
        email: email,
      });
      log('Password reset requested', { email });
      return response;
    } catch (error) {
      logError('Password reset request failed', error);
      throw error;
    }
  },
};

// Jobs API
export const jobs = {
  // Get all jobs with filtering
  async getAll(params = {}) {
    try {
      log('Fetching jobs', params);
      const response = await apiClient.get('/api/jobs/', params);
      return response;
    } catch (error) {
      logError('Failed to fetch jobs', error);
      throw error;
    }
  },

  // Get single job by ID
  async getById(jobId) {
    try {
      log('Fetching job', { jobId });
      const response = await apiClient.get(`/api/jobs/${jobId}`);
      return response;
    } catch (error) {
      logError('Failed to fetch job', error);
      throw error;
    }
  },

  // Create new job
  async create(jobData) {
    try {
      log('Creating job', { title: jobData.title });
      
      // Prepare form data
      const formData = new FormData();
      Object.keys(jobData).forEach(key => {
        if (jobData[key] !== null && jobData[key] !== undefined) {
          if (Array.isArray(jobData[key])) {
            formData.append(key, jobData[key].join(', '));
          } else {
            formData.append(key, jobData[key]);
          }
        }
      });

      const response = await apiClient.post('/api/jobs/', formData);
      log('Job created successfully', { jobId: response.job?.id });
      return response;
    } catch (error) {
      logError('Failed to create job', error);
      throw error;
    }
  },

  // Update existing job
  async update(jobId, jobData) {
    try {
      log('Updating job', { jobId });
      
      // Prepare form data
      const formData = new FormData();
      Object.keys(jobData).forEach(key => {
        if (jobData[key] !== null && jobData[key] !== undefined) {
          if (Array.isArray(jobData[key])) {
            formData.append(key, jobData[key].join(', '));
          } else {
            formData.append(key, jobData[key]);
          }
        }
      });

      const response = await apiClient.put(`/api/jobs/${jobId}`, formData);
      log('Job updated successfully', { jobId });
      return response;
    } catch (error) {
      logError('Failed to update job', error);
      throw error;
    }
  },

  // Delete job
  async delete(jobId) {
    try {
      log('Deleting job', { jobId });
      const response = await apiClient.delete(`/api/jobs/${jobId}`);
      log('Job deleted successfully', { jobId });
      return response;
    } catch (error) {
      logError('Failed to delete job', error);
      throw error;
    }
  },

  // Get candidates for a job
  async getCandidates(jobId, params = {}) {
    try {
      log('Fetching job candidates', { jobId, params });
      const response = await apiClient.get(`/api/jobs/${jobId}/candidates`, params);
      return response;
    } catch (error) {
      logError('Failed to fetch job candidates', error);
      throw error;
    }
  },

  // Get job statistics
  async getStats() {
    try {
      log('Fetching job statistics');
      const response = await apiClient.get('/api/jobs/stats/overview');
      return response;
    } catch (error) {
      logError('Failed to fetch job statistics', error);
      throw error;
    }
  },

  // Search jobs
  async search(query, filters = {}) {
    try {
      log('Searching jobs', { query, filters });
      const params = {
        search: query,
        ...filters,
      };
      return this.getAll(params);
    } catch (error) {
      logError('Job search failed', error);
      throw error;
    }
  },
};

// Resumes API
export const resumes = {
  // Upload single resume
  async upload(file, candidateName = null) {
    try {
      log('Uploading resume', { filename: file.name, size: file.size });
      
      const formData = new FormData();
      formData.append('file', file);
      if (candidateName) {
        formData.append('candidate_name', candidateName);
      }

      const response = await apiClient.post('/api/resumes/upload', formData);
      log('Resume uploaded successfully', { resumeId: response.resume?.id });
      return response;
    } catch (error) {
      logError('Resume upload failed', error);
      throw error;
    }
  },

  // Bulk upload resumes
  async bulkUpload(files) {
    try {
      log('Bulk uploading resumes', { count: files.length });
      
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await apiClient.post('/api/resumes/bulk-upload', formData);
      log('Bulk upload completed', { 
        successful: response.summary?.successful_uploads,
        failed: response.summary?.failed_uploads 
      });
      return response;
    } catch (error) {
      logError('Bulk upload failed', error);
      throw error;
    }
  },

  // Get all resumes with filtering
  async getAll(params = {}) {
    try {
      log('Fetching resumes', params);
      const response = await apiClient.get('/api/resumes/', params);
      return response;
    } catch (error) {
      logError('Failed to fetch resumes', error);
      throw error;
    }
  },

  // Get single resume by ID
  async getById(resumeId) {
    try {
      log('Fetching resume', { resumeId });
      const response = await apiClient.get(`/api/resumes/${resumeId}`);
      return response;
    } catch (error) {
      logError('Failed to fetch resume', error);
      throw error;
    }
  },

  // Delete resume
  async delete(resumeId) {
    try {
      log('Deleting resume', { resumeId });
      const response = await apiClient.delete(`/api/resumes/${resumeId}`);
      log('Resume deleted successfully', { resumeId });
      return response;
    } catch (error) {
      logError('Failed to delete resume', error);
      throw error;
    }
  },

  // Match resumes to job description
  async matchToJob(jobDescription, params = {}) {
    try {
      log('Matching resumes to job', { descriptionLength: jobDescription.length });
      
      const response = await apiClient.post('/api/resumes/match', {
        job_description: jobDescription,
        ...params,
      });
      
      log('Resume matching completed', { 
        matches: response.total_matches,
        totalResumes: response.total_resumes 
      });
      return response;
    } catch (error) {
      logError('Resume matching failed', error);
      throw error;
    }
  },

  // Get matches for a specific resume
  async getMatches(resumeId, params = {}) {
    try {
      log('Fetching resume matches', { resumeId });
      const response = await apiClient.get(`/api/resumes/${resumeId}/matches`, params);
      return response;
    } catch (error) {
      logError('Failed to fetch resume matches', error);
      throw error;
    }
  },

  // Get resume statistics
  async getStats() {
    try {
      log('Fetching resume statistics');
      const response = await apiClient.get('/api/resumes/stats/overview');
      return response;
    } catch (error) {
      logError('Failed to fetch resume statistics', error);
      throw error;
    }
  },

  // Search resumes
  async search(query, filters = {}) {
    try {
      log('Searching resumes', { query, filters });
      const params = {
        search: query,
        ...filters,
      };
      return this.getAll(params);
    } catch (error) {
      logError('Resume search failed', error);
      throw error;
    }
  },
};

// System API
export const system = {
  // Get API health status
  async health() {
    try {
      const response = await apiClient.get('/health');
      return response;
    } catch (error) {
      logError('Health check failed', error);
      throw error;
    }
  },

  // Get API status and configuration
  async status() {
    try {
      const response = await apiClient.get('/api/status');
      return response;
    } catch (error) {
      logError('Status check failed', error);
      throw error;
    }
  },

  // Get demo information
  async demo() {
    try {
      const response = await apiClient.get('/api/demo');
      return response;
    } catch (error) {
      logError('Demo info failed', error);
      throw error;
    }
  },

  // Test API connectivity
  async ping() {
    try {
      const response = await apiClient.get('/');
      return response;
    } catch (error) {
      logError('Ping failed', error);
      throw error;
    }
  },
};

// Analytics API
export const analytics = {
  // Get dashboard overview
  async getDashboardOverview() {
    try {
      log('Fetching dashboard overview');
      
      // Fetch data from multiple endpoints
      const [jobStats, resumeStats, systemHealth] = await Promise.allSettled([
        jobs.getStats(),
        resumes.getStats(),
        system.health(),
      ]);

      const overview = {
        jobs: jobStats.status === 'fulfilled' ? jobStats.value : { total_jobs: 0, active_jobs: 0 },
        resumes: resumeStats.status === 'fulfilled' ? resumeStats.value : { total_resumes: 0 },
        system: systemHealth.status === 'fulfilled' ? systemHealth.value : { status: 'unknown' },
        timestamp: new Date().toISOString(),
      };

      log('Dashboard overview fetched', overview);
      return overview;
    } catch (error) {
      logError('Failed to fetch dashboard overview', error);
      throw error;
    }
  },

  // Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      log('Fetching recent activity', { limit });
      
      // This would typically fetch from a dedicated activity endpoint
      // For now, return sample data
      const activity = {
        recent_jobs: [],
        recent_resumes: [],
        recent_matches: [],
        timestamp: new Date().toISOString(),
      };

      return activity;
    } catch (error) {
      logError('Failed to fetch recent activity', error);
      throw error;
    }
  },
};

// Utility functions
export const utils = {
  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Format salary range
  formatSalary(min, max, currency = 'USD') {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `${formatter.format(min)}+`;
    } else if (max) {
      return `Up to ${formatter.format(max)}`;
    } else {
      return 'Salary not specified';
    }
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate file type
  isValidFileType(file, allowedTypes = ['pdf', 'docx', 'txt']) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
  },

  // Get file extension
  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  },

  // Debounce function for search
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// Error handling utilities
export const errorHandler = {
  // Parse API error
  parseError(error) {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    if (error.detail) {
      return error.detail;
    }
    
    return 'An unexpected error occurred';
  },

  // Check if error is network related
  isNetworkError(error) {
    return error.message && (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('connection')
    );
  },

  // Check if error is authentication related
  isAuthError(error) {
    return error.message && (
      error.message.includes('401') ||
      error.message.includes('unauthorized') ||
      error.message.includes('authentication')
    );
  },
};

// Export default API object
const api = {
  auth,
  jobs,
  resumes,
  system,
  analytics,
  utils,
  errorHandler,
  TokenManager,
};

export default api;

// Development helpers
if (isDevelopment) {
  window.recruitAI_API = api;
  log('API client initialized in development mode');
  log('Available at window.recruitAI_API for debugging');
}

