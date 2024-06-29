'use client'

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaTimes, FaHome, FaHeart, FaMusic, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ setIsMenuOpen }) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsMenuOpen(!isOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 h-screen bg-gradient-to-b from-purple-800 to-indigo-900 text-white w-20 flex flex-col items-center py-6 shadow-lg z-50">
        <button
          onClick={toggleMenu}
          className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 mb-8"
        >
          {isOpen ? (
            <FaTimes className="h-6 w-6 text-white" />
          ) : (
            <FaBars className="h-6 w-6 text-white" />
          )}
        </button>
        <nav className="flex flex-col space-y-6">
          <Link href="/" className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300">
            <FaHome className="h-6 w-6" />
          </Link>
          <Link href="/favorites" className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300">
            <FaHeart className="h-6 w-6" />
          </Link>
          <Link href="/playlists" className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300">
            <FaMusic className="h-6 w-6" />
          </Link>
        </nav>
      </header>
      {isOpen && (
        <div className="fixed left-20 top-0 h-screen w-64 bg-gradient-to-br from-purple-900 to-indigo-800 p-6 shadow-2xl">
          {status === 'authenticated' ? (
            <div className="flex flex-col items-center">
              <FaUser className="h-20 w-20 text-white mb-4" />
              <span className="text-lg font-semibold text-white mb-2">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="w-full py-2 px-4 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors duration-300 flex items-center justify-center"
              >
                <FaSignOutAlt className="mr-2" /> Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FaUser className="h-20 w-20 text-gray-400 mb-4" />
              <span className="text-lg font-semibold text-white mb-6">Welcome, Guest</span>
              <button
                onClick={() => signIn('google', {}, { prompt: 'login' })}
                className="w-full py-2 px-4 bg-white text-purple-800 rounded-full hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
              >
                <FaSignInAlt className="mr-2" /> Sign in with Google
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
