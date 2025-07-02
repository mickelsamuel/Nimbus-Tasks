import { Shield, Lock, GraduationCap, Scale } from 'lucide-react'
import type { PolicyItem } from './index'

export const policyItems: PolicyItem[] = [
  {
    id: 'codeOfConduct',
    title: 'Professional Excellence & Ethical Standards',
    subtitle: 'Core Values & Conduct',
    icon: Shield,
    gradient: 'from-red-500 via-red-600 to-red-700',
    accentColor: '#E01A1A',
    content: [
      'Uphold National Bank of Canada\'s reputation through exemplary professional conduct and ethical decision-making in all training activities and workplace interactions',
      'Foster an inclusive, respectful learning environment that reflects our commitment to diversity, equity, inclusion, and professional growth for all participants',
      'Maintain absolute confidentiality regarding proprietary training content, client information, strategic business discussions, and sensitive bank operations',
      'Demonstrate integrity in all assessments, peer collaborations, learning evaluations, and professional certifications without compromise or academic dishonesty',
      'Report immediately any violations of ethical standards, inappropriate conduct, harassment, discrimination, or security concerns through designated channels including Ethics Hotline'
    ]
  },
  {
    id: 'dataPrivacy',
    title: 'Information Security & Data Protection',
    subtitle: 'Privacy & Cybersecurity',
    icon: Lock,
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    accentColor: '#2196F3',
    content: [
      'Protect all client data, employee information, and proprietary bank content according to PIPEDA, provincial privacy laws, OSFI guidelines, and internal security policies',
      'Implement robust authentication measures including strong passwords (minimum 12 characters), multi-factor authentication, biometric verification, and secure device management',
      'Access training materials exclusively through authorized corporate devices and secured networks, never from public Wi-Fi, personal devices, or unsecured connections',
      'Immediately report any suspected data breaches, phishing attempts, malware, security incidents, or unauthorized access attempts to IT Security (1-800-NBC-HELP)',
      'Follow established data retention schedules, classification protocols, and secure disposal methods for all sensitive training materials, client information, and personal data'
    ]
  },
  {
    id: 'platformUsage',
    title: 'Learning Platform Governance & Standards',
    subtitle: 'Training Excellence',
    icon: GraduationCap,
    gradient: 'from-green-500 via-green-600 to-green-700',
    accentColor: '#4CAF50',
    content: [
      'Utilize the training platform exclusively for authorized professional development, skills enhancement, regulatory compliance training, and career advancement activities aligned with your role',
      'Complete all required modules, assessments, and certification requirements with absolute honesty, integrity, and academic excellence within specified deadlines',
      'Respect all intellectual property rights, copyrights, licensing agreements, and third-party content for training materials, simulations, and proprietary banking resources',
      'Contribute constructively to collaborative learning through thoughtful discussions, peer mentoring, knowledge sharing, and professional networking while maintaining confidentiality',
      'Report technical issues, content errors, accessibility concerns, or inappropriate behavior through designated support channels (training.support@nbc.ca) for continuous platform improvement'
    ]
  },
  {
    id: 'bankingSecurity',
    title: 'Banking Compliance & Regulatory Excellence',
    subtitle: 'Regulatory Adherence',
    icon: Scale,
    gradient: 'from-purple-500 via-purple-600 to-purple-700',
    accentColor: '#9C27B0',
    content: [
      'Maintain strict compliance with all banking regulations including OSFI guidelines, FINTRAC requirements, provincial securities legislation, and federal banking acts',
      'Demonstrate unwavering adherence to Anti-Money Laundering (AML), Know Your Customer (KYC), sanctions screening, and terrorist financing prevention protocols in all training scenarios',
      'Follow all market conduct rules, insider trading restrictions, conflict of interest policies, and suitability requirements in training simulations and practical applications',
      'Implement robust fraud prevention measures, risk assessment protocols, and immediately report any suspicious activities, potential market manipulation, or compliance violations to Compliance Department',
      'Ensure full compliance with consumer protection laws, fair lending practices, privacy regulations, accessibility standards, and complaint handling procedures in all client-facing training scenarios and assessments'
    ]
  }
]