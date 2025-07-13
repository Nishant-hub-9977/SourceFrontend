import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data for demonstration
const mockResumes = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    skills: ['React', 'Node.js', 'JavaScript', 'Python'],
    experience: '5 years',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    skills: ['Vue.js', 'PHP', 'MySQL', 'Docker'],
    experience: '3 years',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    skills: ['Angular', 'Java', 'Spring Boot', 'AWS'],
    experience: '7 years',
    status: 'Pending'
  }
];

const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    skills: ['React', 'JavaScript', 'CSS'],
    type: 'Full-time',
    status: 'Open'
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'StartupXYZ',
    location: 'New York',
    skills: ['Node.js', 'Python', 'MongoDB'],
    type: 'Full-time',
    status: 'Open'
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Innovation Labs',
    location: 'San Francisco',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    type: 'Contract',
    status: 'Open'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resumes, setResumes] = useState(mockResumes);
  const [jobs, setJobs] = useState(mockJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Simulate loading effect
  useEffect(() => {
    document.body.classList.add('app-loaded');
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      // Simulate file processing
      setTimeout(() => {
        setIsLoading(false);
        showNotification(`Resume "${file.name}" uploaded successfully!`);
      }, 2000);
    }
  };

  const handleCreateJob = () => {
    showNotification('Job creation feature coming soon!');
  };

  const handleMatch = (resumeId, jobId) => {
    showNotification(`Matching resume ${resumeId} with job ${jobId}...`);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">
              <span className="logo-icon">🤖</span>
              RecruitAI
            </h1>
            <nav className="nav-tabs">
              <button 
                className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-tab ${activeTab === 'resumes' ? 'active' : ''}`}
                onClick={() => setActiveTab('resumes')}
              >
                Resumes
              </button>
              <button 
                className={`nav-tab ${activeTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobs')}
              >
                Jobs
              </button>
              <button 
                className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard">
              <h2 className="section-title">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📄</div>
                  <div className="stat-info">
                    <h3>{resumes.length}</h3>
                    <p>Total Resumes</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💼</div>
                  <div className="stat-info">
                    <h3>{jobs.length}</h3>
                    <p>Active Jobs</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-info">
                    <h3>12</h3>
                    <p>Matches</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <h3>85%</h3>
                    <p>Success Rate</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <label className="btn btn-primary upload-btn">
                    📤 Upload Resume
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button className="btn btn-secondary" onClick={handleCreateJob}>
                    ➕ Create Job
                  </button>
                  <button className="btn btn-accent" onClick={() => setActiveTab('analytics')}>
                    📊 View Analytics
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resumes Tab */}
          {activeTab === 'resumes' && (
            <div className="resumes-section">
              <div className="section-header">
                <h2 className="section-title">Resume Management</h2>
                <label className="btn btn-primary upload-btn">
                  📤 Upload New Resume
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              
              <div className="items-grid">
                {resumes.map(resume => (
                  <div key={resume.id} className="item-card resume-card">
                    <div className="item-header">
                      <h3>{resume.name}</h3>
                      <span className={`status ${resume.status.toLowerCase()}`}>
                        {resume.status}
                      </span>
                    </div>
                    <p className="item-meta">{resume.email}</p>
                    <p className="item-meta">Experience: {resume.experience}</p>
                    <div className="skills-tags">
                      {resume.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="item-actions">
                      <button className="btn btn-small btn-primary">View</button>
                      <button 
                        className="btn btn-small btn-accent"
                        onClick={() => handleMatch(resume.id, 'auto')}
                      >
                        Match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="jobs-section">
              <div className="section-header">
                <h2 className="section-title">Job Management</h2>
                <button className="btn btn-primary" onClick={handleCreateJob}>
                  ➕ Create New Job
                </button>
              </div>
              
              <div className="items-grid">
                {jobs.map(job => (
                  <div key={job.id} className="item-card job-card">
                    <div className="item-header">
                      <h3>{job.title}</h3>
                      <span className={`status ${job.status.toLowerCase()}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="item-meta">{job.company}</p>
                    <p className="item-meta">{job.location} • {job.type}</p>
                    <div className="skills-tags">
                      {job.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="item-actions">
                      <button className="btn btn-small btn-primary">View</button>
                      <button 
                        className="btn btn-small btn-accent"
                        onClick={() => handleMatch('auto', job.id)}
                      >
                        Find Matches
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <h2 className="section-title">Analytics & Insights</h2>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Hiring Funnel</h3>
                  <div className="funnel-stats">
                    <div className="funnel-item">
                      <span className="funnel-label">Applications</span>
                      <span className="funnel-value">156</span>
                    </div>
                    <div className="funnel-item">
                      <span className="funnel-label">Screened</span>
                      <span className="funnel-value">89</span>
                    </div>
                    <div className="funnel-item">
                      <span className="funnel-label">Interviewed</span>
                      <span className="funnel-value">34</span>
                    </div>
                    <div className="funnel-item">
                      <span className="funnel-label">Hired</span>
                      <span className="funnel-value">12</span>
                    </div>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h3>Top Skills in Demand</h3>
                  <div className="skills-chart">
                    <div className="skill-bar">
                      <span>React</span>
                      <div className="bar"><div className="fill" style={{width: '85%'}}></div></div>
                    </div>
                    <div className="skill-bar">
                      <span>Node.js</span>
                      <div className="bar"><div className="fill" style={{width: '72%'}}></div></div>
                    </div>
                    <div className="skill-bar">
                      <span>Python</span>
                      <div className="bar"><div className="fill" style={{width: '68%'}}></div></div>
                    </div>
                    <div className="skill-bar">
                      <span>JavaScript</span>
                      <div className="bar"><div className="fill" style={{width: '91%'}}></div></div>
                    </div>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">📄</span>
                      <span>New resume uploaded: John Smith</span>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">💼</span>
                      <span>Job posted: Senior Developer</span>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">🎯</span>
                      <span>Match found: Sarah Connor</span>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}

export default App;
