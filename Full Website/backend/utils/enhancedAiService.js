const { GoogleGenerativeAI } = require('@google/generative-ai');

class EnhancedAIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.model = process.env.AI_MODEL || 'gemini-pro';
    this.visionModel = process.env.AI_VISION_MODEL || 'gemini-pro-vision';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not configured. AI features will be disabled.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    
    // Enhanced configuration for banking conversations
    this.defaultConfig = {
      temperature: 0.7, // Balanced creativity and accuracy
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };
    
    this.safetySettings = [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ];
  }

  /**
   * Enhanced domain filtering for banking-specific content
   */
  async isFinancialBankingQuestion(question) {
    const financialKeywords = [
      'bank', 'banking', 'finance', 'financial', 'investment', 'portfolio', 'loan', 'credit',
      'mortgage', 'interest', 'rate', 'deposit', 'account', 'savings', 'checking', 'money',
      'currency', 'exchange', 'trading', 'stock', 'bond', 'mutual fund', 'etf', 'rrsp',
      'tfsa', 'tax', 'insurance', 'wealth', 'retirement', 'pension', 'budget', 'debt',
      'equity', 'dividend', 'yield', 'capital', 'risk', 'return', 'market', 'economy',
      'gdp', 'inflation', 'deflation', 'recession', 'bull market', 'bear market',
      'national bank', 'bnc', 'banque nationale', 'canada', 'canadian', 'cad', 'usd',
      'compliance', 'regulation', 'basel', 'stress test', 'liquidity', 'capital ratio',
      'aml', 'kyc', 'fatca', 'crs', 'privacy', 'security', 'fraud', 'cybersecurity',
      'advisor', 'advisory', 'consultation', 'planning', 'strategy', 'analysis'
    ];
    
    const questionLower = question.toLowerCase();
    
    // Check for direct keyword matches
    const hasFinancialKeywords = financialKeywords.some(keyword => 
      questionLower.includes(keyword)
    );
    
    // Check for financial question patterns
    const financialPatterns = [
      /how.*invest/i,
      /what.*interest/i,
      /when.*market/i,
      /why.*price/i,
      /where.*bank/i,
      /portfolio.*performance/i,
      /risk.*management/i,
      /financial.*planning/i,
      /credit.*score/i,
      /mortgage.*rate/i,
      /retirement.*planning/i,
      /tax.*strategy/i,
      /investment.*strategy/i,
      /account.*balance/i,
      /transfer.*funds/i,
      /bank.*statement/i,
      /loan.*application/i,
      /insurance.*policy/i
    ];
    
    const hasFinancialPatterns = financialPatterns.some(pattern => 
      pattern.test(question)
    );
    
    return hasFinancialKeywords || hasFinancialPatterns;
  }

  /**
   * Enhanced question analysis with context awareness
   */
  async analyzeQuestionContext(question, userProfile = {}) {
    const isFinancial = await this.isFinancialBankingQuestion(question);
    
    // Determine question type and complexity
    const questionType = this.categorizeQuestion(question);
    const complexityLevel = this.assessQuestionComplexity(question);
    
    return {
      isFinancial,
      type: questionType,
      complexity: complexityLevel,
      suggestedApproach: this.getSuggestedApproach(questionType, complexityLevel),
      relevantServices: this.getRelevantServices(question),
      userPersonalization: this.getPersonalizationHints(userProfile)
    };
  }

  categorizeQuestion(question) {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('how')) {
      return 'procedural'; // How-to questions
    } else if (questionLower.includes('what') || questionLower.includes('define')) {
      return 'definitional'; // What is/definition questions
    } else if (questionLower.includes('why')) {
      return 'explanatory'; // Why/reasoning questions
    } else if (questionLower.includes('when') || questionLower.includes('timeline')) {
      return 'temporal'; // Timing/when questions
    } else if (questionLower.includes('compare') || questionLower.includes('difference')) {
      return 'comparative'; // Comparison questions
    } else if (questionLower.includes('should') || questionLower.includes('recommend')) {
      return 'advisory'; // Recommendation questions
    } else {
      return 'general'; // General questions
    }
  }

  assessQuestionComplexity(question) {
    const words = question.split(' ').length;
    const hasMultipleParts = question.includes('and') || question.includes('also') || question.includes(',');
    const hasTechnicalTerms = /\b(derivatives|securitization|arbitrage|volatility|correlation)\b/i.test(question);
    
    if (words > 20 || hasMultipleParts || hasTechnicalTerms) {
      return 'complex';
    } else if (words > 10) {
      return 'moderate';
    } else {
      return 'simple';
    }
  }

  getSuggestedApproach(type, complexity) {
    const approaches = {
      procedural: {
        simple: 'step_by_step',
        moderate: 'detailed_process',
        complex: 'comprehensive_guide'
      },
      definitional: {
        simple: 'clear_definition',
        moderate: 'definition_with_examples',
        complex: 'comprehensive_explanation'
      },
      advisory: {
        simple: 'direct_recommendation',
        moderate: 'options_with_pros_cons',
        complex: 'comprehensive_analysis'
      }
    };
    
    return approaches[type]?.[complexity] || 'general_response';
  }

  getRelevantServices(question) {
    const services = [];
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('invest') || questionLower.includes('portfolio')) {
      services.push('Wealth Management', 'Investment Advisory');
    }
    if (questionLower.includes('loan') || questionLower.includes('mortgage')) {
      services.push('Lending Services', 'Mortgage Solutions');
    }
    if (questionLower.includes('account') || questionLower.includes('banking')) {
      services.push('Personal Banking', 'Business Banking');
    }
    if (questionLower.includes('insurance')) {
      services.push('Insurance Products');
    }
    
    return services;
  }

  getPersonalizationHints(userProfile) {
    const hints = [];
    
    if (userProfile.role === 'new_client') {
      hints.push('Use simpler terminology', 'Include basic concepts');
    } else if (userProfile.role === 'business_owner') {
      hints.push('Focus on business banking', 'Include tax implications');
    } else if (userProfile.experience === 'high_net_worth') {
      hints.push('Include advanced strategies', 'Mention private banking');
    }
    
    return hints;
  }

  /**
   * Enhanced intelligent question answering with domain filtering
   */
  async answerQuestion(question, context = {}) {
    if (!this.genAI) {
      throw new Error('AI service not properly configured');
    }

    try {
      // Analyze question context first
      const questionAnalysis = await this.analyzeQuestionContext(question, context.userProfile);
      
      // If not financial, provide polite redirect
      if (!questionAnalysis.isFinancial) {
        return {
          answer: `Hello! I'm Max, your dedicated AI advisor for National Bank of Canada. I specialize in banking, finance, and investment guidance.\n\nI'd be happy to help you with:\n• Banking products and services\n• Investment strategies and portfolio management\n• Loans, mortgages, and credit solutions\n• Financial planning and retirement strategies\n• Risk management and insurance\n• National Bank's digital banking tools\n• Market insights and economic trends\n\nCould you please rephrase your question to focus on banking or financial topics? I'm here to provide expert guidance in these areas.`,
          question,
          context,
          isFinancialQuery: false,
          answeredAt: new Date().toISOString(),
          confidence: 95
        };
      }

      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        generationConfig: this.defaultConfig,
        safetySettings: this.safetySettings
      });
      
      const contextInfo = context.userRole ? `The user is a ${context.userRole} in ${context.department || 'banking'}.` : '';
      const moduleInfo = context.currentModule ? `They are currently studying: ${context.currentModule}.` : '';
      const personalInfo = questionAnalysis.userPersonalization.length > 0 ? `Personalization hints: ${questionAnalysis.userPersonalization.join(', ')}` : '';
      
      const prompt = `You are Max, the advanced AI banking advisor for National Bank of Canada. You have deep expertise in Canadian banking, finance, and National Bank's products and services.

Question Analysis:
- Type: ${questionAnalysis.type}
- Complexity: ${questionAnalysis.complexity}
- Suggested Approach: ${questionAnalysis.suggestedApproach}
- Relevant Services: ${questionAnalysis.relevantServices.join(', ') || 'General banking'}

User Question: "${question}"

Context: ${contextInfo} ${moduleInfo} ${personalInfo}

National Bank of Canada - Your Complete Banking Partner:

🏦 About National Bank:
- Founded in 1859, headquartered in Montreal, Quebec
- One of Canada's Big Six banks with over 160 years of excellence
- Leading financial institution in Quebec and growing across Canada
- Trusted by over 2.8 million personal and commercial clients

💼 Core Services:
- Personal Banking: Accounts, cards, payments, digital banking
- Commercial Banking: Business loans, cash management, trade finance
- Wealth Management: Investment advisory, portfolio management, estate planning
- Investment Banking: Corporate finance, capital markets, M&A advisory
- Insurance: Life, property, travel, and business insurance

📱 Digital Innovation:
- Award-winning mobile and online banking
- AI-powered financial insights
- Contactless payments and digital wallet solutions
- Automated investment services (robo-advisory)

🛡️ Regulatory Excellence:
- Regulated by OSFI (Office of the Superintendent of Financial Institutions)
- Member of CDIC (Canada Deposit Insurance Corporation)
- Strong capital ratios and risk management
- Commitment to privacy and data security

Response Framework:
1. Direct, accurate answer addressing the user's specific question
2. National Bank perspective and relevant products/services when applicable
3. Canadian banking context (regulations, market conditions, etc.)
4. Practical next steps or actionable advice
5. Related services or opportunities the user might find valuable

Response Style:
- Professional yet approachable tone
- Clear, jargon-free explanations
- Include specific examples where helpful
- Maintain focus on National Bank's capabilities and Canadian banking context
- Be concise but comprehensive

Important: Always ensure your response is factually accurate about banking concepts and National Bank services. If uncertain about specific product details, recommend speaking with a National Bank advisor for personalized guidance.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Extract confidence score if available
      const responseText = response.text();
      let confidence = 90; // Default confidence
      
      // Assess response quality
      if (responseText.length > 500 && questionAnalysis.complexity === 'complex') {
        confidence = 95;
      } else if (responseText.length < 100) {
        confidence = 75;
      }
      
      return {
        answer: responseText,
        question,
        context,
        isFinancialQuery: true,
        questionAnalysis,
        confidence,
        answeredAt: new Date().toISOString(),
        model: this.model
      };
    } catch (error) {
      console.error('Enhanced question answering failed:', error);
      
      // Provide a helpful fallback response
      return {
        answer: `I apologize, but I'm experiencing a temporary issue processing your request. As your National Bank AI advisor, I'm here to help with banking and financial questions.\n\nIn the meantime, you can:\n• Visit nbc.ca for account access and information\n• Call our customer service at 1-888-483-5628\n• Visit any National Bank branch for personalized assistance\n\nPlease try asking your question again, and I'll do my best to provide you with accurate financial guidance.`,
        question,
        context,
        isFinancialQuery: true,
        confidence: 80,
        error: 'Fallback response due to processing error',
        answeredAt: new Date().toISOString()
      };
    }
  }

  /**
   * Enhanced conversation context management
   */
  async generateContextualResponse(question, conversationHistory = [], userProfile = {}) {
    if (!this.genAI || conversationHistory.length === 0) {
      return this.answerQuestion(question, { userProfile });
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        generationConfig: this.defaultConfig,
        safetySettings: this.safetySettings
      });
      
      // Build conversation context
      const recentHistory = conversationHistory.slice(-6); // Last 6 exchanges
      const contextString = recentHistory.map(exchange => 
        `User: ${exchange.question}\nMax: ${exchange.answer}`
      ).join('\n\n');
      
      const prompt = `You are Max, National Bank of Canada's AI advisor. Continue this conversation naturally while maintaining context.

Conversation History:
${contextString}

Current Question: "${question}"

User Profile: ${JSON.stringify(userProfile)}

Provide a contextual response that:
1. References previous conversation points when relevant
2. Builds on established context
3. Maintains consistent advice and recommendations
4. Focuses on National Bank solutions
5. Avoids repeating information already covered

Keep the response natural and conversational while being professionally informative.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        answer: response.text(),
        question,
        hasContext: true,
        contextLength: recentHistory.length,
        confidence: 92,
        answeredAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Contextual response generation failed:', error);
      // Fallback to regular question answering
      return this.answerQuestion(question, { userProfile });
    }
  }

  /**
   * Generate conversation starters based on user profile
   */
  async generateConversationStarters(userProfile = {}) {
    const baseStarters = [
      "How can I optimize my investment portfolio?",
      "What's the difference between RRSP and TFSA?",
      "Tell me about National Bank's mortgage options",
      "How do I improve my credit score?",
      "What business banking services does National Bank offer?"
    ];

    if (!this.genAI) {
      return baseStarters;
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        generationConfig: this.defaultConfig
      });
      
      const prompt = `Generate 5 personalized conversation starter questions for a National Bank client with this profile:
