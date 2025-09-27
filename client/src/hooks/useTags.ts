import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getTags();
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
