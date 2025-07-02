'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload,
  FileText,
  CheckCircle,
  Send
} from 'lucide-react'

interface TicketFormData {
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: string
  subject: string
  description: string
  attachments: File[]
}

interface TicketTabProps {
  ticketForm: TicketFormData
  setTicketForm: React.Dispatch<React.SetStateAction<TicketFormData>>
  isSubmitting: boolean
  submitSuccess: boolean
  onSubmit: (e: React.FormEvent) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (index: number) => void
}

export default function TicketTab({ 
  ticketForm, 
  setTicketForm, 
  isSubmitting, 
  submitSuccess, 
  onSubmit, 
  onFileUpload, 
  onRemoveFile 
}: TicketTabProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const priorityOptions = [
    { value: 'critical', label: 'Critical', color: '#DC2626', sla: '15 min' },
    { value: 'high', label: 'High', color: '#F59E0B', sla: '1 hour' },
    { value: 'medium', label: 'Medium', color: '#3B82F6', sla: '4 hours' },
    { value: 'low', label: 'Low', color: '#059669', sla: '24 hours' }
  ]

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="p-8 rounded-3xl"
        style={{
          background: isDarkMode
            ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.5) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: isDarkMode
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
          >
            Executive Issue Resolution
          </h2>
          <p 
            style={{ color: isDarkMode ? '#CBD5E1' : '#4B5563' }}
          >
            We&apos;ll get you back to excellence quickly
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Priority Level */}
          <div>
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
            >
              Priority Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setTicketForm(prev => ({ ...prev, priority: priority.value as 'critical' | 'high' | 'medium' | 'low' }))}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
                    ticketForm.priority === priority.value
                      ? 'shadow-lg'
                      : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: ticketForm.priority === priority.value
                      ? isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255,255,255,0.2)'
                      : isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.05)',
                    color: isDarkMode ? '#F1F5F9' : '#1F2937',
                    borderColor: ticketForm.priority === priority.value ? priority.color : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (ticketForm.priority !== priority.value) {
                      e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (ticketForm.priority !== priority.value) {
                      e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.05)'
                    }
                  }}
                >
                  <div>{priority.label}</div>
                  <div className="text-xs opacity-70">{priority.sla} SLA</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
            >
              Issue Category
            </label>
            <select
              value={ticketForm.category}
              onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-teal-400 transition-all duration-300"
              style={{
                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.05)',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                color: isDarkMode ? '#F1F5F9' : '#1F2937'
              }}
              required
            >
              <option value="">Select a category</option>
              <option value="account">Account Security</option>
              <option value="system">System Access</option>
              <option value="training">Training Issues</option>
              <option value="feature">Feature Requests</option>
              <option value="escalation">Executive Escalation</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
            >
              Subject
            </label>
            <input
              type="text"
              value={ticketForm.subject}
              onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-teal-400 transition-all duration-300"
              style={{
                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.05)',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                color: isDarkMode ? '#F1F5F9' : '#1F2937'
              }}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
            >
              Detailed Description
            </label>
            <textarea
              value={ticketForm.description}
              onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
              rows={6}
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-teal-400 transition-all duration-300 resize-none"
              style={{
                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.05)',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                color: isDarkMode ? '#F1F5F9' : '#1F2937'
              }}
              placeholder="Please provide detailed information about your issue..."
              required
            />
          </div>

          {/* File Attachments */}
          <div>
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: isDarkMode ? '#F1F5F9' : '#1F2937' }}
            >
              Attachments (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={onFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer"
                style={{
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  color: isDarkMode ? '#CBD5E1' : '#6B7280'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  e.currentTarget.style.color = isDarkMode ? '#F1F5F9' : '#1F2937'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                  e.currentTarget.style.color = isDarkMode ? '#CBD5E1' : '#6B7280'
                }}
              >
                <Upload className="h-5 w-5" />
                Click to upload files or drag and drop
              </label>
              
              {ticketForm.attachments.length > 0 && (
                <div className="space-y-2">
                  {ticketForm.attachments.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.05)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileText 
                          className="h-4 w-4" 
                          style={{ color: isDarkMode ? '#94A3B8' : '#6B7280' }}
                        />
                        <span 
                          className="text-sm"
                          style={{ color: isDarkMode ? '#CBD5E1' : '#4B5563' }}
                        >
                          {file.name}
                        </span>
                        <span 
                          className="text-xs"
                          style={{ color: isDarkMode ? '#64748B' : '#9CA3AF' }}
                        >
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || submitSuccess}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden disabled:opacity-70"
            style={{
              background: submitSuccess 
                ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                : 'linear-gradient(135deg, #0D9488 0%, #059669 100%)',
              boxShadow: '0 10px 30px rgba(13,148,136,0.4)'
            }}
            whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Submitting...</span>
              </>
            ) : submitSuccess ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Request Submitted!</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Submit Executive Request</span>
              </>
            )}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            />
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}