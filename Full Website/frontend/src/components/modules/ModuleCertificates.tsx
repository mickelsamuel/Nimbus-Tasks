'use client'

import { useState } from 'react'
import { 
  Award, Download, Share2, Eye, 
  ExternalLink, Mail
} from 'lucide-react'

interface Certificate {
  id: string
  moduleTitle: string
  completedDate: Date
  certificateId: string
  expiryDate?: Date
  score: number
  instructor: string
  category: string
}

interface ModuleCertificatesProps {
  certificates: Certificate[]
}

export function ModuleCertificates({ certificates }: ModuleCertificatesProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [, setHoveredCert] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const isExpiringSoon = (expiryDate?: Date) => {
    if (!expiryDate) return false
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isExpired = (expiryDate?: Date) => {
    if (!expiryDate) return false
    return expiryDate < new Date()
  }

  const handleDownload = (certificate: Certificate) => {
    // In real implementation, this would trigger a download
    console.log('Downloading certificate:', certificate.certificateId)
  }

  const handleShare = (certificate: Certificate) => {
    // In real implementation, this would open share options
    console.log('Sharing certificate:', certificate.certificateId)
  }

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
  }

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl text-white shadow-xl group-hover:rotate-12 transition-all duration-500">
              <Award className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {certificates.length}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              🏆 Your Achievements
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {certificates.length} certificates earned with excellence
            </p>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="space-y-4">
        {certificates.slice(0, 3).map((cert, index) => {
          const expiring = isExpiringSoon(cert.expiryDate)
          const expired = isExpired(cert.expiryDate)

          return (
            <div
              key={cert.id}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 ${
                expired ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25' :
                expiring ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-orange-500/25' :
                'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-green-500/25'
              } hover:shadow-2xl`}
              onMouseEnter={() => setHoveredCert(cert.id)}
              onMouseLeave={() => setHoveredCert(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12" />
              </div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-white mb-2">
                        {cert.moduleTitle}
                      </h3>
                      <div className="flex items-center gap-3 text-white/90 text-sm">
                        <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                          🏅 {cert.category}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
                          {cert.score}% Score
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  {expired && (
                    <div className="bg-white/20 px-3 py-1 rounded-full text-white font-bold text-sm">
                      ⚠️ Expired
                    </div>
                  )}
                  {expiring && !expired && (
                    <div className="bg-white/20 px-3 py-1 rounded-full text-white font-bold text-sm">
                      ⏰ Expiring Soon
                    </div>
                  )}
                  {!expired && !expiring && (
                    <div className="bg-white/20 px-3 py-1 rounded-full text-white font-bold text-sm">
                      ✅ Valid
                    </div>
                  )}
                </div>

                {/* Certificate Details */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/70 mb-1">Completed</div>
                    <div className="font-semibold text-white">
                      {formatDate(cert.completedDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 mb-1">Certificate ID</div>
                    <div className="font-mono text-xs text-white bg-white/10 px-2 py-1 rounded">
                      {cert.certificateId}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => handleView(cert)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(cert)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleShare(cert)}
                    className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Renewal Notice */}
                {expired && (
                  <div className="mt-4 p-3 bg-white/20 rounded-xl">
                    <p className="text-sm text-white font-medium text-center">
                      🔄 Certificate expired - Retake module to renew
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <button className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300 group">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Verify</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300 group">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300 group">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Download className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">All PDFs</span>
        </button>
      </div>

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCertificate(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Certificate of Completion
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                This certifies that you have successfully completed
              </p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCertificate.moduleTitle}
              </h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>Completed on: {formatDate(selectedCertificate.completedDate)}</p>
                <p>Score: {selectedCertificate.score}%</p>
                <p>Instructor: {selectedCertificate.instructor}</p>
                <p className="font-mono text-sm">ID: {selectedCertificate.certificateId}</p>
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => handleDownload(selectedCertificate)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}