const axios = require('axios');
const crypto = require('crypto');

class AvatarService {
  constructor() {
    this.service = process.env.AVATAR_SERVICE || 'readyplayerme';
    this.readyPlayerMeUrl = process.env.READYPLAYERME_API_URL || 'https://api.readyplayer.me/v1';
    this.readyPlayerMeAppId = process.env.READYPLAYERME_APP_ID || 'national-bank-avatars';
    this.readyPlayerMeOrgId = process.env.READYPLAYERME_ORG_ID;
    this.readyPlayerMeApiKey = process.env.READYPLAYERME_API_KEY;
    this.readyPlayerMeSubdomain = process.env.READYPLAYERME_SUBDOMAIN || 'national-bank';
    
    // Professional banking avatar templates
    this.professionalTemplates = {
      male: [
        '65a8dba831b23abb4f401bae', // Executive male 1
        '648b2de3dc9f0e6fa3fa9b3c', // Banking professional male 1
        '6475f02b22a8d9d00367b4f6', // Senior manager male 1
        '63dd1b4c7044dc5c43e67153', // Team leader male 1
        '64c4f2c3b3b0e7a5f0d75f8b', // Director male 1
      ],
      female: [
        '649d3a8e4f2e8c3f9a2d1b5e', // Executive female 1
        '64b7e9a52d4f3c8e7b9a1c6f', // Banking professional female 1
        '648f5d2c9b3e7a4f2c8d6e9a', // Senior manager female 1
        '64a2f8b7e5d9c3a1f7b8e2d4', // Team leader female 1
        '64d5e3a9f2b8c7e4a9d3f5b7', // Director female 1
      ],
      neutral: [
        '648c7f2e5a9d3b4f1c8e6d7a', // Neutral professional 1
        '64e8a3b7f5c2d9a4e7b3f8c6', // Neutral professional 2
        '649f2c8e7d5a3b9f4e8c1d6a', // Neutral professional 3
      ]
    };
    
    // Initialize fallback avatar service
    this.fallbackService = 'dicebear';
    this.dicebearBaseUrl = 'https://api.dicebear.com/7.x';
  }

  /**
   * Generate Ready Player Me avatar URL
   * @param {Object} userData - User data containing name, email, etc.
   * @param {Object} options - Additional options like quality, format, etc.
   * @returns {Promise<string>} Avatar URL
   */
  async generateAvatarUrl(userData, options = {}) {
    // Parameters are available for future avatar customization

    try {
      // For Ready Player Me, we'll use pre-generated professional avatars
      // or create random professional-looking avatars
      return await this.generateReadyPlayerMeAvatar(userData, options);
    } catch (error) {
      console.error('Ready Player Me avatar generation failed:', error.message);
      return this.getFallbackAvatar(userData);
    }
  }

  /**
   * Generate Ready Player Me Avatar
   */
  async generateReadyPlayerMeAvatar(userData, options = {}) {
    const { gender = 'neutral' } = userData;
    // eslint-disable-next-line no-unused-vars
    const { quality = 'medium', format = 'glb' } = options;

    // Create a deterministic seed from user data
    const seed = this.createSeed(userData.firstName, userData.lastName, userData.email);
    
    // Use Ready Player Me's public avatar URLs for demo
    // In production, you'd integrate with their API to create custom avatars
    const avatarTemplates = {
      male: [
        '65a8dba831b23abb4f401bae', // Professional male avatar 1
        '648b2de3dc9f0e6fa3fa9b3c', // Professional male avatar 2
        '6475f02b22a8d9d00367b4f6', // Professional male avatar 3
        '63dd1b4c7044dc5c43e67153', // Professional male avatar 4
        '64c4f2c3b3b0e7a5f0d75f8b', // Professional male avatar 5
      ],
      female: [
        '649d3a8e4f2e8c3f9a2d1b5e', // Professional female avatar 1
        '64b7e9a52d4f3c8e7b9a1c6f', // Professional female avatar 2
        '648f5d2c9b3e7a4f2c8d6e9a', // Professional female avatar 3
        '64a2f8b7e5d9c3a1f7b8e2d4', // Professional female avatar 4
        '64d5e3a9f2b8c7e4a9d3f5b7', // Professional female avatar 5
      ],
      neutral: [
        '648c7f2e5a9d3b4f1c8e6d7a', // Neutral professional avatar 1
        '64e8a3b7f5c2d9a4e7b3f8c6', // Neutral professional avatar 2
        '649f2c8e7d5a3b9f4e8c1d6a', // Neutral professional avatar 3
      ]
    };

    // Select avatar based on deterministic seed
    const templates = avatarTemplates[gender] || avatarTemplates.neutral;
    const templateIndex = parseInt(seed, 16) % templates.length;
    const selectedTemplate = templates[templateIndex];

    // Construct Ready Player Me URL
    // Using the models subdomain for avatar assets
    const baseUrl = `https://models.readyplayer.me/${selectedTemplate}`;
    
    // Return the URL with the format extension
    const avatarUrl = `${baseUrl}.${format}`;
    
    return avatarUrl;
  }

