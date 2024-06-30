'use client'

import { useState } from 'react';
import { YouTubeEmbed } from "@next/third-parties/google";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import fetcherWithAuth from '../utils/fetcher';
import camelcaseKeys from 'camelcase-keys';
import { KpopVideo } from '../types';
import Link from 'next/link'

const FavoriteVideosIndex = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}/api/v1/favorites`; // お気に入り一覧を取得するエンドポイント
  const { data: session, status } = useSession();
  const { data: rawFavoriteVideos, error } = useSWR<KpopVideo[]>(url, fetcherWithAuth);
  const [sortBy, setSortBy] = useState('addedDate');
  const [viewStyle, setViewStyle] = useState('grid');


  const favoriteVideos: KpopVideo[] | null = rawFavoriteVideos
    ? (camelcaseKeys(rawFavoriteVideos as unknown as Record<string, unknown>[], { deep: true }) as unknown as KpopVideo[])
    : null;

  if (error) return <div className="text-center text-red-500">エラーが発生しました。</div>;
  if (!favoriteVideos) return <div className="text-center text-gray-500">読み込み中...</div>;

  if (favoriteVideos && favoriteVideos.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>お気に入りの動画がありません。</p>
        <Link href="/videos" className="text-blue-400 hover:text-blue-300">
          動画一覧を見る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">お気に入り動画</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-0">
          {favoriteVideos.map((video: KpopVideo) => (
            <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <div className="aspect-w-16 aspect-h-9">
                <YouTubeEmbed 
                  videoid={video.videoId}
                  params="controls=0&modestbranding=1&rel=0"
                />
              </div>
              <div className="p-3">
                <Link href={`/videos/${video.id}`}>
                  <h2 className="text-lg font-bold mb-1 text-blue-400 hover:text-blue-300 transition-colors duration-300 truncate">{video.name}</h2>
                </Link>
                <p className="text-xs text-gray-400 mb-1 truncate">{video.artist.name}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{video.viewCount.toLocaleString()} 視聴</span>
                  <span>{new Date(video.postedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteVideosIndex;
