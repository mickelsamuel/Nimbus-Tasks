'use client'

import React from 'react'
import { Users, Bell, Shield, BarChart3, Mail } from 'lucide-react'

export default function SettingsTab() {
  return (
    <div 
      className="tab-content-section" 
      role="tabpanel" 
      id="tabpanel-settings" 
      aria-labelledby="tab-settings"
    >
      <div className="settings-theater">
        <div className="settings-header">
          <h3 className="theater-title">Team Management Settings</h3>
          <p className="theater-description">
            Configure team preferences, permissions, and system behavior
          </p>
        </div>

        <div className="settings-sections">
          <div className="settings-section">
            <div className="section-header">
              <Users className="w-5 h-5 text-blue-400" />
              <h4>Team Configuration</h4>
            </div>
            <div className="setting-item">
              <label className="setting-label">Team Size Limit</label>
              <select className="setting-select">
                <option value="25">25 members</option>
                <option value="50">50 members</option>
                <option value="100">100 members</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Department Access</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Investment Banking
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Wealth Management
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Risk Management
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h4>Notification Settings</h4>
            </div>
            <div className="setting-item">
              <label className="setting-label">Training Reminders</label>
              <select className="setting-select">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Performance Alerts</label>
              <div className="toggle-switch">
                <input type="checkbox" id="performance-alerts" defaultChecked />
                <label htmlFor="performance-alerts" className="toggle-label"></label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Shield className="w-5 h-5 text-green-400" />
              <h4>Security & Permissions</h4>
            </div>
            <div className="setting-item">
              <label className="setting-label">Data Access Level</label>
              <select className="setting-select">
                <option value="full">Full Access</option>
                <option value="limited">Limited Access</option>
                <option value="view-only">View Only</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Two-Factor Authentication</label>
              <div className="toggle-switch">
                <input type="checkbox" id="2fa" defaultChecked />
                <label htmlFor="2fa" className="toggle-label"></label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h4>Analytics & Reporting</h4>
            </div>
            <div className="setting-item">
              <label className="setting-label">Report Frequency</label>
              <select className="setting-select">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Performance Tracking</label>
              <div className="toggle-switch">
                <input type="checkbox" id="performance-tracking" defaultChecked />
                <label htmlFor="performance-tracking" className="toggle-label"></label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Mail className="w-5 h-5 text-cyan-400" />
              <h4>Communication Preferences</h4>
            </div>
            <div className="setting-item">
              <label className="setting-label">Email Notifications</label>
              <div className="toggle-switch">
                <input type="checkbox" id="email-notifications" defaultChecked />
                <label htmlFor="email-notifications" className="toggle-label"></label>
              </div>
            </div>
            <div className="setting-item">
              <label className="setting-label">Team Updates</label>
              <select className="setting-select">
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="settings-btn primary">Save Changes</button>
          <button className="settings-btn secondary">Reset to Defaults</button>
        </div>
      </div>
    </div>
  )
}