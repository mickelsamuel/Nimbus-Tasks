import { motion } from 'framer-motion'

export default function EventsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700/30 shadow-2xl"
        >
          {/* Animated shimmer effect */}
          <motion.div
            animate={{
              x: [-300, 300]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-600/20 to-transparent"
            style={{
              transform: 'skewX(-15deg)'
            }}
          />
          
          {/* Image skeleton */}
          <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 relative">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-purple-200/30 to-pink-200/30 dark:from-blue-800/30 dark:via-purple-800/30 dark:to-pink-800/30"
            />
          </div>
          
          {/* Content skeleton */}
          <div className="p-8 space-y-6">
            {/* Title skeleton */}
            <div className="space-y-3">
              <motion.div
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.2
                }}
                className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl"
              />
              <motion.div
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.4
                }}
                className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl w-4/5"
              />
              <motion.div
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.6
                }}
                className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl w-3/5"
              />
            </div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <motion.div
                  key={j}
                  animate={{
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.8 + j * 0.1
                  }}
                  className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-xl"
                />
              ))}
            </div>
            
            {/* Challenges skeleton */}
            <div className="space-y-3">
              <motion.div
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 1.2
                }}
                className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl"
              />
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex space-x-4">
              <motion.div
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 1.4
                }}
                className="flex-1 h-12 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 rounded-2xl"
              />
              <motion.div
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 1.6
                }}
                className="w-12 h-12 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-700 rounded-2xl"
              />
            </div>
            
            {/* Badges skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((j) => (
                <motion.div
                  key={j}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 1.8 + j * 0.1
                  }}
                  className="h-6 w-16 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded-full"
                />
              ))}
            </div>
          </div>
          
          {/* Floating loading indicators */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}