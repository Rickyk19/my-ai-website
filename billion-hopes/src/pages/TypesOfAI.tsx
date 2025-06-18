import React from 'react';
import { motion } from 'framer-motion';

const TypesOfAI: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 prose prose-lg prose-blue"
    >
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="brain">🧠</span> Types of AI
      </h1>

      <p className="text-gray-700 mb-8">
        Artificial Intelligence (AI) is typically categorized based on <strong>capability</strong> and <strong>functionality</strong>. 
        These classifications help us understand how intelligent an AI system is and how far it can mimic human-like thinking.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="checkmark">✅</span> Classification Based on Capability
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">1. Narrow AI (Weak AI)</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> AI that is designed and trained to perform a specific task.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Voice assistants like Siri, Alexa</li>
              <li>Spam filters in email</li>
              <li>Recommendation systems (Netflix, YouTube)</li>
            </ul>
            <p className="text-gray-700 mt-2"><strong>Notes:</strong> Most AI systems today are Narrow AI. They perform a <strong>single job efficiently</strong>, but can't adapt beyond their training.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">2. General AI (Strong AI)</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> A theoretical form of AI that can perform <strong>any intellectual task</strong> that a human can.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong> Not yet achieved; exists only in theory and advanced research.</p>
            <p className="text-gray-700"><strong>Goal:</strong> Build a machine that has <strong>human-level intelligence</strong>, learning ability, and reasoning.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">3. Super AI</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> A <strong>hypothetical AI</strong> that surpasses human intelligence in every field — creativity, wisdom, problem-solving, and even emotional intelligence.</p>
            <p className="text-gray-700 mb-2"><strong>Concerns:</strong> This is often discussed in the context of ethics, existential risks, and the future of humanity.</p>
            <p className="text-gray-700"><strong>Examples:</strong> Currently science fiction — explored in movies like <em>Her</em>, <em>Ex Machina</em>, or <em>Avengers: Age of Ultron</em>.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="checkmark">✅</span> Classification Based on Functionality
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">1. Reactive Machines</h3>
            <p className="text-gray-700 mb-2"><strong>Behavior:</strong> Can only react to current situations, no memory.</p>
            <p className="text-gray-700 mb-2"><strong>Example:</strong> IBM's Deep Blue (chess-playing AI).</p>
            <p className="text-gray-700"><strong>Limitation:</strong> Doesn't learn from past experiences.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">2. Limited Memory</h3>
            <p className="text-gray-700 mb-2"><strong>Behavior:</strong> Can learn from past data for a short time.</p>
            <p className="text-gray-700 mb-2"><strong>Example:</strong> Self-driving cars using sensor data, traffic info, and maps.</p>
            <p className="text-gray-700"><strong>Use Case:</strong> Most AI systems in use today fall in this category.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">3. Theory of Mind</h3>
            <p className="text-gray-700 mb-2"><strong>Behavior:</strong> Can understand human emotions, beliefs, intentions.</p>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> Not yet developed. Still a <strong>research goal</strong> in cognitive AI.</p>
            <p className="text-gray-700"><strong>Potential:</strong> Could enable AI to engage in real human-like interaction.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">4. Self-Aware AI</h3>
            <p className="text-gray-700 mb-2"><strong>Behavior:</strong> Has its own consciousness, self-awareness, and emotions.</p>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> Purely hypothetical and <strong>not yet possible</strong> with current technology.</p>
            <p className="text-gray-700"><strong>Risk:</strong> Often tied to sci-fi concerns about AI autonomy and control.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="graduation">🎓</span> Summary Table
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capability-Based AI</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Functionality-Based AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-gray-700">Narrow AI</td>
                <td className="px-6 py-4 text-gray-700">Reactive Machines</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">General AI</td>
                <td className="px-6 py-4 text-gray-700">Limited Memory</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">Super AI</td>
                <td className="px-6 py-4 text-gray-700">Theory of Mind / Self-Aware AI</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
};

export default TypesOfAI; 