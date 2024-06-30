'use client'

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import fetcherWithAuth from '../../utils/fetcher';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import camelcaseKeys from "camelcase-keys";
import { KpopVideo } from '../../types';
import { YouTubeEmbed } from "@next/third-parties/google";
import { HeartIcon, ShareIcon, PlayIcon, QueueListIcon } from '@heroicons/react/24/outline';
import IconButton from "../../components/IconButton"

const DetailKpopVideos = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}/api/v1/kpop_videos/${id}`;

  const { data: rawKpopVideo, error } = useSWR<KpopVideo>(url, fetcherWithAuth);
  const camelCaseKpopVideo = rawKpopVideo ? camelcaseKeys(rawKpopVideo as unknown as Record<string, unknown>, { deep: true }) : null;
  const kpopVideo = camelCaseKpopVideo as unknown as KpopVideo;

  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  if (!kpopVideo) {
    return <div className="text-center text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
          <div className="bg-black py-8">
            <div className="max-w-4xl mx-auto aspect-w-16 aspect-h-9">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${kpopVideo.videoId}?vq=hd1080&modestbranding=1&rel=0`}
                  title={kpopVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-3 text-blue-400">
              {kpopVideo.name}
            </h2>
            <p className="text-sm text-gray-400 mb-4">{kpopVideo.artist.name}</p>
            <div className="flex items-center justify-between mb-6 text-xs text-gray-400">
              <span>{kpopVideo.viewCount.toLocaleString()} 回視聴</span>
              <span>{new Date(kpopVideo.postedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-center space-x-6">
              <IconButton icon={<HeartIcon className="w-6 h-6" />} videoId={String(kpopVideo.id)} />
              <IconButton icon={<ShareIcon className="w-6 h-6" />} />
              <IconButton icon={<PlayIcon className="w-6 h-6" />} />
              <IconButton icon={<QueueListIcon className="w-6 h-6" />} />
            </div>
          </div>
        </div>
        <div className="mt-6 bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">コメント</h3>
        </div>
      </div>
    </div>
  );
}

export default DetailKpopVideos;