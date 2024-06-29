'use client'

import { useState } from 'react';
import Header from './Header';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Header setIsMenuOpen={setIsMenuOpen} />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isMenuOpen ? 'ml-80' : 'ml-20'}`}>
        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
