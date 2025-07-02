import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Coffee, Dumbbell, Book, Music, Users, 
  Wifi, Car, Shield, Heart, Globe, Camera,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const CampusLife = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const facilities = [
    {
      icon: Home,
      title: 'Modern Residence Halls',
      description: 'Comfortable living spaces with study areas and community lounges',
      image: '/api/placeholder/600/400',
      features: ['Single & Shared Rooms', '24/7 Security', 'High-Speed Internet', 'Laundry Facilities']
    },
    {
      icon: Book,
      title: 'State-of-the-Art Library',
      description: '5 million volumes and cutting-edge digital resources',
      image: '/api/placeholder/600/400',
      features: ['24/7 Access', 'Study Pods', 'Digital Archives', 'Research Support']
    },
    {
      icon: Dumbbell,
      title: 'Fitness & Recreation',
      description: 'Olympic-size pool, gym, and outdoor sports facilities',
      image: '/api/placeholder/600/400',
      features: ['Personal Training', 'Group Classes', 'Sports Courts', 'Wellness Programs']
    },
    {
      icon: Coffee,
      title: 'Dining & Cafes',
      description: 'Diverse dining options catering to all dietary preferences',
      image: '/api/placeholder/600/400',
      features: ['International Cuisine', 'Vegan Options', 'Coffee Shops', 'Food Trucks']
    }
  ];

  const studentOrgs = [
    { name: 'Tech Innovation Club', members: 500, icon: Globe },
    { name: 'Photography Society', members: 200, icon: Camera },
    { name: 'Music Ensemble', members: 150, icon: Music },
    { name: 'Volunteer Corps', members: 800, icon: Heart },
    { name: 'Debate Team', members: 100, icon: Users },
    { name: 'Cultural Exchange', members: 600, icon: Globe }
  ];

  const campusFeatures = [
    { icon: Wifi, label: 'Campus-Wide WiFi', description: '10 Gbps fiber network' },
    { icon: Car, label: 'Sustainable Transport', description: 'Electric shuttles & bike share' },
    { icon: Shield, label: '24/7 Security', description: 'Safe campus environment' },
    { icon: Heart, label: 'Health Services', description: 'On-campus medical center' }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % facilities.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + facilities.length) % facilities.length);
  };

  return (
    <div>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Campus Life & Facilities
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience a vibrant community with world-class facilities designed for your success
        </p>
      </motion.div>

      {/* Facilities Carousel */}
      <div className="relative mb-16">
        <div className="overflow-hidden rounded-3xl">
          <motion.div
            className="flex"
            animate={{ x: `-${activeSlide * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {facilities.map((facility, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="relative h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                  <div className="relative h-full flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                          <facility.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">
                          {facility.title}
                        </h3>
                        <p className="text-lg text-gray-200 mb-6">
                          {facility.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {facility.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              <span className="text-gray-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-30" />
                        <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                          <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                            <facility.icon className="w-32 h-32 text-indigo-300 dark:text-indigo-600" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {facilities.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? 'w-8 bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Student Organizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Student Organizations
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join over 200+ student-led organizations and find your community
          </p>
          <div className="space-y-4">
            {studentOrgs.map((org, index) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <org.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {org.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {org.members} active members
                    </p>
                  </div>
                </div>
                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                  Join
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Campus Features */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Campus Features
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Everything you need for a comfortable and productive campus experience
          </p>
          <div className="grid grid-cols-2 gap-6">
            {campusFeatures.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Virtual Tour CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Experience Campus Life Virtually
        </h3>
        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
          Take a 360° virtual tour of our campus and explore all facilities from the comfort of your home
        </p>
        <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          Start Virtual Tour
        </button>
      </motion.div>
    </div>
  );
};

export default CampusLife;