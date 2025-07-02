'use client'

import React from 'react'
import { TrendingUp, Users, Target, Calendar, BarChart3 } from 'lucide-react'

export default function DevelopmentTab() {
  return (
    <div 
      className="tab-content-section" 
      role="tabpanel" 
      id="tabpanel-development" 
      aria-labelledby="tab-development"
    >
      <div className="development-theater">
        <div className="development-header">
          <h3 className="theater-title">Career Development Planning</h3>
          <p className="theater-description">
            Strategic career progression and skill development pathways for your team
          </p>
        </div>

        <div className="development-grid">
          <div className="development-card">
            <div className="card-header">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h4>Individual Development Plans</h4>
            </div>
            <div className="card-content">
              <p>Create personalized career growth roadmaps for each team member</p>
              <button className="development-btn">Create New Plan</button>
            </div>
          </div>

          <div className="development-card">
            <div className="card-header">
              <Users className="w-6 h-6 text-blue-400" />
              <h4>Skill Gap Analysis</h4>
            </div>
            <div className="card-content">
              <p>Identify competency gaps and recommend targeted training</p>
              <button className="development-btn">Run Analysis</button>
            </div>
          </div>

          <div className="development-card">
            <div className="card-header">
              <Target className="w-6 h-6 text-purple-400" />
              <h4>Goal Setting & Tracking</h4>
            </div>
            <div className="card-content">
              <p>Set SMART goals and monitor progress toward career objectives</p>
              <button className="development-btn">Set Goals</button>
            </div>
          </div>

          <div className="development-card">
            <div className="card-header">
              <Calendar className="w-6 h-6 text-orange-400" />
              <h4>Mentorship Programs</h4>
            </div>
            <div className="card-content">
              <p>Match mentors with mentees for accelerated development</p>
              <button className="development-btn">Manage Program</button>
            </div>
          </div>

          <div className="development-card">
            <div className="card-header">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <h4>Performance Reviews</h4>
            </div>
            <div className="card-content">
              <p>Conduct comprehensive performance evaluations and feedback</p>
              <button className="development-btn">Schedule Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}