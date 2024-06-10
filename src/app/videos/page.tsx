'use client'

import { YouTubeEmbed } from "@next/third-parties/google";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import fetcherWithAuth from '../utils/fetcher';
import camelcaseKeys from 'camelcase-keys';
import { KpopVideo } from '../types';
import Link from 'next/link'

const KpopVideosIndex = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}/api/v1/kpop_videos`;
  const { data: session, status } = useSession();
  const { data: rawKpopVideos, error } = useSWR<KpopVideo[]>(url, fetcherWithAuth);

  const videos: KpopVideo[] | null = rawKpopVideos
    ? (camelcaseKeys(rawKpopVideos as unknown as Record<string, unknown>[], { deep: true }) as unknown as KpopVideo[])
    : null;

  if (error) return <div>Failed to load</div>;
  if (!videos) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kpop Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video: KpopVideo) => (
          <Link key={video.id} href={`/videos/${video.id}`} passHref>
            <div key={video.id} className="bg-white p-4 rounded shadow">
              <YouTubeEmbed videoid={video.videoId} />
              <h2 className="text-lg font-semibold">{video.name}</h2>
              <p className="text-gray-600">Artist: {video.artist.name}</p>
              <p className="text-gray-600">Views: {video.viewCount}</p>
              <p className="text-gray-600">Posted on: {new Date(video.postedAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KpopVideosIndex;
