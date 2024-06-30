import { useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { apis } from '../app/utils/api';

const useFavolite = (videoId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFavolite = async () => {
    if (!videoId) {
      setError('Video ID is missing');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const session = await getSession();

      if (!session) {
        throw new Error('User is not authenticated');
      }

      const token = session.accessToken;

      const response = await axios.post(
        apis.addFavorite(videoId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true
          },
        }
      );

      if (response.status !== 201) {
        throw new Error('Failed to add Favolite');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return { addFavolite, loading, error };
};

export default useFavolite;
