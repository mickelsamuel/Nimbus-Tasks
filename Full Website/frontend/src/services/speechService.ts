// Import speech recognition types from enhanced service to avoid duplicates
import type { 
  SpeechRecognition, 
  SpeechRecognitionEvent, 
  SpeechRecognitionErrorEvent 
} from './enhancedSpeechService';

// Speech synthesis service with viseme support
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
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
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
  
  // Find best voice for the assistant
  getBestVoice(): SpeechSynthesisVoice | null {
    // Prefer Google voices as they sound more natural
    const googleVoices = this.voices.filter(v => v.name.includes('Google'));
    const femaleVoices = googleVoices.filter(v => 
      v.name.includes('Female') || 
      v.name.includes('female') ||
      v.name.includes('Samantha') ||
      v.name.includes('Victoria') ||
      v.name.includes('Karen')
    );
    
    if (femaleVoices.length > 0) return femaleVoices[0];
    if (googleVoices.length > 0) return googleVoices[0];
    
    // Fallback to any female voice
    const anyFemaleVoice = this.voices.find(v => 
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('victoria')
    );
    
    return anyFemaleVoice || this.voices[0] || null;
  }
  
  // Generate visemes from text (simplified version)
  generateVisemes(text: string, duration: number): Viseme[] {
    const visemes: Viseme[] = [];
    const words = text.toLowerCase().split(/\s+/);
    const timePerWord = duration / words.length;
    
    let currentTime = 0;
    
    words.forEach((word) => {
      // Add silence at start of word
      visemes.push({ time: currentTime, type: 'sil', value: 1 });
      currentTime += timePerWord * 0.1;
      
      // Simple phoneme mapping
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        let visemeType = 'sil';
        
        // Map characters to visemes
        if ('aeiou'.includes(char)) {
          if (char === 'a') visemeType = 'aa';
          else if (char === 'e') visemeType = 'E';
          else if (char === 'i') visemeType = 'I';
          else if (char === 'o') visemeType = 'O';
          else if (char === 'u') visemeType = 'U';
        } else if ('bp'.includes(char)) {
          visemeType = 'PP';
        } else if ('fv'.includes(char)) {
          visemeType = 'FF';
        } else if ('td'.includes(char)) {
          visemeType = 'DD';
        } else if ('sz'.includes(char)) {
          visemeType = 'SS';
        } else if ('th'.includes(word.slice(i, i+2))) {
          visemeType = 'TH';
          i++; // Skip next character
        } else if ('ch'.includes(word.slice(i, i+2))) {
          visemeType = 'CH';
          i++;
        } else if ('kg'.includes(char)) {
          visemeType = 'kk';
        }
        
        visemes.push({ 
          time: currentTime, 
          type: visemeType, 
          value: 1 
        });
        
        currentTime += (timePerWord * 0.8) / word.length;
      }
      
      // Add short silence between words
      visemes.push({ time: currentTime, type: 'sil', value: 1 });
      currentTime += timePerWord * 0.1;
    });
    
    return visemes;
  }
  
  // Speak text with viseme callbacks
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
      
      // Set voice
      const voice = this.getBestVoice();
      console.log('\ud83d\uddfe Available voices:', this.voices.length);
      console.log('\ud83d\uddfe Selected voice:', voice?.name || 'Default');
      if (voice) utterance.voice = voice;
      
      // Set speech parameters
      utterance.rate = config.rate || 0.9;
      utterance.pitch = config.pitch || 1.0;
      utterance.volume = config.volume || 1.0;
      
      // Estimate duration (rough approximation)
      const estimatedDuration = (text.length / 15) * 1000 / utterance.rate;
      
      // Generate visemes
      const visemes = this.generateVisemes(text, estimatedDuration);
      let visemeIndex = 0;
      let startTime = Date.now();
      
      // Handle events
      utterance.onstart = () => {
        startTime = Date.now();
        
        // Start viseme animation
        if (onViseme && visemes.length > 0) {
          const visemeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            // Find current viseme
            while (visemeIndex < visemes.length - 1 && 
                   visemes[visemeIndex + 1].time <= elapsed) {
              visemeIndex++;
            }
            
            if (visemeIndex < visemes.length) {
              onViseme(visemes[visemeIndex]);
            }
            
            // Stop when speech ends
            if (elapsed > estimatedDuration || visemeIndex >= visemes.length - 1) {
              clearInterval(visemeInterval);
            }
          }, 50); // Update visemes at 20fps
        }
      };
      
      utterance.onend = () => {
        this.currentUtterance = null;
        if (onViseme) {
          onViseme({ time: 0, type: 'sil', value: 1 });
        }
        if (onEnd) onEnd();
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(event.error));
      };
      
      // Speak
      if (this.synth) {
        this.synth.speak(utterance);
      }
    });
  }
  
  // Cancel current speech
  cancel() {
    if (this.currentUtterance && this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
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

// Export singleton instance
export const speechService = new SpeechService();

// Speech recognition service
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  
  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = 'en-US';
      }
    }
  }
  
  // Check if speech recognition is supported
  isSupported(): boolean {
    return !!this.recognition;
  }
  
  // Start listening
  async startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }
    
    if (this.isListening) return;
    
    this.isListening = true;
    
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      onResult(transcript, isFinal);
    };
    
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
    };
    
    this.recognition.start();
  }
  
  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognition = new SpeechRecognitionService();