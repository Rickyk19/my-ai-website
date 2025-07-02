import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AIResourcesPage: React.FC = () => {
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
        <span role="img" aria-label="resources">📚</span> AI Resources
      </h1>

      <p className="text-gray-700 mb-8">
        A curated collection of <strong>essential resources</strong> for learning and staying updated with artificial intelligence.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="books">📖</span> Essential Books
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Artificial Intelligence: A Modern Approach</h3>
            <p className="text-gray-700 mb-2">By Stuart Russell and Peter Norvig</p>
            <p className="text-gray-600">The comprehensive textbook for AI fundamentals</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Hands-On Machine Learning</h3>
            <p className="text-gray-700 mb-2">By Aurélien Géron</p>
            <p className="text-gray-600">Practical guide to machine learning with Python</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Deep Learning</h3>
            <p className="text-gray-700 mb-2">By Ian Goodfellow, Yoshua Bengio, and Aaron Courville</p>
            <p className="text-gray-600">The definitive textbook on deep learning</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="tools">🛠️</span> Tools & Platforms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Programming</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Python (Pandas, NumPy)</li>
              <li>R for statistics</li>
              <li>Jupyter Notebooks</li>
              <li>Google Colab</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">ML Frameworks</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>TensorFlow</li>
              <li>PyTorch</li>
              <li>Scikit-learn</li>
              <li>Keras</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">Cloud Platforms</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>AWS SageMaker</li>
              <li>Google Cloud AI</li>
              <li>Azure ML</li>
              <li>IBM Watson</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Datasets</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Kaggle</li>
              <li>UCI ML Repository</li>
              <li>ImageNet</li>
              <li>Common Crawl</li>
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

export default AIResourcesPage; 