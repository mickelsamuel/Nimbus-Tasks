import { motion } from 'framer-motion'
import { Trophy, Star, TrendingUp, Award, Sparkles, Crown, Zap } from 'lucide-react'

interface NewAchievementHeroProps {
  stats: {
    totalXP: number
    unlockedAchievements: number
    totalAchievements: number
    completionRate: number
    currentStreak: number
    rank: string
  }
}

export function NewAchievementHero({ stats }: NewAchievementHeroProps) {
  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    icon: [Trophy, Star, Award, Sparkles, Crown][Math.floor(Math.random() * 5)],
    delay: Math.random() * 2,
    duration: 8 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.5 + Math.random() * 0.5,
  }))

  return (
    <div className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-violet-900/10 via-purple-900/10 to-fuchsia-900/10 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-fuchsia-900/30">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -top-20 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-64 bg-gradient-to-t from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Icons */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute text-purple-400/20 dark:text-purple-300/30"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `scale(${element.scale})`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          >
            <element.icon className="w-8 h-8" />
          </motion.div>
        ))}

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.2 
                }}
                className="relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Trophy className="w-9 h-9 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight"
              >
                Achievements
              </motion.h1>

              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.3 
                }}
                className="relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Crown className="w-9 h-9 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed"
            >
              Celebrate your journey of growth and excellence
            </motion.p>
          </motion.div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Total XP */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-yellow-200/50 dark:border-yellow-700/50 shadow-xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                </div>
                <motion.div
                  className="text-4xl font-black text-gray-900 dark:text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                >
                  {stats.totalXP?.toLocaleString() || '0'}
                </motion.div>
                <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-lg">Total XP</div>
              </div>
            </motion.div>

            {/* Achievements Progress */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-purple-200/50 dark:border-purple-700/50 shadow-xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                </div>
                <motion.div
                  className="text-4xl font-black text-gray-900 dark:text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                >
                  {stats.unlockedAchievements}/{stats.totalAchievements}
                </motion.div>
                <div className="text-purple-600 dark:text-purple-400 font-semibold text-lg">Unlocked</div>
              </div>
            </motion.div>

            {/* Current Streak */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-green-200/50 dark:border-green-700/50 shadow-xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
                <motion.div
                  className="text-4xl font-black text-gray-900 dark:text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                >
                  {stats.currentStreak}
                </motion.div>
                <div className="text-green-600 dark:text-green-400 font-semibold text-lg">Day Streak</div>
              </div>
            </motion.div>

            {/* Current Rank */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50 shadow-xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                </div>
                <motion.div
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                >
                  {stats.rank}
                </motion.div>
                <div className="text-blue-600 dark:text-blue-400 font-semibold text-lg">Current Rank</div>
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-full p-2 border border-white/30 dark:border-gray-700/30">
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                  <motion.div
                    className="h-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ delay: 1.6, duration: 1.5, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 skew-x-12"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white font-bold text-sm"
                >
                  {stats.completionRate}%
                </motion.div>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="text-center mt-4 text-gray-600 dark:text-gray-400 font-medium"
            >
              Overall Achievement Progress
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}