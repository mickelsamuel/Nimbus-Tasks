import { env } from "~/env";

export interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface NotificationData {
  type: "assignment" | "mention" | "comment" | "task_update";
  recipientEmail: string;
  recipientName: string;
  data: {
    taskTitle?: string;
    taskId?: string;
    projectName?: string;
    assignerName?: string;
    commentContent?: string;
    mentionedBy?: string;
    organizationName?: string;
  };
}

class EmailTransport {
  async send(config: EmailConfig): Promise<boolean> {
    try {
      if (env.NODE_ENV === "development") {
        // Console transport for development
        console.log("📧 Email Notification:");
        console.log("-------------------");
        console.log(`To: ${config.to}`);
        console.log(`Subject: ${config.subject}`);
        console.log(`Content: ${config.text || config.html}`);
        console.log("-------------------");
        return true;
      }

      // In production, this would use AWS SES, SendGrid, etc.
      // For now, just log and return success
      console.log(`Sending email to ${config.to}: ${config.subject}`);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }
}

export const emailTransport = new EmailTransport();

export class NotificationService {
  private transport: EmailTransport;

  constructor(transport: EmailTransport) {
    this.transport = transport;
  }

  async sendTaskAssignment(data: NotificationData): Promise<boolean> {
    if (data.type !== "assignment") {
      throw new Error("Invalid notification type for task assignment");
    }

    const emailConfig: EmailConfig = {
      to: data.recipientEmail,
      subject: `Task Assigned: ${data.data.taskTitle}`,
      html: this.generateAssignmentEmailHtml(data),
      text: this.generateAssignmentEmailText(data),
    };

    return await this.transport.send(emailConfig);
  }

  async sendMentionNotification(data: NotificationData): Promise<boolean> {
    if (data.type !== "mention") {
      throw new Error("Invalid notification type for mention");
    }

    const emailConfig: EmailConfig = {
      to: data.recipientEmail,
      subject: `You were mentioned in ${data.data.taskTitle}`,
      html: this.generateMentionEmailHtml(data),
      text: this.generateMentionEmailText(data),
    };

    return await this.transport.send(emailConfig);
  }

  async sendCommentNotification(data: NotificationData): Promise<boolean> {
    if (data.type !== "comment") {
      throw new Error("Invalid notification type for comment");
    }

    const emailConfig: EmailConfig = {
      to: data.recipientEmail,
      subject: `New comment on ${data.data.taskTitle}`,
      html: this.generateCommentEmailHtml(data),
      text: this.generateCommentEmailText(data),
    };

    return await this.transport.send(emailConfig);
  }

  async sendTaskUpdateNotification(data: NotificationData): Promise<boolean> {
    if (data.type !== "task_update") {
      throw new Error("Invalid notification type for task update");
    }

    const emailConfig: EmailConfig = {
      to: data.recipientEmail,
      subject: `Task Updated: ${data.data.taskTitle}`,
      html: this.generateTaskUpdateEmailHtml(data),
      text: this.generateTaskUpdateEmailText(data),
    };

    return await this.transport.send(emailConfig);
  }

  private generateAssignmentEmailHtml(data: NotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Task Assignment Notification</h2>
        <p>Hi ${data.recipientName},</p>
        <p>You have been assigned to a new task:</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">${data.data.taskTitle}</h3>
          <p style="margin: 5px 0; color: #666;">
            <strong>Project:</strong> ${data.data.projectName}<br>
            <strong>Assigned by:</strong> ${data.data.assignerName}<br>
            <strong>Organization:</strong> ${data.data.organizationName}
          </p>
        </div>

        <p>
          <a href="${env.NEXTAUTH_URL}/dashboard/tasks"
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Task
          </a>
        </p>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This email was sent from Nimbus Tasks. If you no longer wish to receive these notifications,
          you can update your preferences in your account settings.
        </p>
      </div>
    `;
  }

  private generateAssignmentEmailText(data: NotificationData): string {
    return `
Task Assignment Notification

Hi ${data.recipientName},

You have been assigned to a new task:

Task: ${data.data.taskTitle}
Project: ${data.data.projectName}
Assigned by: ${data.data.assignerName}
Organization: ${data.data.organizationName}

View the task at: ${env.NEXTAUTH_URL}/dashboard/tasks

---
This email was sent from Nimbus Tasks.
    `.trim();
  }

  private generateMentionEmailHtml(data: NotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You were mentioned</h2>
        <p>Hi ${data.recipientName},</p>
        <p>${data.data.mentionedBy} mentioned you in a comment:</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">${data.data.taskTitle}</h3>
          <blockquote style="border-left: 3px solid #2563eb; padding-left: 15px; margin: 10px 0; color: #555;">
            "${data.data.commentContent}"
          </blockquote>
        </div>

        <p>
          <a href="${env.NEXTAUTH_URL}/dashboard/tasks"
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Task
          </a>
        </p>
      </div>
    `;
  }

  private generateMentionEmailText(data: NotificationData): string {
    return `
You were mentioned

Hi ${data.recipientName},

${data.data.mentionedBy} mentioned you in a comment:

Task: ${data.data.taskTitle}
Comment: "${data.data.commentContent}"

View the task at: ${env.NEXTAUTH_URL}/dashboard/tasks
    `.trim();
  }

  private generateCommentEmailHtml(data: NotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Comment</h2>
        <p>Hi ${data.recipientName},</p>
        <p>A new comment was added to a task you're involved with:</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">${data.data.taskTitle}</h3>
          <blockquote style="border-left: 3px solid #2563eb; padding-left: 15px; margin: 10px 0; color: #555;">
            "${data.data.commentContent}"
          </blockquote>
        </div>

        <p>
          <a href="${env.NEXTAUTH_URL}/dashboard/tasks"
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Task
          </a>
        </p>
      </div>
    `;
  }

  private generateCommentEmailText(data: NotificationData): string {
    return `
New Comment

Hi ${data.recipientName},

A new comment was added to a task you're involved with:

Task: ${data.data.taskTitle}
Comment: "${data.data.commentContent}"

View the task at: ${env.NEXTAUTH_URL}/dashboard/tasks
    `.trim();
  }

  private generateTaskUpdateEmailHtml(data: NotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Task Updated</h2>
        <p>Hi ${data.recipientName},</p>
        <p>A task you're involved with has been updated:</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">${data.data.taskTitle}</h3>
          <p style="margin: 5px 0; color: #666;">
            <strong>Project:</strong> ${data.data.projectName}
          </p>
        </div>

        <p>
          <a href="${env.NEXTAUTH_URL}/dashboard/tasks"
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Task
          </a>
        </p>
      </div>
    `;
  }

  private generateTaskUpdateEmailText(data: NotificationData): string {
    return `
Task Updated

Hi ${data.recipientName},

A task you're involved with has been updated:

Task: ${data.data.taskTitle}
Project: ${data.data.projectName}

View the task at: ${env.NEXTAUTH_URL}/dashboard/tasks
    `.trim();
  }
}

export const notificationService = new NotificationService(emailTransport);