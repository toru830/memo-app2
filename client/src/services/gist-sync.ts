// GitHub Gist 同期サービス
interface GistData {
  memos: any[];
  lastSync: string;
}

interface GistFile {
  content: string;
  filename: string;
}

interface GistResponse {
  id: string;
  files: Record<string, GistFile>;
  created_at: string;
  updated_at: string;
}

class GistSyncService {
  private accessToken: string | null = null;
  private gistId: string | null = null;
  private readonly GIST_FILENAME = 'memo-app-data.json';

  // GitHub Personal Access Token を設定
  setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('github-access-token', token);
  }

  // Gist ID を設定
  setGistId(gistId: string): void {
    this.gistId = gistId;
    localStorage.setItem('github-gist-id', gistId);
  }

  // 認証状態を確認
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.gistId);
  }

  // ローカルストレージから認証情報を復元
  loadAuth(): void {
    const token = localStorage.getItem('github-access-token');
    const gistId = localStorage.getItem('github-gist-id');
    
    if (token) this.accessToken = token;
    if (gistId) this.gistId = gistId;
  }

  // ログアウト
  logout(): void {
    this.accessToken = null;
    this.gistId = null;
    localStorage.removeItem('github-access-token');
    localStorage.removeItem('github-gist-id');
  }

  // 新しいGistを作成
  async createGist(data: GistData): Promise<string> {
    if (!this.accessToken) {
      throw new Error('GitHub access token is required');
    }

    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Memo App Data Sync',
        public: false,
        files: {
          [this.GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create gist: ${response.status} ${error}`);
    }

    const gist: GistResponse = await response.json();
    this.gistId = gist.id;
    return gist.id;
  }

  // Gistからデータを取得
  async getData(): Promise<GistData | null> {
    if (!this.accessToken || !this.gistId) {
      throw new Error('GitHub authentication required');
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
        headers: {
          'Authorization': `token ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Gist not found
        }
        throw new Error(`Failed to fetch gist: ${response.status} ${response.statusText}`);
      }

      const gist: GistResponse = await response.json();
      const file = gist.files[this.GIST_FILENAME];
      
      if (!file) {
        return null;
      }

      return JSON.parse(file.content);
    } catch (error) {
      console.error('Error fetching data from Gist:', error);
      throw error;
    }
  }

  // Gistにデータを保存
  async saveData(data: GistData): Promise<void> {
    if (!this.accessToken || !this.gistId) {
      throw new Error('GitHub authentication required');
    }

    const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${this.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Memo App Data Sync',
        files: {
          [this.GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to save gist: ${response.status} ${error}`);
    }
  }

  // ローカルストレージからデータを取得
  getLocalData(): GistData {
    const data = localStorage.getItem('memo-app-data');
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return { memos: [], lastSync: new Date().toISOString() };
      }
    }
    return { memos: [], lastSync: new Date().toISOString() };
  }

  // ローカルストレージにデータを保存
  saveLocalData(data: GistData): void {
    localStorage.setItem('memo-app-data', JSON.stringify(data));
  }

  // データを同期（ローカル → Gist）
  async syncToGist(): Promise<void> {
    const localData = this.getLocalData();
    await this.saveData(localData);
    console.log('✅ Data synced to GitHub Gist');
  }

  // データを同期（Gist → ローカル）
  async syncFromGist(): Promise<GistData> {
    const gistData = await this.getData();
    if (gistData) {
      this.saveLocalData(gistData);
      console.log('✅ Data synced from GitHub Gist');
      return gistData;
    }
    return this.getLocalData();
  }

  // 認証テスト
  async testAuth(): Promise<boolean> {
    if (!this.accessToken) return false;
    
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const gistSyncService = new GistSyncService();
