import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import SocialMedia from '../SocialMedia';
import Footer from './Footer';
import AIChatbot from '../AIChatbot';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      
      {/* Grid Layout for Sidebar + Content */}
      <div className="grid grid-cols-[256px_1fr] gap-0 pt-24">
        <Sidebar />
        <main className="p-8 min-h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
          <Outlet />
        </main>
      </div>
      
      {/* Full-width Footer */}
      <Footer />
      
      {/* Sticky Social Media Panel */}
      <SocialMedia variant="sticky" />
      
      {/* AI Assistant Chatbot - Available on all pages */}
      <AIChatbot />
    </div>
  );
};

export default Layout; 