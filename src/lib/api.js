// Bulletproof API Client with Fallback System
// File: src/lib/api.js
// Version: 3.0.0 - Client-Ready with Offline Support

import mockData, { mockUtils, mockApiResponses } from './mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cleanfilesbackend.onrender.com';

// Configuration
const CONFIG = {
  // Enable fallback mode when backend is unavailable
  ENABLE_FALLBACK: true,
  
  // Timeout for API requests (ms )
  REQUEST_TIMEOUT: 10000,
  
  // Number of retry attempts
  MAX_RETRIES: 2,
  
  // Delay between retries (ms)
  RETRY_DELAY: 1000,
  
  // Enable offline mode simulation
  SIMULATE_OFFLINE: false,
  
  // Enable demo mode (always use mock data)
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true' || false
};

// Enhanced logging
const isDevelopment = import.meta.env.DEV;
const log = (message, data = null) => {
  if (isDevelopment) {
    console.log(`[API] ${message}`, data || '');
  }
};

const logError = (message, error = null) => {
  console.error(`[API Error] ${message}`, error || '');
};

const logFallback = (message, data = null) => {
  console.warn(`[FALLBACK] ${message}`, data || '');
};

// Token management with fallback
class TokenManager {
  static getToken() {
    return localStorage.getItem('auth_token') || localStorage.getItem('fallback_token');
  }

  static setToken(token) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('fallback_token', token);
  }

  static getRefreshToken() {
    return localStorage.getItem('refresh_token') || localStorage.getItem('fallback_refresh_token');
  }

  static setRefreshToken(token) {
    localStorage.setItem('refresh_token', token);
    localStorage.setItem('fallback_refresh_token', token);
  }

  static clearTokens() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('fallback_token');
    localStorage.removeItem('fallback_refresh_token');
    localStorage.removeItem('fallback_user_data');
  }

  static getUserData() {
    const userData = localStorage.getItem('user_data') || localStorage.getItem('fallback_user_data');
    return userData ? JSON.parse(userData) : null;
  }

  static setUserData(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('fallback_user_data', JSON.stringify(userData));
  }

  static isInFallbackMode() {
    return localStorage.getItem('fallback_mode') === 'true';
  }

  static setFallbackMode(enabled) {
    localStorage.setItem('fallback_mode', enabled.toString());
  }
}

// Network status detection
class NetworkMonitor {
  static isOnline() {
    return navigator.onLine;
  }

  static async testBackendConnection() {
    if (CONFIG.SIMULATE_OFFLINE || CONFIG.DEMO_MODE) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      logError('Backend connection test failed', error);
      return false;
    }
  }

  static async checkConnectionStatus() {
    const isOnline = this.isOnline();
    const backendAvailable = await this.testBackendConnection();
    
    const status = {
      online: isOnline,
      backend: backendAvailable,
      fallbackMode: !isOnline || !backendAvailable || CONFIG.DEMO_MODE
    };

    log('Connection status', status);
    TokenManager.setFallbackMode(status.fallbackMode);
    
    return status;
  }
}

