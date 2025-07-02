// Enhanced speech synthesis and recognition service for banking AI
export interface Viseme {
  time: number;
  type: string;
  value: number;
  confidence?: number;
}

export interface SpeechConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  language?: string;
  emphasizeWords?: string[];
}

export interface VoiceProfile {
  name: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'adult' | 'senior';
  accent: string;
  quality: number;
  naturalness: number;
}

class EnhancedSpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
  // Enhanced phoneme-to-viseme mapping
  private phoneticMap: { [key: string]: string } = {
    // Vowels
    'a': 'aa', 'ah': 'aa', 'ae': 'aa',
    'e': 'E', 'eh': 'E', 'er': 'E',
    'i': 'I', 'ih': 'I', 'iy': 'I',
    'o': 'O', 'oh': 'O', 'ow': 'O', 'oy': 'O',
    'u': 'U', 'uh': 'U', 'uw': 'U',
    
    // Consonants
    'p': 'PP', 'b': 'PP', 'm': 'PP',
    'f': 'FF', 'v': 'FF',
    't': 'DD', 'd': 'DD', 'n': 'DD', 'l': 'DD',
    's': 'SS', 'z': 'SS', 'sh': 'SS', 'zh': 'SS',
    'th': 'TH', 'dh': 'TH',
    'ch': 'CH', 'jh': 'CH',
    'k': 'kk', 'g': 'kk', 'ng': 'kk',
    'r': 'RR', 'w': 'RR', 'y': 'RR'
  };
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      
      // Reload voices when they change
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }
  
  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }
  
  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
  
  // Get voice profiles with quality ratings
  getVoiceProfiles(): VoiceProfile[] {
    return this.voices.map(voice => {
      const name = voice.name.toLowerCase();
      const isGoogle = name.includes('google');
      const isMicrosoft = name.includes('microsoft');
      const isApple = name.includes('samantha') || name.includes('victoria') || name.includes('karen');
      
      // Determine gender
      let gender: 'male' | 'female' | 'neutral' = 'neutral';
      if (name.includes('female') || name.includes('samantha') || name.includes('victoria') || name.includes('karen') || name.includes('zira')) {
        gender = 'female';
      } else if (name.includes('male') || name.includes('david') || name.includes('mark') || name.includes('alex')) {
        gender = 'male';
      }
      
      // Calculate quality score
      let quality = 3; // base score
      if (isGoogle) quality += 3; // Google voices are typically highest quality
      else if (isMicrosoft) quality += 2;
      else if (isApple) quality += 2;
      
      if (voice.localService) quality -= 1; // Local voices may be lower quality
      
      return {
        name: voice.name,
        gender,
        age: name.includes('young') ? 'young' : name.includes('senior') ? 'senior' : 'adult',
        accent: voice.lang,
        quality: Math.min(quality, 5),
        naturalness: isGoogle ? 5 : isMicrosoft ? 4 : isApple ? 4 : 3
      };
    });
  }
  
  // Find best voice for the assistant with preference scoring
  getBestVoice(preferences: { gender?: 'male' | 'female'; accent?: string } = {}): SpeechSynthesisVoice | null {
    const profiles = this.getVoiceProfiles();
    
    // Score voices based on preferences and quality
    const scoredVoices = this.voices.map((voice, index) => {
      const profile = profiles[index];
      let score = profile.quality * 2 + profile.naturalness;
      
      // Gender preference
      if (preferences.gender && profile.gender === preferences.gender) {
        score += 3;
      } else if (preferences.gender && profile.gender !== preferences.gender) {
        score -= 2;
      }
      
      // Default preference for female voices for banking assistant
      if (!preferences.gender && profile.gender === 'female') {
        score += 2;
      }
      
      // Accent/language preference
      if (preferences.accent && voice.lang.includes(preferences.accent)) {
        score += 3;
      }
      
      // Prefer US English for banking context
      if (voice.lang.includes('en-US')) {
        score += 1;
      }
      
      return { voice, profile, score };
    });
    
    // Sort by score and return best voice
    scoredVoices.sort((a, b) => b.score - a.score);
    
    console.log('🎤 Voice Selection Rankings:');
    scoredVoices.slice(0, 5).forEach((item, i) => {
      console.log(`${i + 1}. ${item.voice.name} (Score: ${item.score}, Quality: ${item.profile.quality})`);
    });
    
    return scoredVoices[0]?.voice || null;
  }
  
  private extractPhonemes(word: string): string[] {
    // Enhanced phoneme extraction with common patterns
    const phonemes: string[] = [];
    let i = 0;
    
    while (i < word.length) {
      // Check for digraphs first
      const twoChar = word.slice(i, i + 2);
      const threeChar = word.slice(i, i + 3);
      
      if (threeChar === 'tch') {
        phonemes.push('ch');
        i += 3;
      } else if (['th', 'sh', 'ch', 'ng', 'ck'].includes(twoChar)) {
        phonemes.push(twoChar === 'ck' ? 'k' : twoChar);
        i += 2;
      } else {
        phonemes.push(word[i]);
        i++;
      }
    }
    
    return phonemes;
  }
  
  private estimatePhonemeCount(word: string): number {
    // Rough estimate based on syllables and consonant clusters
    const vowels = word.match(/[aeiou]/g) || [];
    const consonantClusters = word.match(/[bcdfghjklmnpqrstvwxyz]{2,}/g) || [];
    return vowels.length + consonantClusters.length;
  }
  
  private getVisemeFromLetter(letter: string): string {
    // Fallback mapping for individual letters
    if ('aeiou'.includes(letter)) {
      return { a: 'aa', e: 'E', i: 'I', o: 'O', u: 'U' }[letter] || 'aa';
    }
    if ('bp'.includes(letter)) return 'PP';
    if ('fv'.includes(letter)) return 'FF';
    if ('td'.includes(letter)) return 'DD';
    if ('sz'.includes(letter)) return 'SS';
    if ('kg'.includes(letter)) return 'kk';
    return 'sil';
  }
  
  private getPhonemeIntensity(phoneme: string): number {
    // Vowels and voiced consonants are more prominent
    const vowels = ['a', 'e', 'i', 'o', 'u', 'aa', 'E', 'I', 'O', 'U'];
    const strongConsonants = ['PP', 'FF', 'DD', 'kk'];
    
    if (vowels.includes(phoneme)) return 1.0;
    if (strongConsonants.includes(phoneme)) return 0.8;
    return 0.6;
  }
  
  private getPhonemeConfidence(phoneme: string, word: string): number {
    // Higher confidence for common phonemes and longer words
    const baseConfidence = 0.8;
    const lengthBonus = Math.min(word.length / 10, 0.2);
    const commonPhonemes = ['a', 'e', 'i', 'o', 'u', 't', 'd', 'n', 's'];
    const commonBonus = commonPhonemes.includes(phoneme) ? 0.1 : 0;
    
    return Math.min(baseConfidence + lengthBonus + commonBonus, 1.0);
  }
  
  private smoothVisemeTransitions(visemes: Viseme[]): Viseme[] {
    // Add interpolated transitions between different viseme types
    const smoothed: Viseme[] = [];
    
    for (let i = 0; i < visemes.length; i++) {
      smoothed.push(visemes[i]);
      
      // Add transition if next viseme is different
      if (i < visemes.length - 1 && visemes[i].type !== visemes[i + 1].type) {
        const transitionTime = visemes[i].time + (visemes[i + 1].time - visemes[i].time) * 0.7;
        smoothed.push({
          time: transitionTime,
          type: visemes[i + 1].type,
          value: visemes[i + 1].value * 0.5,
          confidence: (visemes[i].confidence! + visemes[i + 1].confidence!) / 2
        });
      }
    }
    
    return smoothed;
  }
  
  // Generate enhanced visemes with phonetic analysis
  generateVisemes(text: string, duration: number): Viseme[] {
    const visemes: Viseme[] = [];
    const cleanText = text.toLowerCase().replace(/[^a-z\s]/g, '');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) {
      return [{ time: 0, type: 'sil', value: 1, confidence: 1 }];
    }
    
    const totalPhonemes = words.reduce((sum, word) => sum + this.estimatePhonemeCount(word), 0);
    const timePerPhoneme = duration / Math.max(totalPhonemes, 1);
    
    let currentTime = 0;
    
    words.forEach((word, wordIndex) => {
      // Pre-word silence (shorter for connected speech)
      if (wordIndex > 0) {
        visemes.push({ 
          time: currentTime, 
          type: 'sil', 
          value: 0.5,
          confidence: 0.9
        });
        currentTime += timePerPhoneme * 0.3;
      }
      
      // Analyze word for phonetic content
      const phonemes = this.extractPhonemes(word);
      
      phonemes.forEach((phoneme) => {
        const visemeType = this.phoneticMap[phoneme] || this.getVisemeFromLetter(phoneme);
        const isVowel = 'aeiou'.includes(phoneme[0]);
        const duration = isVowel ? timePerPhoneme * 1.2 : timePerPhoneme * 0.8;
        
        visemes.push({
          time: currentTime,
          type: visemeType,
          value: this.getPhonemeIntensity(phoneme),
          confidence: this.getPhonemeConfidence(phoneme, word)
        });
        
        currentTime += duration;
      });
    });
    
    // Final silence
    visemes.push({ 
      time: currentTime, 
      type: 'sil', 
      value: 1,
      confidence: 1
    });
    
    return this.smoothVisemeTransitions(visemes);
  }
  
  // Enhanced speak method with advanced features
  async speak(
    text: string, 
    config: SpeechConfig = {},
    onViseme?: (viseme: Viseme) => void,
    onEnd?: () => void
  ): Promise<void> {
    if (!this.synth) {
      return Promise.reject(new Error('Speech synthesis not available'));
    }
    
    // Ensure voices are loaded
    if (this.voices.length === 0) {
      this.loadVoices();
      // Wait a bit for voices to load
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Cancel any ongoing speech
    this.cancel();
    
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      
      // Select best voice with preferences
      const voicePreferences = {
        gender: 'female' as const,
        accent: config.language || 'en-US'
      };
      const voice = this.getBestVoice(voicePreferences);
      console.log('🗣️ Available voices:', this.voices.length);
      console.log('🗣️ Selected voice:', voice?.name || 'Default');
      console.log('🗣️ Voice details:', voice ? {
        name: voice.name,
        lang: voice.lang,
        gender: voice.name.toLowerCase().includes('female') ? 'female' : voice.name.toLowerCase().includes('male') ? 'male' : 'neutral',
        localService: voice.localService
      } : 'None');
      
      if (voice) utterance.voice = voice;
      
      // Enhanced speech parameters for natural banking assistant voice
      utterance.rate = config.rate || 0.95; // Slightly slower for clarity
      utterance.pitch = config.pitch || 1.05; // Slightly higher for friendliness
      utterance.volume = config.volume || 0.9; // Slightly softer for comfort
      
      // Add emphasis to important words if specified
      let processedText = text;
      if (config.emphasizeWords && config.emphasizeWords.length > 0) {
        config.emphasizeWords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          processedText = processedText.replace(regex, `<emphasis level="strong">${word}</emphasis>`);
        });
        utterance.text = processedText;
      }
      
      // Enhanced duration estimation based on content analysis
      const wordCount = text.trim().split(/\s+/).length;
      const avgWordsPerMinute = 160; // Professional speaking rate
      const baseWPM = avgWordsPerMinute * utterance.rate;
      const estimatedDuration = (wordCount / baseWPM) * 60 * 1000;
      
      // Adjust for punctuation and complexity
      const punctuationCount = (text.match(/[.,!?;:]/g) || []).length;
      const complexityAdjustment = punctuationCount * 200; // 200ms per punctuation
      const finalDuration = estimatedDuration + complexityAdjustment;
      
      console.log('🕐 Speech timing:', {
        words: wordCount,
        estimatedMs: Math.round(finalDuration),
        rate: utterance.rate,
        punctuation: punctuationCount
      });
      
      // Generate enhanced visemes
      const visemes = this.generateVisemes(text, finalDuration);
      console.log('👄 Generated visemes:', visemes.length, 'total phonemes');
      let visemeIndex = 0;
      let startTime = Date.now();
      
      // Handle events
      utterance.onstart = () => {
        startTime = Date.now();
        
        // Enhanced viseme animation with smooth interpolation
        if (onViseme && visemes.length > 0) {
          const visemeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            // Find current and next viseme for interpolation
            while (visemeIndex < visemes.length - 1 && 
                   visemes[visemeIndex + 1].time <= elapsed) {
              visemeIndex++;
            }
            
            if (visemeIndex < visemes.length) {
              const currentViseme = visemes[visemeIndex];
              const nextViseme = visemes[visemeIndex + 1];
              
              // Interpolate between visemes for smoother animation
              if (nextViseme && elapsed < nextViseme.time) {
                const progress = (elapsed - currentViseme.time) / (nextViseme.time - currentViseme.time);
                const interpolatedViseme = {
                  ...currentViseme,
                  value: currentViseme.value * (1 - progress) + nextViseme.value * progress,
                  confidence: (currentViseme.confidence || 1) * (1 - progress) + (nextViseme.confidence || 1) * progress
                };
                onViseme(interpolatedViseme);
              } else {
                onViseme(currentViseme);
              }
            }
            
            // Stop when speech ends
            if (elapsed > finalDuration || visemeIndex >= visemes.length - 1) {
              clearInterval(visemeInterval);
            }
          }, 33); // Update at 30fps for smoother animation
          
          // Store interval reference to clear on speech end
          (utterance as any).visemeInterval = visemeInterval;
        }
      };
      
      utterance.onend = () => {
        // Clear viseme interval
        if ((utterance as any).visemeInterval) {
          clearInterval((utterance as any).visemeInterval);
        }
        
        this.currentUtterance = null;
        if (onViseme) {
          onViseme({ time: Date.now() - startTime, type: 'sil', value: 1, confidence: 1 });
        }
        if (onEnd) onEnd();
        resolve();
      };
      
      utterance.onerror = (event) => {
        // Clear viseme interval on error
        if ((utterance as any).visemeInterval) {
          clearInterval((utterance as any).visemeInterval);
        }
        
        this.currentUtterance = null;
        console.error('🚨 Speech synthesis error:', event.error);
        
        // Provide user-friendly error messages
        const errorMessages: { [key: string]: string } = {
          'network': 'Network connection issue. Please check your internet connection.',
          'synthesis-failed': 'Speech synthesis failed. The voice may not be available.',
          'language-not-supported': 'The selected language is not supported.',
          'voice-not-found': 'The selected voice is not available.',
          'audio-hardware': 'Audio hardware issue. Please check your speakers.',
          'interrupted': 'Speech was interrupted by another audio source.'
        };
        
        const userMessage = errorMessages[event.error] || `Speech error: ${event.error}`;
        reject(new Error(userMessage));
      };
      
      // Speak
      if (this.synth) {
        this.synth.speak(utterance);
      }
    });
  }
  
  // Enhanced speech cancellation
  cancel() {
    if (this.currentUtterance && this.synth) {
      // Clear any ongoing viseme animation
      if ((this.currentUtterance as any).visemeInterval) {
        clearInterval((this.currentUtterance as any).visemeInterval);
      }
      
      this.synth.cancel();
      this.currentUtterance = null;
      console.log('🛑 Speech synthesis cancelled');
    }
  }
  
  // Stop current speech (alias for cancel)
  stop() {
    this.cancel();
  }
  
  // Check if speech synthesis is supported
  isSupported(): boolean {
    return !!this.synth && typeof window !== 'undefined';
  }
  
  // Check if speaking
  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
  
  // Pause speech
  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }
  
  // Resume speech
  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }
}

