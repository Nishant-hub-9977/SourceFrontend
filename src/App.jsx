import React, { useState } from 'react';
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
    status: 'Closed'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resumes] = useState(mockResumes);
  const [jobs] = useState(mockJobs);
  const [notification, setNotification] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            showNotification(`File "${file.name}" uploaded successfully!`, 'success');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  // Calculate statistics
  const stats = {
    totalResumes: resumes.length,
    activeJobs: jobs.filter(job => job.status === 'Open').length,
    totalMatches: 12,
    pendingReviews: resumes.filter(resume => resume.status === 'Pending').length
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">RecruitAI</h1>
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
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="fade-in">
            <h2 className="text-white mb-4">Dashboard Overview</h2>
            
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalResumes}</div>
                <div className="stat-label">Total Resumes</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.activeJobs}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalMatches}</div>
                <div className="stat-label">AI Matches</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.pendingReviews}</div>
                <div className="stat-label">Pending Reviews</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Upload Resume</h3>
                </div>
                <div className="card-content">
                  <div 
                    className="upload-area"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="upload-text">
                      {isUploading ? (
                        <div>
                          <div className="loading-spinner"></div>
                          <div>Uploading... {uploadProgress}%</div>
                        </div>
                      ) : (
                        <div>
                          <div>📄 Drop files here or click to upload</div>
                          <div className="text-gray-400">PDF, DOC, DOCX, TXT</div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Activity</h3>
                </div>
                <div className="card-content">
                  <div className="item-list">
                    <div className="list-item">
                      <div className="item-info">
                        <div className="item-title">New resume uploaded</div>
                        <div className="item-subtitle">John Doe - 2 hours ago</div>
                      </div>
                    </div>
                    <div className="list-item">
                      <div className="item-info">
                        <div className="item-title">Job posting created</div>
                        <div className="item-subtitle">Frontend Developer - 4 hours ago</div>
                      </div>
                    </div>
                    <div className="list-item">
                      <div className="item-info">
                        <div className="item-title">AI match found</div>
                        <div className="item-subtitle">Jane Smith → Backend Role - 6 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumes Tab */}
        {activeTab === 'resumes' && (
          <div className="fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white">Resume Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => showNotification('Bulk upload feature coming soon!', 'info')}
              >
                Bulk Upload
              </button>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div className="item-list">
                  {resumes.map(resume => (
                    <div key={resume.id} className="list-item">
                      <div className="item-info">
                        <div className="item-title">{resume.name}</div>
                        <div className="item-subtitle">
                          {resume.email} • {resume.experience} • {resume.skills.join(', ')}
                        </div>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => showNotification(`Viewing ${resume.name}'s profile`, 'info')}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => showNotification(`Finding matches for ${resume.name}`, 'success')}
                        >
                          Match
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white">Job Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => showNotification('Create new job feature coming soon!', 'info')}
              >
                Create Job
              </button>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div className="item-list">
                  {jobs.map(job => (
                    <div key={job.id} className="list-item">
                      <div className="item-info">
                        <div className="item-title">{job.title}</div>
                        <div className="item-subtitle">
                          {job.company} • {job.location} • {job.type} • {job.skills.join(', ')}
                        </div>
                      </div>
                      <div className="item-actions">
                        <span className={`status-badge ${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => showNotification(`Editing ${job.title}`, 'info')}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => showNotification(`Finding candidates for ${job.title}`, 'success')}
                        >
                          Find Candidates
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="fade-in">
            <h2 className="text-white mb-4">Analytics & Insights</h2>
            
            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Hiring Funnel</h3>
                </div>
                <div className="card-content">
                  <div className="analytics-chart">
                    <div className="chart-bar" style={{height: '80%'}}>
                      <div className="chart-label">Applications: 150</div>
                    </div>
                    <div className="chart-bar" style={{height: '60%'}}>
                      <div className="chart-label">Screened: 90</div>
                    </div>
                    <div className="chart-bar" style={{height: '40%'}}>
                      <div className="chart-label">Interviewed: 30</div>
                    </div>
                    <div className="chart-bar" style={{height: '20%'}}>
                      <div className="chart-label">Hired: 8</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Top Skills</h3>
                </div>
                <div className="card-content">
                  <div className="skills-chart">
                    <div className="skill-item">
                      <span>JavaScript</span>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span>React</span>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{width: '70%'}}></div>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span>Python</span>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{width: '65%'}}></div>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span>Node.js</span>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{width: '55%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span>{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
