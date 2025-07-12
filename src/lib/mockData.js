


const mockData = {
  users: [
    {
      id: 'admin_id',
      email: 'admin@recruitai.com',
      password: 'password123',
      role: 'admin',
      token: 'mock_admin_token',
    },
    {
      id: 'recruiter_id',
      email: 'recruiter@recruitai.com',
      password: 'password123',
      role: 'recruiter',
      token: 'mock_recruiter_token',
    },
    {
      id: 'candidate_id',
      email: 'candidate@recruitai.com',
      password: 'password123',
      role: 'candidate',
      token: 'mock_candidate_token',
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
    },
    {
      id: 'job4',
      title: 'Data Scientist',
      description: 'As a Data Scientist, you will be responsible for analyzing large datasets and building predictive models.',
      skills: ['Python', 'R', 'Machine Learning', 'SQL', ' estadística'],
      location: 'Boston, MA',
      salary: '110,000 - 140,000 USD',
      status: 'Closed',
      applicants: 8,
      matched_candidates: 5,
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
    },
  ],
  dashboardStats: {
    totalJobs: 5,
    totalCandidates: 5,
    totalResumes: 5,
    totalInterviews: 0,
    openJobs: 4,
    closedJobs: 1,
  },
};

export const mockUtils = {
  delay: (ms) => new Promise(res => setTimeout(res, ms)),
  generateUserId: () => `user_${Math.random().toString(36).substr(2, 9)}`,
  generateJobId: () => `job_${Math.random().toString(36).substr(2, 9)}`,
  generateResumeId: () => `resume_${Math.random().toString(36).substr(2, 9)}`,
  findUser: (email, password) => {
    const user = mockData.users.find(u => u.email === email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  },
  generateMatchScore: (resume, job) => {
    const resumeSkills = new Set(resume.skills.map(s => s.toLowerCase()));
    const jobSkills = new Set(job.skills.map(s => s.toLowerCase()));
    const commonSkills = [...resumeSkills].filter(skill => jobSkills.has(skill));
    const skillMatch = (commonSkills.length / jobSkills.size) * 100;
    
    const experienceMatch = Math.min(100, (resume.experience_years / 5) * 100); // Assuming 5 years is ideal
    
    return Math.round((skillMatch * 0.7) + (experienceMatch * 0.3));
  }
};

export const mockApiResponses = {
  login_success: {
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    token_type: 'bearer',
    expires_in: 3600,
    user: {
      id: 'mock_user_id',
      email: 'mock@example.com',
      username: 'mockuser',
      full_name: 'Mock User',
      company_name: 'Mock Corp',
      role: 'admin',
    },
  },
  register_success: {
    message: 'Registration successful (mock)',
    user: {
      id: 'mock_new_user_id',
      email: 'new@example.com',
      username: 'newuser',
      full_name: 'New User',
      company_name: 'New Corp',
      role: 'candidate',
    },
  },
  jobs_list: {
    jobs: mockData.jobs,
    total: mockData.jobs.length,
    skip: 0,
    limit: 100,
    has_more: false,
  },
  job_created: {
    message: 'Job created successfully (mock)',
    job: {},
  },
  job_updated: {
    message: 'Job updated successfully (mock)',
    job: {},
  },
  job_deleted: {
    success: true,
    message: 'Job deleted successfully (mock)',
  },
  resumes_list: {
    resumes: mockData.resumes,
    total: mockData.resumes.length,
    skip: 0,
    limit: 100,
    has_more: false,
  },
  resume_uploaded: {
    success: true,
    message: 'Resume uploaded successfully (mock)',
    resume: {},
  },
  bulk_upload_success: {
    success: true,
    summary: {
      total_files: 0,
      successful_uploads: 0,
      failed_uploads: 0,
      processing_time: '0s',
    },
    results: [],
  },
  resume_matches: {
    matches: [],
    total_matches: 0,
    total_resumes: 0,
    job_description_preview: '',
    matching_criteria: {},
  },
  health_check: {
    status: 'healthy',
    service: 'frontend_mock',
    timestamp: new Date().toISOString(),
    message: 'Frontend is operating in mock data mode.',
  },
  api_status: {
    api_version: '3.0.0',
    status: 'operational (mock)',
    timestamp: new Date().toISOString(),
    endpoints: {},
    demo_credentials: {
      admin: 'admin@recruitai.com / password123',
      recruiter: 'recruiter@recruitai.com / password123',
      candidate: 'candidate@recruitai.com / password123',
    },
    features: {
      authentication: 'Mock JWT',
      file_processing: 'Simulated',
      ai_matching: 'Simulated TF-IDF',
    },
  },
};

export default mockData;
