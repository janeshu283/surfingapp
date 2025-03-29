// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">SurfWave</Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/spots" className="hover:text-blue-200 transition">サーフスポット</Link>
          <Link to="/forecast" className="hover:text-blue-200 transition">波予報</Link>
          <Link to="/cameras" className="hover:text-blue-200 transition">ライブカメラ</Link>
          <Link to="/community" className="hover:text-blue-200 transition">コミュニティ</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-blue-200 transition">
                <span className="hidden md:inline">マイページ</span>
                <span className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </Link>
              <button 
                onClick={signOut}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm font-medium transition"
              >
                <span className="hidden md:inline">ログアウト</span>
                <span className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="hover:text-blue-200 transition"
              >
                <span className="hidden md:inline">ログイン</span>
                <span className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm font-medium transition"
              >
                <span className="hidden md:inline">新規登録</span>
                <span className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </span>
              </Link>
            </>
          )}
          
          <button className="md:hidden text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