// Speech recognition type declarations
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  grammars?: any;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

// Enhanced speech recognition service with noise reduction
export class EnhancedSpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private confidenceThreshold: number = 0.7;
  private noiseReductionEnabled: boolean = true;
  
  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = true; // Allow longer input
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy
        this.recognition.lang = 'en-US';
        
        // Enhanced settings for better recognition
        if ('grammars' in this.recognition) {
          // Add banking-specific vocabulary if supported
          try {
            const speechRecognitionList = new (window as any).SpeechGrammarList();
            const bankingGrammar = '#JSGF V1.0; grammar banking; public <banking> = account | investment | loan | credit | debit | transfer | balance | savings | checking ;';
            speechRecognitionList.addFromString(bankingGrammar, 1);
            this.recognition.grammars = speechRecognitionList;
          } catch (e) {
            console.log('🎤 Grammar not supported, using default recognition');
          }
        }
      }
    }
  }
  
  // Check if speech recognition is supported
  isSupported(): boolean {
    return !!this.recognition;
  }
  
  private isValidSpeech(transcript: string): boolean {
    if (!this.noiseReductionEnabled) return true;
    
    const cleaned = transcript.trim().toLowerCase();
    
    // Filter out very short or empty results
    if (cleaned.length < 2) return false;
    
    // Filter out common noise patterns
    const noisePatterns = [
      /^[^a-z]+$/,  // Only non-letters
      /^(uh|um|ah|hmm)$/,  // Common filler words
      /^\s*$/,  // Only whitespace
    ];
    
    return !noisePatterns.some(pattern => pattern.test(cleaned));
  }
  
  // Enhanced listening with quality filtering
  async startListening(
    onResult: (transcript: string, isFinal: boolean, confidence?: number) => void,
    onError?: (error: string) => void,
    options: { language?: string; timeout?: number } = {}
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }
    
    if (this.isListening) return;
    
    // Set language if specified
    if (options.language) {
      this.recognition.lang = options.language;
    }
    
    this.isListening = true;
    let lastTranscript = '';
    let silenceTimer: NodeJS.Timeout | null = null;
    const timeoutDuration = options.timeout || 10000; // 10 second default timeout
    
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Reset silence timer on speech detection
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
      
      const results = event.results;
      const latestResult = results[results.length - 1];
      
      // Get best alternative based on confidence
      let bestTranscript = latestResult[0].transcript;
      let bestConfidence = latestResult[0].confidence || 0;
      
      // Check alternatives for better confidence
      for (let i = 1; i < latestResult.length; i++) {
        const alternative = latestResult[i];
        if (alternative.confidence > bestConfidence) {
          bestTranscript = alternative.transcript;
          bestConfidence = alternative.confidence;
        }
      }
      
      // Filter out low-confidence results
      const meetsConfidenceThreshold = bestConfidence >= this.confidenceThreshold || latestResult.isFinal;
      
      // Basic noise filtering
      const isValidSpeech = this.isValidSpeech(bestTranscript);
      
      if (meetsConfidenceThreshold && isValidSpeech) {
        // Avoid duplicate callbacks
        if (bestTranscript !== lastTranscript || latestResult.isFinal) {
          lastTranscript = bestTranscript;
          onResult(bestTranscript.trim(), latestResult.isFinal, bestConfidence);
        }
      }
      
      // Set silence timer for final results
      if (latestResult.isFinal) {
        silenceTimer = setTimeout(() => {
          this.stopListening();
        }, 2000); // Stop after 2 seconds of silence
      }
    };
    
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.isListening = false;
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      
      console.error('🚨 Speech recognition error:', event.error);
      
      // Provide user-friendly error messages
      const errorMessages: { [key: string]: string } = {
        'network': 'Network connection issue. Please check your internet connection.',
        'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
        'no-speech': 'No speech detected. Please try speaking louder or closer to the microphone.',
        'audio-capture': 'Microphone not found. Please check your audio settings.',
        'aborted': 'Speech recognition was interrupted.',
        'language-not-supported': 'Language not supported for speech recognition.',
        'service-not-allowed': 'Speech recognition service not available.'
      };
      
      const userMessage = errorMessages[event.error] || `Recognition error: ${event.error}`;
      if (onError) onError(userMessage);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
    
    // Set overall timeout
    const overallTimeout = setTimeout(() => {
      if (this.isListening) {
        this.stopListening();
        if (onError) onError('Speech recognition timed out. Please try again.');
      }
    }, timeoutDuration);
    
    try {
      this.recognition.start();
      console.log('🎤 Speech recognition started');
      
      // Clear timeout when recognition ends naturally
      this.recognition.onend = () => {
        clearTimeout(overallTimeout);
        this.isListening = false;
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
      };
    } catch (error) {
      clearTimeout(overallTimeout);
      this.isListening = false;
      throw error;
    }
  }
  
  // Enhanced stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('🛑 Speech recognition stopped');
    }
  }
  
  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }
  
  // Set confidence threshold (0.0 to 1.0)
  setConfidenceThreshold(threshold: number) {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }
  
  // Toggle noise reduction
  setNoiseReduction(enabled: boolean) {
    this.noiseReductionEnabled = enabled;
  }
}

