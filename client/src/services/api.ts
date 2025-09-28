import { Memo, CreateMemoData, UpdateMemoData } from '../types';

// Vercel用の設定（ローカルストレージを使用）
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
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.is_task !== undefined) searchParams.append('is_task', params.is_task.toString());
    if (params?.is_completed !== undefined) searchParams.append('is_completed', params.is_completed.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/memos?${queryString}` : '/memos';
    
    return this.request<Memo[]>(endpoint);
  }

  async getMemo(id: number): Promise<Memo> {
    return this.request<Memo>(`/memos/${id}`);
  }

  async createMemo(data: CreateMemoData): Promise<{ id: number; message: string }> {
    return this.request<{ id: number; message: string }>('/memos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMemo(id: number, data: UpdateMemoData): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/memos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMemo(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/memos/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/memos/categories/list');
  }

  async getTags(): Promise<string[]> {
    return this.request<string[]>('/memos/tags/list');
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
