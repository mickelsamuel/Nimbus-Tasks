const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');
const { emailMonitor } = require('./emailMonitor');

// Email providers configuration with Google as primary
const backupProviders = [
  {
    name: 'google-primary',
    config: {
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL_USER,
        pass: process.env.GOOGLE_EMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'backup-sendgrid',
    config: {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    }
  }
];

// Create reusable transporter object with fallback support
const createTransporter = (providerIndex = 0) => {
  const provider = backupProviders[providerIndex];
  if (!provider) {
    throw new Error('No more email providers available');
  }
  
  console.log(`Using email provider: ${provider.name}`);
  return nodemailer.createTransporter(provider.config);
};

// Enhanced email sending with monitoring and fallback
const sendEmailWithFallback = async (mailOptions, emailType, maxRetries = 3) => {
  let lastError;
  
  for (let providerIndex = 0; providerIndex < backupProviders.length; providerIndex++) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const transporter = createTransporter(providerIndex);
        const info = await transporter.sendMail(mailOptions);
        
        // Track successful delivery
        await emailMonitor.trackDelivery(
          emailType,
          mailOptions.to,
          true,
          info.messageId
        );
        
        console.log(`Email sent successfully via ${backupProviders[providerIndex].name}:`, info.messageId);
        return { success: true, messageId: info.messageId, provider: backupProviders[providerIndex].name };
        
      } catch (error) {
        lastError = error;
        console.error(`Email send attempt ${attempt + 1} failed via ${backupProviders[providerIndex].name}:`, error.message);
        
        // Track failed delivery attempt
        await emailMonitor.trackDelivery(
          emailType,
          mailOptions.to,
          false,
          null,
          error
        );
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  // All providers and retries exhausted
  throw new Error(`Failed to send email after trying all providers: ${lastError?.message}`);
};

// Send password reset email
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: {
      name: 'National Bank of Canada Training Platform',
      address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
    },
    to: email,
    subject: 'Password Reset Request - BNC Training Platform',
    html: generatePasswordResetEmailTemplate(firstName, resetUrl),
    text: generatePasswordResetEmailText(firstName, resetUrl)
  };

  return await sendEmailWithFallback(mailOptions, 'password-reset');
};

// Send welcome email for new users
const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: {
      name: 'National Bank of Canada Training Platform',
      address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
    },
    to: email,
    subject: 'Welcome to BNC Training Platform',
    html: generateWelcomeEmailTemplate(firstName),
    text: generateWelcomeEmailText(firstName)
  };

  return await sendEmailWithFallback(mailOptions, 'welcome');
};

// Send policy acceptance confirmation email
const sendPolicyConfirmationEmail = async (email, firstName) => {
  const mailOptions = {
    from: {
      name: 'National Bank of Canada Training Platform',
      address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
    },
    to: email,
    subject: 'Policy Acceptance Confirmation - BNC Training Platform',
    html: generatePolicyConfirmationEmailTemplate(firstName),
    text: generatePolicyConfirmationEmailText(firstName)
  };

  return await sendEmailWithFallback(mailOptions, 'policy-confirmation');
};

