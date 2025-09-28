import React, { useState } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { speechSynthesisService } from '../services/speechService';

interface VoicePlayerProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ 
  text, 
  className = '', 
  size = 'sm' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  }[size];

  const buttonSize = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  }[size];

  const handlePlay = async () => {
    try {
      if (isPaused) {
        speechSynthesisService.resume();
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        setIsPlaying(true);
        setIsPaused(false);
        await speechSynthesisService.speak(text, {
          lang: 'ja-JP',
          rate: 0.9,
          pitch: 1.0
        });
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    speechSynthesisService.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    speechSynthesisService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!speechSynthesisService.isAvailable()) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {!isPlaying && !isPaused ? (
        <button
          onClick={handlePlay}
          className={`${buttonSize} text-gray-400 hover:text-blue-600 transition-colors`}
          title="音声読み上げ"
        >
          <Play size={iconSize} />
        </button>
      ) : (
        <>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className={`${buttonSize} text-blue-600 hover:text-blue-700 transition-colors`}
            title={isPlaying ? "一時停止" : "再開"}
          >
            {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
          </button>
          <button
            onClick={handleStop}
            className={`${buttonSize} text-gray-400 hover:text-red-600 transition-colors`}
            title="停止"
          >
            <Square size={iconSize} />
          </button>
        </>
      )}
    </div>
  );
};