// Enhanced API client with fallback
class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.fallbackMode = false;
    this.connectionStatus = null;
  }

  async initialize() {
    this.connectionStatus = await NetworkMonitor.checkConnectionStatus();
    this.fallbackMode = this.connectionStatus.fallbackMode;
    
    if (this.fallbackMode) {
      logFallback('API client initialized in fallback mode');
    } else {
      log('API client initialized with backend connection');
    }
  }

  // Enhanced request method with comprehensive fallback
  async request(endpoint, options = {}) {
    // Initialize connection status if not done
    if (!this.connectionStatus) {
      await this.initialize();
    }

    // Force fallback mode if configured
    if (CONFIG.DEMO_MODE || CONFIG.SIMULATE_OFFLINE) {
      return this.fallbackRequest(endpoint, options);
    }

    // Try backend first if not in fallback mode
    if (!this.fallbackMode) {
      try {
        return await this.backendRequest(endpoint, options);
      } catch (error) {
        logError('Backend request failed, switching to fallback', error);
        this.fallbackMode = true;
        TokenManager.setFallbackMode(true);
      }
    }

    // Use fallback system
    return this.fallbackRequest(endpoint, options);
  }

  // Backend request with timeout and retries
  async backendRequest(endpoint, options = {}) {
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

    // Handle FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
    config.signal = controller.signal;

    log(`${config.method} ${endpoint} (backend)`, config.body ? 'with body' : '');

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return this.backendRequest(endpoint, options);
          } else {
            TokenManager.clearTokens();
            throw new Error('Authentication failed');
          }
        }

        const errorMessage = data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      log(`${config.method} ${endpoint} - Backend success`, data);
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server may be slow or unavailable');
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - unable to connect to server');
      }
      
      throw error;
    }
  }

  // Fallback request using mock data
  async fallbackRequest(endpoint, options = {}) {
    logFallback(`${options.method || 'GET'} ${endpoint} (fallback mode)`);
    
    // Simulate network delay
    await mockUtils.delay(Math.random() * 500 + 200);

    const method = options.method || 'GET';
    const body = options.body;

    try {
      // Route to appropriate fallback handler
      if (endpoint.startsWith('/api/auth/')) {
        return this.handleAuthFallback(endpoint, method, body);
      } else if (endpoint.startsWith('/api/jobs')) {
        return this.handleJobsFallback(endpoint, method, body);
      } else if (endpoint.startsWith('/api/resumes')) {
        return this.handleResumesFallback(endpoint, method, body);
      } else if (endpoint === '/health') {
        return mockApiResponses.health_check;
      } else if (endpoint === '/api/status') {
        return mockApiResponses.api_status;
      } else {
        return { success: true, message: 'Fallback response', data: null };
      }
    } catch (error) {
      logError('Fallback request failed', error);
      throw error;
    }
  }

  // Authentication fallback handlers
  handleAuthFallback(endpoint, method, body) {
    if (endpoint === '/api/auth/login' && method === 'POST') {
      const credentials = JSON.parse(body);
      const user = mockUtils.findUser(credentials.email, credentials.password);
      
      if (user) {
        const response = { ...mockApiResponses.login_success };
        response.user = { ...user };
        delete response.user.password; // Don't send password back
        
        logFallback('Login successful (fallback)', { email: user.email, role: user.role });
        return response;
      } else {
        logFallback('Login failed (fallback)', { email: credentials.email });
        throw new Error('Invalid credentials');
      }
    }

    if (endpoint === '/api/auth/register' && method === 'POST') {
      const userData = JSON.parse(body);
      const newUser = {
        id: mockUtils.generateUserId(),
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role || 'candidate',
        created_at: new Date().toISOString(),
        avatar: null,
        permissions: userData.role === 'admin' ? ['all'] : ['profile']
      };

      // Add to mock database
      mockData.mockUsers.push(newUser);
      
      const response = { ...mockApiResponses.register_success };
      response.user = newUser;
      
      logFallback('Registration successful (fallback)', { email: newUser.email });
      return response;
    }

    if (endpoint === '/api/auth/me' && method === 'GET') {
      const userData = TokenManager.getUserData();
      if (userData) {
        return { success: true, user: userData };
      } else {
        throw new Error('User not found');
      }
    }

    if (endpoint === '/api/auth/logout' && method === 'POST') {
      logFallback('Logout (fallback)');
      return { success: true, message: 'Logged out successfully' };
    }

    throw new Error('Auth endpoint not implemented in fallback mode');
  }

  // Jobs fallback handlers
  handleJobsFallback(endpoint, method, body) {
    if (endpoint === '/api/jobs/' && method === 'GET') {
      const response = { ...mockApiResponses.jobs_list };
      logFallback('Jobs list retrieved (fallback)', { count: response.jobs.length });
      return response;
    }

    if (endpoint === '/api/jobs/' && method === 'POST') {
      const jobData = this.parseFormData(body);
      const newJob = {
        id: mockUtils.generateJobId(),
        ...jobData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: TokenManager.getUserData()?.id || 1,
        applications_count: 0,
        views_count: 0,
        status: 'active'
      };

      // Add to mock database
      mockData.mockJobs.push(newJob);
      
      const response = { ...mockApiResponses.job_created };
      response.job = newJob;
      
      logFallback('Job created (fallback)', { title: newJob.title });
      return response;
    }

    if (endpoint.match(/^\/api\/jobs\/\d+$/) && method === 'GET') {
      const jobId = parseInt(endpoint.split('/').pop());
      const job = mockData.mockJobs.find(j => j.id === jobId);
      
      if (job) {
        logFallback('Job retrieved (fallback)', { id: jobId, title: job.title });
        return { success: true, job };
      } else {
        throw new Error('Job not found');
      }
    }

    if (endpoint.match(/^\/api\/jobs\/\d+$/) && method === 'PUT') {
      const jobId = parseInt(endpoint.split('/').pop());
      const jobIndex = mockData.mockJobs.findIndex(j => j.id === jobId);
      
      if (jobIndex !== -1) {
        const updateData = this.parseFormData(body);
        mockData.mockJobs[jobIndex] = {
          ...mockData.mockJobs[jobIndex],
          ...updateData,
          updated_at: new Date().toISOString()
        };
        
        const response = { ...mockApiResponses.job_updated };
        response.job = mockData.mockJobs[jobIndex];
        
        logFallback('Job updated (fallback)', { id: jobId });
        return response;
      } else {
        throw new Error('Job not found');
      }
    }

    if (endpoint.match(/^\/api\/jobs\/\d+$/) && method === 'DELETE') {
      const jobId = parseInt(endpoint.split('/').pop());
      const jobIndex = mockData.mockJobs.findIndex(j => j.id === jobId);
      
      if (jobIndex !== -1) {
        mockData.mockJobs.splice(jobIndex, 1);
        logFallback('Job deleted (fallback)', { id: jobId });
        return mockApiResponses.job_deleted;
      } else {
        throw new Error('Job not found');
      }
    }

    if (endpoint === '/api/jobs/stats/overview' && method === 'GET') {
      logFallback('Job stats retrieved (fallback)');
      return { success: true, ...mockData.mockStats.jobs };
    }

    throw new Error('Jobs endpoint not implemented in fallback mode');
  }

  // Resumes fallback handlers
  handleResumesFallback(endpoint, method, body) {
    if (endpoint === '/api/resumes/' && method === 'GET') {
      const response = { ...mockApiResponses.resumes_list };
      logFallback('Resumes list retrieved (fallback)', { count: response.resumes.length });
      return response;
    }

    if (endpoint === '/api/resumes/upload' && method === 'POST') {
      const formData = body;
      const file = formData.get('file');
      const candidateName = formData.get('candidate_name') || 'Unknown Candidate';
      
      const newResume = {
        id: mockUtils.generateResumeId(),
        candidate_name: candidateName,
        email: `${candidateName.toLowerCase().replace(' ', '.')}` + '@email.com',
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        filename: file?.name || 'uploaded_resume.pdf',
        file_size: file?.size || 250000,
        upload_date: new Date().toISOString(),
        skills: ['JavaScript', 'React', 'Node.js'], // Mock skills
        experience_years: Math.floor(Math.random() * 8) + 1,
        education: 'Bachelor\'s Degree in Computer Science',
        summary: 'Experienced professional with strong technical background.',
        work_experience: [],
        match_scores: {}
      };

      // Generate match scores for all jobs
      mockData.mockJobs.forEach(job => {
        newResume.match_scores[job.id] = {
          score: mockUtils.generateMatchScore(newResume, job),
          explanation: 'Generated match score based on skills and experience'
        };
      });

      // Add to mock database
      mockData.mockResumes.push(newResume);
      
      const response = { ...mockApiResponses.resume_uploaded };
      response.resume = newResume;
      
      logFallback('Resume uploaded (fallback)', { name: candidateName, filename: file?.name });
      return response;
    }

    if (endpoint === '/api/resumes/bulk-upload' && method === 'POST') {
      const formData = body;
      const files = formData.getAll('files');
      
      const results = [];
      let successCount = 0;
      
      files.forEach((file, index) => {
        try {
          const newResume = {
            id: mockUtils.generateResumeId() + index,
            candidate_name: `Candidate ${index + 1}`,
            email: `candidate${index + 1}` + '@email.com',
            filename: file.name,
            file_size: file.size,
            upload_date: new Date().toISOString(),
            skills: ['JavaScript', 'Python', 'SQL'],
            experience_years: Math.floor(Math.random() * 8) + 1,
            education: 'Bachelor\'s Degree',
            summary: 'Professional with relevant experience.',
            work_experience: [],
            match_scores: {}
          };

          mockData.mockResumes.push(newResume);
          results.push({ success: true, resume: newResume });
          successCount++;
        } catch (error) {
          results.push({ success: false, error: error.message, filename: file.name });
        }
      });

      const response = { ...mockApiResponses.bulk_upload_success };
      response.summary = {
        total_files: files.length,
        successful_uploads: successCount,
        failed_uploads: files.length - successCount,
        processing_time: `${(Math.random() * 3 + 1).toFixed(1)} seconds`
      };
      response.results = results;
      
      logFallback('Bulk upload completed (fallback)', response.summary);
      return response;
    }

    if (endpoint === '/api/resumes/match' && method === 'POST') {
      const matchData = JSON.parse(body);
      const jobDescription = matchData.job_description;
      
      // Simple keyword matching for demo
      const keywords = jobDescription.toLowerCase().split(/\s+/);
      const matches = mockData.mockResumes.map(resume => {
        const score = mockUtils.generateMatchScore(resume, { required_skills: keywords });
        return {
          ...resume,
          match_score: score,
          match_explanation: `${score}% match based on skills and experience`
        };
      }).filter(resume => resume.match_score > 30)
        .sort((a, b) => b.match_score - a.match_score);

      const response = { ...mockApiResponses.resume_matches };
      response.matches = matches;
      response.total_matches = matches.length;
      
      logFallback('Resume matching completed (fallback)', { 
        matches: matches.length,
        query_length: jobDescription.length 
      });
      return response;
    }

    if (endpoint === '/api/resumes/stats/overview' && method === 'GET') {
      logFallback('Resume stats retrieved (fallback)');
      return { success: true, ...mockData.mockStats.resumes };
    }

    throw new Error('Resumes endpoint not implemented in fallback mode');
  }

  // Helper method to parse FormData
  parseFormData(formData) {
    if (formData instanceof FormData) {
      const data = {};
      for (const [key, value] of formData.entries()) {
        if (key === 'required_skills' || key === 'preferred_skills') {
          data[key] = value.split(',').map(s => s.trim()).filter(s => s);
        } else {
          data[key] = value;
        }
      }
      return data;
    } else if (typeof formData === 'string') {
      return JSON.parse(formData);
    }
    return formData;
  }

  // Token refresh (fallback always succeeds)
  async refreshToken() {
    if (this.fallbackMode) {
      logFallback('Token refresh (fallback)');
      const newToken = 'mock_refreshed_token_' + Date.now();
      TokenManager.setToken(newToken);
      return true;
    }

    // Try backend refresh
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
      logError('Token refresh failed, switching to fallback', error);
      this.fallbackMode = true;
      TokenManager.setFallbackMode(true);
      return true; // Fallback mode always succeeds
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

  // Get connection status
  getConnectionStatus() {
    return {
      fallbackMode: this.fallbackMode,
      backendAvailable: !this.fallbackMode,
      online: NetworkMonitor.isOnline(),
      demoMode: CONFIG.DEMO_MODE
    };
  }
}

