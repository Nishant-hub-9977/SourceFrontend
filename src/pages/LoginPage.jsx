// Enhanced Login Page with proper error handling and UX
// File: src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username_or_email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    clearError();
    setLocalError('');
  }, [formData, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalLoading(true);

    // Basic validation
    if (!formData.username_or_email.trim()) {
      setLocalError('Please enter your email or username');
      setLocalLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setLocalError('Please enter your password');
      setLocalLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Success will be handled by the redirect effect
        console.log('Login successful');
      } else {
        setLocalError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setLocalError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setFormData({
        username_or_email: 'admin@recruitai.com',
        password: 'password123'
      });
    } else if (type === 'recruiter') {
      setFormData({
        username_or_email: 'recruiter@recruitai.com',
        password: 'password123'
      });
    } else if (type === 'candidate') {
      setFormData({
        username_or_email: 'candidate@recruitai.com',
        password: 'password123'
      });
    }
  };

  const currentError = localError || error;
  const currentLoading = localLoading || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">RecruitAI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Error Display */}
        {currentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-sm font-medium">Login Failed</p>
              <p className="text-red-600 text-sm mt-1">{currentError}</p>
            </div>
          </div>
        )}

        {/* Demo Credentials */}
        {showDemoCredentials && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-900">Demo Credentials</h3>
              <button
                onClick={() => setShowDemoCredentials(false)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Hide
              </button>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="w-full text-left p-2 text-xs bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
              >
                <strong>Admin:</strong> admin@recruitai.com / password123
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('recruiter')}
                className="w-full text-left p-2 text-xs bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
              >
                <strong>Recruiter:</strong> recruiter@recruitai.com / password123
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('candidate')}
                className="w-full text-left p-2 text-xs bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
              >
                <strong>Candidate:</strong> candidate@recruitai.com / password123
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username or Email */}
            <div>
              <label htmlFor="username_or_email" className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                id="username_or_email"
                name="username_or_email"
                value={formData.username_or_email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                placeholder="Enter your email or username"
                disabled={currentLoading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  disabled={currentLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={currentLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={currentLoading}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {currentLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign up
              </Link>
            </p>
            
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to home
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-teal-600 hover:text-teal-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-teal-600 hover:text-teal-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