// Email template for password reset
const generatePasswordResetEmailTemplate = (firstName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - BNC Training Platform</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #E01A1A 0%, #B71C1C 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
        .message { font-size: 16px; line-height: 1.8; margin-bottom: 30px; color: #555; }
        .button-container { text-align: center; margin: 30px 0; }
        .reset-button { display: inline-block; background: linear-gradient(135deg, #E01A1A 0%, #B71C1C 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(224,26,26,0.3); transition: all 0.3s ease; }
        .reset-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(224,26,26,0.4); }
        .security-notice { background: #f8f9fa; border-left: 4px solid #28a745; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; }
        .security-notice h3 { margin: 0 0 10px 0; color: #28a745; font-size: 16px; }
        .security-notice p { margin: 0; font-size: 14px; color: #666; }
        .footer { background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer p { margin: 0; font-size: 14px; color: #6c757d; }
        .expiry-warning { color: #dc3545; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏦 National Bank of Canada</h1>
          <p>Training Platform Security Center</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${firstName},</div>
          
          <div class="message">
            We received a request to reset your password for your National Bank of Canada Training Platform account. If you made this request, please click the secure button below to create a new password.
          </div>
          
          <div class="button-container">
            <a href="${resetUrl}" class="reset-button">Reset Your Password</a>
          </div>
          
          <div class="security-notice">
            <h3>🔒 Security Information</h3>
            <p>This password reset link is valid for 15 minutes and can only be used once. If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          
          <div class="expiry-warning">
            ⏰ This link expires in 15 minutes for your security protection.
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 National Bank of Canada. All rights reserved.</p>
          <p>This is an automated message from the BNC Training Platform security system.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Plain text version of password reset email
const generatePasswordResetEmailText = (firstName, resetUrl) => {
  return `
Hello ${firstName},

We received a request to reset your password for your National Bank of Canada Training Platform account.

To reset your password, please visit: ${resetUrl}

This link is valid for 15 minutes and can only be used once.

If you didn't request this password reset, please ignore this email and your password will remain unchanged.

Security Notice: This is an automated message from the BNC Training Platform security system.

© 2024 National Bank of Canada. All rights reserved.
  `;
};

// Welcome email template
const generateWelcomeEmailTemplate = (firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to BNC Training Platform</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #E01A1A 0%, #1E40AF 50%, #F59E0B 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; margin-bottom: 20px; color: #2c3e50; }
        .welcome-message { font-size: 16px; line-height: 1.8; margin-bottom: 30px; color: #555; }
        .features { margin: 30px 0; }
        .feature-item { display: flex; align-items: flex-start; margin-bottom: 20px; }
        .feature-icon { width: 24px; height: 24px; margin-right: 15px; margin-top: 2px; }
        .button-container { text-align: center; margin: 30px 0; }
        .login-button { display: inline-block; background: linear-gradient(135deg, #E01A1A 0%, #B71C1C 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(224,26,26,0.3); }
        .footer { background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer p { margin: 0; font-size: 14px; color: #6c757d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Welcome to BNC Training</h1>
          <p>Excellence in Banking Education</p>
        </div>
        
        <div class="content">
          <div class="greeting">Welcome ${firstName}!</div>
          
          <div class="welcome-message">
            Thank you for joining the National Bank of Canada Training Platform. You now have access to our comprehensive professional development resources designed to enhance your banking expertise and career growth.
          </div>
          
          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">🏆</div>
              <div><strong>Gamified Learning:</strong> Earn points, badges, and climb leaderboards while mastering banking skills</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📚</div>
              <div><strong>Comprehensive Modules:</strong> Access industry-leading training content and certification programs</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👥</div>
              <div><strong>Team Collaboration:</strong> Connect with colleagues and participate in group learning activities</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div><strong>Progress Tracking:</strong> Monitor your learning journey with detailed analytics and insights</div>
            </div>
          </div>
          
          <div class="button-container">
            <a href="${process.env.FRONTEND_URL}/login" class="login-button">Start Learning Today</a>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 National Bank of Canada. All rights reserved.</p>
          <p>Need help? Contact our training support team for assistance.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Plain text version of welcome email
const generateWelcomeEmailText = (firstName) => {
  return `
Welcome ${firstName}!

Thank you for joining the National Bank of Canada Training Platform. You now have access to our comprehensive professional development resources.

What you can expect:
- Gamified learning with points, badges, and leaderboards
- Comprehensive training modules and certification programs  
- Team collaboration and group learning activities
- Detailed progress tracking and analytics

Start your learning journey: ${process.env.FRONTEND_URL}/login

© 2024 National Bank of Canada. All rights reserved.
  `;
};

// Policy confirmation email template
const generatePolicyConfirmationEmailTemplate = (firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Policy Acceptance Confirmed - BNC Training Platform</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .footer { background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Policy Acceptance Confirmed</h1>
          <p>BNC Training Platform</p>
        </div>
        
        <div class="content">
          <div style="font-size: 18px; margin-bottom: 20px;">Hello ${firstName},</div>
          
          <div style="font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
            This email confirms that you have successfully accepted all required policies for the National Bank of Canada Training Platform. Your commitment to our standards of excellence is appreciated.
          </div>
          
          <div style="background: #f8f9fa; border-left: 4px solid #10B981; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <h3 style="margin: 0 0 10px 0; color: #10B981;">Policies Accepted:</h3>
            <ul style="margin: 0; color: #666;">
              <li>Professional Excellence & Ethical Standards</li>
              <li>Information Security & Data Protection</li>
              <li>Learning Platform Governance & Standards</li>
              <li>Banking Compliance & Regulatory Excellence</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 National Bank of Canada. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Plain text version of policy confirmation email
const generatePolicyConfirmationEmailText = (firstName) => {
  return `
Hello ${firstName},

This email confirms that you have successfully accepted all required policies for the National Bank of Canada Training Platform.

Policies Accepted:
- Professional Excellence & Ethical Standards
- Information Security & Data Protection
- Learning Platform Governance & Standards
- Banking Compliance & Regulatory Excellence

© 2024 National Bank of Canada. All rights reserved.
  `;
};

// Template loading functionality
const templates = new Map();
let baseTemplate = null;

const loadTemplates = async () => {
  try {
    const templatesDir = path.join(__dirname, '../templates/email');
    
    // Load base template
    try {
      const baseTemplatePath = path.join(templatesDir, 'base.html');
      const baseTemplateContent = await fs.readFile(baseTemplatePath, 'utf8');
      baseTemplate = Handlebars.compile(baseTemplateContent);
      console.log('Loaded base email template');
    } catch (error) {
      console.warn('Base email template not found, using inline templates');
    }
    
    // Load individual templates
    const templateFiles = [
      'welcome.html',
      'passwordReset.html', 
      'moduleAssignment.html',
      'achievementUnlocked.html',
      'moduleReminder.html'
    ];
    
    for (const templateFile of templateFiles) {
      try {
        const templatePath = path.join(templatesDir, templateFile);
        const templateContent = await fs.readFile(templatePath, 'utf8');
        const templateName = path.basename(templateFile, '.html');
        templates.set(templateName, Handlebars.compile(templateContent));
        console.log(`Loaded email template: ${templateName}`);
      } catch (error) {
        console.warn(`Email template ${templateFile} not found, using fallback`);
      }
    }
  } catch (error) {
    console.error('Failed to load email templates:', error.message);
  }
};

const renderTemplate = (templateName, data) => {
  const template = templates.get(templateName);
  if (!template) {
    console.warn(`Template '${templateName}' not found, using fallback`);
    return null;
  }
  
  const content = template(data);
  
  // Wrap in base template if available
  if (baseTemplate) {
    return baseTemplate({
      ...data,
      content,
      subject: data.subject || 'BNC Training Platform',
      baseUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      currentYear: new Date().getFullYear(),
      unsubscribeUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe`
    });
  }
  
  return content;
};

// Enhanced email functions using templates
const sendModuleAssignmentEmail = async (user, module, assignment, assignedBy) => {
  try {
    const moduleUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/modules/${module._id}`;
    const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date';
    
    const templateData = {
      firstName: user.firstName,
      moduleTitle: module.title,
      moduleDescription: module.description || module.shortDescription,
      moduleCategory: module.category,
      moduleDifficulty: module.difficulty,
      moduleDuration: formatDuration(module.totalDuration),
      modulePoints: module.points,
      moduleUrl,
      dueDate,
      priority: assignment.priority || 'medium',
      assignedBy: assignedBy?.firstName && assignedBy?.lastName ? 
        `${assignedBy.firstName} ${assignedBy.lastName}` : 'System',
      assignedByEmail: assignedBy?.email,
      assignmentDate: new Date().toLocaleDateString(),
      notes: assignment.notes,
      learningObjectives: module.learningObjectives || [],
      prerequisites: module.prerequisites?.map(p => p.title) || [],
      daysRemaining: assignment.dueDate ? 
        Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null,
      estimatedHours: Math.ceil(module.totalDuration / 60),
      platformUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    };
    
    const htmlContent = renderTemplate('moduleAssignment', templateData);
    
    const mailOptions = {
      from: {
        name: 'BNC Training Platform',
        address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
      },
      to: user.email,
      subject: `New Training Assignment: ${module.title}`,
      html: htmlContent || generateModuleAssignmentFallback(templateData),
      text: `You have been assigned a new training module: ${module.title}. Due: ${dueDate}. Visit ${moduleUrl} to start.`
    };
    
    return await sendEmailWithFallback(mailOptions, 'module-assignment');
  } catch (error) {
    console.error('Failed to send module assignment email:', error);
    throw error;
  }
};

const sendAchievementEmail = async (user, achievement) => {
  try {
    const templateData = {
      firstName: user.firstName,
      achievementTitle: achievement.title,
      achievementDescription: achievement.description,
      achievementIcon: achievement.icon || '🏆',
      achievementRarity: achievement.rarity || 'Common',
      points: achievement.points || 0,
      totalAchievements: user.achievements?.filter(a => a.unlockedAt).length || 0,
      currentLevel: user.stats?.level || 1,
      nextLevel: (user.stats?.level || 1) + 1,
      xpToNextLevel: user.stats?.xpToNextLevel || 1000,
      unlockedDate: new Date().toLocaleDateString(),
      dashboardUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
      modulesUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/modules`,
      achievementMeaning: 'This achievement recognizes your dedication and progress in the training platform.',
      recommendedActions: [
        'Explore advanced modules in your field',
        'Join team challenges and competitions', 
        'Share your knowledge with colleagues',
        'Set new learning goals for continued growth'
      ]
    };
    
    const htmlContent = renderTemplate('achievementUnlocked', templateData);
    
    const mailOptions = {
      from: {
        name: 'BNC Training Platform',
        address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
      },
      to: user.email,
      subject: `Achievement Unlocked: ${achievement.title}!`,
      html: htmlContent || generateAchievementFallback(templateData),
      text: `Congratulations! You've unlocked the "${achievement.title}" achievement. Visit your dashboard to see your progress.`
    };
    
    return await sendEmailWithFallback(mailOptions, 'achievement');
  } catch (error) {
    console.error('Failed to send achievement email:', error);
    throw error;
  }
};

const sendModuleReminderEmail = async (user, module, assignment, options = {}) => {
  try {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = dueDate < now;
    const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    
    const templateData = {
      firstName: user.firstName,
      moduleTitle: module.title,
      moduleCategory: module.category,
      moduleDifficulty: module.difficulty,
      moduleUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/modules/${module._id}`,
      dueDate: dueDate.toLocaleDateString(),
      timeRemaining: isOverdue ? 'Overdue' : formatTimeRemaining(daysRemaining),
      isOverdue,
      currentProgress: options.currentProgress || 0,
      chaptersCompleted: options.chaptersCompleted || 0,
      totalChapters: module.chapters?.length || 0,
      timeSpent: options.timeSpent || '0 min',
      daysRemaining: Math.max(0, daysRemaining),
      multipleDays: daysRemaining > 1,
      trainingImportance: 'This training module is essential for your role and contributes to your professional development.',
      benefits: [
        'Enhanced job performance and efficiency',
        'Improved knowledge and skill set', 
        'Career advancement opportunities',
        'Compliance with regulatory requirements'
      ],
      supportAvailable: true,
      helpCenterUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/help`,
      supportChatUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/support`
    };
    
    const htmlContent = renderTemplate('moduleReminder', templateData);
    
    const mailOptions = {
      from: {
        name: 'BNC Training Platform',
        address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
      },
      to: user.email,
      subject: isOverdue ? 
        `Overdue Training: ${module.title}` : 
        `Training Reminder: ${module.title}`,
      html: htmlContent || generateModuleReminderFallback(templateData),
      text: `${isOverdue ? 'Overdue' : 'Reminder'}: Please complete your training module "${module.title}" by ${dueDate.toLocaleDateString()}.`
    };
    
    return await sendEmailWithFallback(mailOptions, 'module-reminder');
  } catch (error) {
    console.error('Failed to send module reminder email:', error);
    throw error;
  }
};

// Utility functions
const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const formatTimeRemaining = (days) => {
  if (days <= 0) return 'Overdue';
  if (days === 1) return '1 day';
  return `${days} days`;
};

// Fallback templates if files not found
const generateModuleAssignmentFallback = (data) => {
  return `
    <h2>New Training Assignment: ${data.moduleTitle}</h2>
    <p>Hello ${data.firstName},</p>
    <p>You have been assigned a new training module by ${data.assignedBy}.</p>
    <p><strong>Module:</strong> ${data.moduleTitle}</p>
    <p><strong>Category:</strong> ${data.moduleCategory}</p>
    <p><strong>Due Date:</strong> ${data.dueDate}</p>
    <p><a href="${data.moduleUrl}">Start Training Module</a></p>
  `;
};

const generateAchievementFallback = (data) => {
  return `
    <h2>Achievement Unlocked: ${data.achievementTitle}!</h2>
    <p>Congratulations ${data.firstName}!</p>
    <p>You've unlocked the "${data.achievementTitle}" achievement.</p>
    <p>${data.achievementDescription}</p>
    <p>Points earned: ${data.points}</p>
    <p><a href="${data.dashboardUrl}">View Your Dashboard</a></p>
  `;
};

const generateModuleReminderFallback = (data) => {
  return `
    <h2>Training Reminder: ${data.moduleTitle}</h2>
    <p>Hello ${data.firstName},</p>
    <p>${data.isOverdue ? 'This training is now overdue.' : 'Your training deadline is approaching.'}</p>
    <p><strong>Module:</strong> ${data.moduleTitle}</p>
    <p><strong>Due Date:</strong> ${data.dueDate}</p>
    <p><a href="${data.moduleUrl}">Continue Training</a></p>
  `;
};

// Queue-aware email sending
const emailQueue = require('./emailQueue');

const queueEmail = async (mailOptions, emailType, priority = 'normal', scheduleAt = null) => {
  try {
    const emailData = {
      mailOptions,
      emailType,
      timestamp: new Date()
    };

    if (scheduleAt) {
      return await emailQueue.scheduleEmail(emailData, scheduleAt, priority);
    } else {
      return await emailQueue.add(emailData, priority);
    }
  } catch (error) {
    console.error('Failed to queue email:', error);
    // Fallback to direct sending if queue fails
    return await sendEmailWithFallback(mailOptions, emailType);
  }
};

// Enhanced module assignment with queue
const sendModuleAssignmentEmailQueued = async (user, module, assignment, assignedBy, options = {}) => {
  try {
    const mailOptions = await buildModuleAssignmentEmail(user, module, assignment, assignedBy);
    const priority = assignment.priority === 'high' ? 'high' : 'normal';
    
    return await queueEmail(mailOptions, 'module-assignment', priority, options.scheduleAt);
  } catch (error) {
    console.error('Failed to queue module assignment email:', error);
    // Fallback to direct sending
    return await sendModuleAssignmentEmail(user, module, assignment, assignedBy);
  }
};

// Helper to build module assignment email
const buildModuleAssignmentEmail = async (user, module, assignment, assignedBy) => {
  const moduleUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/modules/${module._id}`;
  const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date';
  
  const templateData = {
    firstName: user.firstName,
    moduleTitle: module.title,
    moduleDescription: module.description || module.shortDescription,
    moduleCategory: module.category,
    moduleDifficulty: module.difficulty,
    moduleDuration: formatDuration(module.totalDuration),
    modulePoints: module.points,
    moduleUrl,
    dueDate,
    priority: assignment.priority || 'medium',
    assignedBy: assignedBy?.firstName && assignedBy?.lastName ? 
      `${assignedBy.firstName} ${assignedBy.lastName}` : 'System',
    assignedByEmail: assignedBy?.email,
    assignmentDate: new Date().toLocaleDateString(),
    notes: assignment.notes,
    learningObjectives: module.learningObjectives || [],
    prerequisites: module.prerequisites?.map(p => p.title) || [],
    daysRemaining: assignment.dueDate ? 
      Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null,
    estimatedHours: Math.ceil(module.totalDuration / 60),
    platformUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  };
  
  const htmlContent = renderTemplate('moduleAssignment', templateData);
  
  return {
    from: {
      name: 'BNC Training Platform',
      address: process.env.EMAIL_FROM || 'noreply@bnc-training.com'
    },
    to: user.email,
    subject: `New Training Assignment: ${module.title}`,
    html: htmlContent || generateModuleAssignmentFallback(templateData),
    text: `You have been assigned a new training module: ${module.title}. Due: ${dueDate}. Visit ${moduleUrl} to start.`
  };
};

// Bulk email sending with queue
const sendBulkEmails = async (emails, priority = 'normal') => {
  try {
    return await emailQueue.addBulk(emails, priority);
  } catch (error) {
    console.error('Failed to send bulk emails:', error);
    throw error;
  }
};

// Email analytics and monitoring
const getEmailQueueStatus = () => {
  return emailQueue.getAnalytics();
};

// Initialize templates on startup
setTimeout(() => {
  loadTemplates().catch(console.error);
}, 1000);

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPolicyConfirmationEmail,
  sendModuleAssignmentEmail,
  sendAchievementEmail,
  sendModuleReminderEmail,
  sendModuleAssignmentEmailQueued,
  sendBulkEmails,
  queueEmail,
  getEmailQueueStatus,
  loadTemplates,
  sendEmailWithFallback, // Export for other services
  emailMonitor // Export for monitoring endpoints
};