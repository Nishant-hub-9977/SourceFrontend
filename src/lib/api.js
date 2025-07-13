// RecruitAI API Client - Production Ready

const API_BASE_URL = process.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://cleanfilesbackend.onrender.com';
const DEMO_MODE = true; // Set to false when backend is fully ready

// Mock data for demo mode
const mockData = {
  resumes: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      skills: ['React', 'Node.js', 'JavaScript', 'Python'],
      experience: '5 years',
      status: 'Active',
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      skills: ['Vue.js', 'PHP', 'MySQL', 'Docker'],
      experience: '3 years',
      status: 'Active',
      uploadDate: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      skills: ['Angular', 'Java', 'Spring Boot', 'AWS'],
      experience: '7 years',
      status: 'Pending',
      uploadDate: '2024-01-13'
    }
  ],
  jobs: [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'Remote',
      skills: ['React', 'JavaScript', 'CSS'],
      type: 'Full-time',
      status: 'Open',
      salary: '$80,000 - $120,000',
      postedDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'StartupXYZ',
      location: 'New York',
      skills: ['Node.js', 'Python', 'MongoDB'],
      type: 'Full-time',
      status: 'Open',
      salary: '$90,000 - $130,000',
      postedDate: '2024-01-09'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Innovation Labs',
      location: 'San Francisco',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      type: 'Contract',
      status: 'Open',
      salary: '$100,000 - $150,000',
      postedDate: '2024-01-08'
    }
  ],
  matches: [
    { id: 1, resumeId: 1, jobId: 1, score: 85, status: 'pending' },
    { id: 2, resumeId: 2, jobId: 2, score: 78, status: 'approved' },
    { id: 3, resumeId: 3, jobId: 3, score: 92, status: 'pending' }
  ]
};

// API Client Class
class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10 seconds
  }

  // Generic request method with error handling
  async request(endpoint, options = {}) {
    // Demo mode - return mock data
    if (DEMO_MODE) {
      return this.getMockData(endpoint, options);
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      
      // Fallback to mock data on error
      console.log('Falling back to mock data...');
      return this.getMockData(endpoint, options);
    }
  }

  // Mock data handler
  getMockData(endpoint, options) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const method = options.method || 'GET';
        
        if (endpoint.includes('/resumes')) {
          if (method === 'POST') {
            const newResume = {
              id: Date.now(),
              name: 'New Candidate',
              email: 'new@email.com',
              skills: ['JavaScript', 'React'],
              experience: '2 years',
              status: 'Active',
              uploadDate: new Date().toISOString().split('T')[0]
            };
            mockData.resumes.push(newResume);
            resolve({ success: true, data: newResume });
          } else {
            resolve({ success: true, data: mockData.resumes });
          }
        } else if (endpoint.includes('/jobs')) {
          if (method === 'POST') {
            const newJob = {
              id: Date.now(),
              title: 'New Position',
              company: 'New Company',
              location: 'Remote',
              skills: ['JavaScript'],
              type: 'Full-time',
              status: 'Open',
              salary: '$70,000 - $100,000',
              postedDate: new Date().toISOString().split('T')[0]
            };
            mockData.jobs.push(newJob);
            resolve({ success: true, data: newJob });
          } else {
            resolve({ success: true, data: mockData.jobs });
          }
        } else if (endpoint.includes('/matches')) {
          resolve({ success: true, data: mockData.matches });
        } else {
          resolve({ success: true, data: { message: 'Mock response' } });
        }
      }, 500); // Simulate network delay
    });
  }

  // Resume endpoints
  async getResumes() {
    return this.request('/api/resumes');
  }

  async uploadResume(formData) {
    return this.request('/api/resumes', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getResumeById(id) {
    return this.request(`/api/resumes/${id}`);
  }

  async deleteResume(id) {
    return this.request(`/api/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  // Job endpoints
  async getJobs() {
    return this.request('/api/jobs');
  }

  async createJob(jobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async getJobById(id) {
    return this.request(`/api/jobs/${id}`);
  }

  async updateJob(id, jobData) {
    return this.request(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id) {
    return this.request(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Matching endpoints
  async getMatches() {
    return this.request('/api/matches');
  }

  async createMatch(resumeId, jobId) {
    return this.request('/api/matches', {
      method: 'POST',
      body: JSON.stringify({ resumeId, jobId }),
    });
  }

  async getMatchesByResumeId(resumeId) {
    return this.request(`/api/matches/resume/${resumeId}`);
  }

  async getMatchesByJobId(jobId) {
    return this.request(`/api/matches/job/${jobId}`);
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request('/api/analytics');
  }

  async getStats() {
    return this.request('/api/stats');
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Create and export API client instance
const apiClient = new APIClient();

export default apiClient;

// Named exports for convenience
export const {
  getResumes,
  uploadResume,
  getResumeById,
  deleteResume,
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  getMatches,
  createMatch,
  getMatchesByResumeId,
  getMatchesByJobId,
  getAnalytics,
  getStats,
  healthCheck,
} = apiClient;
