import { Memo, CreateMemoData, UpdateMemoData } from '../types';

const STORAGE_KEY = 'memo-app-data';

export class LocalStorageService {
  private getData(): Memo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return [];
    }
  }

  private setData(memos: Memo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }

  private generateId(): number {
    const memos = this.getData();
    return memos.length > 0 ? Math.max(...memos.map(m => m.id)) + 1 : 1;
  }

  async getMemos(filters?: {
    category?: string;
    is_task?: boolean;
    is_completed?: boolean;
  }): Promise<Memo[]> {
    let memos = this.getData();

    if (filters) {
      if (filters.category) {
        memos = memos.filter(memo => memo.category === filters.category);
      }
      if (filters.is_task !== undefined) {
        memos = memos.filter(memo => memo.is_task === filters.is_task);
      }
      if (filters.is_completed !== undefined) {
        memos = memos.filter(memo => memo.is_completed === filters.is_completed);
      }
    }

    return memos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getMemo(id: number): Promise<Memo> {
    const memos = this.getData();
    const memo = memos.find(m => m.id === id);
    if (!memo) {
      throw new Error('Memo not found');
    }
    return memo;
  }

  async createMemo(data: CreateMemoData): Promise<{ id: number; message: string }> {
    const memos = this.getData();
    const newMemo: Memo = {
      id: this.generateId(),
      title: data.title,
      content: data.content || '',
      category: data.category || 'general',
      is_task: data.is_task || false,
      is_completed: false,
      priority: data.priority || 1,
      tags: data.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memos.push(newMemo);
    this.setData(memos);

    return { id: newMemo.id, message: 'Memo created successfully' };
  }

  async updateMemo(id: number, data: UpdateMemoData): Promise<{ message: string }> {
    const memos = this.getData();
    const index = memos.findIndex(m => m.id === id);
    
    if (index === -1) {
      throw new Error('Memo not found');
    }

    memos[index] = {
      ...memos[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    this.setData(memos);
    return { message: 'Memo updated successfully' };
  }

  async deleteMemo(id: number): Promise<{ message: string }> {
    const memos = this.getData();
    const filteredMemos = memos.filter(m => m.id !== id);
    
    if (memos.length === filteredMemos.length) {
      throw new Error('Memo not found');
    }

    this.setData(filteredMemos);
    return { message: 'Memo deleted successfully' };
  }

  async getCategories(): Promise<string[]> {
    const memos = this.getData();
    const categories = [...new Set(memos.map(m => m.category))];
    return categories.sort();
  }

  async getTags(): Promise<string[]> {
    const memos = this.getData();
    const allTags = new Set<string>();
    
    memos.forEach(memo => {
      memo.tags.forEach(tag => allTags.add(tag));
    });

    return Array.from(allTags).sort();
  }

  async exportData(): Promise<any> {
    const memos = this.getData();
    return {
      exported_at: new Date().toISOString(),
      total_memos: memos.length,
      memos: memos
    };
  }

  async importData(data: any): Promise<{ imported: number; errors: any[] }> {
    if (!data.memos || !Array.isArray(data.memos)) {
      throw new Error('Invalid data format');
    }

    const existingMemos = this.getData();
    const importedMemos: Memo[] = [];
    const errors: any[] = [];

    data.memos.forEach((memoData: any, index: number) => {
      try {
        const memo: Memo = {
          id: this.generateId() + index,
          title: memoData.title || '',
          content: memoData.content || '',
          category: memoData.category || 'general',
          is_task: Boolean(memoData.is_task),
          is_completed: Boolean(memoData.is_completed),
          priority: memoData.priority || 1,
          tags: Array.isArray(memoData.tags) ? memoData.tags : [],
          created_at: memoData.created_at || new Date().toISOString(),
          updated_at: memoData.updated_at || new Date().toISOString(),
        };
        importedMemos.push(memo);
      } catch (error) {
        errors.push({ index, error: error.message });
      }
    });

    this.setData([...existingMemos, ...importedMemos]);
    return { imported: importedMemos.length, errors };
  }
}

export const localStorageService = new LocalStorageService();
