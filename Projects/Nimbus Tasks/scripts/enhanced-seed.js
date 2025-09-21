#!/usr/bin/env node

/**
 * Enhanced seed script for Nimbus Tasks
 * Creates 3 organizations, 5 projects each, and 50 tasks total
 */

const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

// Seed configuration
const CONFIG = {
  organizations: 3,
  projectsPerOrg: 5,
  tasksPerProject: 3,
  usersPerOrg: 4,
  commentsPerTask: 2,
  attachmentsPerTask: 1
}

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const PROJECT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
]

const TAG_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#10B981', '#14B8A6',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
]

// Sample project templates
const PROJECT_TEMPLATES = [
  {
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    tasks: [
      'Create wireframes and mockups',
      'Develop responsive layout',
      'Implement user authentication',
      'Set up content management system',
      'Optimize for mobile devices'
    ]
  },
  {
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android',
    tasks: [
      'Design user interface',
      'Implement core features',
      'Integrate with backend API',
      'Add push notifications',
      'Submit to app stores'
    ]
  },
  {
    name: 'Data Migration',
    description: 'Migrate legacy data to new system',
    tasks: [
      'Analyze existing data structure',
      'Create migration scripts',
      'Test data integrity',
      'Perform backup procedures',
      'Execute migration process'
    ]
  },
  {
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for product launch',
    tasks: [
      'Develop campaign strategy',
      'Create marketing materials',
      'Set up social media campaigns',
      'Plan launch events',
      'Track campaign metrics'
    ]
  },
  {
    name: 'Security Audit',
    description: 'Comprehensive security review and improvements',
    tasks: [
      'Conduct vulnerability assessment',
      'Review access controls',
      'Update security policies',
      'Implement security training',
      'Create incident response plan'
    ]
  }
]

// Sample task descriptions
const TASK_DESCRIPTIONS = [
  'This task requires careful planning and execution. We need to ensure all requirements are met.',
  'High priority item that needs immediate attention from the development team.',
  'Collaborate with stakeholders to gather requirements and create detailed specifications.',
  'Research and evaluate different approaches before implementation.',
  'Code review and testing required before marking as complete.',
  'Document the process and create user guides for future reference.',
  'Cross-functional effort requiring coordination between multiple teams.'
]

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

async function createOrganizations() {
  console.log('🏢 Creating organizations...')

  const organizations = []

  for (let i = 0; i < CONFIG.organizations; i++) {
    const org = await prisma.organization.create({
      data: {
        name: `${faker.company.name()}`,
        slug: `org-${i + 1}-${faker.helpers.slugify(faker.company.buzzNoun())}`,
        description: faker.company.catchPhrase(),
        settings: {
          timezone: 'UTC',
          dateFormat: 'YYYY-MM-DD',
          workingHours: '9:00-17:00'
        }
      }
    })

    organizations.push(org)
    console.log(`  ✅ Created organization: ${org.name}`)
  }

  return organizations
}

async function createUsers(organizations) {
  console.log('👥 Creating users...')

  const users = []

  for (const org of organizations) {
    for (let i = 0; i < CONFIG.usersPerOrg; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const email = faker.internet.email({ firstName, lastName }).toLowerCase()

      const user = await prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          image: faker.image.avatar(),
          organizationId: org.id,
          role: i === 0 ? 'OWNER' : i === 1 ? 'ADMIN' : 'MEMBER',
          emailVerified: new Date(),
        }
      })

      users.push(user)
      console.log(`  ✅ Created user: ${user.name} (${user.role})`)
    }
  }

  return users
}

async function createProjects(organizations, users) {
  console.log('📁 Creating projects...')

  const projects = []

  for (const org of organizations) {
    const orgUsers = users.filter(u => u.organizationId === org.id)

    for (let i = 0; i < CONFIG.projectsPerOrg; i++) {
      const template = getRandomElement(PROJECT_TEMPLATES)
      const owner = getRandomElement(orgUsers)

      const project = await prisma.project.create({
        data: {
          name: `${template.name} ${i + 1}`,
          description: template.description,
          color: getRandomElement(PROJECT_COLORS),
          organizationId: org.id,
          ownerId: owner.id,
          isArchived: faker.datatype.boolean({ probability: 0.1 }),
          settings: {
            allowComments: true,
            allowAttachments: true,
            defaultAssignee: owner.id
          }
        }
      })

      projects.push({ ...project, template })
      console.log(`  ✅ Created project: ${project.name}`)
    }
  }

  return projects
}

