import dynamic from 'next/dynamic'

// Lazy load the spaces page with loading state
const SpacesPage = dynamic(() => import('@/components/spaces/SpacesPage'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
        
        {/* Explorer view skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    </div>
  ),
  ssr: false
})

export default function SpacesPageRoute() {
  return <SpacesPage />
}