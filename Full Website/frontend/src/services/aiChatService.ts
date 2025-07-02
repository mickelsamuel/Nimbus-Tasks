export interface FinancialContext {
  topic: 'general' | 'banking' | 'savings' | 'loans' | 'investments' | 'history' | 'security' | 'transactions';
  confidence: number;
}

export interface AIResponse {
  message: string;
  context?: FinancialContext;
  suggestions?: string[];
  sources?: string[];
}

class AIChatService {
  private bankingKnowledge = {
    history: {
      'national bank': 'The National Bank has a rich history dating back to 1859, serving communities for over 160 years with innovative financial solutions.',
      'founding': 'Founded in 1859, the National Bank started as a small community bank and grew to become one of the leading financial institutions.',
      'milestones': 'Key milestones include: 1859 founding, 1920s expansion across states, 1980s digital banking introduction, 2000s mobile banking launch.',
    },
    products: {
      'savings': 'We offer high-yield savings accounts with competitive interest rates, no minimum balance requirements, and 24/7 online access.',
      'checking': 'Our checking accounts feature no monthly fees, free ATM access worldwide, and instant mobile deposits.',
      'loans': 'Personal loans from $1,000 to $100,000 with flexible terms, competitive rates, and quick approval process.',
      'mortgages': 'Home loans with rates starting at 3.5% APR, various term options, and dedicated mortgage specialists.',
      'credit cards': 'Rewards credit cards with up to 5% cashback, no annual fees, and comprehensive fraud protection.',
    },
    security: {
      'fraud': 'We use advanced AI-powered fraud detection, 256-bit encryption, and multi-factor authentication to protect your accounts.',
      'protection': 'Your deposits are FDIC insured up to $250,000 per account type. We also offer additional insurance options.',
      'privacy': 'We never share your personal information with third parties without consent and comply with all privacy regulations.',
    },
    services: {
      'online banking': 'Access your accounts 24/7, transfer funds, pay bills, and manage investments from any device.',
      'mobile app': 'Our award-winning mobile app features biometric login, mobile check deposit, and real-time notifications.',
      'support': 'Get help through 24/7 phone support, live chat, video banking, or visit any of our 500+ branches nationwide.',
    }
  };

  private financialTips = [
    'Consider setting up automatic transfers to build your savings effortlessly.',
    'Review your spending patterns monthly to identify areas for improvement.',
    'Take advantage of employer 401(k) matching - it\'s free money!',
    'Build an emergency fund covering 3-6 months of expenses.',
    'Pay more than the minimum on credit cards to save on interest.',
  ];

  async generateResponse(userMessage: string): Promise<AIResponse> {
    const lowerMessage = userMessage.toLowerCase();
    const context = this.detectContext(lowerMessage);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    let response = '';
    let suggestions: string[] = [];
    let sources: string[] = [];

    // Check for specific banking knowledge
    if (lowerMessage.includes('history') || lowerMessage.includes('founded') || lowerMessage.includes('established')) {
      response = this.bankingKnowledge.history['national bank'] + ' ' + this.bankingKnowledge.history.milestones;
      sources = ['National Bank Historical Archives', 'Annual Reports 1859-2024'];
    } else if (lowerMessage.includes('savings') || lowerMessage.includes('save money')) {
      response = this.bankingKnowledge.products.savings + ' Current rates are 4.5% APY for balances over $10,000.';
      suggestions = ['Open a high-yield savings account', 'Set up automatic savings', 'Calculate potential earnings'];
    } else if (lowerMessage.includes('loan') || lowerMessage.includes('borrow')) {
      response = this.bankingKnowledge.products.loans + ' We also offer student loans, auto loans, and business loans.';
      suggestions = ['Check your loan eligibility', 'Calculate monthly payments', 'Compare loan options'];
    } else if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('fraud')) {
      response = this.bankingKnowledge.security.fraud + ' ' + this.bankingKnowledge.security.protection;
      sources = ['FDIC Insurance Coverage', 'Security & Privacy Policy'];
    } else if (lowerMessage.includes('mortgage') || lowerMessage.includes('home loan')) {
      response = this.bankingKnowledge.products.mortgages + ' Get pre-approved in minutes online.';
      suggestions = ['Get pre-approved', 'Calculate mortgage payments', 'Speak with a mortgage specialist'];
    } else if (lowerMessage.includes('credit card')) {
      response = this.bankingKnowledge.products['credit cards'] + ' Apply online and get instant approval.';
      suggestions = ['Compare credit cards', 'Check your credit score', 'Apply for a card'];
    } else if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
      response = this.bankingKnowledge.services['mobile app'] + ' Download it free from App Store or Google Play.';
      suggestions = ['Download mobile app', 'Learn app features', 'Enable notifications'];
    } else {
      // General response with financial tip
      const randomTip = this.financialTips[Math.floor(Math.random() * this.financialTips.length)];
      response = `I'd be happy to help you with your banking needs. ${randomTip} What specific information are you looking for today?`;
      suggestions = ['Learn about accounts', 'Explore loan options', 'Investment services', 'Contact support'];
    }

    return {
      message: response,
      context,
      suggestions,
      sources: sources.length > 0 ? sources : undefined
    };
  }

  private detectContext(message: string): FinancialContext {
    const contexts = {
      banking: ['account', 'bank', 'checking', 'savings', 'balance'],
      loans: ['loan', 'borrow', 'mortgage', 'credit', 'apr', 'interest'],
      investments: ['invest', 'stocks', 'bonds', 'portfolio', 'retirement', '401k', 'ira'],
      history: ['history', 'founded', 'established', 'years', 'heritage'],
      security: ['security', 'fraud', 'safe', 'protect', 'privacy', 'secure'],
      transactions: ['transfer', 'payment', 'send', 'deposit', 'withdraw'],
    };

    for (const [topic, keywords] of Object.entries(contexts)) {
      const matches = keywords.filter(keyword => message.includes(keyword)).length;
      if (matches > 0) {
        return {
          topic: topic as FinancialContext['topic'],
          confidence: Math.min(matches / keywords.length, 1)
        };
      }
    }

    return { topic: 'general', confidence: 0.5 };
  }

  // Get conversation starters
  getConversationStarters(): string[] {
    return [
      "Tell me about National Bank's history",
      "What savings accounts do you offer?",
      "How can I apply for a loan?",
      "What security measures protect my account?",
      "Help me understand investment options",
      "What makes National Bank different?",
    ];
  }

  // Get quick actions based on context
  getQuickActions(context?: FinancialContext): string[] {
    if (!context) return this.getConversationStarters();

    const actions: Record<FinancialContext['topic'], string[]> = {
      general: this.getConversationStarters(),
      banking: ['Open account', 'Check balance', 'View transactions', 'Order checks'],
      savings: ['Calculate savings', 'Compare rates', 'Set savings goal', 'Open account'],
      loans: ['Check eligibility', 'Calculate payments', 'Apply now', 'Compare rates'],
      investments: ['View portfolio', 'Market insights', 'Retirement calculator', 'Speak to advisor'],
      history: ['View timeline', 'Read annual report', 'Company milestones', 'Leadership team'],
      security: ['Security center', 'Report fraud', 'Update settings', 'Learn more'],
      transactions: ['Transfer money', 'Pay bills', 'Send money', 'Transaction history'],
    };

    return actions[context.topic] || actions.general;
  }
}

export const aiChatService = new AIChatService();