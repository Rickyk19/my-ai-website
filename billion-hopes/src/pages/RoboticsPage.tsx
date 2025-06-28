import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RoboticsPage: React.FC = () => {
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
        <span role="img" aria-label="robot">🤖</span> Robotics & AI
      </h1>

      <p className="text-gray-700 mb-8">
        Robotics combines <strong>artificial intelligence with physical systems</strong> to create machines that can interact with and manipulate the physical world.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="types">📊</span> Types of Robots
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Industrial Robots</h3>
            <p className="text-gray-700 mb-2"><strong>Purpose:</strong> Manufacturing and assembly tasks.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong> Assembly line robots, welding robots, painting robots</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Service Robots</h3>
            <p className="text-gray-700 mb-2"><strong>Purpose:</strong> Assist humans in various tasks.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong> Cleaning robots, delivery robots, medical robots</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Humanoid Robots</h3>
            <p className="text-gray-700 mb-2"><strong>Purpose:</strong> Human-like interaction and tasks.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong> ASIMO, Sophia, Boston Dynamics Atlas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Autonomous Vehicles</h3>
            <p className="text-gray-700 mb-2"><strong>Purpose:</strong> Self-driving transportation.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong> Self-driving cars, drones, autonomous ships</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="applications">🚀</span> AI in Robotics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Perception</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Computer vision</li>
              <li>Object recognition</li>
              <li>Sensor fusion</li>
              <li>SLAM (Mapping)</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Decision Making</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Path planning</li>
              <li>Task scheduling</li>
              <li>Reinforcement learning</li>
              <li>Behavior trees</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">Control</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Motor control</li>
              <li>Balance and stability</li>
              <li>Manipulation</li>
              <li>Adaptive control</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Interaction</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Natural language</li>
              <li>Gesture recognition</li>
              <li>Human-robot collaboration</li>
              <li>Social robotics</li>
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

export default RoboticsPage; 