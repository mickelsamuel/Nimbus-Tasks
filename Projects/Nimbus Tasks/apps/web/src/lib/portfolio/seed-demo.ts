import { PrismaClient } from '@nimbus/db'
import { PORTFOLIO_CONFIG } from './config'

const prisma = new PrismaClient()

// Demo task data for a realistic project showcase
const DEMO_TASKS = [
  // Sprint 1: Foundation & Planning
  {
    title: 'Market Research & Competitive Analysis',
    description: 'Conduct comprehensive market research to identify target audience, competitor landscape, and market positioning opportunities.',
    status: 'COMPLETED',
    priority: 'HIGH',
    assigneeIndex: 0, // Sarah Chen (PM)
    tags: ['research', 'planning'],
    completedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01')
  },
  {
    title: 'Define Product Requirements & Specifications',
    description: 'Create detailed PRD including user stories, acceptance criteria, and technical specifications.',
    status: 'COMPLETED',
    priority: 'HIGH',
    assigneeIndex: 0,
    tags: ['planning', 'requirements'],
    completedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-05')
  },
  {
    title: 'Technical Architecture Design',
    description: 'Design system architecture, database schema, and API specifications for the new product features.',
    status: 'COMPLETED',
    priority: 'HIGH',
    assigneeIndex: 1, // Marcus Rodriguez (Lead Dev)
    tags: ['architecture', 'backend'],
    completedAt: new Date('2024-01-25'),
    createdAt: new Date('2024-01-10')
  },

  // Sprint 2: Design & Development
  {
    title: 'User Experience Design & Wireframes',
    description: 'Create user journey maps, wireframes, and high-fidelity mockups for all product screens.',
    status: 'COMPLETED',
    priority: 'HIGH',
    assigneeIndex: 2, // Emily Thompson (UX)
    tags: ['design', 'ux'],
    completedAt: new Date('2024-02-10'),
    createdAt: new Date('2024-01-25')
  },
  {
    title: 'Implement Core API Endpoints',
    description: 'Develop REST API endpoints for user management, project creation, and task operations.',
    status: 'COMPLETED',
    priority: 'HIGH',
    assigneeIndex: 1,
    tags: ['backend', 'api'],
    completedAt: new Date('2024-02-15'),
    createdAt: new Date('2024-02-01')
  },
  {
    title: 'Frontend Component Library',
    description: 'Build reusable React components including forms, modals, and data visualization widgets.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assigneeIndex: 1,
    tags: ['frontend', 'components'],
    createdAt: new Date('2024-02-10')
  },

  // Sprint 3: Features & Integration
  {
    title: 'Real-time Collaboration Features',
    description: 'Implement WebSocket connections for live updates, presence indicators, and collaborative editing.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assigneeIndex: 1,
    tags: ['realtime', 'collaboration'],
    createdAt: new Date('2024-02-20')
  },
  {
    title: 'User Authentication & Authorization',
    description: 'Set up secure login system with role-based permissions and team management.',
    status: 'TODO',
    priority: 'HIGH',
    assigneeIndex: 1,
    tags: ['auth', 'security'],
    createdAt: new Date('2024-02-25')
  },
  {
    title: 'Dashboard Analytics & Reporting',
    description: 'Create interactive charts and reports for project progress, team productivity, and burndown tracking.',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeIndex: 2,
    tags: ['analytics', 'visualization'],
    createdAt: new Date('2024-03-01')
  },

  // Sprint 4: Testing & Polish
  {
    title: 'Comprehensive Testing Suite',
    description: 'Develop unit tests, integration tests, and end-to-end automation testing coverage.',
    status: 'TODO',
    priority: 'HIGH',
    assigneeIndex: 4, // Lisa Wang (QA)
    tags: ['testing', 'quality'],
    createdAt: new Date('2024-03-05')
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize application performance, implement caching strategies, and reduce load times.',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeIndex: 1,
    tags: ['performance', 'optimization'],
    createdAt: new Date('2024-03-10')
  },
  {
    title: 'Mobile Responsive Design',
    description: 'Ensure seamless user experience across all device sizes with responsive design patterns.',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeIndex: 2,
    tags: ['mobile', 'responsive'],
    createdAt: new Date('2024-03-12')
  },

  // Sprint 5: Marketing & Launch
  {
    title: 'Marketing Website & Landing Pages',
    description: 'Design and develop marketing website with feature highlights, pricing, and onboarding flows.',
    status: 'TODO',
    priority: 'HIGH',
    assigneeIndex: 3, // David Kim (Marketing)
    tags: ['marketing', 'website'],
    createdAt: new Date('2024-03-15')
  },
  {
    title: 'Content Strategy & Documentation',
    description: 'Create user guides, API documentation, and help center content for product launch.',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeIndex: 3,
    tags: ['content', 'documentation'],
    createdAt: new Date('2024-03-18')
  },
  {
    title: 'Beta User Onboarding Program',
    description: 'Launch beta testing program with selected users and gather feedback for final improvements.',
    status: 'TODO',
    priority: 'HIGH',
    assigneeIndex: 0,
    tags: ['beta', 'feedback'],
    createdAt: new Date('2024-03-20')
  },
  {
    title: 'Production Deployment & Monitoring',
    description: 'Deploy to production infrastructure with monitoring, logging, and alerting systems.',
    status: 'TODO',
    priority: 'HIGH',
    assigneeIndex: 1,
    tags: ['deployment', 'devops'],
    createdAt: new Date('2024-03-25')
  }
]

