import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { localStorageService } from '../services/localStorage';

// 本番環境（GitHub Pages）ではlocalStorageを使用
const isProduction = process.env.NODE_ENV === 'production';
const service = isProduction ? localStorageService : apiService;

export const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await service.getTags();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
};
