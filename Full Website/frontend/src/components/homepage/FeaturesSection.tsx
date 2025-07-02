'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Award, 
  Shield, 
  Target,
  Brain,
  Globe,
  Sparkles,
  Zap,
  Rocket,
  Star,
  ArrowRight,
  Play
} from 'lucide-react'

interface FeaturesSectionProps {
  containerVariants: Variants
  itemVariants: Variants
}

export function FeaturesSection({ containerVariants, itemVariants }: FeaturesSectionProps) {

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Comprehensive training modules with practical simulations, intelligent assessments, and adaptive learning paths that evolve with your progress.",
      stats: "500+ Modules",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-900/20 to-cyan-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      description: "Real-time market data integration, advanced financial modeling tools, and predictive analytics training powered by industry-standard platforms.",
      stats: "Live Data",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      darkBgGradient: "from-green-900/20 to-emerald-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconBg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with experienced colleagues, industry mentors, and accomplished peers within National Bank of Canada and the broader banking community.",
      stats: "50K+ Experts",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "from-purple-900/20 to-pink-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      iconBg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: Award,
      title: "Elite Certifications",
      description: "Earn professional certifications recognized throughout the financial services industry. Validate your expertise with credentials that enhance your career.",
      stats: "25+ Certifications",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
      darkBgGradient: "from-yellow-900/20 to-orange-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      icon: Shield,
      title: "Risk & Compliance",
      description: "Master cutting-edge regulatory frameworks, advanced risk modeling, and compliance automation tools used by leading banks worldwide.",
      stats: "100% Compliant",
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-50 to-rose-50",
      darkBgGradient: "from-red-900/20 to-rose-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      iconBg: "bg-red-100 dark:bg-red-900/30"
    },
    {
      icon: Target,
      title: "Career Acceleration",
      description: "Personalized career development, mentorship programs, and strategic advancement planning to support your professional growth.",
      stats: "95% Success Rate",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50",
      darkBgGradient: "from-indigo-900/20 to-blue-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ]

  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized AI that adapts to your learning style",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Globe,
      title: "Global Standards",
      description: "Internationally recognized and accredited training",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Rocket,
      title: "Fast-Track Learning",
      description: "Accelerated pathways for rapid skill development",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Industry-leading content updated in real-time",
      gradient: "from-yellow-500 to-amber-500"
    }
  ]

  return (
    <section 
      id="features" 
      className="py-32 relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/5 to-purple-400/5 opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-green-400/5 to-blue-400/5 opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Premium Features</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
            <span className="block">Professional Training</span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">
              Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Advance your banking career with National Bank of Canada&apos;s comprehensive training platform. 
            Interactive modules, practical simulations, and expert-led content designed to enhance your professional skills.
          </p>
        </motion.div>
        
        {/* Feature Grid */}
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="group relative"
              variants={itemVariants}
            >
              <div className={`relative rounded-3xl bg-gradient-to-br ${feature.bgGradient} dark:${feature.darkBgGradient} p-8 h-full shadow-lg border ${feature.borderColor} hover:shadow-xl transition-shadow duration-300`}>
                
                {/* Icon */}
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${feature.iconBg} mb-6 shadow-md`}>
                  <feature.icon className={`h-8 w-8 ${feature.gradient.includes('blue') ? 'text-blue-600' : feature.gradient.includes('green') ? 'text-green-600' : feature.gradient.includes('purple') ? 'text-purple-600' : feature.gradient.includes('yellow') ? 'text-yellow-600' : feature.gradient.includes('red') ? 'text-red-600' : 'text-indigo-600'}`} />
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <span className={`text-sm font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${feature.gradient} shadow-md`}>
                      {feature.stats}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  <Link
                    href="/modules"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="relative rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-12 lg:p-16 shadow-xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Simple background decoration */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-50" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 opacity-50" />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Zap className="h-5 w-5 text-green-500" />
                <span className="text-sm font-bold text-green-700 dark:text-green-300">Why Choose Us</span>
              </motion.div>

              <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-6">
                The Future of Banking Education
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join thousands of National Bank of Canada professionals advancing their careers through continuous learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-10 rounded-2xl`} />
                    <benefit.icon className={`h-10 w-10 relative z-10 ${benefit.gradient.includes('purple') ? 'text-purple-600' : benefit.gradient.includes('blue') ? 'text-blue-600' : benefit.gradient.includes('red') ? 'text-red-600' : 'text-yellow-600'}`} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Play className="h-5 w-5" />
                <span>Access Platform</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}