// Additional project milestones
const DEMO_MILESTONES = [
  {
    title: 'MVP Requirements Complete',
    description: 'All core features defined and technical architecture approved',
    dueDate: new Date('2024-02-01'),
    completed: true,
    completedAt: new Date('2024-01-30')
  },
  {
    title: 'Alpha Release',
    description: 'Internal testing version with core functionality',
    dueDate: new Date('2024-03-01'),
    completed: false
  },
  {
    title: 'Beta Launch',
    description: 'Public beta with selected users and feedback collection',
    dueDate: new Date('2024-03-15'),
    completed: false
  },
  {
    title: 'Production Launch',
    description: 'Full public release with marketing campaign',
    dueDate: new Date('2024-04-01'),
    completed: false
  }
]

export async function seedDemoData() {
  console.log('🌱 Seeding demo data for portfolio mode...')

  try {
    // Create demo organization
    const demoOrg = await prisma.organization.upsert({
      where: { id: PORTFOLIO_CONFIG.demoOrgId },
      update: {},
      create: {
        id: PORTFOLIO_CONFIG.demoOrgId,
        name: PORTFOLIO_CONFIG.demoOrgName,
        slug: PORTFOLIO_CONFIG.demoOrgSlug,
        description: 'A showcase workspace demonstrating Nimbus Tasks capabilities with realistic project data.'
      }
    })

    console.log(`✅ Created demo organization: ${demoOrg.name}`)

    // Create demo users
    const demoUsers = []
    for (const userData of PORTFOLIO_CONFIG.demoUsers) {
      const user = await prisma.user.upsert({
        where: { id: userData.id },
        update: {},
        create: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          image: userData.avatar,
          role: 'MEMBER'
        }
      })

      // Add user to demo organization
      await prisma.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: demoOrg.id,
            userId: user.id
          }
        },
        update: {},
        create: {
          organizationId: demoOrg.id,
          userId: user.id,
          role: userData.role === 'Product Manager' ? 'ADMIN' : 'MEMBER'
        }
      })

      demoUsers.push(user)
    }

    console.log(`✅ Created ${demoUsers.length} demo users`)

    // Create demo project
    const demoProject = await prisma.project.upsert({
      where: { id: PORTFOLIO_CONFIG.demoProject.id },
      update: {},
      create: {
        id: PORTFOLIO_CONFIG.demoProject.id,
        name: PORTFOLIO_CONFIG.demoProject.name,
        description: PORTFOLIO_CONFIG.demoProject.description,
        color: PORTFOLIO_CONFIG.demoProject.color,
        organizationId: demoOrg.id,
        createdById: demoUsers[0].id, // Sarah Chen as creator
        status: 'ACTIVE',
        startDate: new Date('2024-01-01'),
        targetDate: new Date('2024-04-01')
      }
    })

    console.log(`✅ Created demo project: ${demoProject.name}`)

    // Add all demo users to the project
    for (const user of demoUsers) {
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: demoProject.id,
            userId: user.id
          }
        },
        update: {},
        create: {
          projectId: demoProject.id,
          userId: user.id,
          role: user.id === demoUsers[0].id ? 'ADMIN' : 'MEMBER'
        }
      })
    }

    // Create demo tasks
    let taskCount = 0
    for (const taskData of DEMO_TASKS) {
      const assignee = taskData.assigneeIndex !== undefined ? demoUsers[taskData.assigneeIndex] : null

      const task = await prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status as any,
          priority: taskData.priority as any,
          projectId: demoProject.id,
          assignedToId: assignee?.id,
          createdById: demoUsers[0].id, // Sarah Chen as creator
          createdAt: taskData.createdAt,
          updatedAt: taskData.completedAt || taskData.createdAt,
          ...(taskData.completedAt && { completedAt: taskData.completedAt })
        }
      })

      // Add tags if specified
      if (taskData.tags && taskData.tags.length > 0) {
        for (const tagName of taskData.tags) {
          // Create or find tag
          const tag = await prisma.tag.upsert({
            where: { name_projectId: { name: tagName, projectId: demoProject.id } },
            update: {},
            create: {
              name: tagName,
              color: getTagColor(tagName),
              projectId: demoProject.id
            }
          })

          // Associate tag with task
          await prisma.taskTag.upsert({
            where: {
              taskId_tagId: {
                taskId: task.id,
                tagId: tag.id
              }
            },
            update: {},
            create: {
              taskId: task.id,
              tagId: tag.id
            }
          })
        }
      }

      taskCount++
    }

    console.log(`✅ Created ${taskCount} demo tasks with realistic data`)

    // Create demo comments on some tasks
    const tasks = await prisma.task.findMany({
      where: { projectId: demoProject.id },
      take: 5
    })

    const demoComments = [
      { content: 'Great progress on this! The research findings are very insightful.', authorIndex: 1 },
      { content: 'I\'ve reviewed the designs and they look fantastic. Ready for development.', authorIndex: 0 },
      { content: 'API endpoints are complete and tested. Moving to frontend integration.', authorIndex: 1 },
      { content: 'Updated the mockups based on user feedback. Check the latest version.', authorIndex: 2 },
      { content: 'All tests are passing. Ready for staging deployment.', authorIndex: 4 }
    ]

    for (let i = 0; i < Math.min(tasks.length, demoComments.length); i++) {
      const commentData = demoComments[i]
      await prisma.comment.create({
        data: {
          content: commentData.content,
          taskId: tasks[i].id,
          authorId: demoUsers[commentData.authorIndex].id,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random within last week
        }
      })
    }

    console.log(`✅ Added demo comments and interactions`)

    console.log('🎉 Demo data seeding completed successfully!')

    return {
      organization: demoOrg,
      project: demoProject,
      users: demoUsers,
      taskCount
    }

  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    throw error
  }
}

