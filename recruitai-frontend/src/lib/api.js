// API utility for RecruitAI backend integration
const API_BASE_URL = 'https://cleanfilesbackend.onrender.com';

// API configuration
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for cold starts
  retries: 3,
  retryDelay: 2000, // 2 seconds
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('recruitai_token');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('recruitai_token', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('recruitai_token');
};

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Sleep utility for retries
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API call with retry logic
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...createHeaders(options.includeAuth !== false),
      ...options.headers,
    },
  };

  for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++) {
    try {
      const response = await fetch(url, config);
      
      // Handle backend cold start (503/502 errors)
      if ((response.status === 503 || response.status === 502) && attempt < API_CONFIG.retries) {
        console.log(`Backend cold start detected, retrying... (${attempt}/${API_CONFIG.retries})`);
        await sleep(API_CONFIG.retryDelay);
        continue;
      }

      // Handle authentication errors
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API call attempt ${attempt} failed:`, error);
      
      if (attempt === API_CONFIG.retries) {
        throw error;
      }
      
      await sleep(API_CONFIG.retryDelay);
    }
  }
};

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      includeAuth: false,
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    
    return response;
  },

  // Register user
  register: async (userData) => {
    return await apiCall('/api/auth/register', {
      method: 'POST',
      includeAuth: false,
      body: JSON.stringify(userData),
    });
  },

  // Refresh token
  refresh: async () => {
    return await apiCall('/api/auth/refresh', {
      method: 'POST',
    });
  },

  // Logout user
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiCall('/api/auth/me');
  },
};

// Jobs API calls
export const jobsAPI = {
  // Get all jobs
  getAll: async () => {
    return await apiCall('/api/jobs/');
  },

  // Get job by ID
  getById: async (id) => {
    return await apiCall(`/api/jobs/${id}`);
  },

  // Create new job
  create: async (jobData) => {
    return await apiCall('/api/jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  // Update job
  update: async (id, jobData) => {
    return await apiCall(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  // Delete job
  delete: async (id) => {
    return await apiCall(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Resumes API calls
export const resumesAPI = {
  // Upload resume
  upload: async (file, jobId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (jobId) {
      formData.append('job_id', jobId);
    }

    return await apiCall('/api/resumes/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
  },

  // Get all resumes
  getAll: async () => {
    return await apiCall('/api/resumes/');
  },

  // Get resume by ID
  getById: async (id) => {
    return await apiCall(`/api/resumes/${id}`);
  },

  // Match resume with job
  match: async (resumeId, jobId) => {
    return await apiCall('/api/resumes/match', {
      method: 'POST',
      body: JSON.stringify({ resume_id: resumeId, job_id: jobId }),
    });
  },

  // Analyze resume
  analyze: async (resumeId) => {
    return await apiCall(`/api/resumes/${resumeId}/analyze`);
  },
};

// Candidates API calls
export const candidatesAPI = {
  // Get all candidates
  getAll: async () => {
    return await apiCall('/api/candidates/');
  },

  // Get candidate by ID
  getById: async (id) => {
    return await apiCall(`/api/candidates/${id}`);
  },

  // Create candidate
  create: async (candidateData) => {
    return await apiCall('/api/candidates/', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  },

  // Update candidate
  update: async (id, candidateData) => {
    return await apiCall(`/api/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(candidateData),
    });
  },

  // Delete candidate
  delete: async (id) => {
    return await apiCall(`/api/candidates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return await apiCall('/health', {
      includeAuth: false,
    });
  },
};

// Export utilities
export { getAuthToken, setAuthToken, removeAuthToken, API_BASE_URL };