// Export singleton instances
export const enhancedSpeechService = new EnhancedSpeechService();
export const enhancedSpeechRecognition = new EnhancedSpeechRecognitionService();

// Export enhanced speech service with banking optimizations
export const bankingSpeechService = {
  ...enhancedSpeechService,
  
  // Check if supported
  isSupported() {
    return enhancedSpeechService.isSupported();
  },
  
  // Stop speech
  stop() {
    return enhancedSpeechService.stop();
  },
  
  // Get voice profiles
  getVoiceProfiles() {
    return enhancedSpeechService.getVoiceProfiles();
  },
  
  // Banking-specific speech settings
  getBankingVoice() {
    return enhancedSpeechService.getBestVoice({ gender: 'female', accent: 'en-US' });
  },
  
  // Speak with banking-appropriate settings
  async speakBankingMessage(
    text: string,
    onViseme?: (viseme: Viseme) => void,
    onEnd?: () => void
  ) {
    const bankingConfig: SpeechConfig = {
      rate: 0.92,
      pitch: 1.05,
      volume: 0.9,
      language: 'en-US',
      emphasizeWords: ['account', 'balance', 'investment', 'transfer', 'National Bank']
    };
    
    return enhancedSpeechService.speak(text, bankingConfig, onViseme, onEnd);
  }
};

// Banking-optimized speech recognition
export const bankingSpeechRecognition = {
  ...enhancedSpeechRecognition,
  
  // Check if supported
  isSupported() {
    return enhancedSpeechRecognition.isSupported();
  },
  
  // Stop listening
  stopListening() {
    return enhancedSpeechRecognition.stopListening();
  },
  
  // Start listening with banking context
  async startBankingListening(
    onResult: (transcript: string, isFinal: boolean, confidence?: number) => void,
    onError?: (error: string) => void
  ) {
    // Set optimal settings for banking conversations
    enhancedSpeechRecognition.setConfidenceThreshold(0.75);
    enhancedSpeechRecognition.setNoiseReduction(true);
    
    return enhancedSpeechRecognition.startListening(
      onResult,
      onError,
      { language: 'en-US', timeout: 15000 }
    );
  }
};