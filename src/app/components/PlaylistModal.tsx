import React, { useState, useCallback, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';
import { PlaylistModalProps, Playlist } from '../types';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import useSWR from 'swr';

interface PlaylistState {
  playlist_id: number;
  included: boolean;
}

const fetcher = async (url: string) => {
  const session = await getSession();
  if (!session) throw new Error('User is not authenticated');
  
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  return response.data;
};

const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, videoId, playlists }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: playlistStates, mutate } = useSWR(
    isOpen ? `${apiUrl}/api/v1/playlists/check_video?video_id=${videoId}` : null,
    fetcher
  );

  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (playlistStates) {
      setSelectedPlaylists(new Set(playlistStates.filter((state: PlaylistState) => state.included).map((state: PlaylistState) => state.playlist_id)));
    }
  }, [playlistStates]);

  const togglePlaylist = useCallback((playlistId: number) => {
    setSelectedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playlistId)) {
        newSet.delete(playlistId);
      } else {
        newSet.add(playlistId);
      }
      return newSet;
    });
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const session = await getSession();
      if (!session) throw new Error('User is not authenticated');

      const token = session.accessToken;

      for (const state of playlistStates) {
        const isCurrentlySelected = selectedPlaylists.has(state.playlist_id);
        
        if (state.included !== isCurrentlySelected) {
          const url = `${apiUrl}/api/v1/playlists/${state.playlist_id}/playlist_items`;
          
          try {
            if (isCurrentlySelected) {
              await axios.post(url, { kpop_video_id: videoId }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
              });
            } else {
              await axios.delete(`${url}/${videoId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              // error処理
            }
          }
        }
      }

      await mutate();
      onClose();
    } catch (error) {
      // error処理
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-gray-900 shadow-xl">
          <Dialog.Title className="text-xl font-semibold text-white p-6 border-b border-gray-700">
            プレイリストに追加
          </Dialog.Title>
          <div className="max-h-80 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`relative group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer`}
                  onClick={() => togglePlaylist(playlist.id)}
                >
                  <div className={`absolute inset-0 bg-black ${selectedPlaylists.has(playlist.id) ? 'opacity-70' : 'opacity-50'} group-hover:opacity-70 transition-opacity duration-300`}></div>
                  <div className="relative p-4 flex items-center">
                    <MusicalNoteIcon className="h-8 w-8 text-white opacity-75 mr-3" />
                    <h3 className="text-lg font-bold text-white flex-grow">{playlist.name}</h3>
                    {selectedPlaylists.has(playlist.id) ? (
                      <CheckIcon className="h-6 w-6 text-green-400" />
                    ) : (
                      <PlusIcon className="h-6 w-6 text-white opacity-75" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white ${
                isLoading ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500`}
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PlaylistModal;
