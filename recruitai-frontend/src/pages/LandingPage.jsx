import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  FileText, 
  Video, 
  BarChart3, 
  Users, 
  Target, 
  CheckCircle, 
  Star,
  Play,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RecruitAI</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-teal-600 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-teal-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors">Testimonials</a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-teal-600">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-8">
            🚀 AI-Powered Recruitment Platform
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Revolutionize Your{' '}
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Hiring Process
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform recruitment with AI-powered video interviews, intelligent resume matching, 
            and comprehensive candidate assessment. Built specifically for IT industries.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 px-8 py-4 text-lg">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              10 free credits included
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Video className="w-6 h-6 text-teal-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">AI Interview Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-8">Real-time candidate assessment</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Communication Skills</span>
                  <span className="text-green-600 font-bold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Technical Knowledge</span>
                  <span className="text-blue-600 font-bold">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Problem Solving</span>
                  <span className="text-yellow-600 font-bold">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-semibold">AI Recommendation: Hire</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">10K+</div>
              <div className="text-gray-600">Interviews Conducted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Companies Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">✨ Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything You Need for Modern Recruitment
            </p>
            <p className="text-gray-600 mt-2">
              Our comprehensive platform combines AI technology with intuitive design to streamline your entire hiring process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Interviews</h3>
              <p className="text-gray-600 mb-4">
                Advanced AI conducts comprehensive video interviews with emotion detection, skill assessment, and real-time analysis.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Facial expression analysis</li>
                <li>• Communication skill evaluation</li>
                <li>• Technical & coding assessments</li>
                <li>• AI-assisted answer detection</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Resume Matching</h3>
              <p className="text-gray-600">
                Intelligent resume parsing and matching with automatic scoring against job requirements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Interview Platform</h3>
              <p className="text-gray-600">
                Seamless video interview experience with recording, analysis, and comprehensive reporting.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                Detailed reports with skill percentages, AI recommendations, and hiring insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🔄 Simple Process</h2>
            <p className="text-xl text-gray-600">How RecruitAI Works</p>
            <p className="text-gray-600 mt-2">Get started in minutes with our streamlined recruitment process.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                01
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Post Job & Upload Resumes</h3>
              <p className="text-gray-600">
                Create job descriptions with AI assistance and upload candidate resumes. Our system automatically extracts contact information and calculates matching scores.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                02
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Conducts Interviews</h3>
              <p className="text-gray-600">
                Qualified candidates (60%+ match) receive automatic interview links. Our AI conducts comprehensive video interviews with real-time analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                03
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Review & Hire</h3>
              <p className="text-gray-600">
                Get detailed reports with skill assessments, AI recommendations, and interview recordings. Make informed hiring decisions quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">💬 Customer Stories</h2>
            <p className="text-xl text-gray-600">What Our Customers Say</p>
            <p className="text-gray-600 mt-2">Join hundreds of companies that have transformed their hiring process with RecruitAI.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "RecruitAI transformed our hiring process. The AI interviews are incredibly accurate and save us hours of manual screening."
              </p>
              <div>
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-gray-600">HR Director at TechCorp</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The resume matching feature is outstanding. We now focus only on the most qualified candidates."
              </p>
              <div>
                <div className="font-semibold text-gray-900">Michael Chen</div>
                <div className="text-gray-600">Talent Acquisition Lead</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "As a small team, RecruitAI helps us compete with larger companies in attracting top talent."
              </p>
              <div>
                <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                <div className="text-gray-600">Startup Founder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using RecruitAI to find the best talent faster and more efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link to="/register">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>

          <p className="text-white/80 text-sm">
            No credit card required • 10 free interview credits • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">RecruitAI</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 RecruitAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

