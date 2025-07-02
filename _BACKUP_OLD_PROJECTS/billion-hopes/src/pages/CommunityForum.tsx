import React from 'react';

const CommunityForum: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          💬 Community Forum
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Connect with fellow AI learners, ask questions, and share knowledge!
        </p>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🚧 Coming Soon!</h2>
          <p className="text-gray-600 mb-6">
            Our community forum is currently under development. Soon you will be able to:
          </p>
          <ul className="mt-4 space-y-2 text-left max-w-md mx-auto">
            <li>💬 Ask questions and get help</li>
            <li>🚀 Share your AI projects</li>
            <li>🤝 Connect with other learners</li>
            <li>🏆 Earn reputation points</li>
            <li>📚 Access exclusive resources</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;