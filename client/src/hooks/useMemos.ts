import { useState, useEffect, useCallback } from 'react';
import { Memo, CreateMemoData, UpdateMemoData, FilterOptions } from '../types';
import { apiService } from '../services/api';

export const useMemos = (filters?: FilterOptions) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMemos(filters);
      setMemos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch memos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const createMemo = useCallback(async (data: CreateMemoData) => {
    try {
      await apiService.createMemo(data);
      await fetchMemos(); // リストを再取得
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create memo');
      throw err;
    }
  }, [fetchMemos]);

  const updateMemo = useCallback(async (id: number, data: UpdateMemoData) => {
    try {
      await apiService.updateMemo(id, data);
      setMemos(prev => 
        prev.map(memo => 
          memo.id === id 
            ? { ...memo, ...data, updated_at: new Date().toISOString() }
            : memo
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update memo');
      throw err;
    }
  }, []);

  const deleteMemo = useCallback(async (id: number) => {
    try {
      await apiService.deleteMemo(id);
      setMemos(prev => prev.filter(memo => memo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete memo');
      throw err;
    }
  }, []);

  const toggleComplete = useCallback(async (id: number, is_completed: boolean) => {
    await updateMemo(id, { is_completed });
  }, [updateMemo]);

  return {
    memos,
    loading,
    error,
    createMemo,
    updateMemo,
    deleteMemo,
    toggleComplete,
    refetch: fetchMemos,
  };
};
