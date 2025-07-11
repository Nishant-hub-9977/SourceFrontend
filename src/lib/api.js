// src/lib/api.js - Updated API client with correct field mapping for login

import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cleanfilesbackend.onrender.com';

class APIClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  // Auth methods
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email || credentials.username_or_email,  // Fixed: use 'email' for backend
        password: credentials.password
      }),
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Job methods
  createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  getJobs() {
    return this.request('/jobs');
  }

  // Resume methods
  uploadResumes(formData) {
    return this.request('/resumes/upload', {
      method: 'POST',
      body: formData,
      headers: {}  // No JSON header for FormData
    });
  }

  getResumes() {
    return this.request('/resumes');
  }

  // AI Matching
  matchResumes(jobId) {
    return this.request(`/jobs/${jobId}/match`);
  }
}

// Export instances
export const api = new APIClient();
export const auth = {
  login: (credentials) => api.login(credentials),
  register: (userData) => api.register(userData),
};
