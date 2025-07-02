import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AIIndustryPage: React.FC = () => {
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
        <span role="img" aria-label="industry">🏭</span> AI in Industry
      </h1>

      <p className="text-gray-700 mb-8">
        Artificial Intelligence is <strong>transforming industries</strong> across the globe, revolutionizing how businesses operate, make decisions, and serve customers.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="industries">🏢</span> Key Industries
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Healthcare</h3>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Medical diagnosis and imaging</li>
              <li>Drug discovery and development</li>
              <li>Personalized treatment plans</li>
              <li>Robotic surgery assistance</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Finance</h3>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Fraud detection and prevention</li>
              <li>Algorithmic trading</li>
              <li>Credit scoring and risk assessment</li>
              <li>Robo-advisors for investment</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-purple-600">Manufacturing</h3>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Predictive maintenance</li>
              <li>Quality control and inspection</li>
              <li>Supply chain optimization</li>
              <li>Automated production lines</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-orange-600">Retail & E-commerce</h3>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Personalized recommendations</li>
              <li>Inventory management</li>
              <li>Dynamic pricing strategies</li>
              <li>Customer service chatbots</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="benefits">📈</span> Business Benefits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Efficiency</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Process automation</li>
              <li>Reduced manual errors</li>
              <li>Faster decision making</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Cost Reduction</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Lower operational costs</li>
              <li>Reduced waste</li>
              <li>Optimized resource usage</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">Innovation</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>New product development</li>
              <li>Enhanced capabilities</li>
              <li>Competitive advantage</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Customer Experience</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Personalized services</li>
              <li>24/7 support</li>
              <li>Improved satisfaction</li>
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

export default AIIndustryPage; 