  /**
   * Generate Ready Player Me avatar with custom configuration
   */
  async createCustomReadyPlayerMeAvatar(userData, customizations = {}) {
    if (!this.readyPlayerMeAppId || !this.readyPlayerMeApiKey) {
      console.warn('Ready Player Me App ID or API Key not configured, using template avatars');
      return this.generateReadyPlayerMeAvatar(userData);
    }

    try {
      // Create avatar through Ready Player Me API
      const response = await axios.post(`${this.readyPlayerMeUrl}/avatars`, {
        partner: this.readyPlayerMeAppId,
        bodyType: customizations.bodyType || 'halfbody',
        assets: {
          outfit: customizations.outfit || 'business-casual',
          hair: customizations.hair || 'professional',
          eyes: customizations.eyes || 'neutral',
          skin: customizations.skin || 'medium'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.readyPlayerMeApiKey}`,
          'Content-Type': 'application/json',
          'X-App-Id': this.readyPlayerMeAppId
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('Custom Ready Player Me avatar creation failed:', error.message);
      return this.generateReadyPlayerMeAvatar(userData);
    }
  }

  /**
   * Generate multiple Ready Player Me avatar options
   */
  async generateAvatarOptions(userData, count = 6) {
    const options = [];
    const genders = ['male', 'female', 'neutral'];
    const qualities = ['low', 'medium', 'high'];
    
    for (let i = 0; i < count; i++) {
      const gender = genders[i % genders.length];
      const quality = qualities[i % qualities.length];
      
      try {
        const avatarData = {
          ...userData,
          gender,
          seed: i.toString()
        };
        
        const url = await this.generateReadyPlayerMeAvatar(avatarData, { quality });
        
        options.push({
          id: i + 1,
          url,
          gender,
          quality,
          type: 'readyplayerme',
          preview: url.replace('.glb', '.png'), // Get PNG preview
          name: `Professional ${gender.charAt(0).toUpperCase() + gender.slice(1)} Avatar ${i + 1}`
        });
      } catch (error) {
        console.error(`Failed to generate Ready Player Me avatar option ${i + 1}:`, error.message);
      }
    }
    
    return options;
  }

  /**
   * Get Ready Player Me avatar preview image
   */
  getAvatarPreview(avatarUrl, options = {}) {
    const { width = 400, height = 400, expression = 'neutral' } = options;
    
    // Convert GLB URL to preview image URL
    const baseUrl = avatarUrl.replace('.glb', '.png').replace('.fbx', '.png');
    
    // Add Ready Player Me specific parameters for better preview quality
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      expression,
      morphTargets: 'ARKit',
      textureAtlas: 'none',
      lod: '1'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Create a unique seed from user data
   */
  createSeed(firstName, lastName, email, employeeId) {
    const data = `${firstName}-${lastName}-${email}-${employeeId || ''}`;
    return crypto.createHash('md5').update(data).digest('hex').substring(0, 8);
  }

  /**
   * Fallback avatar for when Ready Player Me fails
   */
  getFallbackAvatar(userData) {
    // eslint-disable-next-line no-unused-vars
    const seed = this.createSeed(userData.firstName, userData.lastName, userData.email);
    
    // Use DiceBear as fallback with professional initials
    return `https://api.dicebear.com/7.x/initials/svg?seed=${userData.firstName}+${userData.lastName}&backgroundColor=1e40af&color=ffffff&size=150`;
  }

  /**
   * Validate Ready Player Me avatar URL
   */
  async validateAvatarUrl(url) {
    try {
      const response = await axios.head(url, { timeout: 10000 });
      return response.status === 200;
    } catch (error) {
      console.error('Avatar URL validation failed:', error.message);
      return false;
    }
  }

  /**
   * Get avatar metadata from Ready Player Me
   */
  async getAvatarMetadata(avatarId) {
    try {
      const response = await axios.get(`${this.readyPlayerMeUrl}/avatars/${avatarId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get avatar metadata:', error.message);
      return null;
    }
  }

  /**
   * Professional avatar presets for banking environment
   */
  getProfessionalAvatarPresets() {
    return {
      executive: {
        outfit: 'business-suit',
        hair: 'professional-short',
        expression: 'confident',
        pose: 'professional'
      },
      manager: {
        outfit: 'business-casual',
        hair: 'professional-medium',
        expression: 'friendly',
        pose: 'approachable'
      },
      employee: {
        outfit: 'smart-casual',
        hair: 'modern',
        expression: 'enthusiastic',
        pose: 'relaxed'
      },
      trainee: {
        outfit: 'casual-professional',
        hair: 'contemporary',
        expression: 'eager',
        pose: 'learning'
      }
    };
  }

  /**
   * Generate avatar based on user role
   */
  async generateRoleBasedAvatar(userData) {
    const presets = this.getProfessionalAvatarPresets();
    const rolePreset = presets[userData.role] || presets.employee;
    
    return this.createCustomReadyPlayerMeAvatar(userData, rolePreset);
  }
}

module.exports = new AvatarService();