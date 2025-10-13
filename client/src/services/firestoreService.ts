import { db } from './firebase';
import { authService } from './authService';
import { Memo } from '../types';
import { localStorageService } from './localStorage';

class FirestoreService {
  private unsubscribe: (() => void) | null = null;

  // ユーザーのメモコレクションへの参照を取得
  private getUserMemosRef() {
    const user = authService.getCurrentUser();
    if (!user || !db) {
      throw new Error('User not authenticated or Firestore not initialized');
    }
    return db.collection('users').doc(user.uid).collection('memos');
  }

  // Firestoreにメモを保存
  async saveMemo(memo: Memo): Promise<void> {
    try {
      const memosRef = this.getUserMemosRef();
      await memosRef.doc(memo.id.toString()).set({
        ...memo,
        updated_at: new Date().toISOString()
      });
      console.log('Memo saved to Firestore:', memo.id);
    } catch (error) {
      console.error('Error saving memo to Firestore:', error);
      throw error;
    }
  }

  // Firestoreからメモを削除
  async deleteMemo(id: number): Promise<void> {
    try {
      const memosRef = this.getUserMemosRef();
      await memosRef.doc(id.toString()).delete();
      console.log('Memo deleted from Firestore:', id);
    } catch (error) {
      console.error('Error deleting memo from Firestore:', error);
      throw error;
    }
  }

  // Firestoreからすべてのメモを取得
  async getAllMemos(): Promise<Memo[]> {
    try {
      const memosRef = this.getUserMemosRef();
      const snapshot = await memosRef.get();
      
      const memos: Memo[] = [];
      snapshot.forEach((doc: any) => {
        memos.push(doc.data() as Memo);
      });
      
      return memos;
    } catch (error) {
      console.error('Error getting memos from Firestore:', error);
      throw error;
    }
  }

  // ローカルとクラウドのデータを同期
  async syncData(): Promise<void> {
    try {
      console.log('Starting data sync...');
      
      // ローカルのデータを取得
      const localMemos = await localStorageService.getMemos({});
      
      // Firestoreのデータを取得
      const cloudMemos = await this.getAllMemos();
      
      // マージ戦略: 新しいデータを優先
      const mergedMemos = this.mergeMemos(localMemos, cloudMemos);
      
      // ローカルに保存
      await localStorageService.clearAllMemos();
      for (const memo of mergedMemos) {
        await localStorageService.createMemo(memo);
      }
      
      // クラウドに保存
      for (const memo of mergedMemos) {
        await this.saveMemo(memo);
      }
      
      console.log('Data sync completed:', mergedMemos.length, 'memos');
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  }

  // メモをマージ（新しいデータを優先）
  private mergeMemos(localMemos: Memo[], cloudMemos: Memo[]): Memo[] {
    const memoMap = new Map<number, Memo>();
    
    // ローカルのメモを追加
    localMemos.forEach(memo => {
      memoMap.set(memo.id, memo);
    });
    
    // クラウドのメモを追加/更新（新しい場合）
    cloudMemos.forEach(cloudMemo => {
      const localMemo = memoMap.get(cloudMemo.id);
      
      if (!localMemo) {
        // ローカルにない場合は追加
        memoMap.set(cloudMemo.id, cloudMemo);
      } else {
        // 両方にある場合は新しい方を採用
        const localDate = new Date(localMemo.updated_at).getTime();
        const cloudDate = new Date(cloudMemo.updated_at).getTime();
        
        if (cloudDate > localDate) {
          memoMap.set(cloudMemo.id, cloudMemo);
        }
      }
    });
    
    return Array.from(memoMap.values());
  }

  // リアルタイム同期を開始
  startRealtimeSync(onDataChange: () => void): void {
    try {
      const memosRef = this.getUserMemosRef();
      
      this.unsubscribe = memosRef.onSnapshot(async (snapshot: any) => {
        console.log('Firestore data changed, syncing...');
        
        snapshot.docChanges().forEach(async (change: any) => {
          const memo = change.doc.data() as Memo;
          
          if (change.type === 'added' || change.type === 'modified') {
            await localStorageService.updateMemo(memo.id, memo);
          } else if (change.type === 'removed') {
            await localStorageService.deleteMemo(memo.id);
          }
        });
        
        onDataChange();
      });
      
      console.log('Realtime sync started');
    } catch (error) {
      console.error('Error starting realtime sync:', error);
    }
  }

  // リアルタイム同期を停止
  stopRealtimeSync(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      console.log('Realtime sync stopped');
    }
  }

  // すべてのデータをバックアップ
  async backupAllData(): Promise<string> {
    try {
      const memos = await this.getAllMemos();
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        memos: memos
      };
      
      return JSON.stringify(backup, null, 2);
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  // バックアップから復元
  async restoreFromBackup(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData);
      
      if (!backup.memos || !Array.isArray(backup.memos)) {
        throw new Error('Invalid backup format');
      }
      
      // すべてのメモを復元
      for (const memo of backup.memos) {
        await this.saveMemo(memo);
      }
      
      console.log('Backup restored:', backup.memos.length, 'memos');
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();

