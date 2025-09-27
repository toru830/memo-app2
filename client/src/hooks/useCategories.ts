import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { localStorageService } from '../services/localStorage';

// 本番環境（GitHub Pages）ではlocalStorageを使用
const isProduction = process.env.NODE_ENV === 'production';
const service = isProduction ? localStorageService : apiService;

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await service.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
