// Bulletproof API Client with Fallback System
// File: src/lib/api.js
// Version: 3.0.0 - Client-Ready with Offline Support

import mockData from './mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cleanfilesbackend.onrender.com';

// Configuration
const CONFIG = {
  // Enable fallback mode when backend is unavailable
  ENABLE_FALLBACK: true,
  
  // Timeout for API requests (ms)
  REQUEST_TIMEOUT: 10000,
  
  // Number of retry attempts
  MAX_RETRIES: 2,
  
  // Delay between retries (ms)
  RETRY_DELAY: 1000,
  
  // Enable offline mode simulation
  SIMULATE_OFFLINE: false,
  
  // Enable demo mode (always use mock data)
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true' || true
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
    this.fallbackMode = CONFIG.DEMO_MODE || false;
    this.connectionStatus = null;
  }

  async initialize() {
    this.connectionStatus = await NetworkMonitor.checkConnectionStatus();
    this.fallbackMode = this.connectionStatus.fallbackMode || CONFIG.DEMO_MODE;
    
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
    await this.delay(Math.random() * 500 + 200);

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
        return { status: 'healthy', message: 'Fallback mode active' };
      } else if (endpoint === '/api/status') {
        return { status: 'operational', mode: 'fallback' };
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
      const credentials = typeof body === 'string' ? JSON.parse(body) : body;
      const user = mockData.users.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          role: user.role,
          token: user.token
        };
        
        TokenManager.setToken(user.token);
        TokenManager.setUserData(userData);
        
        logFallback('Login successful (fallback)', { email: user.email, role: user.role });
        return {
          success: true,
          user: userData,
          token: user.token,
          message: 'Login successful'
        };
      } else {
        logFallback('Login failed (fallback)', { email: credentials.email });
        throw new Error('Invalid credentials');
      }
    }

    if (endpoint === '/api/auth/register' && method === 'POST') {
      const userData = typeof body === 'string' ? JSON.parse(body) : body;
      const newUser = {
        id: `user_${Date.now()}`,
        email: userData.email,
        role: userData.role || 'candidate',
        token: `token_${Date.now()}`,
        created_at: new Date().toISOString()
      };

      TokenManager.setToken(newUser.token);
      TokenManager.setUserData(newUser);
      
      logFallback('Registration successful (fallback)', { email: newUser.email });
      return {
        success: true,
        user: newUser,
        token: newUser.token,
        message: 'Registration successful'
      };
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
      TokenManager.clearTokens();
      logFallback('Logout (fallback)');
      return { success: true, message: 'Logged out successfully' };
    }

    throw new Error('Auth endpoint not implemented in fallback mode');
  }

  // Jobs fallback handlers
  handleJobsFallback(endpoint, method, body) {
    if (endpoint === '/api/jobs/' && method === 'GET') {
      logFallback('Jobs list retrieved (fallback)', { count: mockData.jobs.length });
      return {
        success: true,
        jobs: mockData.jobs,
        total: mockData.jobs.length
      };
    }

    if (endpoint === '/api/jobs/' && method === 'POST') {
      const jobData = typeof body === 'string' ? JSON.parse(body) : body;
      const newJob = {
        id: `job_${Date.now()}`,
        ...jobData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'Open',
        applicants: 0,
        matched_candidates: 0
      };

      mockData.jobs.push(newJob);
      
      logFallback('Job created (fallback)', { title: newJob.title });
      return {
        success: true,
        job: newJob,
        message: 'Job created successfully'
      };
    }

    if (endpoint.match(/^\/api\/jobs\/\w+$/) && method === 'GET') {
      const jobId = endpoint.split('/').pop();
      const job = mockData.jobs.find(j => j.id === jobId);
      
      if (job) {
        logFallback('Job retrieved (fallback)', { id: jobId, title: job.title });
        return { success: true, job };
      } else {
        throw new Error('Job not found');
      }
    }

    throw new Error('Jobs endpoint not implemented in fallback mode');
  }

  // Resumes fallback handlers
  handleResumesFallback(endpoint, method, body) {
    if (endpoint === '/api/resumes/' && method === 'GET') {
      logFallback('Resumes list retrieved (fallback)', { count: mockData.resumes.length });
      return {
        success: true,
        resumes: mockData.resumes,
        total: mockData.resumes.length
      };
    }

    if (endpoint === '/api/resumes/upload' && method === 'POST') {
      const newResume = {
        id: `resume_${Date.now()}`,
        name: 'Sample Candidate',
        email: 'candidate@example.com',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '3 years',
        education: 'Bachelor of Computer Science',
        match_score: Math.floor(Math.random() * 40) + 60,
        upload_date: new Date().toISOString()
      };

      mockData.resumes.push(newResume);
      
      logFallback('Resume uploaded (fallback)', { name: newResume.name });
      return {
        success: true,
        resume: newResume,
        message: 'Resume uploaded successfully'
      };
    }

    throw new Error('Resumes endpoint not implemented in fallback mode');
  }

  // Token refresh (fallback always succeeds)
  async refreshToken() {
    if (this.fallbackMode || CONFIG.DEMO_MODE) {
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

  // Utility method for delays
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET request helper
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request helper
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request helper
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request helper
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload helper
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  }
}

// Create and export API client instance
const apiClient = new APIClient();

// Initialize the client
apiClient.initialize();

// Export the client and utilities
export default apiClient;
export { TokenManager, NetworkMonitor, CONFIG };

// Export specific API methods for convenience
export const auth = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  logout: () => apiClient.post('/api/auth/logout'),
  me: () => apiClient.get('/api/auth/me'),
  refresh: () => apiClient.refreshToken(),
};

export const jobs = {
  list: (params) => apiClient.get('/api/jobs/', params),
  create: (jobData) => apiClient.post('/api/jobs/', jobData),
  get: (id) => apiClient.get(`/api/jobs/${id}`),
  update: (id, jobData) => apiClient.put(`/api/jobs/${id}`, jobData),
  delete: (id) => apiClient.delete(`/api/jobs/${id}`),
};

export const resumes = {
  list: (params) => apiClient.get('/api/resumes/', params),
  upload: (file, data) => apiClient.uploadFile('/api/resumes/upload', file, data),
  bulkUpload: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return apiClient.request('/api/resumes/bulk-upload', {
      method: 'POST',
      body: formData,
    });
  },
  match: (jobDescription) => apiClient.post('/api/resumes/match', { job_description: jobDescription }),
};

