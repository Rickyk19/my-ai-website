import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import SocialMedia from '../SocialMedia';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-24">
        <Sidebar />
        <div className="flex-1 ml-64">
          <main className="p-8 pb-24">
            <Outlet />
          </main>
          
          {/* Footer with Social Media */}
          <footer className="bg-blue-600 border-t w-full text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-white/90 whitespace-nowrap">
                  © {new Date().getFullYear()} Billion Hopes. All rights reserved.
                </div>
                <div className="text-white">
                  <SocialMedia variant="footer" />
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Sticky Social Media Panel */}
      <SocialMedia variant="sticky" />
    </div>
  );
};

export default Layout; 