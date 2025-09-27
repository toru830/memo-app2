export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export class SpeechService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    // ブラウザ環境でのみ初期化
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.isSupported = true;
        this.setupRecognition();
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ja-JP';
    this.recognition.maxAlternatives = 1;
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && this.isSupported;
  }

  public startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void,
    onEnd?: () => void,
    options?: SpeechRecognitionOptions
  ): void {
    if (!this.isSupported || !this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    if (options) {
      if (options.language) this.recognition.lang = options.language;
      if (options.continuous !== undefined) this.recognition.continuous = options.continuous;
      if (options.interimResults !== undefined) this.recognition.interimResults = options.interimResults;
      if (options.maxAlternatives !== undefined) this.recognition.maxAlternatives = options.maxAlternatives;
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      
      onResult({
        transcript,
        confidence,
        isFinal: result.isFinal
      });
    };

    this.recognition.onerror = (event: any) => {
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      onEnd?.();
    };

    this.recognition.start();
  }

  public stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public abort(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  public getAvailableLanguages(): string[] {
    return [
      'ja-JP', // 日本語
      'en-US', // 英語（アメリカ）
      'en-GB', // 英語（イギリス）
      'ko-KR', // 韓国語
      'zh-CN', // 中国語（簡体字）
      'zh-TW', // 中国語（繁体字）
    ];
  }
}

// 音声合成（読み上げ）機能
export class SpeechSynthesisService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // 音声リストの読み込み（非同期）
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public getJapaneseVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith('ja') || voice.name.includes('Japanese')
    );
  }

  public speak(
    text: string,
    options?: {
      voice?: SpeechSynthesisVoice;
      rate?: number;
      pitch?: number;
      volume?: number;
      lang?: string;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // 既存の発話を停止
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (options) {
        if (options.voice) utterance.voice = options.voice;
        if (options.rate) utterance.rate = options.rate;
        if (options.pitch) utterance.pitch = options.pitch;
        if (options.volume) utterance.volume = options.volume;
        if (options.lang) utterance.lang = options.lang;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error));

      this.synthesis.speak(utterance);
    });
  }

  public stop(): void {
    this.synthesis.cancel();
  }

  public pause(): void {
    this.synthesis.pause();
  }

  public resume(): void {
    this.synthesis.resume();
  }
}

export const speechService = new SpeechService();
export const speechSynthesisService = new SpeechSynthesisService();
