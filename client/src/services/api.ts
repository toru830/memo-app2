import { Memo, CreateMemoData, UpdateMemoData } from '../types';
import { localStorageService } from './localStorage';

// Vercel用の設定（ローカルストレージ + Firestore同期を使用）
const API_BASE_URL = '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // メモ関連のAPI
  async getMemos(params?: {
    category?: string;
    is_task?: boolean;
    is_completed?: boolean;
  }): Promise<Memo[]> {
    return localStorageService.getMemos(params || {});
  }

  async getMemo(id: number): Promise<Memo> {
    return localStorageService.getMemoById(id);
  }

  async createMemo(data: CreateMemoData): Promise<{ id: number; message: string }> {
    // localStorageServiceを使用してローカルストレージに保存
    return localStorageService.createMemo(data);
  }

  async updateMemo(id: number, data: UpdateMemoData): Promise<{ message: string }> {
    // localStorageServiceを使用してローカルストレージを更新
    return localStorageService.updateMemo(id, data);
  }

  async deleteMemo(id: number): Promise<{ message: string }> {
    // localStorageServiceを使用してローカルストレージから削除
    return localStorageService.deleteMemo(id);
  }

  async getCategories(): Promise<string[]> {
    return localStorageService.getCategories();
  }

  async getTags(): Promise<string[]> {
    return localStorageService.getTags();
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
