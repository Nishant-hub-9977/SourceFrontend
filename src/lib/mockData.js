// Mock Data for RecruitAI Frontend
// File: src/lib/mockData.js
// Version: 2.0.0 - Enhanced with comprehensive data

const mockData = {
  users: [
    {
      id: 'admin_id',
      email: 'admin@recruitai.com',
      password: 'password123',
      role: 'admin',
      token: 'mock_admin_token',
      full_name: 'Admin User',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'recruiter_id',
      email: 'recruiter@recruitai.com',
      password: 'password123',
      role: 'recruiter',
      token: 'mock_recruiter_token',
      full_name: 'Recruiter User',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'candidate_id',
      email: 'candidate@recruitai.com',
      password: 'password123',
      role: 'candidate',
      token: 'mock_candidate_token',
      full_name: 'Candidate User',
      created_at: '2024-01-01T00:00:00Z'
    },
  ],
  jobs: [
    {
      id: 'job1',
      title: 'Senior Software Engineer',
      description: 'We are looking for a passionate Senior Software Engineer to join our team. You will be responsible for developing and maintaining high-quality software solutions.',
      skills: ['Python', 'Django', 'React', 'AWS', 'SQL'],
      location: 'Remote',
      salary: '120,000 - 150,000 USD',
      status: 'Open',
      applicants: 15,
      matched_candidates: 10,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 'job2',
      title: 'Frontend Developer',
      description: 'Join our dynamic team as a Frontend Developer and build amazing user interfaces using modern web technologies.',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
      location: 'New York, NY',
      salary: '90,000 - 110,000 USD',
      status: 'Open',
      applicants: 20,
      matched_candidates: 12,
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z'
    },
    {
      id: 'job3',
      title: 'DevOps Engineer',
      description: 'We need an experienced DevOps Engineer to streamline our development and operations processes.',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Ansible', 'Linux'],
      location: 'San Francisco, CA',
      salary: '130,000 - 160,000 USD',
      status: 'Open',
      applicants: 12,
      matched_candidates: 8,
      created_at: '2024-01-17T10:00:00Z',
      updated_at: '2024-01-17T10:00:00Z'
    },
    {
      id: 'job4',
      title: 'Data Scientist',
      description: 'As a Data Scientist, you will be responsible for analyzing large datasets and building predictive models.',
      skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Statistics'],
      location: 'Boston, MA',
      salary: '110,000 - 140,000 USD',
      status: 'Closed',
      applicants: 8,
      matched_candidates: 5,
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z'
    },
    {
      id: 'job5',
      title: 'UI/UX Designer',
      description: 'Create intuitive and visually appealing user interfaces for our web and mobile applications.',
      skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
      location: 'Remote',
      salary: '80,000 - 100,000 USD',
      status: 'Open',
      applicants: 18,
      matched_candidates: 11,
      created_at: '2024-01-19T10:00:00Z',
      updated_at: '2024-01-19T10:00:00Z'
    },
  ],
  resumes: [
    {
      id: 'resume1',
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      skills: ['Python', 'Django', 'AWS', 'SQL', 'JavaScript'],
      experience: '5 years',
      education: 'Master of Computer Science',
      match_score: 92,
      job_id: 'job1',
      upload_date: '2024-01-20T10:00:00Z'
    },
    {
      id: 'resume2',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      skills: ['React', 'TypeScript', 'HTML', 'CSS', 'Node.js'],
      experience: '3 years',
      education: 'Bachelor of Software Engineering',
      match_score: 88,
      job_id: 'job2',
      upload_date: '2024-01-21T10:00:00Z'
    },
    {
      id: 'resume3',
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Ansible', 'Linux'],
      experience: '7 years',
      education: 'PhD in Computer Science',
      match_score: 95,
      job_id: 'job3',
      upload_date: '2024-01-22T10:00:00Z'
    },
    {
      id: 'resume4',
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      skills: ['Python', 'Machine Learning', 'R', 'SQL', 'Data Visualization'],
      experience: '4 years',
      education: 'Master of Data Science',
      match_score: 70,
      job_id: 'job4',
      upload_date: '2024-01-23T10:00:00Z'
    },
    {
      id: 'resume5',
      name: 'Eve Adams',
      email: 'eve.adams@example.com',
      skills: ['Figma', 'User Research', 'Prototyping', 'Sketch', 'Adobe XD'],
      experience: '2 years',
      education: 'Bachelor of Graphic Design',
      match_score: 85,
      job_id: 'job5',
      upload_date: '2024-01-24T10:00:00Z'
    },
  ],
  dashboardStats: {
    totalJobs: 5,
    totalCandidates: 5,
    totalResumes: 5,
    totalInterviews: 0,
    openJobs: 4,
    closedJobs: 1,
    activeApplications: 73,
    pendingReviews: 25,
    scheduledInterviews: 8,
    hiredCandidates: 3
  },
};

