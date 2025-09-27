export interface Memo {
  id: number;
  title: string;
  content: string;
  category: string;
  is_task: boolean;
  is_completed: boolean;
  priority: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateMemoData {
  title: string;
  content?: string;
  category?: string;
  is_task?: boolean;
  priority?: number;
  tags?: string[];
}

export interface UpdateMemoData extends Partial<CreateMemoData> {
  is_completed?: boolean;
}

export interface FilterOptions {
  category?: string;
  is_task?: boolean;
  is_completed?: boolean;
  search?: string;
}

export interface Category {
  name: string;
  count: number;
}

export interface Tag {
  name: string;
  count: number;
}

export type SortOption = 'created_at' | 'updated_at' | 'title' | 'priority';
export type SortOrder = 'asc' | 'desc';