// Helper function to get consistent tag colors
function getTagColor(tagName: string): string {
  const colorMap: Record<string, string> = {
    research: '#8b5cf6',
    planning: '#3b82f6',
    requirements: '#06b6d4',
    architecture: '#10b981',
    backend: '#f59e0b',
    frontend: '#ef4444',
    design: '#ec4899',
    ux: '#f97316',
    api: '#84cc16',
    components: '#6366f1',
    realtime: '#14b8a6',
    collaboration: '#a855f7',
    auth: '#dc2626',
    security: '#991b1b',
    analytics: '#7c3aed',
    visualization: '#2563eb',
    testing: '#059669',
    quality: '#047857',
    performance: '#b45309',
    optimization: '#92400e',
    mobile: '#7c2d12',
    responsive: '#9a3412',
    marketing: '#be185d',
    website: '#c2185b',
    content: '#7e22ce',
    documentation: '#6b21a8',
    beta: '#1d4ed8',
    feedback: '#1e40af',
    deployment: '#1e3a8a',
    devops: '#312e81'
  }

  return colorMap[tagName.toLowerCase()] || '#6b7280'
}

// Function to clean up demo data (for development)
export async function cleanupDemoData() {
  console.log('🧹 Cleaning up demo data...')

  try {
    // Delete in correct order due to foreign key constraints
    await prisma.comment.deleteMany({
      where: {
        task: {
          projectId: PORTFOLIO_CONFIG.demoProject.id
        }
      }
    })

    await prisma.taskTag.deleteMany({
      where: {
        task: {
          projectId: PORTFOLIO_CONFIG.demoProject.id
        }
      }
    })

    await prisma.tag.deleteMany({
      where: {
        projectId: PORTFOLIO_CONFIG.demoProject.id
      }
    })

    await prisma.task.deleteMany({
      where: {
        projectId: PORTFOLIO_CONFIG.demoProject.id
      }
    })

    await prisma.projectMember.deleteMany({
      where: {
        projectId: PORTFOLIO_CONFIG.demoProject.id
      }
    })

    await prisma.project.delete({
      where: {
        id: PORTFOLIO_CONFIG.demoProject.id
      }
    })

    await prisma.organizationMember.deleteMany({
      where: {
        organizationId: PORTFOLIO_CONFIG.demoOrgId
      }
    })

    await prisma.user.deleteMany({
      where: {
        id: {
          in: PORTFOLIO_CONFIG.demoUsers.map(u => u.id)
        }
      }
    })

    await prisma.organization.delete({
      where: {
        id: PORTFOLIO_CONFIG.demoOrgId
      }
    })

    console.log('✅ Demo data cleanup completed')
  } catch (error) {
    console.error('❌ Error cleaning up demo data:', error)
    throw error
  }
}