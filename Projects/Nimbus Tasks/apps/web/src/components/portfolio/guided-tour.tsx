'use client'

import React, { useState, useEffect } from 'react'
import Joyride, { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride'
import { Play, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { Button } from '@nimbus/ui/button'
import { isPortfolioMode, PORTFOLIO_CONFIG } from '~/lib/portfolio/config'

interface GuidedTourProps {
  steps?: Step[]
  autoStart?: boolean
  showSkipButton?: boolean
  onComplete?: () => void
  onSkip?: () => void
}

export function GuidedTour({
  steps = PORTFOLIO_CONFIG.tour.steps,
  autoStart = false,
  showSkipButton = true,
  onComplete,
  onSkip
}: GuidedTourProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  // Only show tour in portfolio mode
  if (!isPortfolioMode() || !PORTFOLIO_CONFIG.tour.enabled) {
    return null
  }

  useEffect(() => {
    if (autoStart && !hasStarted) {
      // Add a small delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        setIsRunning(true)
        setHasStarted(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [autoStart, hasStarted])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (type === EVENTS.STEP_AFTER ? 1 : 0))
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setIsRunning(false)
      setStepIndex(0)

      if (status === STATUS.FINISHED && onComplete) {
        onComplete()
      } else if (status === STATUS.SKIPPED && onSkip) {
        onSkip()
      }
    }
  }

  const startTour = () => {
    setStepIndex(0)
    setIsRunning(true)
    setHasStarted(true)
  }

  const stopTour = () => {
    setIsRunning(false)
    setStepIndex(0)
  }

  const restartTour = () => {
    setStepIndex(0)
    setIsRunning(true)
  }

  return (
    <>
      {/* Tour Trigger Button */}
      {!isRunning && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={startTour}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            ▶ Tour
          </Button>
          {hasStarted && (
            <Button
              onClick={restartTour}
              variant="outline"
              size="sm"
              className="shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Joyride Component */}
      <Joyride
        steps={steps}
        run={isRunning}
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        continuous
        showProgress
        showSkipButton={showSkipButton}
        hideCloseButton={false}
        disableCloseOnEsc={false}
        disableOverlayClose={false}
        spotlightClicks={true}
        spotlightPadding={8}
        styles={{
          options: {
            primaryColor: '#3b82f6',
            width: 380,
            zIndex: 10000,
          },
          tooltip: {
            fontSize: 16,
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          tooltipContent: {
            padding: 0,
          },
          tooltipTitle: {
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 12,
          },
          buttonNext: {
            backgroundColor: '#3b82f6',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
          },
          buttonBack: {
            marginRight: 10,
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: '#6b7280',
          },
          buttonSkip: {
            color: '#6b7280',
            fontSize: 14,
            fontWeight: 500,
          },
          spotlight: {
            borderRadius: 8,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}
        locale={{
          back: (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </>
          ),
          close: (
            <X className="h-4 w-4" />
          ),
          last: (
            <>
              Finish Tour
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          ),
          next: (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          ),
          skip: 'Skip Tour',
        }}
        floaterProps={{
          disableAnimation: false,
        }}
      />

      {/* Tour Progress Indicator */}
      {isRunning && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Step {stepIndex + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= stepIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Hook for controlling the tour programmatically
export function useGuidedTour() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const startTour = () => setIsActive(true)
  const stopTour = () => {
    setIsActive(false)
    setCurrentStep(0)
  }
  const nextStep = () => setCurrentStep(prev => prev + 1)
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1))
  const goToStep = (step: number) => setCurrentStep(step)

  return {
    isActive,
    currentStep,
    startTour,
    stopTour,
    nextStep,
    prevStep,
    goToStep,
    totalSteps: PORTFOLIO_CONFIG.tour.steps.length
  }
}

// Extended tour steps for different pages
export const TOUR_STEPS = {
  dashboard: [
    {
      target: '.dashboard-overview',
      content: 'Welcome to your project dashboard! This gives you a bird\'s-eye view of all your active projects and their current status.',
      placement: 'bottom' as const,
      disableBeacon: true,
      title: 'Dashboard Overview'
    },
    {
      target: '[data-testid="project-card"]:first-child',
      content: 'Each project card shows key metrics: task completion progress, team members, upcoming deadlines, and project health indicators.',
      placement: 'top' as const,
      title: 'Project Cards'
    },
    {
      target: '[data-testid="quick-actions"]',
      content: 'Use quick actions to rapidly create new projects, tasks, or invite team members without navigating away from the dashboard.',
      placement: 'left' as const,
      title: 'Quick Actions'
    }
  ],

  project: [
    {
      target: '[data-testid="task-board"]',
      content: 'The Kanban board provides a visual workflow of your tasks. Drag and drop cards between columns to update their status instantly.',
      placement: 'bottom' as const,
      disableBeacon: true,
      title: 'Task Board'
    },
    {
      target: '[data-testid="task-card"]:first-child',
      content: 'Task cards show essential information: title, assignee, due date, priority level, and associated tags for easy identification.',
      placement: 'top' as const,
      title: 'Task Cards'
    },
    {
      target: '[data-testid="team-section"]',
      content: 'Monitor your team\'s workload and see who\'s working on what. Click on team members to see their assigned tasks.',
      placement: 'left' as const,
      title: 'Team Overview'
    },
    {
      target: '[data-testid="project-analytics"]',
      content: 'Track project progress with burndown charts, velocity metrics, and completion rates to stay on schedule.',
      placement: 'top' as const,
      title: 'Project Analytics'
    }
  ],

  task: [
    {
      target: '[data-testid="task-details"]',
      content: 'View comprehensive task information including description, subtasks, attachments, and activity timeline.',
      placement: 'bottom' as const,
      disableBeacon: true,
      title: 'Task Details'
    },
    {
      target: '[data-testid="task-comments"]',
      content: 'Collaborate with your team through comments. @mention team members to notify them about important updates.',
      placement: 'left' as const,
      title: 'Task Comments'
    },
    {
      target: '[data-testid="task-activity"]',
      content: 'Track all changes and updates to this task with a complete activity log showing who did what and when.',
      placement: 'top' as const,
      title: 'Activity Timeline'
    }
  ]
}