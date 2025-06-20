import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import SocialMedia from '../SocialMedia';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-24">
        <Sidebar />
        <div className="flex-1 ml-64">
          <main className="p-8">
            <Outlet />
          </main>
          
          {/* New Professional Footer */}
          <Footer />
        </div>
      </div>
      
      {/* Sticky Social Media Panel */}
      <SocialMedia variant="sticky" />
    </div>
  );
};

export default Layout; 