// import { Memo } from '../types';

export interface AudioRecording {
  id: string;
  memoId: number;
  audioData: string; // base64 encoded audio data
  duration: number;
  createdAt: string;
  transcript?: string;
}

export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  public async startRecording(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Audio recording not supported');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error('Failed to start recording: ' + error);
    }
  }

  public stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.isRecording = false;
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      
      // Stop all tracks to release microphone
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    });
  }

  public isRecordingActive(): boolean {
    return this.isRecording;
  }

  public async getAudioDuration(blob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);
      
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio'));
      };
      
      audio.src = url;
    });
  }

  public async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:audio/wav;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public base64ToBlob(base64: string, mimeType: string = 'audio/wav'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  public createAudioUrl(base64: string, mimeType: string = 'audio/wav'): string {
    const blob = this.base64ToBlob(base64, mimeType);
    return URL.createObjectURL(blob);
  }

  public revokeAudioUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  // LocalStorage operations for audio recordings
  public saveAudioRecording(recording: AudioRecording): void {
    try {
      const existing = this.getAudioRecordings();
      const updated = [...existing, recording];
      localStorage.setItem('memo-app-audio', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save audio recording:', error);
    }
  }

  public getAudioRecordings(): AudioRecording[] {
    try {
      const data = localStorage.getItem('memo-app-audio');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load audio recordings:', error);
      return [];
    }
  }

  public getAudioRecordingsByMemoId(memoId: number): AudioRecording[] {
    return this.getAudioRecordings().filter(recording => recording.memoId === memoId);
  }

  public deleteAudioRecording(recordingId: string): void {
    try {
      const existing = this.getAudioRecordings();
      const updated = existing.filter(recording => recording.id !== recordingId);
      localStorage.setItem('memo-app-audio', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete audio recording:', error);
    }
  }

  public deleteAudioRecordingsByMemoId(memoId: number): void {
    try {
      const existing = this.getAudioRecordings();
      const updated = existing.filter(recording => recording.memoId !== memoId);
      localStorage.setItem('memo-app-audio', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete audio recordings:', error);
    }
  }

  public exportAudioRecordings(): string {
    const recordings = this.getAudioRecordings();
    return JSON.stringify(recordings, null, 2);
  }

  public importAudioRecordings(jsonData: string): { imported: number; errors: string[] } {
    try {
      const data = JSON.parse(jsonData);
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }

      const existing = this.getAudioRecordings();
      const imported = data.filter((recording: AudioRecording) => 
        recording.id && recording.memoId && recording.audioData
      );
      
      const updated = [...existing, ...imported];
      localStorage.setItem('memo-app-audio', JSON.stringify(updated));
      
      return { imported: imported.length, errors: [] };
    } catch (error) {
      return { imported: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] };
    }
  }
}

export const audioService = new AudioService();
