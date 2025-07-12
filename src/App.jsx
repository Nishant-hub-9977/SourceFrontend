import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Simple Dashboard Component
const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockResumes = [
      { id: 1, name: 'John Doe Resume.pdf', skills: ['JavaScript', 'React', 'Node.js'] },
      { id: 2, name: 'Jane Smith Resume.pdf', skills: ['Python', 'Django', 'PostgreSQL'] },
      { id: 3, name: 'Mike Johnson Resume.pdf', skills: ['Java', 'Spring Boot', 'MongoDB'] }
    ];
    
    const mockJobs = [
      { id: 1, title: 'Frontend Developer', description: 'React and JavaScript developer needed' },
      { id: 2, title: 'Backend Developer', description: 'Python Django developer needed' },
      { id: 3, title: 'Full Stack Developer', description: 'Java Spring Boot developer needed' }
    ];

    setResumes(mockResumes);
    setJobs(mockJobs);
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setIsLoading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newResumes = files.map((file, index) => ({
        id: resumes.length + index + 1,
        name: file.name,
        skills: ['New Skill', 'Another Skill']
      }));
      setResumes([...resumes, ...newResumes]);
      setIsLoading(false);
      alert(`${files.length} resume(s) uploaded successfully!`);
    }, 1000);
  };

  const createJob = () => {
    const title = prompt('Enter job title:');
    if (title) {
      const newJob = {
        id: jobs.length + 1,
        title: title,
        description: 'New job description'
      };
      setJobs([...jobs, newJob]);
      alert('Job created successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">RecruitAI - No Auth</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Demo User</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">D</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Resumes</h3>
            <p className="text-3xl font-bold text-blue-600">{resumes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Jobs</h3>
            <p className="text-3xl font-bold text-green-600">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900">Matches</h3>
            <p className="text-3xl font-bold text-purple-600">12</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Resumes</h3>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {isLoading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Management</h3>
            <button
              onClick={createJob}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Create New Job
            </button>
          </div>
        </div>

        {/* Resumes List */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Resumes</h3>
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{resume.name}</p>
                  <p className="text-sm text-gray-600">Skills: {resume.skills.join(', ')}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Jobs</h3>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </div>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Match
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
