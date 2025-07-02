import React, { useState } from 'react';
import { motion } from 'framer-motion';

const YTLecturesPage: React.FC = () => {
  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    clap: 0
  });

  const handleReaction = (type: 'like' | 'love' | 'clap') => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 prose prose-lg prose-blue"
    >
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="video">📺</span> YouTube Lectures
      </h1>

      <p className="text-gray-700 mb-8">
        Discover the best <strong>AI and Machine Learning video lectures</strong> from top universities and experts around the world.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="university">🎓</span> University Courses
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Stanford CS229 - Machine Learning</h3>
            <p className="text-gray-700 mb-2">Andrew Ng's comprehensive machine learning course</p>
            <p className="text-blue-600">Full playlist available on YouTube</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">MIT 6.034 - Artificial Intelligence</h3>
            <p className="text-gray-700 mb-2">Complete AI course covering algorithms and applications</p>
            <p className="text-blue-600">MIT OpenCourseWare</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Fast.ai - Practical Deep Learning</h3>
            <p className="text-gray-700 mb-2">Hands-on approach to deep learning for coders</p>
            <p className="text-blue-600">Free practical course</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="channels">📢</span> Top AI YouTube Channels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Educational</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>3Blue1Brown</li>
              <li>Two Minute Papers</li>
              <li>Lex Fridman</li>
              <li>DeepLearning.AI</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Technical</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Yannic Kilcher</li>
              <li>AI Coffee Break</li>
              <li>Machine Learning Explained</li>
              <li>StatQuest</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reactions Section */}
      <section className="mt-12 mb-8 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="reactions">💭</span> Reactions
        </h2>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => handleReaction('like')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-3xl">👍</span>
            <span className="text-gray-600">{reactions.like}</span>
          </button>
          <button
            onClick={() => handleReaction('love')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-3xl">❤️</span>
            <span className="text-gray-600">{reactions.love}</span>
          </button>
          <button
            onClick={() => handleReaction('clap')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-3xl">👏</span>
            <span className="text-gray-600">{reactions.clap}</span>
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default YTLecturesPage; 