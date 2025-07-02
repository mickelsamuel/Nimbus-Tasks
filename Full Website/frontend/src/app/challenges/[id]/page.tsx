'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  Clock,
  Target,
  FileText,
  Github,
  Globe,
  Video,
  Upload,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare,
  ThumbsUp,
  Share2,
  Award,
  DollarSign,
  Briefcase,
  Send
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  category: string;
  difficulty: string;
  deadline: string;
  maxTeamSize: number;
  rewards: string;
  prizePool: number;
  successCriteria: string;
  tags: string[];
  creator: {
    _id: string;
    name: string;
    avatar?: string;
    title?: string;
  };
  resources?: Array<{
    title: string;
    description?: string;
    url: string;
    type: string;
  }>;
  requirements?: string[];
  evaluationCriteria?: Array<{
    criteria: string;
    weight: number;
  }>;
  submissionCount: number;
  viewCount: number;
  featured: boolean;
  daysRemaining: number;
  isExpired: boolean;
  canSubmit: boolean;
  topSubmissions?: any[];
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submissionDetails: '',
    publicName: '',
    publicEmail: '',
    organization: '',
    githubRepo: '',
    demoUrl: '',
    videoUrl: '',
    technologies: '',
    implementationPlan: '',
    estimatedImpact: '',
    resourcesNeeded: ''
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchChallenge();
  }, [params.id]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/challenges/public/${params.id}`);
      if (!response.ok) throw new Error('Challenge not found');
      const data = await response.json();
      setChallenge(data);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      router.push('/challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add files
      files.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      const headers: HeadersInit = {};
      if (user) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }

      const response = await fetch(`/api/challenges/public/${params.id}/submit`, {
        method: 'POST',
        headers,
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to submit');

      const result = await response.json();
      
      // Show success message
      alert('Your submission has been received successfully!');
      setShowSubmitForm(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        submissionDetails: '',
        publicName: '',
        publicEmail: '',
        organization: '',
        githubRepo: '',
        demoUrl: '',
        videoUrl: '',
        technologies: '',
        implementationPlan: '',
        estimatedImpact: '',
        resourcesNeeded: ''
      });
      setFiles([]);
      
      // Refresh challenge data
      fetchChallenge();
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge not found</h2>
          <Link href="/challenges">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Back to Challenges
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/challenges">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                Back to Challenges
              </button>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Share2 className="w-5 h-5" />
              </button>
              {user && (
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Star className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              {challenge.featured && (
                <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Featured
                </span>
              )}
            </div>
            {challenge.prizePool > 0 && (
              <div className="text-right">
                <div className="text-sm opacity-80">Prize Pool</div>
                <div className="text-2xl font-bold">${challenge.prizePool.toLocaleString()}</div>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {challenge.title}
          </h1>
          
          <p className="text-xl text-purple-100 mb-6">
            {challenge.description}
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{challenge.daysRemaining} days remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{challenge.submissionCount} submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>{challenge.category}</span>
            </div>
          </div>

          {challenge.canSubmit && !challenge.isExpired && (
            <motion.button
              onClick={() => setShowSubmitForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Submit Your Solution
            </motion.button>
          )}

          {challenge.isExpired && (
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg px-6 py-3 inline-flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              This challenge has ended
            </div>
          )}
        </div>
      </section>

      {/* Content Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg">
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex -mb-px">
              {['overview', 'requirements', 'submissions', 'discussion'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Detailed Description */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Challenge Overview</h3>
                  <div className="prose max-w-none text-gray-600">
                    {challenge.detailedDescription || challenge.description}
                  </div>
                </div>

                {/* Success Criteria */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-600" />
                    Success Criteria
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="text-gray-700">{challenge.successCriteria}</p>
                  </div>
                </div>

                {/* Rewards */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Rewards & Recognition
                  </h3>
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <p className="text-gray-700">{challenge.rewards}</p>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Creator</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-900">{challenge.creator.name}</p>
                      {challenge.creator.title && (
                        <p className="text-gray-600">{challenge.creator.title}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-8">
                {/* Requirements */}
                {challenge.requirements && challenge.requirements.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Evaluation Criteria */}
                {challenge.evaluationCriteria && challenge.evaluationCriteria.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Evaluation Criteria</h3>
                    <div className="space-y-3">
                      {challenge.evaluationCriteria.map((criteria, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{criteria.criteria}</span>
                            <span className="text-purple-600 font-semibold">{criteria.weight}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${criteria.weight}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {challenge.resources && challenge.resources.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {challenge.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-purple-600 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">{resource.title}</h4>
                              {resource.description && (
                                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Submissions</h3>
                {challenge.topSubmissions && challenge.topSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {challenge.topSubmissions.map((submission, index) => (
                      <div key={submission._id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' :
                              'bg-orange-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{submission.title}</h4>
                              <p className="text-sm text-gray-600">
                                by {submission.submitter?.name || submission.publicSubmitter?.name || 'Anonymous'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">{submission.votes?.count || 0}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{submission.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No submissions yet. Be the first!</p>
                )}
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Discussion feature coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Submit Form Modal */}
      <AnimatePresence>
        {showSubmitForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmitForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Submit Your Solution</h2>
                <p className="text-gray-600 mt-1">Share your innovative solution to this challenge</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  
                  {!user && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="publicName"
                            value={formData.publicName}
                            onChange={handleInputChange}
                            required={!user}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="publicEmail"
                            value={formData.publicEmail}
                            onChange={handleInputChange}
                            required={!user}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization (Optional)
                        </label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Solution Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Give your solution a catchy title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brief Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Summarize your solution in a few sentences"
                    />
                  </div>
                </div>

                {/* Detailed Solution */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Solution Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detailed Solution *
                    </label>
                    <textarea
                      name="submissionDetails"
                      value={formData.submissionDetails}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Provide a comprehensive explanation of your solution..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., React, Node.js, Machine Learning, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Github className="w-4 h-4 inline mr-1" />
                        GitHub Repository
                      </label>
                      <input
                        type="url"
                        name="githubRepo"
                        value={formData.githubRepo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Demo URL
                      </label>
                      <input
                        type="url"
                        name="demoUrl"
                        value={formData.demoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Video className="w-4 h-4 inline mr-1" />
                        Video Demo
                      </label>
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="YouTube/Vimeo link"
                      />
                    </div>
                  </div>
                </div>

                {/* Implementation Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Implementation Plan</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      How would you implement this solution?
                    </label>
                    <textarea
                      name="implementationPlan"
                      value={formData.implementationPlan}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe the steps to implement your solution..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Impact
                      </label>
                      <textarea
                        name="estimatedImpact"
                        value={formData.estimatedImpact}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="What impact will this have?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resources Needed
                      </label>
                      <textarea
                        name="resourcesNeeded"
                        value={formData.resourcesNeeded}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="What resources are required?"
                      />
                    </div>
                  </div>
                </div>

                {/* File Uploads */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Supporting Documents
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mov,.zip"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 5 files, 10MB each. Accepted: PDF, DOC, Images, Videos, ZIP
                  </p>
                  {files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Selected files:</p>
                      <ul className="text-sm text-gray-600">
                        {files.map((file, index) => (
                          <li key={index}>• {file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Solution
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}