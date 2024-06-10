'use client'

import useSWR from 'swr';
import fetcherWithAuth from '../../utils/fetcher';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import camelcaseKeys from "camelcase-keys";
import { KpopVideo } from '../../types';
import { YouTubeEmbed } from "@next/third-parties/google";

const DetailKpopVideos = () => {
  const { data: session, status } = useSession();
  const params = useParams()
  const id = params.id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/kpop_videos/${id}`
  const router = useRouter();

  const { data: rawKpopVideo, error } = useSWR<KpopVideo>(url, fetcherWithAuth);
  // 'rawKpopVideo' を 'Record<string, unknown>' としてキャストし、キャメルケースに変換
  const camelCaseKpopVideo = rawKpopVideo ? camelcaseKeys(rawKpopVideo as unknown as Record<string, unknown>, { deep: true }) : null;
  const kpopVideo = camelCaseKpopVideo as unknown as KpopVideo;

  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  if (!kpopVideo) {
    return <div className="text-center text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-200">
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2">
          <YouTubeEmbed videoid={kpopVideo.videoId} />
        </div>
        <div className="p-6 lg:w-1/2">
          <h2 className="text-3xl font-bold text-gray-100">{kpopVideo.name}</h2>
          <p className="mt-4 text-gray-400">アーティスト: {kpopVideo.artist.name}</p>
          <p className="mt-2 text-gray-400">視聴回数: {kpopVideo.viewCount}</p>
          <p className="mt-2 text-gray-400">投稿日: {new Date(kpopVideo.postedAt).toLocaleDateString()}</p>
          <div className="mt-6 flex space-x-4">
            <button className="px-4 py-2 bg-pink-600 text-gray-200 font-semibold rounded-lg shadow-md hover:bg-pink-500">お気に入りに追加</button>
            <button className="px-4 py-2 bg-blue-600 text-gray-200 font-semibold rounded-lg shadow-md hover:bg-blue-500">シェア</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailKpopVideos;
