// GitHub Gist API サービス
interface GistData {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface MemoData {
  memos: any[];
  lastSync: string;
}

class GitHubGistService {
  private gistId: string | null = null;
  private accessToken: string | null = null;

  // GitHub Personal Access Token を設定
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Gist ID を設定
  setGistId(gistId: string) {
    this.gistId = gistId;
  }

  // 認証状態を確認
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.gistId);
  }

  // 新しいGistを作成
  async createGist(data: MemoData): Promise<string> {
    if (!this.accessToken) {
      throw new Error('GitHub access token is required');
    }

    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Memo App Data Sync',
        public: false,
        files: {
          'memo-data.json': {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create gist: ${response.statusText}`);
    }

    const gist = await response.json();
    this.gistId = gist.id;
    return gist.id;
  }

  // Gistからデータを取得
  async getData(): Promise<MemoData | null> {
    if (!this.accessToken || !this.gistId) {
      throw new Error('GitHub authentication required');
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
        headers: {
          'Authorization': `token ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Gist not found
        }
        throw new Error(`Failed to fetch gist: ${response.statusText}`);
      }

      const gist = await response.json();
      const file = gist.files['memo-data.json'];
      
      if (!file) {
        return null;
      }

      return JSON.parse(file.content);
    } catch (error) {
      console.error('Error fetching data from Gist:', error);
      return null;
    }
  }

  // Gistにデータを保存
  async saveData(data: MemoData): Promise<void> {
    if (!this.accessToken || !this.gistId) {
      throw new Error('GitHub authentication required');
    }

    const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Memo App Data Sync',
        files: {
          'memo-data.json': {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to save gist: ${response.statusText}`);
    }
  }

  // ローカルストレージからデータを取得
  getLocalData(): MemoData {
    const data = localStorage.getItem('memo-app-data');
    if (data) {
      return JSON.parse(data);
    }
    return {
      memos: [],
      lastSync: new Date().toISOString()
    };
  }

  // ローカルストレージにデータを保存
  saveLocalData(data: MemoData): void {
    localStorage.setItem('memo-app-data', JSON.stringify(data));
  }

  // データを同期（ローカル → Gist）
  async syncToGist(): Promise<void> {
    const localData = this.getLocalData();
    await this.saveData(localData);
    console.log('Data synced to GitHub Gist');
  }

  // データを同期（Gist → ローカル）
  async syncFromGist(): Promise<MemoData> {
    const gistData = await this.getData();
    if (gistData) {
      this.saveLocalData(gistData);
      console.log('Data synced from GitHub Gist');
      return gistData;
    }
    return this.getLocalData();
  }
}

export const githubGistService = new GitHubGistService();