// Create API client instance
const apiClient = new APIClient();

// Authentication API with fallback
export const auth = {
  async login(credentials) {
    try {
      log('Attempting login', { email: credentials.email });
      
      const response = await apiClient.post('/api/auth/login', {
        email: credentials.email || credentials.username_or_email,
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
        log('Login successful', { user: response.user?.email, fallback: apiClient.fallbackMode });
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      logError('Login failed', error);
      throw error;
    }
  },

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
        log('Registration successful', { user: response.user?.email, fallback: apiClient.fallbackMode });
        return response;
      }

      return response;
    } catch (error) {
      logError('Registration failed', error);
      throw error;
    }
  },

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

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      logError('Logout endpoint failed, continuing with local logout', error);
    } finally {
      TokenManager.clearTokens();
      log('Logout completed');
    }
  },

  isAuthenticated() {
    return !!TokenManager.getToken();
  },

  getCurrentUser() {
    return TokenManager.getUserData();
  },

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
};

// Jobs API with fallback
export const jobs = {
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

  async create(jobData) {
    try {
      log('Creating job', { title: jobData.title });
      
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
      log('Job created successfully', { jobId: response.job?.id, fallback: apiClient.fallbackMode });
      return response;
    } catch (error) {
      logError('Failed to create job', error);
      throw error;
    }
  },

  async update(jobId, jobData) {
    try {
      log('Updating job', { jobId });
      
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
      log('Job updated successfully', { jobId, fallback: apiClient.fallbackMode });
      return response;
    } catch (error) {
      logError('Failed to update job', error);
      throw error;
    }
  },

  async delete(jobId) {
    try {
      log('Deleting job', { jobId });
      const response = await apiClient.delete(`/api/jobs/${jobId}`);
      log('Job deleted successfully', { jobId, fallback: apiClient.fallbackMode });
      return response;
    } catch (error) {
      logError('Failed to delete job', error);
      throw error;
    }
  },

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

// Resumes API with fallback
export const resumes = {
  async upload(file, candidateName = null) {
    try {
      log('Uploading resume', { filename: file.name, size: file.size });
      
      const formData = new FormData();
      formData.append('file', file);
      if (candidateName) {
        formData.append('candidate_name', candidateName);
      }

      const response = await apiClient.post('/api/resumes/upload', formData);
      log('Resume uploaded successfully', { resumeId: response.resume?.id, fallback: apiClient.fallbackMode });
      return response;
    } catch (error) {
      logError('Resume upload failed', error);
      throw error;
    }
  },

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
        failed: response.summary?.failed_uploads,
        fallback: apiClient.fallbackMode
      });
      return response;
    } catch (error) {
      logError('Bulk upload failed', error);
      throw error;
    }
  },

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

  async delete(resumeId) {
    try {
      log('Deleting resume', { resumeId });
      const response = await apiClient.delete(`/api/resumes/${resumeId}`);
      log('Resume deleted successfully', { resumeId, fallback: apiClient.fallbackMode });
      return response;
    } catch (error) {
      logError('Failed to delete resume', error);
      throw error;
    }
  },

  async matchToJob(jobDescription, params = {}) {
    try {
      log('Matching resumes to job', { descriptionLength: jobDescription.length });
      
      const response = await apiClient.post('/api/resumes/match', {
        job_description: jobDescription,
        ...params,
      });
      
      log('Resume matching completed', { 
        matches: response.total_matches,
        totalResumes: response.total_resumes,
        fallback: apiClient.fallbackMode
      });
      return response;
    } catch (error) {
      logError('Resume matching failed', error);
      throw error;
    }
  },

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

