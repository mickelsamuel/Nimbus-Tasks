import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, FileText, Users, CheckCircle, 
  Send, Clock, Award, Briefcase,
  AlertCircle, ArrowRight
} from 'lucide-react';

const AdmissionsTimeline = () => {
  const timeline = [
    {
      date: 'September 1',
      title: 'Applications Open',
      description: 'Begin your journey by starting your application',
      icon: Send,
      status: 'upcoming',
      color: 'from-blue-500 to-indigo-500',
      tasks: ['Create account', 'Choose program', 'Start application']
    },
    {
      date: 'October 15',
      title: 'Early Decision Deadline',
      description: 'Submit for priority consideration and early response',
      icon: Clock,
      status: 'upcoming',
      color: 'from-purple-500 to-pink-500',
      tasks: ['Submit transcripts', 'Letters of recommendation', 'Personal statement']
    },
    {
      date: 'December 1',
      title: 'Regular Decision Deadline',
      description: 'Final deadline for regular admission consideration',
      icon: Calendar,
      status: 'upcoming',
      color: 'from-orange-500 to-red-500',
      tasks: ['Complete application', 'Submit test scores', 'Pay application fee']
    },
    {
      date: 'January 15-30',
      title: 'Interview Period',
      description: 'Selected candidates participate in virtual or on-campus interviews',
      icon: Users,
      status: 'upcoming',
      color: 'from-green-500 to-emerald-500',
      tasks: ['Schedule interview', 'Prepare portfolio', 'Campus visit (optional)']
    },
    {
      date: 'March 15',
      title: 'Admission Decisions',
      description: 'Receive your admission decision and financial aid package',
      icon: CheckCircle,
      status: 'upcoming',
      color: 'from-indigo-500 to-blue-500',
      tasks: ['Check portal', 'Review offer', 'Financial aid details']
    },
    {
      date: 'May 1',
      title: 'Enrollment Deadline',
      description: 'Confirm your enrollment and secure your spot',
      icon: Award,
      status: 'upcoming',
      color: 'from-yellow-500 to-orange-500',
      tasks: ['Accept offer', 'Submit deposit', 'Register for orientation']
    }
  ];

  const requirements = [
    {
      icon: FileText,
      title: 'Academic Records',
      items: ['Official transcripts', 'Test scores (SAT/ACT)', 'English proficiency (if applicable)']
    },
    {
      icon: Users,
      title: 'Recommendations',
      items: ['2-3 letters of recommendation', 'Academic references preferred', 'Professional references accepted']
    },
    {
      icon: Briefcase,
      title: 'Personal Materials',
      items: ['Personal statement', 'Resume/CV', 'Portfolio (for certain programs)']
    }
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
          Admissions Process
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your journey to excellence starts here. Follow our streamlined admission process.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative mb-16">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 hidden lg:block" />

        {/* Timeline Items */}
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col lg:flex-row gap-6"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className={`relative w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                  {index < timeline.length - 1 && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-300 dark:bg-gray-700 lg:hidden" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-2 sm:mt-0">
                    {item.date}
                  </span>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  {item.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 lg:p-12 mb-12"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Application Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {requirements.map((req, index) => (
            <motion.div
              key={req.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-4">
                <req.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {req.title}
              </h4>
              <ul className="space-y-2 text-left">
                {req.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-12"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Important Information
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Application fees may be waived for eligible students. International students should allow extra time for visa processing. 
              All deadlines are at 11:59 PM EST on the specified date.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
          Start Your Application
          <ArrowRight className="w-5 h-5" />
        </button>
        <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Download Guide
        </button>
      </motion.div>
    </div>
  );
};

export default AdmissionsTimeline;