import React, { useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { audioService, AudioRecording } from '../services/audioService';

interface AudioRecorderProps {
  memoId: number;
  onRecordingSaved?: (recording: AudioRecording) => void;
  onClose: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  memoId, 
  onRecordingSaved, 
  onClose 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const durationIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
      await audioService.startRecording();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      durationIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      setError(`録音開始エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopRecording = async () => {
    try {
      const blob = await audioService.stopRecording();
      setCurrentRecording(blob);
      setIsRecording(false);
      
      // Stop duration counter
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // Create audio URL for playback
      const url = audioService.createAudioUrl(await audioService.blobToBase64(blob));
      setAudioUrl(url);
    } catch (error) {
      setError(`録音停止エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const playRecording = () => {
    if (audioUrl && audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const saveRecording = async () => {
    if (!currentRecording) return;

    try {
      setIsProcessing(true);
      
      // Convert blob to base64
      const audioData = await audioService.blobToBase64(currentRecording);
      
      // Get duration
      const duration = await audioService.getAudioDuration(currentRecording);
      
      // Create recording object
      const recording: AudioRecording = {
        id: Date.now().toString(),
        memoId,
        audioData,
        duration,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      audioService.saveAudioRecording(recording);
      
      // Notify parent component
      onRecordingSaved?.(recording);
      
      // Close modal
      onClose();
    } catch (error) {
      setError(`保存エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const discardRecording = () => {
    setCurrentRecording(null);
    setRecordingDuration(0);
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioUrl) {
      audioService.revokeAudioUrl(audioUrl);
      setAudioUrl(null);
    }
  };

  const downloadRecording = () => {
    if (currentRecording && audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${memoId}-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (audioUrl) {
        audioService.revokeAudioUrl(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">音声録音</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Recording Status */}
          <div className="text-center mb-6">
            {isRecording && (
              <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">録音中</span>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 text-2xl font-mono mb-2">
              <Clock size={24} />
              {formatDuration(recordingDuration)}
            </div>
          </div>

          {/* Audio Element */}
          {audioUrl && (
            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Recording Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {!currentRecording ? (
              <>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={!audioService.isAvailable()}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Mic size={20} />
                    録音開始
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="btn btn-danger flex items-center gap-2"
                  >
                    <MicOff size={20} />
                    録音停止
                  </button>
                )}
              </>
            ) : (
              <>
                {!isPlaying ? (
                  <button
                    onClick={playRecording}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Play size={20} />
                    再生
                  </button>
                ) : (
                  <button
                    onClick={pauseRecording}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Pause size={20} />
                    一時停止
                  </button>
                )}
                
                <button
                  onClick={stopPlayback}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Square size={20} />
                  停止
                </button>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {currentRecording && (
            <div className="flex gap-3">
              <button
                onClick={saveRecording}
                disabled={isProcessing}
                className="btn btn-primary flex-1"
              >
                {isProcessing ? '保存中...' : '保存'}
              </button>
              
              <button
                onClick={downloadRecording}
                className="btn btn-secondary px-4"
                title="ダウンロード"
              >
                <Download size={16} />
              </button>
              
              <button
                onClick={discardRecording}
                className="btn btn-danger px-4"
                title="破棄"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {/* Info */}
          {!audioService.isAvailable() && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
              <AlertCircle size={16} className="inline mr-2" />
              このブラウザでは音声録音がサポートされていません。Chrome、Edge、Firefoxをお試しください。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