async function createTasks(projects, users) {
  console.log('📋 Creating tasks...')

  const tasks = []

  for (const project of projects) {
    const orgUsers = users.filter(u => u.organizationId === project.organizationId)

    for (let i = 0; i < CONFIG.tasksPerProject; i++) {
      const taskName = project.template.tasks[i] || faker.hacker.phrase()
      const assignee = faker.datatype.boolean({ probability: 0.8 })
        ? getRandomElement(orgUsers)
        : null

      const task = await prisma.task.create({
        data: {
          title: taskName,
          description: getRandomElement(TASK_DESCRIPTIONS),
          status: getRandomElement(TASK_STATUSES),
          priority: getRandomElement(TASK_PRIORITIES),
          projectId: project.id,
          organizationId: project.organizationId,
          creatorId: getRandomElement(orgUsers).id,
          assigneeId: assignee?.id,
          dueAt: faker.datatype.boolean({ probability: 0.6 })
            ? faker.date.future({ years: 0.5 })
            : null,
          estimatedHours: faker.number.int({ min: 1, max: 40 }),
          actualHours: faker.datatype.boolean({ probability: 0.3 })
            ? faker.number.int({ min: 1, max: 35 })
            : null,
        }
      })

      tasks.push(task)
      console.log(`  ✅ Created task: ${task.title}`)
    }
  }

  return tasks
}

async function createTags(organizations) {
  console.log('🏷️ Creating tags...')

  const tags = []
  const tagNames = [
    'Frontend', 'Backend', 'Database', 'API', 'UI/UX', 'Testing',
    'Documentation', 'Bug', 'Feature', 'Enhancement', 'Critical',
    'Research', 'Meeting', 'Review', 'Deployment', 'Security'
  ]

  for (const org of organizations) {
    for (const tagName of tagNames) {
      const tag = await prisma.tag.create({
        data: {
          name: tagName,
          color: getRandomElement(TAG_COLORS),
          organizationId: org.id
        }
      })

      tags.push(tag)
    }

    console.log(`  ✅ Created ${tagNames.length} tags for ${org.name}`)
  }

  return tags
}

async function assignTagsToTasks(tasks, tags) {
  console.log('🔗 Assigning tags to tasks...')

  for (const task of tasks) {
    const orgTags = tags.filter(t => t.organizationId === task.organizationId)
    const taskTags = getRandomElements(orgTags, faker.number.int({ min: 0, max: 3 }))

    for (const tag of taskTags) {
      await prisma.taskTag.create({
        data: {
          taskId: task.id,
          tagId: tag.id
        }
      })
    }
  }

  console.log(`  ✅ Assigned tags to tasks`)
}

async function createComments(tasks, users) {
  console.log('💬 Creating comments...')

  let commentCount = 0

  for (const task of tasks) {
    if (faker.datatype.boolean({ probability: 0.7 })) {
      const orgUsers = users.filter(u => u.organizationId === task.organizationId)
      const numComments = faker.number.int({ min: 1, max: CONFIG.commentsPerTask })

      for (let i = 0; i < numComments; i++) {
        await prisma.comment.create({
          data: {
            content: faker.lorem.paragraph(),
            taskId: task.id,
            userId: getRandomElement(orgUsers).id,
            createdAt: faker.date.between({
              from: new Date(task.createdAt),
              to: new Date()
            })
          }
        })

        commentCount++
      }
    }
  }

  console.log(`  ✅ Created ${commentCount} comments`)
}

