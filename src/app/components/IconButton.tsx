import React from 'react';
import useFavorite from '../../hooks/useFavorite';
import { IconButtonProps } from '../types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const IconButton: React.FC<IconButtonProps> = ({ videoId }) => {
  const { addFavorite, deleteFavorite, loading, error, isFavorite } = useFavorite(videoId);

  const handleClick = async () => {
    if (isFavorite) {
      await deleteFavorite();
    } else {
      await addFavorite();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-full transition duration-300 ease-in-out ${
        isFavorite ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      disabled={loading}
    >
      {isFavorite ? <AiFillHeart className="w-6 h-6" /> : <AiOutlineHeart className="w-6 h-6" />}
    </button>
  );
};

export default IconButton;
