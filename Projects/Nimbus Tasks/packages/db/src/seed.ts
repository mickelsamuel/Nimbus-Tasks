import { PrismaClient, TaskStatus, TaskPriority, MembershipRole } from "../generated/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create demo organization
  const org = await prisma.organization.create({
    data: {
      name: "Acme Corporation",
      slug: "acme-corp",
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center",
    },
  });

  // Create demo users
  const owner = await prisma.user.create({
    data: {
      email: "owner@acme.com",
      name: "John Doe",
      password: hashedPassword,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@acme.com",
      name: "Jane Smith",
      password: hashedPassword,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612c932?w=40&h=40&fit=crop&crop=center",
    },
  });

  const member = await prisma.user.create({
    data: {
      email: "member@acme.com",
      name: "Bob Johnson",
      password: hashedPassword,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center",
    },
  });

  // Create memberships
  await prisma.membership.createMany({
    data: [
      { userId: owner.id, organizationId: org.id, role: MembershipRole.OWNER },
      { userId: admin.id, organizationId: org.id, role: MembershipRole.ADMIN },
      { userId: member.id, organizationId: org.id, role: MembershipRole.MEMBER },
    ],
  });

  // Create demo projects
  const project1 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      color: "#3B82F6",
      organizationId: org.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App",
      description: "Native mobile application for iOS and Android",
      color: "#10B981",
      organizationId: org.id,
    },
  });

  // Create demo tags
  const tagUrgent = await prisma.tag.create({
    data: {
      name: "urgent",
      color: "#EF4444",
      organizationId: org.id,
    },
  });

  const tagFeature = await prisma.tag.create({
    data: {
      name: "feature",
      color: "#8B5CF6",
      organizationId: org.id,
    },
  });

  const tagBug = await prisma.tag.create({
    data: {
      name: "bug",
      color: "#F59E0B",
      organizationId: org.id,
    },
  });

  const tagDesign = await prisma.tag.create({
    data: {
      name: "design",
      color: "#EC4899",
      organizationId: org.id,
    },
  });

  // Create demo tasks
  const tasks = [
    {
      title: "Design new homepage layout",
      description: "Create wireframes and mockups for the new homepage design",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: project1.id,
      assigneeId: admin.id,
      creatorId: owner.id,
      tags: [tagDesign.id, tagFeature.id],
    },
    {
      title: "Implement user authentication",
      description: "Set up NextAuth.js with email/password and OAuth providers",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      projectId: project1.id,
      assigneeId: member.id,
      creatorId: owner.id,
      tags: [tagFeature.id],
    },
    {
      title: "Fix mobile navigation bug",
      description: "Navigation menu not working properly on mobile devices",
      status: TaskStatus.TODO,
      priority: TaskPriority.URGENT,
      projectId: project1.id,
      assigneeId: admin.id,
      creatorId: admin.id,
      tags: [tagBug.id, tagUrgent.id],
      dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    },
    {
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: project1.id,
      assigneeId: member.id,
      creatorId: owner.id,
      tags: [],
    },
    {
      title: "Design app icon and splash screen",
      description: "Create app icons for both iOS and Android platforms",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: project2.id,
      assigneeId: admin.id,
      creatorId: owner.id,
      tags: [tagDesign.id],
    },
    {
      title: "Implement push notifications",
      description: "Add push notification functionality for task updates",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: project2.id,
      assigneeId: member.id,
      creatorId: admin.id,
      tags: [tagFeature.id],
    },
  ];

  for (const taskData of tasks) {
    const { tags, ...task } = taskData;
    const createdTask = await prisma.task.create({
      data: {
        ...task,
        tags: {
          connect: tags.map((tagId) => ({ id: tagId })),
        },
      },
    });

    // Add some comments
    if (Math.random() > 0.5) {
      await prisma.comment.create({
        data: {
          content: "Great work on this! Let me know if you need any help.",
          taskId: createdTask.id,
          userId: owner.id,
        },
      });
    }
  }

  // Create some notifications
  await prisma.notification.createMany({
    data: [
      {
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: "You have been assigned to 'Design new homepage layout'",
        userId: admin.id,
      },
      {
        type: "TASK_DUE_SOON",
        title: "Task due soon",
        message: "'Fix mobile navigation bug' is due in 2 days",
        userId: admin.id,
      },
      {
        type: "COMMENT_MENTION",
        title: "New comment",
        message: "John Doe commented on your task",
        userId: member.id,
        read: true,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`📊 Created:
  - 1 organization (${org.name})
  - 3 users (owner, admin, member)
  - 2 projects (${project1.name}, ${project2.name})
  - 4 tags (urgent, feature, bug, design)
  - 6 tasks with various statuses
  - Comments and notifications`);

  console.log(`\n🔐 Demo login credentials:
  Owner: owner@acme.com / password123
  Admin: admin@acme.com / password123
  Member: member@acme.com / password123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });