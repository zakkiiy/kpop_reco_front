import React from 'react';
import useFavolite from '../../hooks/useFavolite';
import { IconButtonProps } from '../types';

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, active = false, label, videoId }) => {
  const { addFavolite, loading, error } = useFavolite(videoId);

  const handleClick = async () => {
    if (onClick) {
      await onClick();
    } else {
      await addFavolite();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-full transition duration-300 ease-in-out ${
        active ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
      }`}
      aria-label={label}
      disabled={loading}
    >
      {icon}
    </button>
  );
};

export default IconButton;
