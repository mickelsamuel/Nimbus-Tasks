'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizComponentProps {
  questions: QuizQuestion[]
  onComplete: (score: number, totalQuestions: number) => void
  title?: string
}

export default function QuizComponent({ questions, onComplete, title = "Chapter Quiz" }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizCompleted(true)
      calculateScore()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
    
    onComplete(score, questions.length)
    setShowResult(true)
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowResult(false)
    setQuizCompleted(false)
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (showResult) {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="text-center">
          <div className={`text-6xl font-bold mb-4 ${getScoreColor(score, questions.length)}`}>
            {percentage}%
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You scored {score} out of {questions.length} questions correctly
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={() => onComplete(score, questions.length)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <p className="text-center text-gray-600 dark:text-gray-300">
          No quiz questions available for this chapter.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-blue-100">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
          <div
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.question}
            </h4>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === index
                const isCorrect = index === currentQuestion.correctAnswer
                const showCorrectAnswer = quizCompleted && isCorrect
                const showIncorrectAnswer = quizCompleted && isSelected && !isCorrect

                return (
                  <motion.button
                    key={index}
                    onClick={() => !quizCompleted && handleAnswerSelect(index)}
                    disabled={quizCompleted}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                      showCorrectAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : showIncorrectAnswer
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                    }`}
                    whileHover={!quizCompleted ? { scale: 1.02 } : {}}
                    whileTap={!quizCompleted ? { scale: 0.98 } : {}}
                  >
                    <span className={`${
                      showCorrectAnswer
                        ? 'text-green-800 dark:text-green-200'
                        : showIncorrectAnswer
                        ? 'text-red-800 dark:text-red-200'
                        : isSelected
                        ? 'text-blue-800 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option}
                    </span>
                    
                    {showCorrectAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {showIncorrectAnswer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            {quizCompleted && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Explanation:
                </h5>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentQuestionIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            !hasAnswered
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}