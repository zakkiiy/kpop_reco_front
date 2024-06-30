import { useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { apis } from '../app/utils/api';
import useSWR, { mutate } from 'swr';

const fetcher = async (url: string) => {
  const session = await getSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const token = session.accessToken;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      withCredentials: true,
    },
  });

  return response.data;
};

const useFavorite = (videoId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data, error: swrError } = useSWR(
    videoId ? apis.checkFavorite(videoId) : null,
    fetcher
  );

  // SWRのデータをもとにお気に入り状態を設定
  const isFavorite = data?.isFavorite ?? false;

  const addFavorite = async () => {
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

      if (response.status === 201) {
        mutate(apis.checkFavorite(videoId));
      } else {
        throw new Error('Failed to add Favorite');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async () => {
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
      const response = await axios.delete(
        apis.removeFavorite(videoId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true
          },
        }
      );

      if (response.status === 204) {
        mutate(apis.checkFavorite(videoId)); 
      } else {
        throw new Error('Failed to remove Favorite');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return { addFavorite, deleteFavorite, loading, error, isFavorite };
};

export default useFavorite;