// Utility functions for mock data operations
export const mockUtils = {
  // Generate unique IDs
  generateUserId: () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  generateJobId: () => `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  generateResumeId: () => `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // Find user by credentials
  findUser: (email, password) => {
    return mockData.users.find(user => 
      user.email === email && user.password === password
    );
  },
  
  // Generate match score
  generateMatchScore: (resume, job) => {
    const resumeSkills = resume.skills || [];
    const jobSkills = job.skills || job.required_skills || [];
    
    if (jobSkills.length === 0) return Math.floor(Math.random() * 40) + 60;
    
    const matchingSkills = resumeSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    
    const baseScore = (matchingSkills.length / jobSkills.length) * 100;
    const randomVariation = (Math.random() - 0.5) * 20; // ±10 points
    
    return Math.max(30, Math.min(100, Math.floor(baseScore + randomVariation)));
  },
  
  // Simulate network delay
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Get current timestamp
  getCurrentTimestamp: () => new Date().toISOString(),
  
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Generate random stats
  generateRandomStats: () => ({
    totalJobs: Math.floor(Math.random() * 50) + 10,
    totalCandidates: Math.floor(Math.random() * 200) + 50,
    totalResumes: Math.floor(Math.random() * 300) + 100,
    totalInterviews: Math.floor(Math.random() * 50) + 10,
    openJobs: Math.floor(Math.random() * 30) + 5,
    closedJobs: Math.floor(Math.random() * 20) + 5,
    activeApplications: Math.floor(Math.random() * 100) + 50,
    pendingReviews: Math.floor(Math.random() * 50) + 10,
    scheduledInterviews: Math.floor(Math.random() * 20) + 5,
    hiredCandidates: Math.floor(Math.random() * 10) + 1
  })
};

// Mock API responses
export const mockApiResponses = {
  // Authentication responses
  login_success: {
    success: true,
    message: 'Login successful',
    user: null, // Will be populated dynamically
    token: null // Will be populated dynamically
  },
  
  login_failure: {
    success: false,
    message: 'Invalid credentials',
    error: 'Authentication failed'
  },
  
  register_success: {
    success: true,
    message: 'Registration successful',
    user: null, // Will be populated dynamically
    token: null // Will be populated dynamically
  },
  
  logout_success: {
    success: true,
    message: 'Logged out successfully'
  },
  
  // Jobs responses
  jobs_list: {
    success: true,
    jobs: mockData.jobs,
    total: mockData.jobs.length,
    page: 1,
    per_page: 10
  },
  
  job_created: {
    success: true,
    message: 'Job created successfully',
    job: null // Will be populated dynamically
  },
  
  job_updated: {
    success: true,
    message: 'Job updated successfully',
    job: null // Will be populated dynamically
  },
  
  job_deleted: {
    success: true,
    message: 'Job deleted successfully'
  },
  
  // Resumes responses
  resumes_list: {
    success: true,
    resumes: mockData.resumes,
    total: mockData.resumes.length,
    page: 1,
    per_page: 10
  },
  
  resume_uploaded: {
    success: true,
    message: 'Resume uploaded successfully',
    resume: null // Will be populated dynamically
  },
  
  bulk_upload_success: {
    success: true,
    message: 'Bulk upload completed',
    summary: null, // Will be populated dynamically
    results: [] // Will be populated dynamically
  },
  
  resume_matches: {
    success: true,
    matches: [],
    total_matches: 0,
    query_time: '0.5s'
  },
  
  // System responses
  health_check: {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: 'fallback'
  },
  
  api_status: {
    api_version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    mode: 'fallback',
    features: {
      authentication: 'active',
      job_management: 'active',
      resume_processing: 'active',
      ai_matching: 'active'
    }
  }
};

// Export default mock data
export default mockData;