async function createAttachments(tasks, users) {
  console.log('📎 Creating attachments...')

  let attachmentCount = 0

  const fileTypes = [
    { name: 'document.pdf', type: 'application/pdf', size: 1024000 },
    { name: 'spreadsheet.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 512000 },
    { name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 2048000 },
    { name: 'image.png', type: 'image/png', size: 256000 },
    { name: 'archive.zip', type: 'application/zip', size: 1536000 }
  ]

  for (const task of tasks) {
    if (faker.datatype.boolean({ probability: 0.4 })) {
      const orgUsers = users.filter(u => u.organizationId === task.organizationId)
      const fileType = getRandomElement(fileTypes)

      await prisma.attachment.create({
        data: {
          filename: `${faker.system.fileName()}.${fileType.name.split('.').pop()}`,
          originalName: fileType.name,
          mimeType: fileType.type,
          size: fileType.size,
          url: `https://example.com/attachments/${faker.string.uuid()}`,
          taskId: task.id,
          uploadedById: getRandomElement(orgUsers).id
        }
      })

      attachmentCount++
    }
  }

  console.log(`  ✅ Created ${attachmentCount} attachments`)
}

async function createActivityLogs(tasks, users) {
  console.log('📊 Creating activity logs...')

  let activityCount = 0

  const activityTypes = [
    'TASK_CREATED', 'TASK_UPDATED', 'TASK_COMPLETED',
    'COMMENT_ADDED', 'ATTACHMENT_ADDED', 'TAG_ADDED'
  ]

  for (const task of tasks) {
    const orgUsers = users.filter(u => u.organizationId === task.organizationId)
    const numActivities = faker.number.int({ min: 2, max: 5 })

    for (let i = 0; i < numActivities; i++) {
      await prisma.activityLog.create({
        data: {
          type: getRandomElement(activityTypes),
          description: `Task "${task.title}" was ${getRandomElement(['updated', 'modified', 'reviewed'])}`,
          entityType: 'TASK',
          entityId: task.id,
          userId: getRandomElement(orgUsers).id,
          organizationId: task.organizationId,
          metadata: {
            taskId: task.id,
            previousStatus: getRandomElement(TASK_STATUSES),
            newStatus: task.status
          },
          createdAt: faker.date.between({
            from: new Date(task.createdAt),
            to: new Date()
          })
        }
      })

      activityCount++
    }
  }

  console.log(`  ✅ Created ${activityCount} activity logs`)
}

async function printSummary(organizations, users, projects, tasks) {
  console.log('\n📈 Seed Summary:')
  console.log('=' .repeat(50))
  console.log(`🏢 Organizations: ${organizations.length}`)
  console.log(`👥 Users: ${users.length}`)
  console.log(`📁 Projects: ${projects.length}`)
  console.log(`📋 Tasks: ${tasks.length}`)

  console.log('\n🏢 Organizations:')
  for (const org of organizations) {
    const orgUsers = users.filter(u => u.organizationId === org.id)
    const orgProjects = projects.filter(p => p.organizationId === org.id)
    const orgTasks = tasks.filter(t => t.organizationId === org.id)

    console.log(`  • ${org.name}`)
    console.log(`    Users: ${orgUsers.length}, Projects: ${orgProjects.length}, Tasks: ${orgTasks.length}`)
  }

  console.log('\n✨ Sample login credentials:')
  console.log('  Email: owner@example.com | Password: password123')
  console.log('  Email: admin@example.com | Password: password123')
  console.log('  Email: member@example.com | Password: password123')

  console.log('\n🎉 Seeding completed successfully!')
}

async function main() {
  try {
    console.log('🌱 Starting enhanced database seeding...\n')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.activityLog.deleteMany()
    await prisma.attachment.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.taskTag.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()
    await prisma.organization.deleteMany()
    console.log('  ✅ Database cleared\n')

    // Create data
    const organizations = await createOrganizations()
    const users = await createUsers(organizations)
    const projects = await createProjects(organizations, users)
    const tasks = await createTasks(projects, users)
    const tags = await createTags(organizations)

    await assignTagsToTasks(tasks, tags)
    await createComments(tasks, users)
    await createAttachments(tasks, users)
    await createActivityLogs(tasks, users)

    await printSummary(organizations, users, projects, tasks)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

module.exports = { main }