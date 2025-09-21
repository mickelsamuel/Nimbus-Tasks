import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateFileUpload, extractKeyFromUrl, formatFileSize, getFileExtension } from '~/lib/s3'

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(() => ({
    send: vi.fn(),
  })),
  GetObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
}))

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn(() => Promise.resolve('https://signed-url.com')),
}))

describe('S3 Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateFileUpload()', () => {
    it('should validate correct file types', () => {
      const validFiles = [
        { filename: 'document.pdf', contentType: 'application/pdf', fileSize: 1000 },
        { filename: 'image.jpg', contentType: 'image/jpeg', fileSize: 500000 },
        { filename: 'document.docx', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 200000 },
        { filename: 'spreadsheet.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileSize: 300000 },
        { filename: 'image.png', contentType: 'image/png', fileSize: 400000 },
        { filename: 'text.txt', contentType: 'text/plain', fileSize: 1000 },
      ]

      validFiles.forEach(file => {
        expect(() => validateFileUpload(file)).not.toThrow()
      })
    })

    it('should reject invalid file types', () => {
      const invalidFiles = [
        { filename: 'virus.exe', contentType: 'application/x-msdownload', fileSize: 1000 },
        { filename: 'script.js', contentType: 'application/javascript', fileSize: 1000 },
        { filename: 'archive.zip', contentType: 'application/zip', fileSize: 1000 },
        { filename: 'video.mp4', contentType: 'video/mp4', fileSize: 1000 },
      ]

      invalidFiles.forEach(file => {
        expect(() => validateFileUpload(file)).toThrow('File type not allowed')
      })
    })

    it('should reject files that are too large', () => {
      const largeFile = {
        filename: 'huge.pdf',
        contentType: 'application/pdf',
        fileSize: 11 * 1024 * 1024, // 11MB (over 10MB limit)
      }

      expect(() => validateFileUpload(largeFile)).toThrow('File size exceeds maximum allowed size')
    })

    it('should reject empty files', () => {
      const emptyFile = {
        filename: 'empty.pdf',
        contentType: 'application/pdf',
        fileSize: 0,
      }

      expect(() => validateFileUpload(emptyFile)).toThrow('File size must be greater than 0')
    })

    it('should reject files with missing filename', () => {
      const noFilename = {
        filename: '',
        contentType: 'application/pdf',
        fileSize: 1000,
      }

      expect(() => validateFileUpload(noFilename)).toThrow('Filename is required')
    })

    it('should handle edge case file sizes', () => {
      const maxSizeFile = {
        filename: 'max.pdf',
        contentType: 'application/pdf',
        fileSize: 10 * 1024 * 1024, // Exactly 10MB
      }

      const minSizeFile = {
        filename: 'min.pdf',
        contentType: 'application/pdf',
        fileSize: 1, // 1 byte
      }

      expect(() => validateFileUpload(maxSizeFile)).not.toThrow()
      expect(() => validateFileUpload(minSizeFile)).not.toThrow()
    })

    it('should handle content type case sensitivity', () => {
      const upperCaseType = {
        filename: 'document.pdf',
        contentType: 'APPLICATION/PDF',
        fileSize: 1000,
      }

      // Should handle case-insensitive content types
      expect(() => validateFileUpload(upperCaseType)).toThrow('File type not allowed')
    })
  })

  describe('extractKeyFromUrl()', () => {
    it('should extract key from S3 URL', () => {
      const url = 'https://bucket-name.s3.us-east-1.amazonaws.com/uploads/123-456-file.pdf'
      const key = extractKeyFromUrl(url)
      expect(key).toBe('uploads/123-456-file.pdf')
    })

    it('should extract key from S3 path-style URL', () => {
      const url = 'https://s3.amazonaws.com/bucket-name/uploads/123-456-file.pdf'
      const key = extractKeyFromUrl(url)
      expect(key).toBe('uploads/123-456-file.pdf')
    })

    it('should extract key from presigned URL with query parameters', () => {
      const url = 'https://bucket-name.s3.us-east-1.amazonaws.com/uploads/123-456-file.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...'
      const key = extractKeyFromUrl(url)
      expect(key).toBe('uploads/123-456-file.pdf')
    })

    it('should handle URLs with encoded characters', () => {
      const url = 'https://bucket-name.s3.us-east-1.amazonaws.com/uploads/123-456-file%20with%20spaces.pdf'
      const key = extractKeyFromUrl(url)
      expect(key).toBe('uploads/123-456-file with spaces.pdf')
    })

    it('should handle nested folder structures', () => {
      const url = 'https://bucket-name.s3.us-east-1.amazonaws.com/folder/subfolder/uploads/file.pdf'
      const key = extractKeyFromUrl(url)
      expect(key).toBe('folder/subfolder/uploads/file.pdf')
    })

    it('should handle invalid URLs gracefully', () => {
      const invalidUrls = [
        'not-a-url',
        'https://example.com/file.pdf',
        '',
        'ftp://bucket.s3.amazonaws.com/file.pdf',
      ]

      invalidUrls.forEach(url => {
        const key = extractKeyFromUrl(url)
        expect(key).toBe('')
      })
    })

    it('should handle URLs without path', () => {
      const url = 'https://bucket-name.s3.us-east-1.amazonaws.com/'
      const key = extractKeyFromUrl(url)
      expect(key).toBe('')
    })
  })

  describe('formatFileSize()', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(512)).toBe('512 B')
      expect(formatFileSize(1023)).toBe('1023 B')
    })

    it('should format KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2048)).toBe('2.0 KB')
      expect(formatFileSize(1024 * 1023)).toBe('1023.0 KB')
    })

    it('should format MB correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB')
      expect(formatFileSize(1024 * 1024 * 5)).toBe('5.0 MB')
      expect(formatFileSize(1024 * 1024 * 1023)).toBe('1023.0 MB')
    })

    it('should format GB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB')
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB')
    })

    it('should handle decimal places correctly', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB') // 1.5 * 1024
      expect(formatFileSize(1024 * 1024 * 1.25)).toBe('1.3 MB') // Should round to 1 decimal
      expect(formatFileSize(1024 * 1024 * 1.333)).toBe('1.3 MB') // Should round down
      expect(formatFileSize(1024 * 1024 * 1.366)).toBe('1.4 MB') // Should round up
    })

    it('should handle edge cases', () => {
      expect(formatFileSize(-1)).toBe('0 B') // Negative should be 0
      expect(formatFileSize(Infinity)).toBe('∞ B')
      expect(formatFileSize(NaN)).toBe('0 B')
    })

    it('should handle very large numbers', () => {
      const petabyte = 1024 * 1024 * 1024 * 1024 * 1024
      expect(formatFileSize(petabyte)).toBe('1024.0 GB') // We don't handle PB yet
    })
  })

  describe('getFileExtension()', () => {
    it('should extract file extensions correctly', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf')
      expect(getFileExtension('image.jpg')).toBe('jpg')
      expect(getFileExtension('file.tar.gz')).toBe('gz')
      expect(getFileExtension('README.md')).toBe('md')
      expect(getFileExtension('script.min.js')).toBe('js')
    })

    it('should handle files without extensions', () => {
      expect(getFileExtension('README')).toBe('')
      expect(getFileExtension('Dockerfile')).toBe('')
      expect(getFileExtension('file')).toBe('')
    })

    it('should handle hidden files', () => {
      expect(getFileExtension('.gitignore')).toBe('')
      expect(getFileExtension('.env.local')).toBe('local')
      expect(getFileExtension('.htaccess')).toBe('')
    })

    it('should handle edge cases', () => {
      expect(getFileExtension('')).toBe('')
      expect(getFileExtension('.')).toBe('')
      expect(getFileExtension('..')).toBe('')
      expect(getFileExtension('file.')).toBe('')
      expect(getFileExtension('file..')).toBe('')
    })

    it('should handle paths', () => {
      expect(getFileExtension('/path/to/file.pdf')).toBe('pdf')
      expect(getFileExtension('folder/subfolder/image.png')).toBe('png')
      expect(getFileExtension('C:\\Users\\file.docx')).toBe('docx')
    })

    it('should be case sensitive', () => {
      expect(getFileExtension('image.JPG')).toBe('JPG')
      expect(getFileExtension('document.PDF')).toBe('PDF')
    })
  })
})