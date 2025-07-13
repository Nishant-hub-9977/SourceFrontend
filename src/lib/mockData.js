// Mock Data for RecruitAI - Comprehensive Dataset

export const mockResumes = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    skills: ['React', 'Node.js', 'JavaScript', 'Python', 'MongoDB'],
    experience: '5 years',
    status: 'Active',
    uploadDate: '2024-01-15',
    location: 'New York, NY',
    education: 'BS Computer Science',
    summary: 'Experienced full-stack developer with expertise in modern web technologies.',
    previousRoles: [
      { company: 'Tech Corp', title: 'Senior Developer', duration: '2021-2024' },
      { company: 'StartupXYZ', title: 'Full Stack Developer', duration: '2019-2021' }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 234-5678',
    skills: ['Vue.js', 'PHP', 'MySQL', 'Docker', 'AWS'],
    experience: '3 years',
    status: 'Active',
    uploadDate: '2024-01-14',
    location: 'San Francisco, CA',
    education: 'MS Software Engineering',
    summary: 'Frontend specialist with strong backend capabilities and cloud experience.',
    previousRoles: [
      { company: 'WebTech Solutions', title: 'Frontend Developer', duration: '2022-2024' },
      { company: 'Digital Agency', title: 'Junior Developer', duration: '2021-2022' }
    ]
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1 (555) 345-6789',
    skills: ['Angular', 'Java', 'Spring Boot', 'AWS', 'Kubernetes'],
    experience: '7 years',
    status: 'Pending',
    uploadDate: '2024-01-13',
    location: 'Austin, TX',
    education: 'BS Information Technology',
    summary: 'Senior software engineer with extensive enterprise application experience.',
    previousRoles: [
      { company: 'Enterprise Solutions', title: 'Lead Developer', duration: '2020-2024' },
      { company: 'Corporate Systems', title: 'Senior Developer', duration: '2017-2020' }
    ]
  },
  {
    id: 4,
    name: 'Sarah Connor',
    email: 'sarah.connor@email.com',
    phone: '+1 (555) 456-7890',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    experience: '4 years',
    status: 'Active',
    uploadDate: '2024-01-12',
    location: 'Los Angeles, CA',
    education: 'BS Mobile Development',
    summary: 'Mobile app developer specializing in cross-platform solutions.',
    previousRoles: [
      { company: 'Mobile Innovations', title: 'Mobile Developer', duration: '2021-2024' },
      { company: 'App Studio', title: 'Junior Mobile Dev', duration: '2020-2021' }
    ]
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1 (555) 567-8901',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
    experience: '6 years',
    status: 'Active',
    uploadDate: '2024-01-11',
    location: 'Seattle, WA',
    education: 'MS Data Science',
    summary: 'Backend engineer with strong focus on scalable web applications.',
    previousRoles: [
      { company: 'Data Systems Inc', title: 'Backend Engineer', duration: '2019-2024' },
      { company: 'Web Solutions', title: 'Python Developer', duration: '2018-2019' }
    ]
  }
];

export const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
    type: 'Full-time',
    status: 'Open',
    salary: '$80,000 - $120,000',
    postedDate: '2024-01-10',
    description: 'We are looking for a senior frontend developer to join our growing team.',
    requirements: [
      '5+ years of React experience',
      'Strong JavaScript/TypeScript skills',
      'Experience with modern CSS frameworks',
      'Knowledge of testing frameworks'
    ],
    benefits: ['Health insurance', 'Remote work', '401k matching', 'Flexible hours']
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    skills: ['Node.js', 'Python', 'MongoDB', 'Express'],
    type: 'Full-time',
    status: 'Open',
    salary: '$90,000 - $130,000',
    postedDate: '2024-01-09',
    description: 'Join our backend team to build scalable APIs and microservices.',
    requirements: [
      '3+ years of backend development',
      'Experience with Node.js or Python',
      'Database design experience',
      'API development expertise'
    ],
    benefits: ['Health insurance', 'Stock options', 'Gym membership', 'Learning budget']
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Innovation Labs',
    location: 'San Francisco, CA',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    type: 'Contract',
    status: 'Open',
    salary: '$100,000 - $150,000',
    postedDate: '2024-01-08',
    description: 'Contract position for experienced full-stack developer.',
    requirements: [
      'Full-stack development experience',
      'React and Node.js proficiency',
      'Cloud platform experience',
      'Agile methodology knowledge'
    ],
    benefits: ['Competitive rate', 'Flexible schedule', 'Remote options']
  },
  {
    id: 4,
    title: 'Mobile App Developer',
    company: 'Mobile Solutions',
    location: 'Austin, TX',
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    type: 'Full-time',
    status: 'Open',
    salary: '$75,000 - $110,000',
    postedDate: '2024-01-07',
    description: 'Develop cross-platform mobile applications for our clients.',
    requirements: [
      'Mobile app development experience',
      'React Native or Flutter expertise',
      'App store deployment knowledge',
      'UI/UX design understanding'
    ],
    benefits: ['Health insurance', 'Professional development', 'Team events']
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    location: 'Remote',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    type: 'Full-time',
    status: 'Open',
    salary: '$95,000 - $140,000',
    postedDate: '2024-01-06',
    description: 'Manage cloud infrastructure and deployment pipelines.',
    requirements: [
      'DevOps/SRE experience',
      'Cloud platform expertise',
      'Container orchestration',
      'Infrastructure as Code'
    ],
    benefits: ['Health insurance', 'Remote work', 'Conference attendance', 'Stock options']
  }
];

