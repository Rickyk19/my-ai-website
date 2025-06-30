import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EthicsPage: React.FC = () => {
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
        <span role="img" aria-label="ethics">⚖️</span> Ethics & Governance
      </h1>

      <p className="text-gray-700 mb-8">
        As AI becomes more powerful and pervasive, <strong>ethical considerations and governance frameworks</strong> are crucial for ensuring responsible development and deployment.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="key">🔑</span> Key Ethical Issues
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Bias and Fairness</h3>
            <p className="text-gray-700 mb-2"><strong>Issue:</strong> AI systems can perpetuate or amplify existing biases.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong> Hiring algorithms, facial recognition, loan approval</p>
            <p className="text-gray-700"><strong>Solution:</strong> Diverse training data, bias testing, inclusive development teams</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Privacy and Data Protection</h3>
            <p className="text-gray-700 mb-2"><strong>Issue:</strong> AI systems often require vast amounts of personal data.</p>
            <p className="text-gray-700 mb-2"><strong>Concerns:</strong> Data collection, storage, sharing, consent</p>
            <p className="text-gray-700"><strong>Regulations:</strong> GDPR, CCPA, data minimization principles</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Transparency and Explainability</h3>
            <p className="text-gray-700 mb-2"><strong>Issue:</strong> Many AI systems are "black boxes" with unclear decision-making.</p>
            <p className="text-gray-700 mb-2"><strong>Need:</strong> Understanding how AI makes decisions, especially in critical applications</p>
            <p className="text-gray-700"><strong>Approaches:</strong> Explainable AI (XAI), interpretable models, audit trails</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Accountability and Responsibility</h3>
            <p className="text-gray-700 mb-2"><strong>Question:</strong> Who is responsible when AI systems cause harm?</p>
            <p className="text-gray-700 mb-2"><strong>Stakeholders:</strong> Developers, operators, users, regulators</p>
            <p className="text-gray-700"><strong>Frameworks:</strong> Clear liability chains, insurance models, certification</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="governance">🏛️</span> Governance Frameworks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Regulatory Approaches</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>EU AI Act</li>
              <li>US AI Executive Orders</li>
              <li>China AI regulations</li>
              <li>Sector-specific rules</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Industry Standards</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>IEEE AI standards</li>
              <li>ISO/IEC guidelines</li>
              <li>Partnership on AI</li>
              <li>AI ethics boards</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Ethics by design</li>
              <li>Risk assessment</li>
              <li>Stakeholder engagement</li>
              <li>Continuous monitoring</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Future Considerations</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>AGI governance</li>
              <li>Global coordination</li>
              <li>Adaptive regulation</li>
              <li>Public participation</li>
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

export default EthicsPage; 