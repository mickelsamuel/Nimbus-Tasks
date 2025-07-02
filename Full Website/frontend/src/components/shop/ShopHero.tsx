'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, TrendingUp, Crown, Zap, Star, Gem, Award, Gift } from 'lucide-react';

const ShopHero = () => {
  const floatingIcons = [
    { Icon: Crown, color: 'text-yellow-300', delay: 0 },
    { Icon: Sparkles, color: 'text-blue-300', delay: 0.5 },
    { Icon: Zap, color: 'text-pink-300', delay: 1 },
    { Icon: Gem, color: 'text-purple-300', delay: 1.5 },
    { Icon: Star, color: 'text-green-300', delay: 2 },
    { Icon: Award, color: 'text-red-300', delay: 2.5 },
    { Icon: Gift, color: 'text-indigo-300', delay: 3 },
  ]

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <motion.div 
          className="w-full h-full opacity-20 dark:opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)
            `,
            backgroundSize: '200px 200px, 300px 300px, 100px 100px',
          }}
        />
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingIcons.map(({ Icon, color, delay }, index) => (
          <motion.div
            key={index}
            className={`absolute ${
              index === 0 ? 'top-1/4 left-1/4' :
              index === 1 ? 'top-1/3 right-1/4' :
              index === 2 ? 'bottom-1/4 left-1/3' :
              index === 3 ? 'top-1/2 left-1/6' :
              index === 4 ? 'bottom-1/3 right-1/6' :
              index === 5 ? 'top-1/6 right-1/3' :
              'bottom-1/6 left-1/2'
            }`}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 360],
              opacity: [0.6, 1, 0.6],
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay,
            }}
          >
            <div className="relative">
              <motion.div 
                className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.2, rotateY: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className={`w-8 h-8 ${color}`} />
              </motion.div>
              {/* Glow effect */}
              <motion.div
                className={`absolute inset-0 w-16 h-16 rounded-full blur-xl opacity-50 ${color.replace('text-', 'bg-')}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Animated Icon */}
          <motion.div 
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30"
              whileHover={{ 
                scale: 1.1, 
                rotate: 10,
                boxShadow: '0 0 30px rgba(255,255,255,0.3)'
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.2)',
                  '0 0 40px rgba(255,255,255,0.4)',
                  '0 0 20px rgba(255,255,255,0.2)'
                ]
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <ShoppingBag className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Animated Title */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Premium Digital Store
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Banking Excellence
            </motion.span>
          </motion.h1>

          {/* Animated Description */}
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Elevate your professional presence with exclusive avatars, premium accessories, and cutting-edge digital assets designed for banking professionals.
          </motion.p>

          {/* Enhanced Animated Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {[
              { value: "500+", label: "Premium Items", color: "text-white", icon: ShoppingBag },
              { value: "50+", label: "Exclusive Releases", color: "text-yellow-300", icon: Crown },
              { value: "24/7", label: "Available", color: "text-pink-300", icon: Sparkles },
              { value: "Live", label: "Marketplace", color: "text-green-300", icon: TrendingUp }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div 
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div 
                    className="bg-white/15 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-white/30 dark:border-white/20 group-hover:border-white/50 dark:group-hover:border-white/40 transition-all duration-300"
                    whileHover={{ 
                      boxShadow: '0 10px 30px rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.15)'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="mb-2"
                    >
                      <IconComponent className={`w-6 h-6 ${stat.color} mx-auto`} />
                    </motion.div>
                    <motion.div 
                      className={`text-3xl font-bold ${stat.color} mb-1`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.5 + index * 0.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-white/90 dark:text-white/80 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            <motion.button 
              className="group px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-lg border-2 border-transparent overflow-hidden relative"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: '0 20px 40px rgba(255,255,255,0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Explore Featured Items
              </span>
            </motion.button>
            
            <motion.button 
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold border-2 border-white/30 hover:border-white/50 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                backgroundColor: 'rgba(255,255,255,0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  x: [-100, 100],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                View New Arrivals
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
        >
          <motion.path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-slate-50 dark:fill-slate-900"
            animate={{
              d: [
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
                "M0,0V36.29c57.79,28.2,113.59,28.17,168,34,60.36,1.37,146.33-23.31,216.8-27.5C448.64,42.43,522.34,63.67,593,82.05c79.27,28,148.3,34.88,219.4,23.08,46.15-16,79.85-27.84,114.45-39.34C999.49,35,1123-24.29,1200,62.47V0Z",
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-slate-50 dark:fill-slate-900"
            animate={{
              d: [
                "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
                "M0,0V25.81C23,46.92,37.64,66.86,57.69,82.05,109.41,121.27,175,121,234.58,101.58c41.15-20.15,70.09-36.07,99.67-49.8,50.92-29,94.73-56,140.83-59.67,46.26-12.85,80.9,19.42,108.6,41.56,41.77,35.39,72.32,72,113.63,83,50.44,20.79,91.35,3.31,129.13-14.28s85.16-49,126.92-53.05c69.73-15.85,123.28,32.88,178.9,48.84,40.2,18.66,69,16.17,97.09,2.5,32.43-20.89,58-36.93,70.65-59.24V0Z",
                "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
          />
          <motion.path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-slate-50 dark:fill-slate-900"
            animate={{
              d: [
                "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z",
                "M0,0V15.63C159.93,69,324.09,81.32,485.83,52.57c53-17.64,94.23-30.12,137.61-36.46,69-18.63,122.48,22.24,175.56,45.4C837.93,87.22,896,105.24,961.2,100c96.53-17,182.46-55.71,258.8-94.81V0Z",
                "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }}
          />
        </motion.svg>
      </div>
    </div>
  );
};

export default ShopHero;