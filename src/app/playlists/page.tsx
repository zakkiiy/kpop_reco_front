'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import fetcherWithAuth from '../utils/fetcher';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';

interface Playlist {
  id: number;
  name: string;
}

interface FormData {
  name: string;
}

const PlaylistsPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: playlists, error } = useSWR<Playlist[]>(`${apiUrl}/api/v1/playlists`, fetcherWithAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error('User is not authenticated');
      }
      const token = session.accessToken;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
            onClick={() => setSelectedPlaylist(playlist)}
          >
            <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative p-6 flex flex-col h-full">
              <div className="flex-1">
                <MusicalNoteIcon className="h-12 w-12 text-white opacity-75 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{playlist.name}</h3>
              </div>
              <div className="mt-4">
                <button className="text-sm text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-300 rounded-full py-2 px-4">
                  View Playlist
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
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleSubmit(onSubmit)}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {selectedPlaylist && (
        <Dialog
          open={!!selectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                {selectedPlaylist.name}
              </Dialog.Title>
              <p className="text-sm text-gray-500 mb-4">5 songs</p>
              <button
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setSelectedPlaylist(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default PlaylistsPage;