${JSON.stringify(userProfile)}

Questions should be:
- Relevant to their banking needs
- Focused on National Bank services
- Engaging and specific
- Professional but approachable

Return as a JSON array of strings.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      try {
        const generated = JSON.parse(response.text());
        return Array.isArray(generated) ? generated : baseStarters;
      } catch {
        return baseStarters;
      }
    } catch (error) {
      console.error('Conversation starters generation failed:', error);
      return baseStarters;
    }
  }

  /**
   * Generate learning content using Gemini AI
   */
  async generateLearningContent(topic, type = 'explanation') {
    if (!this.genAI) {
      throw new Error('AI service not properly configured');
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        generationConfig: this.defaultConfig
      });
      
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
   * Check if AI service is available
   */
  isAvailable() {
    return !!this.genAI && !!this.apiKey;
  }

  /**
   * Enhanced AI service status with health metrics
   */
  getStatus() {
    const now = new Date();
    return {
      available: this.isAvailable(),
      model: this.model,
      visionModel: this.visionModel,
      healthCheck: {
        timestamp: now.toISOString(),
        uptime: this.isAvailable() ? 'operational' : 'degraded',
        version: '2.0.0',
        features: {
          domainFiltering: true,
          contextualResponses: true,
          conversationHistory: true,
          personalizedStarters: true
        }
      },
      features: {
        contentGeneration: this.isAvailable(),
        recommendations: this.isAvailable(),
        feedback: this.isAvailable(),
        questionAnswering: this.isAvailable(),
        domainFiltering: this.isAvailable(),
        contextualChat: this.isAvailable()
      },
      capabilities: {
        maxConversationLength: 10,
        supportedLanguages: ['en-CA', 'fr-CA'],
        responseTimeTarget: '2-5 seconds',
        confidenceThreshold: 0.8
      }
    };
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
}

module.exports = new EnhancedAIService();

// Export enhanced features for banking-specific usage
module.exports.BankingAI = {
  // Quick financial topic detection
  isFinancialTopic: async (text) => {
    const service = new EnhancedAIService();
    return service.isFinancialBankingQuestion(text);
  },
  
  // Banking-optimized response generation
  getBankingResponse: async (question, context = {}) => {
    const service = new EnhancedAIService();
    const analysis = await service.analyzeQuestionContext(question, context.userProfile);
    
    if (!analysis.isFinancial) {
      return {
        answer: "I specialize in banking and financial guidance. Could you please ask a question related to banking, investments, or National Bank services?",
        redirect: true,
        confidence: 95
      };
    }
    
    return service.answerQuestion(question, context);
  },
  
  // Conversation context management
  continueConversation: async (question, history, userProfile) => {
    const service = new EnhancedAIService();
    return service.generateContextualResponse(question, history, userProfile);
  }
};