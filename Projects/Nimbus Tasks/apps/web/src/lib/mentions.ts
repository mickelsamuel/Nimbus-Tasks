/**
 * Utility functions for handling user mentions in comments
 */

export interface MentionMatch {
  username: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Extract @mentions from text content
 * Matches @username patterns where username can contain letters, numbers, dots, hyphens, underscores
 */
export function extractMentions(content: string): MentionMatch[] {
  const mentionRegex = /@([a-zA-Z0-9._-]+)/g;
  const mentions: MentionMatch[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      username: match[1]!,
      startIndex: match.index,
      endIndex: match.index + match[0]!.length,
    });
  }

  return mentions;
}

/**
 * Find users by their usernames or email addresses in the given organization
 */
export async function findMentionedUsers(
  mentions: MentionMatch[],
  organizationId: string,
  prisma: any
) {
  if (mentions.length === 0) return [];

  const usernames = mentions.map(m => m.username);

  // Find users by matching username against name or email
  const users = await prisma.user.findMany({
    where: {
      membership: {
        some: {
          organizationId,
        },
      },
      OR: [
        {
          name: {
            in: usernames,
            mode: 'insensitive',
          },
        },
        {
          email: {
            in: usernames,
            mode: 'insensitive',
          },
        },
        // Also check if the username matches the part before @ in email
        ...usernames.map(username => ({
          email: {
            startsWith: `${username}@`,
            mode: 'insensitive' as const,
          },
        })),
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return users;
}

/**
 * Replace @mentions in content with formatted mentions
 * Useful for highlighting mentions in the UI
 */
export function formatMentions(content: string, mentions: MentionMatch[]): string {
  if (mentions.length === 0) return content;

  let formattedContent = content;
  let offset = 0;

  // Sort mentions by start index to process them in order
  const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex);

  for (const mention of sortedMentions) {
    const mentionText = `@${mention.username}`;
    const highlightedMention = `<span class="mention">@${mention.username}</span>`;

    const startPos = mention.startIndex + offset;
    const endPos = mention.endIndex + offset;

    formattedContent =
      formattedContent.slice(0, startPos) +
      highlightedMention +
      formattedContent.slice(endPos);

    offset += highlightedMention.length - mentionText.length;
  }

  return formattedContent;
}