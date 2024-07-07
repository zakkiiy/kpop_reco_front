import { Dialog } from '@headlessui/react';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { PlaylistModalProps, Playlist } from '../types';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';

const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, videoId, playlists, onAddToPlaylist }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);

  const togglePlaylist = (playlistId: number) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId) 
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleSave = () => {
    selectedPlaylists.forEach(playlistId => onAddToPlaylist(playlistId));
    onClose();
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
                  <div className={`absolute inset-0 bg-black ${selectedPlaylists.includes(playlist.id) ? 'opacity-70' : 'opacity-50'} group-hover:opacity-70 transition-opacity duration-300`}></div>
                  <div className="relative p-4 flex items-center">
                    <MusicalNoteIcon className="h-8 w-8 text-white opacity-75 mr-3" />
                    <h3 className="text-lg font-bold text-white flex-grow">{playlist.name}</h3>
                    {selectedPlaylists.includes(playlist.id) ? (
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
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
            >
              保存
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PlaylistModal;
