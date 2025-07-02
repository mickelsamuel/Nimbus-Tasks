declare module 'react-speech-kit' {
  export interface SpeechOptions {
    text: string;
    voice?: SpeechSynthesisVoice | null;
    rate?: number;
    pitch?: number;
    volume?: number;
  }

  export interface UseSpeechSynthesisReturn {
    speak: (options: SpeechOptions) => void;
    cancel: () => void;
    speaking: boolean;
    supported: boolean;
    voices: SpeechSynthesisVoice[];
  }

  export function useSpeechSynthesis(): UseSpeechSynthesisReturn;
}