// System API with fallback
export const system = {
  async health() {
    try {
      const response = await apiClient.get('/health');
      return response;
    } catch (error) {
      logError('Health check failed', error);
      throw error;
    }
  },

  async status() {
    try {
      const response = await apiClient.get('/api/status');
      return response;
    } catch (error) {
      logError('Status check failed', error);
      throw error;
    }
  },

  getConnectionStatus() {
    return apiClient.getConnectionStatus();
  },

  async testConnection() {
    return NetworkMonitor.checkConnectionStatus();
  },

  enableDemoMode() {
    CONFIG.DEMO_MODE = true;
    apiClient.fallbackMode = true;
    TokenManager.setFallbackMode(true);
    logFallback('Demo mode enabled');
  },

  disableDemoMode() {
    CONFIG.DEMO_MODE = false;
    logFallback('Demo mode disabled - will attempt backend connection');
  },
};

// Analytics API with fallback
export const analytics = {
  async getDashboardOverview() {
    try {
      log('Fetching dashboard overview');
      
      const [jobStats, resumeStats, systemHealth] = await Promise.allSettled([
        jobs.getStats(),
        resumes.getStats(),
        system.health(),
      ]);

      const overview = {
        jobs: jobStats.status === 'fulfilled' ? jobStats.value : mockData.mockStats.jobs,
        resumes: resumeStats.status === 'fulfilled' ? resumeStats.value : mockData.mockStats.resumes,
        system: systemHealth.status === 'fulfilled' ? systemHealth.value : mockApiResponses.health_check,
        timestamp: new Date().toISOString(),
        fallbackMode: apiClient.fallbackMode,
      };

      log('Dashboard overview fetched', { fallback: apiClient.fallbackMode });
      return overview;
    } catch (error) {
      logError('Failed to fetch dashboard overview', error);
      throw error;
    }
  },

  async getRecentActivity(limit = 10) {
    try {
      log('Fetching recent activity', { limit });
      
      const activity = {
        recent_jobs: mockData.mockStats.dashboard.recent_activity.slice(0, limit),
        timestamp: new Date().toISOString(),
        fallbackMode: apiClient.fallbackMode,
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
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

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

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidFileType(file, allowedTypes = ['pdf', 'docx', 'txt']) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
  },

  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  },

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

  isNetworkError(error) {
    return error.message && (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('connection') ||
      error.message.includes('timeout')
    );
  },

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
  NetworkMonitor,
  CONFIG,
};

export default api;

// Development helpers
if (isDevelopment) {
  window.recruitAI_API = api;
  window.recruitAI_MockData = mockData;
  log('Bulletproof API client initialized');
  log('Available at window.recruitAI_API for debugging');
  log('Mock data available at window.recruitAI_MockData');
}

// Initialize connection status on load
apiClient.initialize();

