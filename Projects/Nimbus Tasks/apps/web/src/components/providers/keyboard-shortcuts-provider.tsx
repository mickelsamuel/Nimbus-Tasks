"use client"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useKeyboardShortcuts, useKeyboardShortcutsHelp } from '~/hooks/use-keyboard-shortcuts'
import { KeyboardShortcutsDialog } from '~/components/ui/keyboard-shortcuts-dialog'

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const router = useRouter()
  const { isHelpOpen, showHelp, hideHelp } = useKeyboardShortcutsHelp()
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const handleNewTask = useCallback(() => {
    // In a real app, this would open the task creation modal or navigate to task creation
    console.log('Create new task shortcut triggered')
    router.push('/dashboard/tasks?action=create')
  }, [router])

  const handleNewProject = useCallback(() => {
    // In a real app, this would open the project creation modal
    console.log('Create new project shortcut triggered')
    router.push('/dashboard/projects?action=create')
  }, [router])

  const handleSearch = useCallback(() => {
    // Focus the search input or open search modal
    const searchInput = document.querySelector('[data-testid="search-input"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    } else {
      // If no search input found, could open a search modal
      console.log('Focus search shortcut triggered')
    }
  }, [])

  const handleCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true)
  }, [])

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: handleNewTask,
    onNewProject: handleNewProject,
    onSearch: handleSearch,
    onHelp: showHelp,
    onCommandPalette: handleCommandPalette,
  })

  return (
    <>
      {children}

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsDialog
        open={isHelpOpen}
        onOpenChange={hideHelp}
      />

      {/* Command Palette - placeholder for future implementation */}
      {commandPaletteOpen && (
        <div
          data-testid="command-palette"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Command Palette</h3>
            <p className="text-gray-600 mb-4">
              Quick actions and navigation (coming soon)
            </p>
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}