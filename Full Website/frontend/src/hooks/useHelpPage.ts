'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { helpApi, SupportTicketData, ChatSessionData } from '@/lib/api/help'

type TabType = 'quick' | 'faq' | 'ticket' | 'resources'

interface TicketFormData {
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: string
  subject: string
  description: string
  attachments: File[]
}

export const useHelpPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('quick')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({})
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  
  // Ticket form state
  const [ticketForm, setTicketForm] = useState<TicketFormData>({
    priority: 'medium',
    category: '',
    subject: '',
    description: '',
    attachments: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Hydration check
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Navigation handlers
  const handleBackToLogin = () => {
    router.push('/login')
  }

  // Quick action handlers
  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'chat':
        await handleStartChat()
        break
      case 'email':
        window.location.href = 'mailto:support@bnc.ca?subject=Support Request'
        break
      case 'phone':
        alert('📞 Support Hotline: 1-800-BNC-HELP\n\nBusiness Hours:\nMonday - Friday: 8:00 AM - 8:00 PM EST\nSaturday: 9:00 AM - 5:00 PM EST\nSunday: Emergency Support Only')
        break
      default:
        console.log(`Quick action: ${action}`)
    }
  }

  const handleStartChat = async () => {
    try {
      const chatData: ChatSessionData = {
        priority: 'medium',
        category: 'general',
        initialMessage: 'Hello, I need assistance with the platform.'
      }
      
      const response = await helpApi.startChatSession(chatData)
      
      if (response?.sessionId) {
        setShowChatModal(true)
        localStorage.setItem('currentChatSession', response.sessionId)
      } else {
        // Fallback to modal for demonstration
        setShowChatModal(true)
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      // Fallback to modal for demonstration
      setShowChatModal(true)
    }
  }

  // Ticket handlers
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const ticketData: SupportTicketData = {
        priority: ticketForm.priority,
        category: ticketForm.category,
        subject: ticketForm.subject,
        description: ticketForm.description,
        attachments: ticketForm.attachments
      }
      
      const response = await helpApi.createSupportTicket(ticketData)
      
      if (response.success) {
        setSubmitSuccess(true)
        setTicketForm({
          priority: 'medium',
          category: '',
          subject: '',
          description: '',
          attachments: []
        })
        
        setTimeout(() => {
          setSubmitSuccess(false)
          setActiveTab('quick')
        }, 3000)
      } else {
        alert(response.message || 'Failed to submit ticket')
      }
      
    } catch (error) {
      console.error('Ticket submission failed:', error)
      alert('Failed to submit ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setTicketForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setTicketForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  // FAQ handlers
  const handleFAQVote = async (faqId: string, helpful: boolean) => {
    try {
      await helpApi.voteFAQ(faqId, helpful)
      setHelpfulVotes(prev => ({
        ...prev,
        [faqId]: helpful
      }))
      alert(helpful ? 'Thank you for your feedback!' : 'We\'ll work on improving this answer.')
    } catch (error) {
      console.error('Error voting on FAQ:', error)
      setHelpfulVotes(prev => ({
        ...prev,
        [faqId]: helpful
      }))
      alert(helpful ? 'Thank you for your feedback!' : 'We\'ll work on improving this answer.')
    }
  }

  // Resource handlers
  const openResource = (resource: string) => {
    switch (resource) {
      case 'documentation':
        window.open('/help/docs', '_blank')
        break
      case 'videos':
        window.open('/help/training-videos', '_blank')
        break
      case 'forum':
        window.open('/help/community-forum', '_blank')
        break
      case 'best-practices':
        window.open('/help/best-practices', '_blank')
        break
      default:
        alert(`Opening ${resource} resource...`)
    }
  }

  return {
    // State
    activeTab,
    searchQuery,
    selectedCategory,
    isHydrated,
    showChatModal,
    helpfulVotes,
    expandedFAQ,
    ticketForm,
    isSubmitting,
    submitSuccess,
    
    // Setters
    setActiveTab,
    setSearchQuery,
    setSelectedCategory,
    setShowChatModal,
    setExpandedFAQ,
    setTicketForm,
    
    // Handlers
    handleBackToLogin,
    handleQuickAction,
    handleStartChat,
    handleTicketSubmit,
    handleFileUpload,
    removeFile,
    handleFAQVote,
    openResource
  }
}

export default useHelpPage