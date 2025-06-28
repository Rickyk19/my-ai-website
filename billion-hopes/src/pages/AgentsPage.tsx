import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AgentsPage: React.FC = () => {
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
        <span role="img" aria-label="robot">🤖</span> AI Agents
      </h1>

      <p className="text-gray-700 mb-8">
        AI Agents are autonomous systems that can <strong>perceive their environment, make decisions, and take actions</strong> to achieve specific goals.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="types">📊</span> Types of AI Agents
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">1. Simple Reflex Agents</h3>
            <p className="text-gray-700 mb-2"><strong>Behavior:</strong> Act based on current perception only.</p>
            <p className="text-gray-700 mb-2"><strong>Example:</strong> Thermostat, automatic doors</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">2. Goal-Based Agents</h3>
            <p className="text-gray-700 mb-2"><strong>Behavior:</strong> Act to achieve specific goals.</p>
            <p className="text-gray-700 mb-2"><strong>Example:</strong> GPS navigation, game-playing AI</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">3. Learning Agents</h3>
            <p className="text-gray-700 mb-2"><strong>Behavior:</strong> Improve performance through experience.</p>
            <p className="text-gray-700 mb-2"><strong>Example:</strong> AlphaGo, chatbots, personalized assistants</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="applications">🚀</span> Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Transportation</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Autonomous vehicles</li>
              <li>Traffic management</li>
              <li>Route optimization</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Gaming</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>NPCs and game AI</li>
              <li>Strategy games</li>
              <li>Procedural content</li>
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

export default AgentsPage; 