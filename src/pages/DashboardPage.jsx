import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Users, 
  TrendingUp, 
  Search, 
  Filter,
  Download,
  Eye,
  Trash2,
  Plus,
  BarChart3,
  Settings,
  Bell,
  User,
  LogOut,
  Home,
  Briefcase,
  UserCheck,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

const DashboardPage = ({ apiClient, addNotification }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalJobs: 0,
    matchedCandidates: 0,
    pendingReviews: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('');

  // Mock user data (since we removed auth)
  const currentUser = {
    name: 'Demo User',
    email: 'demo@recruitai.com',
    role: 'recruiter',
    avatar: null
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load resumes
      const resumesResponse = await apiClient.getResumes();
      if (resumesResponse.success) {
        setResumes(resumesResponse.resumes || []);
      }

      // Load jobs
      const jobsResponse = await apiClient.getJobs();
      if (jobsResponse.success) {
        setJobs(jobsResponse.jobs || []);
      }

      // Load stats
      const statsResponse = await apiClient.getStats();
      if (statsResponse.success) {
        setStats(statsResponse.stats || stats);
      }

      addNotification({
        type: 'success',
        message: 'Dashboard data loaded successfully'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        if (selectedJob) {
          formData.append('job_id', selectedJob);
        }

        const response = await apiClient.uploadResume(formData);
        if (response.success) {
          addNotification({
            type: 'success',
            message: `Resume "${file.name}" uploaded successfully`
          });
        }
      }
      
      // Reload resumes
      await loadDashboardData();
    } catch (error) {
      console.error('Upload error:', error);
      addNotification({
        type: 'error',
        message: 'Failed to upload resume(s)'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = async () => {
    const jobTitle = prompt('Enter job title:');
    if (!jobTitle) return;

    const jobDescription = prompt('Enter job description:');
    if (!jobDescription) return;

    try {
      const response = await apiClient.createJob({
        title: jobTitle,
        description: jobDescription,
        status: 'active'
      });

      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Job created successfully'
        });
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Create job error:', error);
      addNotification({
        type: 'error',
        message: 'Failed to create job'
      });
    }
  };

  const handleMatchResumes = async () => {
    if (!selectedJob) {
      addNotification({
        type: 'warning',
        message: 'Please select a job first'
      });
      return;
    }

    const job = jobs.find(j => j.id === selectedJob);
    if (!job) return;

    setIsLoading(true);
    try {
      const response = await apiClient.matchResumes(job.description);
      if (response.success) {
        addNotification({
          type: 'success',
          message: `Found ${response.matches?.length || 0} matching candidates`
        });
        // You could update the UI to show matches here
      }
    } catch (error) {
      console.error('Match error:', error);
      addNotification({
        type: 'error',
        message: 'Failed to match resumes'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResumes = resumes.filter(resume =>
    resume.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon: Icon, title, value, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ResumeCard = ({ resume }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{resume.candidate_name || 'Unknown'}</h3>
          <p className="text-sm text-gray-600">{resume.filename}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {resume.skills?.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {skill}
              </span>
            ))}
            {resume.skills?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{resume.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-600">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">RecruitAI</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'resumes', label: 'Resumes', icon: FileText },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FileText}
                title="Total Resumes"
                value={stats.totalResumes || resumes.length}
                color="blue"
              />
              <StatCard
                icon={Briefcase}
                title="Active Jobs"
                value={stats.totalJobs || jobs.length}
                color="green"
              />
              <StatCard
                icon={UserCheck}
                title="Matched Candidates"
                value={stats.matchedCandidates || 0}
                color="purple"
              />
              <StatCard
                icon={Clock}
                title="Pending Reviews"
                value={stats.pendingReviews || 0}
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Upload Resumes</span>
                    <span className="text-xs text-gray-500">PDF, DOCX, TXT</span>
                  </label>
                </div>

                <button
                  onClick={handleCreateJob}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Job</span>
                  <span className="text-xs text-gray-500">Add new position</span>
                </button>

                <button
                  onClick={handleMatchResumes}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Search className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Match Resumes</span>
                  <span className="text-xs text-gray-500">Find candidates</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {resumes.slice(0, 5).map((resume, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Resume uploaded: {resume.filename}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(resume.upload_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {resumes.length === 0 && (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resumes Tab */}
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search resumes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
              
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="bulk-upload"
              />
              <label
                htmlFor="bulk-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Resumes
              </label>
            </div>

            {/* Resumes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume, index) => (
                <ResumeCard key={index} resume={resume} />
              ))}
            </div>

            {filteredResumes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by uploading some resumes.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Job Positions</h2>
              <button
                onClick={handleCreateJob}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.description?.substring(0, 100)}...</p>
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Status: {job.status}</span>
                        <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedJob(job.id)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      Select for Matching
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first job position to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">Resume Upload Trends</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-16 w-16" />
                  <span className="ml-2">Chart visualization would go here</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">Matching Success Rate</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="h-16 w-16" />
                  <span className="ml-2">Chart visualization would go here</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

