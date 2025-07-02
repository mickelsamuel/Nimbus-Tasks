import { useCallback, useRef, useEffect, useState } from 'react'
import { AudioContextType } from '../types'

export const useAudioSystem = () => {
  const [audioContext, setAudioContext] = useState<AudioContextType>({ 
    audioContext: null, 
    isEnabled: true 
  })
  const audioRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioRef.current && audioContext.isEnabled) {
        try {
          audioRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
          setAudioContext(prev => ({ ...prev, audioContext: audioRef.current }))
        } catch (error) {
          console.warn('Audio context not supported')
          setAudioContext(prev => ({ ...prev, isEnabled: false }))
        }
      }
    }

    document.addEventListener('click', initAudio, { once: true })
    return () => document.removeEventListener('click', initAudio)
  }, [audioContext.isEnabled])

  const playSound = useCallback((type: 'select' | 'hover' | 'click' | 'success' | 'error') => {
    if (!audioContext.audioContext || !audioContext.isEnabled) return

    try {
      const ctx = audioContext.audioContext
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Banking-themed sound frequencies
      const frequencies = {
        select: [800, 1000], // Coin clink
        hover: [600, 700],   // Subtle chime
        click: [400, 600],   // Button press
        success: [523, 659, 784], // Success chord
        error: [200, 150]    // Error tone
      }

      const freq = frequencies[type]
      oscillator.frequency.setValueAtTime(freq[0], ctx.currentTime)
      if (freq[1]) {
        oscillator.frequency.exponentialRampToValueAtTime(freq[1], ctx.currentTime + 0.1)
      }

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.2)
    } catch (error) {
      console.warn('Audio playback failed:', error)
    }
  }, [audioContext])

  const toggleAudio = useCallback(() => {
    setAudioContext(prev => ({ ...prev, isEnabled: !prev.isEnabled }))
  }, [])

  return {
    audioContext,
    playSound,
    toggleAudio
  }
}