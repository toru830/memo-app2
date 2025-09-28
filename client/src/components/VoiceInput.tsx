import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  // Play,
  // Pause,
  Square,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { speechService, speechSynthesisService, SpeechRecognitionResult } from '../services/speechService';
import { CreateMemoData } from '../types';

interface VoiceInputProps {
  onMemoCreate: (memo: CreateMemoData) => void;
  onClose: () => void;
}

interface VoiceSession {
  id: string;
  transcript: string;
  timestamp: Date;
  confidence: number;
  isFinal: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onMemoCreate, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingTranscript, setProcessingTranscript] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ja-JP');
  
  const sessionIdRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');

  useEffect(() => {
    if (!speechService.isAvailable()) {
      setError('このブラウザでは音声認識がサポートされていません。Chrome、Edge、Safariをお試しください。');
    }
  }, []);

  const startListening = () => {
    setError(null);
    setCurrentTranscript('');
    finalTranscriptRef.current = '';
    sessionIdRef.current = Date.now().toString();
    setIsListening(true);

    speechService.startListening(
      (result: SpeechRecognitionResult) => {
        setCurrentTranscript(result.transcript);
        
        if (result.isFinal) {
          finalTranscriptRef.current = result.transcript;
          setVoiceSessions(prev => [...prev, {
            id: sessionIdRef.current,
            transcript: result.transcript,
            timestamp: new Date(),
            confidence: result.confidence,
            isFinal: true
          }]);
        }
      },
      (error: string) => {
        setError(`音声認識エラー: ${error}`);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      {
        language: selectedLanguage,
        continuous: true,
        interimResults: true
      }
    );
  };

  const stopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const processTranscript = async (transcript: string) => {
    setProcessingTranscript(true);
    
    try {
      // 音声データを解析してメモまたはタスクとして分類
      const analysis = analyzeTranscript(transcript);
      
      const memoData: CreateMemoData = {
        content: analysis.content,
        category: analysis.category,
        is_task: analysis.is_task,
        priority: analysis.priority,
        tags: analysis.tags
      };

      onMemoCreate(memoData);
      setVoiceSessions([]);
      setCurrentTranscript('');
      
    } catch (error) {
      setError('メモの処理中にエラーが発生しました');
    } finally {
      setProcessingTranscript(false);
    }
  };

  const analyzeTranscript = (text: string) => {
    // シンプルなルールベースの解析
    const lowerText = text.toLowerCase();
    
    // タスクかどうかの判定
    const taskKeywords = ['やる', 'する', 'やらなきゃ', 'やらないと', 'やるべき', 'タスク', 'todo', 'やること'];
    const isTask = taskKeywords.some(keyword => lowerText.includes(keyword));
    
    // 優先度の判定
    let priority = 1;
    if (lowerText.includes('重要') || lowerText.includes('急いで') || lowerText.includes('すぐに')) {
      priority = 3;
    } else if (lowerText.includes('普通') || lowerText.includes('いつか')) {
      priority = 2;
    }
    
    // カテゴリの判定
    let category = 'プライベート';
    if (lowerText.includes('仕事') || lowerText.includes('ビジネス') || lowerText.includes('会議') || lowerText.includes('プロジェクト')) {
      category = '仕事';
    } else if (lowerText.includes('買い物') || lowerText.includes('ショッピング') || lowerText.includes('購入')) {
      category = '買い物';
    } else if (lowerText.includes('アイデア') || lowerText.includes('思いつき') || lowerText.includes('発想')) {
      category = 'アイデア';
    } else if (lowerText.includes('思い') || lowerText.includes('感情') || lowerText.includes('感じ')) {
      category = '思い';
    }
    
    // タグの抽出
    const tags: string[] = [];
    if (lowerText.includes('重要')) tags.push('重要');
    if (lowerText.includes('緊急')) tags.push('緊急');
    if (lowerText.includes('プロジェクト')) tags.push('プロジェクト');
    if (lowerText.includes('会議')) tags.push('会議');
    if (lowerText.includes('電話')) tags.push('電話');
    if (lowerText.includes('メール')) tags.push('メール');
    
    return {
      content: text,
      category,
      is_task: isTask,
      priority,
      tags
    };
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      await speechSynthesisService.speak(text, {
        lang: 'ja-JP',
        rate: 0.9,
        pitch: 1.0
      });
    } catch (error) {
      setError('音声読み上げでエラーが発生しました');
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    speechSynthesisService.stop();
    setIsSpeaking(false);
  };

  const clearSessions = () => {
    setVoiceSessions([]);
    setCurrentTranscript('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">音声入力</h2>
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

          {/* 言語選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              言語
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input"
              disabled={isListening}
            >
              <option value="ja-JP">日本語</option>
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="ko-KR">한국어</option>
              <option value="zh-CN">中文 (简体)</option>
            </select>
          </div>

          {/* 音声認識コントロール */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {!isListening ? (
                <button
                  onClick={startListening}
                  disabled={!speechService.isAvailable()}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Mic size={20} />
                  音声認識開始
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <MicOff size={20} />
                  音声認識停止
                </button>
              )}

              {currentTranscript && (
                <button
                  onClick={() => speakText(currentTranscript)}
                  disabled={isSpeaking}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  {isSpeaking ? '読み上げ中...' : '読み上げ'}
                </button>
              )}

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <Square size={20} />
                  停止
                </button>
              )}
            </div>

            {isListening && (
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Clock size={16} className="animate-pulse" />
                <span className="text-sm">音声認識中...</span>
              </div>
            )}
          </div>

          {/* 現在の音声認識結果 */}
          {currentTranscript && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">認識結果（リアルタイム）</h3>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-gray-800">{currentTranscript}</p>
              </div>
            </div>
          )}

          {/* 確定された音声セッション */}
          {voiceSessions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">確定された音声</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {voiceSessions.map((session) => (
                  <div key={session.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {session.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <CheckCircle size={14} className="text-green-600" />
                        <span className="text-xs text-gray-500">
                          {Math.round(session.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm">{session.transcript}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3">
            {finalTranscriptRef.current && (
              <button
                onClick={() => processTranscript(finalTranscriptRef.current)}
                disabled={processingTranscript}
                className="btn btn-primary flex-1"
              >
                {processingTranscript ? '処理中...' : 'メモとして保存'}
              </button>
            )}
            
            <button
              onClick={clearSessions}
              className="btn btn-secondary px-6"
            >
              クリア
            </button>
            
            <button
              onClick={onClose}
              className="btn btn-secondary px-6"
            >
              閉じる
            </button>
          </div>

          {/* ヒント */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 音声入力のヒント</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 「やること」「タスク」などの言葉でタスクとして認識されます</li>
              <li>• 「重要」「緊急」などの言葉で優先度が設定されます</li>
              <li>• 「仕事」「買い物」などの言葉でカテゴリが自動設定されます</li>
              <li>• 静かな環境で、はっきりと話してください</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
