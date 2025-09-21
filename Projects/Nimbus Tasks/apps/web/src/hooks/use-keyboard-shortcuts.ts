import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsOptions {
  onNewTask?: () => void
  onNewProject?: () => void
  onSearch?: () => void
  onHelp?: () => void
  onCommandPalette?: () => void
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const router = useRouter()

  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'd',
      altKey: true,
      action: () => router.push('/dashboard'),
      description: 'Go to dashboard'
    },
    {
      key: 't',
      altKey: true,
      action: () => router.push('/dashboard/tasks'),
      description: 'Go to tasks'
    },
    {
      key: 'p',
      altKey: true,
      action: () => router.push('/dashboard/projects'),
      description: 'Go to projects'
    },
    {
      key: 's',
      altKey: true,
      action: () => router.push('/settings'),
      description: 'Go to settings'
    },

    // Action shortcuts
    {
      key: 'n',
      action: () => options.onNewTask?.(),
      description: 'Create new task'
    },
    {
      key: 'n',
      shiftKey: true,
      action: () => options.onNewProject?.(),
      description: 'Create new project'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => options.onCommandPalette?.(),
      description: 'Open command palette'
    },
    {
      key: 'k',
      metaKey: true,
      action: () => options.onCommandPalette?.(),
      description: 'Open command palette (Mac)'
    },
    {
      key: '/',
      action: () => options.onSearch?.(),
      description: 'Focus search'
    },
    {
      key: '?',
      action: () => options.onHelp?.(),
      description: 'Show keyboard shortcuts'
    },

    // Quick actions
    {
      key: 'r',
      action: () => window.location.reload(),
      description: 'Refresh page'
    }
  ]

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return
    }

    const matchingShortcut = shortcuts.find(shortcut =>
      shortcut.key.toLowerCase() === event.key.toLowerCase() &&
      !!shortcut.ctrlKey === event.ctrlKey &&
      !!shortcut.metaKey === event.metaKey &&
      !!shortcut.shiftKey === event.shiftKey &&
      !!shortcut.altKey === event.altKey
    )

    if (matchingShortcut) {
      event.preventDefault()
      event.stopPropagation()
      matchingShortcut.action()
    }
  }, [shortcuts, router, options])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { shortcuts }
}

// Hook for displaying keyboard shortcuts help
export function useKeyboardShortcutsHelp() {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const showHelp = useCallback(() => {
    setIsHelpOpen(true)
  }, [])

  const hideHelp = useCallback(() => {
    setIsHelpOpen(false)
  }, [])

  return {
    isHelpOpen,
    showHelp,
    hideHelp
  }
}

// Import useState
import { useState } from 'react'