import { describe, it, expect } from 'vitest'
import { extractMentions, formatMentions } from '~/lib/mentions'

describe('Mentions System', () => {
  describe('extractMentions()', () => {
    it('should extract single mention', () => {
      const content = 'Hey @john, can you review this?'
      const mentions = extractMentions(content)

      expect(mentions).toHaveLength(1)
      expect(mentions[0]).toEqual({
        username: 'john',
        startIndex: 4,
        endIndex: 9,
      })
    })

    it('should extract multiple mentions', () => {
      const content = 'Meeting with @alice and @bob tomorrow at 2pm. @charlie please join!'
      const mentions = extractMentions(content)

      expect(mentions).toHaveLength(3)
      expect(mentions[0]).toEqual({
        username: 'alice',
        startIndex: 13,
        endIndex: 19,
      })
      expect(mentions[1]).toEqual({
        username: 'bob',
        startIndex: 24,
        endIndex: 28,
      })
      expect(mentions[2]).toEqual({
        username: 'charlie',
        startIndex: 42,
        endIndex: 51,
      })
    })

    it('should handle mentions with different valid characters', () => {
      const content = '@user.name @user_name @user-name @user123 @123user'
      const mentions = extractMentions(content)

      expect(mentions).toHaveLength(5)
      expect(mentions.map(m => m.username)).toEqual([
        'user.name',
        'user_name',
        'user-name',
        'user123',
        '123user',
      ])
    })

    it('should not extract mentions in the middle of words', () => {
      const content = 'email@domain.com is not a mention but @user is'
      const mentions = extractMentions(content)

      expect(mentions).toHaveLength(1)
      expect(mentions[0].username).toBe('user')
    })

    it('should handle empty content', () => {
      const mentions = extractMentions('')
      expect(mentions).toHaveLength(0)
    })

    it('should handle content without mentions', () => {
      const content = 'This is a regular comment without any mentions.'
      const mentions = extractMentions(content)
      expect(mentions).toHaveLength(0)
    })

    it('should handle duplicate mentions', () => {
      const content = 'Hey @john, @john can you help @john with this?'
      const mentions = extractMentions(content)

      expect(mentions).toHaveLength(3)
      expect(mentions.every(m => m.username === 'john')).toBe(true)
    })

    it('should handle mentions at start and end of content', () => {
      const content = '@start this is a message @end'
      const mentions = extractMentions(content)

      expect(mentions).toHaveLength(2)
      expect(mentions[0]).toEqual({
        username: 'start',
        startIndex: 0,
        endIndex: 6,
      })
      expect(mentions[1]).toEqual({
        username: 'end',
        startIndex: 26,
        endIndex: 30,
      })
    })

    it('should handle mentions in multiline content', () => {
      const content = `Line 1 with @user1
Line 2 with @user2
@user3 at start of line`
      const mentions = extractMentions(content)

      expect(mentions).toHaveLength(3)
      expect(mentions.map(m => m.username)).toEqual(['user1', 'user2', 'user3'])
    })
  })

  describe('formatMentions()', () => {
    it('should format single mention', () => {
      const content = 'Hey @john, can you review this?'
      const mentions = extractMentions(content)
      const formatted = formatMentions(content, mentions)

      expect(formatted).toBe('Hey <span class="mention">@john</span>, can you review this?')
    })

    it('should format multiple mentions', () => {
      const content = 'Meeting with @alice and @bob tomorrow'
      const mentions = extractMentions(content)
      const formatted = formatMentions(content, mentions)

      expect(formatted).toBe('Meeting with <span class="mention">@alice</span> and <span class="mention">@bob</span> tomorrow')
    })

    it('should handle empty mentions array', () => {
      const content = 'Regular content without mentions'
      const formatted = formatMentions(content, [])

      expect(formatted).toBe(content)
    })

    it('should preserve order and positions', () => {
      const content = '@first middle @second end'
      const mentions = extractMentions(content)
      const formatted = formatMentions(content, mentions)

      expect(formatted).toBe('<span class="mention">@first</span> middle <span class="mention">@second</span> end')
    })

    it('should handle overlapping mentions correctly', () => {
      const content = '@user1 @user2'
      const mentions = extractMentions(content)
      const formatted = formatMentions(content, mentions)

      expect(formatted).toBe('<span class="mention">@user1</span> <span class="mention">@user2</span>')
    })

    it('should handle mentions with special characters in content', () => {
      const content = 'Check this out: @user! Great work.'
      const mentions = extractMentions(content)
      const formatted = formatMentions(content, mentions)

      expect(formatted).toBe('Check this out: <span class="mention">@user</span>! Great work.')
    })

    it('should maintain original content when no mentions provided', () => {
      const content = 'Hey @john, can you review this?'
      const formatted = formatMentions(content, [])

      expect(formatted).toBe(content)
    })

    it('should handle mentions at the very end of content', () => {
      const content = 'Please review @reviewer'
      const mentions = extractMentions(content)
      const formatted = formatMentions(content, mentions)

      expect(formatted).toBe('Please review <span class="mention">@reviewer</span>')
    })
  })

  describe('Integration tests', () => {
    it('should work with extract and format together', () => {
      const content = 'Team meeting @alice @bob @charlie - please join at 3pm!'
      const mentions = extractMentions(content)
      const formatted = formatMentions(content, mentions)

      expect(mentions).toHaveLength(3)
      expect(formatted).toBe('Team meeting <span class="mention">@alice</span> <span class="mention">@bob</span> <span class="mention">@charlie</span> - please join at 3pm!')
    })

    it('should handle complex real-world comment', () => {
      const content = `Hi @project.manager,

The task is ready for review. @jane.doe please test the upload feature and @john_smith can you check the security permissions?

Thanks!
@admin`

      const mentions = extractMentions(content)
      expect(mentions).toHaveLength(4)
      expect(mentions.map(m => m.username)).toEqual([
        'project.manager',
        'jane.doe',
        'john_smith',
        'admin'
      ])

      const formatted = formatMentions(content, mentions)
      expect(formatted).toContain('<span class="mention">@project.manager</span>')
      expect(formatted).toContain('<span class="mention">@jane.doe</span>')
      expect(formatted).toContain('<span class="mention">@john_smith</span>')
      expect(formatted).toContain('<span class="mention">@admin</span>')
    })
  })
})