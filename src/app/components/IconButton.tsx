import React from 'react';
import useFavorite from '../../hooks/useFavorite';
import { IconButtonProps } from '../types';
import { AiOutlineHeart, AiFillHeart, AiOutlineOrderedList } from 'react-icons/ai';

const IconButton: React.FC<IconButtonProps> = ({ videoId, type, onClick }) => {
  const { addFavorite, deleteFavorite, loading, error, isFavorite } = useFavorite(videoId);

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await deleteFavorite();
      } else {
        await addFavorite();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'favorite':
        return isFavorite ? <AiFillHeart className="w-6 h-6" /> : <AiOutlineHeart className="w-6 h-6" />;
      case 'playlist':
        return <AiOutlineOrderedList className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const handleClick = type === 'favorite' ? handleFavoriteClick : onClick;

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-full transition duration-300 ease-in-out ${
        type === 'favorite' && isFavorite
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
      }`}
      aria-label={
        type === 'favorite'
          ? isFavorite
            ? 'Remove from favorites'
            : 'Add to favorites'
          : 'Add to playlist'
      }
      disabled={loading}
    >
      {getIcon()}
    </button>
  );
};

export default IconButton;
