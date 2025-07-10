// Enhanced API utility for RecruitAI backend integration
// File: src/lib/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cleanfilesbackend.onrender.com';

// Enhanced error handling class
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Enhanced API client with better error handling
class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  // Get authentication headers
  getHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Enhanced request method with better error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log(`Making ${config.method || 'GET'} request to:`, url);
      
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        // Extract error message from different response formats
        let errorMessage = 'An error occurred';
        
        if (typeof data === 'object' && data !== null) {
          if (data.detail) {
            // FastAPI error format
            if (typeof data.detail === 'string') {
              errorMessage = data.detail;
            } else if (Array.isArray(data.detail)) {
              errorMessage = data.detail.map(err => err.msg || err.message).join(', ');
            } else if (typeof data.detail === 'object') {
              errorMessage = data.detail.message || JSON.stringify(data.detail);
            }
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
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
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new APIError('Network error. Please check your connection and try again.', 0, null);
      }
      
      // Handle other errors
      throw new APIError(error.message || 'An unexpected error occurred', 0, null);
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new APIClient();

// Authentication API functions
export const authAPI = {
  // User registration
  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return {
        success: true,
        data: response,
        message: 'Registration successful!'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message,
        status: error.status
      };
    }
  },

  // User login
  async login(credentials) {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      
      return {
        success: true,
        data: response,
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message,
        status: error.status
      };
    }
  },

  // User logout
  async logout() {
    try {
      apiClient.setToken(null);
      return {
        success: true,
        message: 'Logged out successfully!'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/auth/me');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: error.message,
        status: error.status
      };
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.post('/api/auth/refresh');
      
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: error.message,
        status: error.status
      };
    }
  }
};

// Export API client for other modules
export { apiClient, APIError };
export default apiClient;

