'use client'

import React from 'react'
import Image from 'next/image'

export default function QuickAvatarTest() {
  // Test with the latest avatar URL from console
  const testAvatarUrl = 'https://models.readyplayer.me/684654bf105ed34bf8bd17cb.png'
  
  return (
    <div className="fixed top-4 left-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
      <h3 className="text-sm font-bold mb-2">Avatar Test</h3>
      <div className="space-y-2">
        <p className="text-xs">Testing direct PNG URL:</p>
        <Image 
          src={testAvatarUrl}
          alt="Test Avatar"
          width={64}
          height={64}
          priority
          className="w-16 h-16 rounded-full bg-gray-200"
          onLoad={() => console.log('Test avatar loaded successfully')}
          onError={() => console.log('Test avatar failed to load')}
        />
        <p className="text-xs font-mono">{testAvatarUrl}</p>
      </div>
    </div>
  )
}