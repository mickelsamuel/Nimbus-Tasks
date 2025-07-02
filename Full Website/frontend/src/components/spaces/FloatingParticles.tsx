'use client'

import { Particle } from '@/types'

interface FloatingParticlesProps {
  particles: Particle[]
}

export default function FloatingParticles({ particles }: FloatingParticlesProps) {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="space-particles absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDelay: `${parseInt(particle.id) * 0.5}s`,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  )
}