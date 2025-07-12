// No-Auth API Client for RecruitAI Frontend
// This version bypasses all authentication and works with mock data + backend fallback

class APIClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://cleanfilesbackend.onrender.com';
    this.isDemo = true; // Always in demo mode for no-auth version
    this.mockData = this.initializeMockData();
  }

  initializeMockData() {
    return {
      resumes: [
        {
          id: 'resume_1',
          filename: 'john_doe_resume.pdf',
          original_filename: 'john_doe_resume.pdf',
          candidate_name: 'John Doe',
          candidate_email: 'john.doe@email.com',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
          upload_date: new Date().toISOString(),
          file_size: 245760,
          processed: true
        },
        {
          id: 'resume_2',
          filename: 'jane_smith_resume.pdf',
          original_filename: 'jane_smith_resume.pdf',
          candidate_name: 'Jane Smith',
          candidate_email: 'jane.smith@email.com',
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
          upload_date: new Date(Date.now() - 86400000).toISOString(),
          file_size: 198432,
          processed: true
        },
        {
          id: 'resume_3',
          filename: 'mike_johnson_resume.pdf',
          original_filename: 'mike_johnson_resume.pdf',
          candidate_name: 'Mike Johnson',
          candidate_email: 'mike.johnson@email.com',
          skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'MongoDB'],
          upload_date: new Date(Date.now() - 172800000).toISOString(),
          file_size: 312576,
          processed: true
        }
      ],
      jobs: [
        {
          id: 'job_1',
          title: 'Senior Frontend Developer',
          description: 'We are looking for a Senior Frontend Developer with expertise in React, JavaScript, and modern web technologies. The ideal candidate should have 5+ years of experience building scalable web applications.',
          status: 'active',
          created_at: new Date().toISOString(),
          requirements: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML']
        },
        {
          id: 'job_2',
          title: 'Backend Python Developer',
          description: 'Join our team as a Backend Python Developer. You will work with Django, PostgreSQL, and cloud technologies to build robust backend systems.',
          status: 'active',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          requirements: ['Python', 'Django', 'PostgreSQL', 'REST API', 'AWS']
        },
        {
          id: 'job_3',
          title: 'Full Stack Java Developer',
          description: 'We need a Full Stack Java Developer experienced in Spring Boot, microservices architecture, and modern frontend frameworks.',
          status: 'active',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          requirements: ['Java', 'Spring Boot', 'Microservices', 'React', 'Docker']
        }
      ],
      stats: {
        totalResumes: 3,
        totalJobs: 3,
        matchedCandidates: 8,
        pendingReviews: 2
      }
    };
  }

  // Helper method to simulate API delay
  async simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper method to try backend first, fallback to mock
  async tryBackendFirst(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Backend error: ${response.status}`);
    } catch (error) {
      console.warn(`Backend unavailable for ${endpoint}, using mock data:`, error.message);
      return null; // Will trigger fallback to mock data
    }
  }

  // Resume Management
  async getResumes(params = {}) {
    await this.simulateDelay();
    
    // Try backend first
    const backendResponse = await this.tryBackendFirst('/api/resumes/', {
      method: 'GET'
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock data
    const { skip = 0, limit = 100 } = params;
    const resumes = this.mockData.resumes.slice(skip, skip + limit);
    
    return {
      success: true,
      resumes: resumes,
      total: this.mockData.resumes.length,
      page: Math.floor(skip / limit) + 1,
      per_page: limit,
      has_more: skip + limit < this.mockData.resumes.length
    };
  }

  async uploadResume(formData) {
    await this.simulateDelay(1000);

    // Try backend first
    const backendResponse = await this.tryBackendFirst('/api/resumes/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Don't set Content-Type for FormData
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock upload
    const file = formData.get('file');
    if (!file) {
      throw new Error('No file provided');
    }

    // Simulate skill extraction
    const mockSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'HTML', 'CSS'];
    const extractedSkills = mockSkills.slice(0, Math.floor(Math.random() * 5) + 3);

    const newResume = {
      id: `resume_${Date.now()}`,
      filename: file.name,
      original_filename: file.name,
      candidate_name: file.name.split('_')[0] || 'Unknown',
      candidate_email: `${file.name.split('.')[0]}@email.com`,
      skills: extractedSkills,
      upload_date: new Date().toISOString(),
      file_size: file.size,
      processed: true
    };

    // Add to mock data
    this.mockData.resumes.unshift(newResume);
    this.mockData.stats.totalResumes = this.mockData.resumes.length;

    return {
      success: true,
      message: 'Resume uploaded and processed successfully',
      resume: {
        id: newResume.id,
        filename: newResume.original_filename,
        skills: newResume.skills,
        skills_count: newResume.skills.length,
        upload_date: newResume.upload_date
      }
    };
  }

  async getResume(resumeId) {
    await this.simulateDelay();

    // Try backend first
    const backendResponse = await this.tryBackendFirst(`/api/resumes/${resumeId}`, {
      method: 'GET'
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock data
    const resume = this.mockData.resumes.find(r => r.id === resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }

    return {
      success: true,
      resume: {
        ...resume,
        extracted_text: 'Sample extracted text from resume...'
      }
    };
  }

  async deleteResume(resumeId) {
    await this.simulateDelay();

    // Try backend first
    const backendResponse = await this.tryBackendFirst(`/api/resumes/${resumeId}`, {
      method: 'DELETE'
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock deletion
    const index = this.mockData.resumes.findIndex(r => r.id === resumeId);
    if (index === -1) {
      throw new Error('Resume not found');
    }

    this.mockData.resumes.splice(index, 1);
    this.mockData.stats.totalResumes = this.mockData.resumes.length;

    return {
      success: true,
      message: 'Resume deleted successfully'
    };
  }

  // Job Management
  async getJobs(params = {}) {
    await this.simulateDelay();

    // Try backend first
    const backendResponse = await this.tryBackendFirst('/api/jobs/', {
      method: 'GET'
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock data
    return {
      success: true,
      jobs: this.mockData.jobs,
      total: this.mockData.jobs.length
    };
  }

  async createJob(jobData) {
    await this.simulateDelay();

    // Try backend first
    const backendResponse = await this.tryBackendFirst('/api/jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock creation
    const newJob = {
      id: `job_${Date.now()}`,
      title: jobData.title,
      description: jobData.description,
      status: jobData.status || 'active',
      created_at: new Date().toISOString(),
      requirements: jobData.requirements || []
    };

    this.mockData.jobs.unshift(newJob);
    this.mockData.stats.totalJobs = this.mockData.jobs.length;

    return {
      success: true,
      message: 'Job created successfully',
      job: newJob
    };
  }

  async getJob(jobId) {
    await this.simulateDelay();

    // Try backend first
    const backendResponse = await this.tryBackendFirst(`/api/jobs/${jobId}`, {
      method: 'GET'
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock data
    const job = this.mockData.jobs.find(j => j.id === jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    return {
      success: true,
      job: job
    };
  }

  // Resume Matching
  async matchResumes(jobDescription) {
    await this.simulateDelay(1500);

    // Try backend first
    const backendResponse = await this.tryBackendFirst('/api/resumes/match', {
      method: 'POST',
      body: JSON.stringify({ job_description: jobDescription })
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock matching
    const matches = this.mockData.resumes.map(resume => {
      // Simple matching algorithm
      const jobWords = jobDescription.toLowerCase().split(' ');
      const resumeSkills = resume.skills.map(s => s.toLowerCase());
      
      let matchCount = 0;
      jobWords.forEach(word => {
        if (resumeSkills.some(skill => skill.includes(word) || word.includes(skill))) {
          matchCount++;
        }
      });

      const matchScore = Math.min(Math.round((matchCount / jobWords.length) * 100), 100);

      return {
        resume_id: resume.id,
        filename: resume.original_filename,
        candidate_name: resume.candidate_name,
        candidate_email: resume.candidate_email,
        skills: resume.skills,
        match_score: matchScore,
        upload_date: resume.upload_date
      };
    }).sort((a, b) => b.match_score - a.match_score);

    return {
      success: true,
      job_description: jobDescription.substring(0, 200) + (jobDescription.length > 200 ? '...' : ''),
      total_resumes: matches.length,
      matches: matches,
      query_time: new Date().toISOString()
    };
  }

  // Statistics
  async getStats() {
    await this.simulateDelay();

    // Try backend first
    const backendResponse = await this.tryBackendFirst('/api/resumes/stats/overview', {
      method: 'GET'
    });

    if (backendResponse && backendResponse.success) {
      return backendResponse;
    }

    // Fallback to mock stats
    return {
      success: true,
      stats: {
        ...this.mockData.stats,
        totalResumes: this.mockData.resumes.length,
        totalJobs: this.mockData.jobs.length
      }
    };
  }

  // Health Check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, backend: 'available', ...data };
      }
    } catch (error) {
      console.warn('Backend health check failed:', error.message);
    }

    return {
      success: true,
      backend: 'unavailable',
      mode: 'mock_data',
      message: 'Running in demo mode with mock data'
    };
  }

  // Utility Methods
  getBackendStatus() {
    return this.healthCheck();
  }

  getMockDataSummary() {
    return {
      resumes: this.mockData.resumes.length,
      jobs: this.mockData.jobs.length,
      features: [
        'Resume upload simulation',
        'Job creation',
        'Resume matching',
        'Statistics tracking',
        'Backend fallback'
      ]
    };
  }
}

export { APIClient };
export default APIClient;

