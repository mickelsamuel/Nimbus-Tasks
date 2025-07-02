const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.model = process.env.AI_MODEL || 'gemini-pro';
    this.visionModel = process.env.AI_VISION_MODEL || 'gemini-pro-vision';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not configured. AI features will be disabled.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  /**
   * Generate learning content using Gemini AI
   */
  // eslint-disable-next-line no-unused-vars
  async generateLearningContent(topic, type = 'explanation', options = {}) {
    if (!this.genAI) {
      throw new Error('AI service not properly configured');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const prompts = {
        explanation: `Create a clear, professional explanation about "${topic}" suitable for banking professionals. Include key concepts, practical applications, and real-world examples. Format the response in a structured way with bullet points and sections.`,
        
        quiz: `Create a multiple-choice quiz question about "${topic}" for banking professionals. Include 4 options with one correct answer and an explanation. Format as JSON with question, options array, correctAnswer (index), and explanation.`,
        
        scenario: `Create a realistic banking scenario or case study about "${topic}". Include the situation, challenges, and potential solutions. Make it relevant for training purposes.`,
        
        summary: `Create a concise summary of key points about "${topic}" for banking professionals. Focus on the most important concepts and practical applications.`
      };

      const prompt = prompts[type] || prompts.explanation;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        content: response.text(),
        topic,
        type,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI content generation failed:', error);
      throw new Error(`Failed to generate ${type} content for ${topic}`);
    }
  }

  /**
   * Generate personalized learning recommendations
   */
  async generateLearningRecommendations(userProfile) {
    if (!this.genAI) {
      throw new Error('AI service not properly configured');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const prompt = `Based on this user profile for a banking professional:
- Role: ${userProfile.role}
- Department: ${userProfile.department}
- Experience Level: ${userProfile.level || 'beginner'}
- Completed Modules: ${userProfile.completedModules || 0}
- Interests: ${userProfile.interests?.join(', ') || 'general banking'}
- Learning Goals: ${userProfile.learningGoals || 'professional development'}

Generate 5 personalized learning recommendations. Each should include:
1. Module title
2. Brief description
3. Why it's relevant for this user
4. Estimated difficulty
5. Expected learning outcomes

Format as JSON array.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      try {
        return JSON.parse(response.text());
      } catch {
        // If JSON parsing fails, return structured text
        return {
          recommendations: response.text(),
          format: 'text'
        };
      }
    } catch (error) {
      console.error('Learning recommendations generation failed:', error);
      throw new Error('Failed to generate learning recommendations');
    }
  }

  /**
   * Generate feedback for user performance
   */
  async generatePerformanceFeedback(performanceData) {
    if (!this.genAI) {
      throw new Error('AI service not properly configured');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const prompt = `Analyze this banking professional's performance data and provide constructive feedback:

Performance Metrics:
- Modules Completed: ${performanceData.modulesCompleted}
- Average Score: ${performanceData.averageScore}%
- Learning Time: ${performanceData.totalLearningTime} minutes
- Streak: ${performanceData.streak} days
- Strong Areas: ${performanceData.strengths?.join(', ') || 'To be determined'}
- Areas for Improvement: ${performanceData.weaknesses?.join(', ') || 'To be determined'}

Provide:
1. Overall performance assessment
2. Specific achievements to celebrate
3. Areas for improvement with actionable suggestions
4. Recommended next steps
5. Motivational encouragement

Keep the tone professional but encouraging, suitable for a banking training environment.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        feedback: response.text(),
        generatedAt: new Date().toISOString(),
        userLevel: this.categorizePerformance(performanceData)
      };
    } catch (error) {
      console.error('Performance feedback generation failed:', error);
      throw new Error('Failed to generate performance feedback');
    }
  }

  /**
   * Generate training content for specific banking topics
   */
  async generateTrainingModule(moduleRequest) {
    if (!this.genAI) {
      throw new Error('AI service not properly configured');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const prompt = `Create a comprehensive training module for banking professionals:

Topic: ${moduleRequest.topic}
Target Audience: ${moduleRequest.audience || 'Banking professionals'}
Difficulty Level: ${moduleRequest.difficulty || 'intermediate'}
Duration: ${moduleRequest.duration || '60'} minutes
Learning Objectives: ${moduleRequest.objectives?.join(', ') || 'Professional development'}

Create:
1. Module overview and introduction
2. 3-5 main learning sections with detailed content
3. Real-world banking examples and case studies
4. 5 quiz questions with answers
5. Practical exercises or scenarios
6. Key takeaways and summary
7. Additional resources for further learning

Format the content professionally and ensure it's practical for banking professionals.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        moduleContent: response.text(),
        topic: moduleRequest.topic,
        difficulty: moduleRequest.difficulty,
        estimatedDuration: moduleRequest.duration,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Training module generation failed:', error);
      throw new Error('Failed to generate training module');
    }
  }

  /**
   * Analyze user questions and provide intelligent responses
   */
  async answerQuestion(question, context = {}) {
    if (!this.genAI) {
      throw new Error('AI service not properly configured');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const contextInfo = context.userRole ? `The user is a ${context.userRole} in ${context.department || 'banking'}.` : '';
      const moduleInfo = context.currentModule ? `They are currently studying: ${context.currentModule}.` : '';
      
      const prompt = `You are Alexandra AI, the dedicated AI advisor for National Bank of Canada (BNC). Answer this banking-related question professionally and accurately with focus on National Bank services and Canadian banking context:

Question: "${question}"

Context: ${contextInfo} ${moduleInfo}

National Bank of Canada Background:
- Founded in 1859, headquartered in Montreal, Quebec
- One of Canada's Big Six banks
- Strong presence in Quebec and across Canada
- Services: Personal banking, commercial banking, wealth management, investment banking
- Known for personalized service and community focus
- Regulated by OSFI (Office of the Superintendent of Financial Institutions)

Response Requirements:
1. A clear, accurate answer with National Bank perspective when relevant
2. Canadian banking regulations and context (OSFI, CDIC, etc.)
3. Practical examples using National Bank products/services when applicable
4. Related concepts and next steps for the user
5. Maintain professional, helpful tone as a National Bank AI advisor

Keep the response focused on banking/finance and National Bank of Canada's perspective. If the question isn't financial, politely redirect to banking topics.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        answer: response.text(),
        question,
        context,
        answeredAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Question answering failed:', error);
      throw new Error('Failed to answer question');
    }
  }

  /**
   * Categorize user performance level
   */
  categorizePerformance(performanceData) {
    const { averageScore, modulesCompleted, streak } = performanceData;
    
    if (averageScore >= 90 && modulesCompleted >= 20 && streak >= 14) {
      return 'Expert';
    } else if (averageScore >= 80 && modulesCompleted >= 10 && streak >= 7) {
      return 'Advanced';
    } else if (averageScore >= 70 && modulesCompleted >= 5) {
      return 'Intermediate';
    } else {
      return 'Beginner';
    }
  }

  /**
   * Generate achievement descriptions
   */
  async generateAchievementContent(achievementType, userProgress) {
    if (!this.genAI) {
      return null; // Fallback to static content
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const prompt = `Create an achievement badge description for a banking training platform:

Achievement Type: ${achievementType}
User Progress: ${JSON.stringify(userProgress)}

Generate:
1. Achievement title (under 50 characters)
2. Description (under 100 characters)
3. Congratulatory message (encouraging and professional)
4. Rarity level (bronze, silver, gold, platinum)

Keep it professional but celebratory, suitable for banking professionals.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Achievement content generation failed:', error);
      return null;
    }
  }

  /**
   * Check if AI service is available
   */
  isAvailable() {
    return !!this.genAI && !!this.apiKey;
  }

  /**
   * Get AI service status
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      model: this.model,
      visionModel: this.visionModel,
      features: {
        contentGeneration: this.isAvailable(),
        recommendations: this.isAvailable(),
        feedback: this.isAvailable(),
        questionAnswering: this.isAvailable()
      }
    };
  }
}

module.exports = new AIService();