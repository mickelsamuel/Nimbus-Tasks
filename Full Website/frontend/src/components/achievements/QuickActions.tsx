import { motion } from 'framer-motion'
import { Target, Users, Award, Calendar, Star } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      icon: Target,
      label: 'View Goals',
      description: 'Track your progress',
      color: 'from-blue-500 to-blue-600',
      href: '#milestones'
    },
    {
      icon: Users,
      label: 'Leaderboard',
      description: 'See your ranking',
      color: 'from-purple-500 to-purple-600',
      href: '#leaderboard'
    },
    {
      icon: Award,
      label: 'All Achievements',
      description: 'Browse collection',
      color: 'from-green-500 to-green-600',
      href: '#achievements'
    },
    {
      icon: Calendar,
      label: 'History',
      description: 'Achievement timeline',
      color: 'from-orange-500 to-orange-600',
      href: '/timeline'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <motion.a
            key={action.label}
            href={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {action.label}
              </h3>
              
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}