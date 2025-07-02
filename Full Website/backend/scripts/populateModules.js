const mongoose = require('mongoose');
require('dotenv').config();

const { Module } = require('../models');

async function populateModules() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing modules
    await Module.deleteMany({});
    console.log('Cleared existing modules');

    const modules = [];
    const categories = ['Banking Fundamentals', 'Customer Service', 'Risk Management', 'Digital Banking', 'Professional Development', 'Compliance', 'Leadership'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    for (let i = 1; i <= 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      const module = new Module({
        title: `${category} Module ${i}`,
        description: `Comprehensive training module covering ${category.toLowerCase()} concepts and best practices.`,
        category,
        difficulty,
        totalDuration: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
        instructor: {
          name: 'BNC Training Team',
          title: 'Senior Learning Specialist',
          bio: 'Expert training team with years of banking experience'
        },
        points: Math.floor(Math.random() * 500) + 100,
        status: 'published',
        isActive: true,
        language: 'en',
        chapters: Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, index) => ({
          title: `Chapter ${index + 1}: Introduction to ${category}`,
          description: `This chapter covers the fundamental concepts of ${category.toLowerCase()} in detail.`,
          duration: Math.floor(Math.random() * 30) + 10,
          content: `<h1>Chapter ${index + 1}</h1><p>This is the content for chapter ${index + 1} about ${category}.</p>`,
          videoUrl: `https://example.com/video-${i}-${index + 1}`,
          resources: [
            {
              name: `Resource ${index + 1}.pdf`,
              url: `https://example.com/resource-${i}-${index + 1}.pdf`,
              type: 'pdf'
            },
            {
              name: `Slides ${index + 1}.pptx`,
              url: `https://example.com/slides-${i}-${index + 1}.pptx`,
              type: 'download'
            }
          ],
          order: index + 1
        })),
        quiz: {
          questions: Array.from({ length: 5 }, (_, qIndex) => ({
            id: qIndex + 1,
            question: `Sample question ${qIndex + 1} about ${category}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: Math.floor(Math.random() * 4),
            explanation: `Explanation for question ${qIndex + 1}`
          })),
          passingScore: 80,
          timeLimit: 30
        },
        prerequisites: i > 10 ? [{ title: `${category} Module ${i - 10}` }] : [],
        tags: [category.toLowerCase().replace(/\s+/g, '-'), difficulty.toLowerCase()],
        stats: {
          averageRating: Math.random() * 2 + 3, // 3-5 rating
          enrolledCount: Math.floor(Math.random() * 2000) + 100,
          completedCount: Math.floor(Math.random() * 1500) + 50,
          totalRatings: Math.floor(Math.random() * 500) + 10
        },
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      });

      modules.push(module);
    }

    // Insert modules one by one to avoid bulk insert issues
    for (let i = 0; i < modules.length; i++) {
      try {
        await modules[i].save();
        if ((i + 1) % 10 === 0) {
          console.log(`Created ${i + 1} modules...`);
        }
      } catch (error) {
        console.error(`Error creating module ${i + 1}:`, error.message);
      }
    }
    console.log(`✅ Created ${modules.length} modules`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

populateModules();