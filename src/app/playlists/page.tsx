'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';
import { getSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import fetcherWithAuth from '../utils/fetcher';
import YouTube from 'react-youtube';
import { YouTubeEmbed } from "@next/third-parties/google";

interface Playlist {
  id: number;
  name: string;
}

interface PlaylistItem {
  id: number;
  kpop_video: {
    id: number;
    name: string;
    video_id: string;
    artist: {
      id: number;
      name: string;
    }
  }
}

interface PlaylistData {
  playlist_name: string;
  items: PlaylistItem[];
}

interface FormData {
  name: string;
}

const ViewPlaylistModal = ({ playlist, isOpen, onClose }: { playlist: Playlist | null, isOpen: boolean, onClose: () => void }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: playlistItems, error } = useSWR<PlaylistData>(
    isOpen && playlist ? `${apiUrl}/api/v1/playlists/${playlist.id}/playlist_items` : null,
    fetcherWithAuth
  );

  console.log('Playlist:', playlist);
  console.log('Playlist Items:', playlistItems);

  if (!isOpen || !playlist) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
          
          <div className="mt-8">
            <Dialog.Title as="h3" className="text-3xl font-bold leading-6 text-gray-900 mb-4">
              {playlistItems ? playlistItems.playlist_name : playlist.name}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">Error loading playlist items: {error.message}</p>}
          {!playlistItems && !error && <p className="text-gray-500 mt-4">Loading...</p>}
          
          {playlistItems && playlistItems.items && (
            <ul className="mt-6 space-y-6">
              {playlistItems.items.map((item) => (
                <li key={item.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
                  <div className="flex items-center p-4">
                  <iframe
                    width="280"
                    height="157"
                    src={`https://www.youtube-nocookie.com/embed/${item.kpop_video.video_id}?autoplay=0&vq=hd1080&modestbranding=1&rel=0`}
                    title={item.kpop_video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                    <div className="ml-6 flex-1">
                      <p className="text-lg font-semibold text-gray-900">{item.kpop_video.name}</p>
                      <p className="text-sm text-gray-500">{item.kpop_video?.artist?.name}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button className="text-purple-600 hover:text-purple-700 mr-2">
                        <PlayIcon className="h-6 w-6" />
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Dialog>
  );
};

const PlaylistsPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: playlists, error } = useSWR<Playlist[]>(`${apiUrl}/api/v1/playlists`, fetcherWithAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error('User is not authenticated');
      }
      const token = session.accessToken;
      const response = await axios.post(`${apiUrl}/api/v1/playlists`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      mutate(`${apiUrl}/api/v1/playlists`);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating playlist', error);
    }
  };

  const deletePlaylist = async (playlistId: number) => {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error('User is not authenticated');
      }
      const token = session.accessToken;
      await axios.delete(`${apiUrl}/api/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      mutate(`${apiUrl}/api/v1/playlists`);
      setPlaylistToDelete(null);
    } catch (error) {
      console.error('Error deleting playlist', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-red-900">Playlists</h1>
        <button
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Create Playlist
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {playlists?.map((playlist) => (
          <div
            key={playlist.id}
            className="relative group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative p-6 flex flex-col h-full">
              <div className="flex-1">
                <MusicalNoteIcon className="h-12 w-12 text-white opacity-75 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{playlist.name}</h3>
              </div>
              <div className="mt-4 flex space-x-2">
                <button 
                  className="flex-grow text-sm text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-300 rounded-full py-2 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Selected playlist:', playlist);
                    setSelectedPlaylist(playlist);
                  }}
                >
                  View Playlist
                </button>
                <button 
                  className="text-sm text-white bg-red-500 bg-opacity-80 hover:bg-opacity-100 transition-colors duration-300 rounded-full py-2 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaylistToDelete(playlist);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Create Playlist
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Playlist Name
                </label>
                <input
                  id="name"
                  {...register('name', { required: 'Playlist name is required' })}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      <ViewPlaylistModal
        playlist={selectedPlaylist}
        isOpen={!!selectedPlaylist}
        onClose={() => setSelectedPlaylist(null)}
      />

      {playlistToDelete && (
        <Dialog
          open={!!playlistToDelete}
          onClose={() => setPlaylistToDelete(null)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Delete Playlist
              </Dialog.Title>
              <p className="text-sm text-gray-500 mb-4">
                
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setPlaylistToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => deletePlaylist(playlistToDelete.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default PlaylistsPage;
