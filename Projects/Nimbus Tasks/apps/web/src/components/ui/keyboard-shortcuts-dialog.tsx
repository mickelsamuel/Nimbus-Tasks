"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@nimbus/ui"
// import { Badge } from "@nimbus/ui"

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  description: string
}

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    { key: 'd', altKey: true, description: 'Go to dashboard' },
    { key: 't', altKey: true, description: 'Go to tasks' },
    { key: 'p', altKey: true, description: 'Go to projects' },
    { key: 's', altKey: true, description: 'Go to settings' },

    // Actions
    { key: 'n', description: 'Create new task' },
    { key: 'n', shiftKey: true, description: 'Create new project' },
    { key: 'k', ctrlKey: true, description: 'Open command palette' },
    { key: '/', description: 'Focus search' },
    { key: '?', description: 'Show this help' },
    { key: 'r', description: 'Refresh page' },

    // Task management
    { key: 'Escape', description: 'Close dialogs/modals' },
    { key: 'Enter', description: 'Submit forms' },
    { key: 'Tab', description: 'Navigate between elements' },
  ]

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const keys = []

    if (shortcut.ctrlKey || shortcut.metaKey) {
      keys.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
    }
    if (shortcut.altKey) {
      keys.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt')
    }
    if (shortcut.shiftKey) {
      keys.push('⇧')
    }

    keys.push(shortcut.key.toUpperCase())

    return keys
  }

  const groupedShortcuts = {
    Navigation: shortcuts.filter(s => s.altKey && ['d', 't', 'p', 's'].includes(s.key)),
    Actions: shortcuts.filter(s => ['n', 'k', '/', '?', 'r'].includes(s.key)),
    General: shortcuts.filter(s => ['Escape', 'Enter', 'Tab'].includes(s.key))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="keyboard-shortcuts-dialog"
        className="max-w-2xl max-h-[80vh] overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and interact with the application more efficiently.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3">{category}</h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center space-x-1">
                      {formatShortcut(shortcut).map((key, keyIndex) => (
                        <span
                          key={keyIndex}
                          className="text-xs px-2 py-1 bg-white border border-gray-300 rounded"
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Pro Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Shortcuts work from anywhere in the application</li>
            <li>• Press <span className="text-xs px-2 py-1 bg-white border border-gray-300 rounded">?</span> anytime to see this help</li>
            <li>• Some shortcuts may not work when typing in form fields</li>
            <li>• On Mac, ⌘ replaces Ctrl in most shortcuts</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}