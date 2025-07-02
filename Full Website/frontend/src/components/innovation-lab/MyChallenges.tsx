'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Eye, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Download,
  MessageSquare,
  BarChart,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface Challenge {
  _id: string;
  title: string;
  category: string;
  status: string;
  deadline: string;
  submissionCount: number;
  actualSubmissionCount: number;
  viewCount: number;
  isPublic: boolean;
  createdAt: string;
}

interface Submission {
  _id: string;
  title: string;
  submitter?: {
    name: string;
    email: string;
  };
  publicSubmitter?: {
    name: string;
    email: string;
  };
  status: string;
  score?: number;
  createdAt: string;
  description: string;
}

export default function MyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    fetchMyChallenges();
  }, []);

  const fetchMyChallenges = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/challenges/my-challenges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch challenges');
      
      const data = await response.json();
      setChallenges(data);
      
      // Auto-select first challenge if any
      if (data.length > 0) {
        setSelectedChallenge(data[0]);
        fetchSubmissions(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (challengeId: string) => {
    try {
      setLoadingSubmissions(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/challenges/my-challenges/${challengeId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch submissions');
      
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    fetchSubmissions(challenge._id);
  };

  const handleReviewSubmission = async (submissionId: string, status: string, score?: number, comments?: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/challenges/submissions/${submissionId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          score,
          comments
        })
      });
      
      if (!response.ok) throw new Error('Failed to review submission');
      
      alert('Submission reviewed successfully!');
      if (selectedChallenge) {
        fetchSubmissions(selectedChallenge._id);
      }
    } catch (error) {
      console.error('Error reviewing submission:', error);
      alert('Failed to review submission');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewing': return 'text-blue-600 bg-blue-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'winner': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Challenges List */}
      <div className="lg:col-span-1">
        <h3 className="text-xl font-bold text-white mb-4">Your Challenges</h3>
        
        {challenges.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">No challenges created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleChallengeSelect(challenge)}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all ${
                  selectedChallenge?._id === challenge._id
                    ? 'ring-2 ring-purple-500 bg-white/20'
                    : 'hover:bg-white/15'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white line-clamp-1">{challenge.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                    {challenge.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {challenge.actualSubmissionCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {challenge.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(challenge.deadline).toLocaleDateString()}
                  </span>
                </div>

                {challenge.isPublic && (
                  <Link 
                    href={`/challenges/${challenge._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View Public Page <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Submissions View */}
      <div className="lg:col-span-2">
        {selectedChallenge ? (
          <>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{selectedChallenge.title}</h3>
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <span>Category: {selectedChallenge.category}</span>
                <span>Created: {new Date(selectedChallenge.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Submissions ({submissions.length})</h4>
                <button className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>

              {loadingSubmissions ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-300">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-white">{submission.title}</h5>
                          <p className="text-sm text-gray-300">
                            by {submission.submitter?.name || submission.publicSubmitter?.name || 'Anonymous'}
                            {(submission.submitter?.email || submission.publicSubmitter?.email) && (
                              <span className="text-gray-400"> ({submission.submitter?.email || submission.publicSubmitter?.email})</span>
                            )}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {submission.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Submitted {new Date(submission.createdAt).toLocaleDateString()}
                        </span>
                        
                        {submission.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReviewSubmission(submission._id, 'accepted', 85)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReviewSubmission(submission._id, 'rejected')}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>

                      {submission.score && (
                        <div className="mt-3 flex items-center gap-2">
                          <BarChart className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-purple-400">Score: {submission.score}/100</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">Select a challenge to view submissions</p>
          </div>
        )}
      </div>
    </div>
  );
}