import React from 'react';
import { motion } from 'framer-motion';
import { 
  Microscope, Cpu, Leaf, Heart, Rocket, Brain,
  TrendingUp, Users, FileText, Award
} from 'lucide-react';

const ResearchSection = () => {
  const researchAreas = [
    {
      icon: Brain,
      title: 'Artificial Intelligence',
      description: 'Advancing machine learning and neural networks',
      projects: 42,
      funding: '$125M',
      color: 'from-purple-500 to-pink-500',
      highlights: ['Natural Language Processing', 'Computer Vision', 'Robotics']
    },
    {
      icon: Heart,
      title: 'Biomedical Research',
      description: 'Pioneering healthcare innovations',
      projects: 38,
      funding: '$98M',
      color: 'from-red-500 to-pink-500',
      highlights: ['Gene Therapy', 'Medical Devices', 'Drug Discovery']
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Creating solutions for a greener future',
      projects: 35,
      funding: '$87M',
      color: 'from-green-500 to-emerald-500',
      highlights: ['Renewable Energy', 'Climate Tech', 'Circular Economy']
    },
    {
      icon: Cpu,
      title: 'Quantum Computing',
      description: 'Exploring quantum mechanics applications',
      projects: 28,
      funding: '$156M',
      color: 'from-blue-500 to-cyan-500',
      highlights: ['Quantum Algorithms', 'Cryptography', 'Quantum Simulation']
    },
    {
      icon: Rocket,
      title: 'Space Technology',
      description: 'Pushing boundaries of space exploration',
      projects: 22,
      funding: '$73M',
      color: 'from-indigo-500 to-purple-500',
      highlights: ['Satellite Tech', 'Space Robotics', 'Astrobiology']
    },
    {
      icon: Microscope,
      title: 'Nanotechnology',
      description: 'Innovation at the molecular level',
      projects: 31,
      funding: '$64M',
      color: 'from-orange-500 to-red-500',
      highlights: ['Materials Science', 'Nanoelectronics', 'Nanomedicine']
    }
  ];

  const impactStats = [
    { value: '2,500+', label: 'Active Researchers', icon: Users },
    { value: '850+', label: 'Published Papers/Year', icon: FileText },
    { value: '150+', label: 'Industry Partnerships', icon: TrendingUp },
    { value: '45+', label: 'Patents Filed/Year', icon: Award }
  ];

  return (
    <div>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Research & Innovation
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Leading breakthrough research that shapes the future of technology and society
        </p>
      </motion.div>

      {/* Research Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {researchAreas.map((area, index) => (
          <motion.div
            key={area.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative p-6">
              {/* Icon */}
              <div className="mb-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${area.color} rounded-xl shadow-lg`}>
                  <area.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {area.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {area.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{area.projects}</span>
                  <span className="text-gray-600 dark:text-gray-400"> Projects</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{area.funding}</span>
                  <span className="text-gray-600 dark:text-gray-400"> Funding</span>
                </div>
              </div>

              {/* Research Highlights */}
              <div className="space-y-2">
                {area.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${area.color}`} />
                    {highlight}
                  </div>
                ))}
              </div>

              {/* Hover Action */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-6"
              >
                <button className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform">
                  Explore Research
                </button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Impact Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 lg:p-12 mb-16"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Research Impact
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Featured Research Project */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:40px_40px]" />
        <div className="relative p-8 lg:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Featured Project</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Breakthrough in Quantum Error Correction
            </h3>
            <p className="text-lg text-indigo-100 mb-6">
              Our research team has developed a revolutionary quantum error correction algorithm that increases qubit stability by 300%, bringing practical quantum computing closer to reality.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Read Full Paper
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300">
                Watch Presentation
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResearchSection;