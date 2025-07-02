'use client'

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { useVirtualList } from '@/hooks/usePerformance'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
  onScroll?: (scrollTop: number) => void
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  const {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex
  } = useVirtualList(items, itemHeight, containerHeight, overscan)

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])

  const visibleStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleEndIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const currentVisibleItems = useMemo(() => {
    return items.slice(visibleStartIndex, visibleEndIndex + 1).map((item, index) => ({
      item,
      index: visibleStartIndex + index
    }))
  }, [items, visibleStartIndex, visibleEndIndex])

  return (
    <div
      ref={containerRef}
      className={`virtual-scroll-container overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleStartIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {currentVisibleItems.map(({ item, index }) => (
            <div
              key={index}
              className="virtual-scroll-item"
              style={{ height: itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Specialized components for common use cases
export function VirtualTeamsList<T>({
  teams,
  renderTeam,
  className = ''
}: {
  teams: T[]
  renderTeam: (team: T, index: number) => React.ReactNode
  className?: string
}) {
  return (
    <VirtualList
      items={teams}
      itemHeight={120}
      containerHeight={600}
      renderItem={renderTeam}
      className={className}
      overscan={3}
    />
  )
}

export function VirtualModulesList<T>({
  modules,
  renderModule,
  className = ''
}: {
  modules: T[]
  renderModule: (module: T, index: number) => React.ReactNode
  className?: string
}) {
  return (
    <VirtualList
      items={modules}
      itemHeight={200}
      containerHeight={800}
      renderItem={renderModule}
      className={className}
      overscan={2}
    />
  )
}

export function VirtualSpacesList<T>({
  spaces,
  renderSpace,
  className = ''
}: {
  spaces: T[]
  renderSpace: (space: T, index: number) => React.ReactNode
  className?: string
}) {
  return (
    <VirtualList
      items={spaces}
      itemHeight={150}
      containerHeight={700}
      renderItem={renderSpace}
      className={className}
      overscan={3}
    />
  )
}