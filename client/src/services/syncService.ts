import { localStorageService } from './localStorage';
import { firestoreService } from './firestoreService';
import { authService } from './authService';
import { Memo, CreateMemoData, UpdateMemoData } from '../types';

// LocalStorageとFirestoreの同期を統合するサービス
class SyncService {
  // メモを作成（LocalStorageとFirestoreの両方に保存）
  async createMemo(data: CreateMemoData): Promise<{ id: number; message: string }> {
    // LocalStorageに保存
    const result = await localStorageService.createMemo(data);
    
    // ログイン中ならFirestoreにも保存
    if (authService.isSignedIn()) {
      try {
        const memo = await localStorageService.getMemoById(result.id);
        await firestoreService.saveMemo(memo);
      } catch (error) {
        console.error('Error syncing new memo to Firestore:', error);
      }
    }
    
    return result;
  }

  // メモを更新（LocalStorageとFirestoreの両方を更新）
  async updateMemo(id: number, data: UpdateMemoData): Promise<{ message: string }> {
    // LocalStorageを更新
    const result = await localStorageService.updateMemo(id, data);
    
    // ログイン中ならFirestoreも更新
    if (authService.isSignedIn()) {
      try {
        const memo = await localStorageService.getMemoById(id);
        await firestoreService.saveMemo(memo);
      } catch (error) {
        console.error('Error syncing updated memo to Firestore:', error);
      }
    }
    
    return result;
  }

  // メモを削除（LocalStorageとFirestoreの両方から削除）
  async deleteMemo(id: number): Promise<{ message: string }> {
    // LocalStorageから削除
    const result = await localStorageService.deleteMemo(id);
    
    // ログイン中ならFirestoreからも削除
    if (authService.isSignedIn()) {
      try {
        await firestoreService.deleteMemo(id);
      } catch (error) {
        console.error('Error deleting memo from Firestore:', error);
      }
    }
    
    return result;
  }

  // その他のメソッドはLocalStorageServiceに委譲
  async getMemos(filters: any): Promise<Memo[]> {
    return localStorageService.getMemos(filters);
  }

  async getMemoById(id: number): Promise<Memo> {
    return localStorageService.getMemoById(id);
  }

  async getCategories(): Promise<string[]> {
    return localStorageService.getCategories();
  }

  async getTags(): Promise<string[]> {
    return localStorageService.getTags();
  }

  async exportData(): Promise<any> {
    return localStorageService.exportData();
  }

  async importData(data: any): Promise<any> {
    const result = await localStorageService.importData(data);
    
    // ログイン中ならFirestoreにも同期
    if (authService.isSignedIn()) {
      try {
        await firestoreService.syncData();
      } catch (error) {
        console.error('Error syncing imported data to Firestore:', error);
      }
    }
    
    return result;
  }
}

export const syncService = new SyncService();