export const mockMatches = [
  {
    id: 1,
    resumeId: 1,
    jobId: 1,
    score: 85,
    status: 'pending',
    matchedSkills: ['React', 'JavaScript'],
    createdDate: '2024-01-15',
    notes: 'Strong technical match with good experience level'
  },
  {
    id: 2,
    resumeId: 2,
    jobId: 4,
    score: 78,
    status: 'approved',
    matchedSkills: ['Vue.js', 'JavaScript'],
    createdDate: '2024-01-14',
    notes: 'Good frontend skills, could adapt to mobile development'
  },
  {
    id: 3,
    resumeId: 3,
    jobId: 3,
    score: 92,
    status: 'pending',
    matchedSkills: ['Java', 'AWS'],
    createdDate: '2024-01-13',
    notes: 'Excellent match with enterprise experience'
  },
  {
    id: 4,
    resumeId: 4,
    jobId: 4,
    score: 95,
    status: 'approved',
    matchedSkills: ['React Native', 'Flutter', 'iOS', 'Android'],
    createdDate: '2024-01-12',
    notes: 'Perfect match for mobile development role'
  },
  {
    id: 5,
    resumeId: 5,
    jobId: 2,
    score: 88,
    status: 'pending',
    matchedSkills: ['Python', 'MongoDB'],
    createdDate: '2024-01-11',
    notes: 'Strong backend skills with relevant experience'
  }
];

export const mockAnalytics = {
  totalResumes: 5,
  totalJobs: 5,
  totalMatches: 5,
  successRate: 85,
  averageMatchScore: 87.6,
  topSkills: [
    { skill: 'JavaScript', count: 15, percentage: 91 },
    { skill: 'React', count: 12, percentage: 85 },
    { skill: 'Node.js', count: 10, percentage: 72 },
    { skill: 'Python', count: 8, percentage: 68 },
    { skill: 'AWS', count: 7, percentage: 58 }
  ],
  hiringFunnel: {
    applications: 156,
    screened: 89,
    interviewed: 34,
    hired: 12
  },
  monthlyStats: [
    { month: 'Jan', resumes: 45, jobs: 12, matches: 23 },
    { month: 'Feb', resumes: 52, jobs: 15, matches: 28 },
    { month: 'Mar', resumes: 38, jobs: 10, matches: 19 },
    { month: 'Apr', resumes: 61, jobs: 18, matches: 31 },
    { month: 'May', resumes: 47, jobs: 13, matches: 25 },
    { month: 'Jun', resumes: 55, jobs: 16, matches: 29 }
  ],
  recentActivity: [
    {
      id: 1,
      type: 'resume',
      message: 'New resume uploaded: John Smith',
      timestamp: '2 hours ago',
      icon: '📄'
    },
    {
      id: 2,
      type: 'job',
      message: 'Job posted: Senior Developer',
      timestamp: '5 hours ago',
      icon: '💼'
    },
    {
      id: 3,
      type: 'match',
      message: 'Match found: Sarah Connor',
      timestamp: '1 day ago',
      icon: '🎯'
    },
    {
      id: 4,
      type: 'hire',
      message: 'Candidate hired: Mike Johnson',
      timestamp: '2 days ago',
      icon: '✅'
    }
  ]
};

// Utility functions for mock data
export const mockUtils = {
  // Get random resume
  getRandomResume: () => {
    const randomIndex = Math.floor(Math.random() * mockResumes.length);
    return mockResumes[randomIndex];
  },

  // Get random job
  getRandomJob: () => {
    const randomIndex = Math.floor(Math.random() * mockJobs.length);
    return mockJobs[randomIndex];
  },

  // Generate random match score
  generateMatchScore: () => {
    return Math.floor(Math.random() * 30) + 70; // Score between 70-100
  },

  // Get resumes by skill
  getResumesBySkill: (skill) => {
    return mockResumes.filter(resume => 
      resume.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  },

  // Get jobs by skill
  getJobsBySkill: (skill) => {
    return mockJobs.filter(job => 
      job.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  },

  // Find potential matches
  findMatches: (resumeId) => {
    const resume = mockResumes.find(r => r.id === resumeId);
    if (!resume) return [];

    return mockJobs.map(job => {
      const matchedSkills = resume.skills.filter(skill => 
        job.skills.some(jobSkill => 
          jobSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      const score = Math.min(95, (matchedSkills.length / job.skills.length) * 100 + Math.random() * 10);
      
      return {
        jobId: job.id,
        job: job,
        score: Math.round(score),
        matchedSkills: matchedSkills
      };
    }).filter(match => match.score > 60).sort((a, b) => b.score - a.score);
  }
};

// API response simulators
export const mockApiResponses = {
  // Simulate successful response
  success: (data) => ({
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  }),

  // Simulate error response
  error: (message, code = 500) => ({
    success: false,
    error: {
      message: message,
      code: code,
      timestamp: new Date().toISOString()
    }
  }),

  // Simulate loading delay
  delay: (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default {
  mockResumes,
  mockJobs,
  mockMatches,
  mockAnalytics,
  mockUtils,
  mockApiResponses
};
