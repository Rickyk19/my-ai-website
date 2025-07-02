import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Comment {
  id: number;
  Name: string;
  Comment: string;
  created_at: string;
  likes?: number;
  hearts?: number;
  claps?: number;
}

interface Reactions {
  like: number;
  love: number;
  clap: number;
}

const RLPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', comments: '' });
  const [reactions, setReactions] = useState<Reactions>({ like: 0, love: 0, clap: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ 
    type: null, 
    message: '' 
  });

  useEffect(() => {
    loadComments();
  }, []);

  const handleReaction = (type: 'like' | 'love' | 'clap') => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const loadComments = async () => {
    try {
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/comments?select=*&page_name=eq.rl', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ'
        }
      });
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
  };

  const handleCommentReaction = async (commentId: number, reactionType: 'likes' | 'hearts' | 'claps') => {
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      const newValue = (comment[reactionType] || 0) + 1;

      await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/comments?id=eq.${commentId}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [reactionType]: newValue })
      });

      await loadComments();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.comments.trim()) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const requestBody = {
        Name: newComment.name,
        Comment: newComment.comments,
        page_name: 'rl',
        likes: 0,
        hearts: 0,
        claps: 0
      };

      await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/comments', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(requestBody)
      });

      setStatus({
        type: 'success',
        message: 'Comment posted successfully!'
      });
      setNewComment({ name: '', comments: '' });
      await loadComments();
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Failed to post comment: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 prose prose-lg prose-blue"
    >
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="robot">🤖</span> Reinforcement Learning (RL)
      </h1>

      <p className="text-gray-700 mb-8">
        Reinforcement Learning is a type of machine learning where an agent learns to make decisions by <strong>performing actions in an environment to maximize cumulative reward</strong> through trial and error.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="checkmark">✅</span> Key Components of RL
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">1. Agent</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> The learner or decision maker that interacts with the environment.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Game-playing AI (like AlphaGo)</li>
              <li>Trading algorithms</li>
              <li>Autonomous vehicle control systems</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">2. Environment</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> The world in which the agent operates and receives feedback.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Game boards (Chess, Go)</li>
              <li>Financial markets</li>
              <li>Physical world (for robots)</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">3. Actions & States</h3>
            <p className="text-gray-700 mb-2"><strong>Actions:</strong> Choices available to the agent.</p>
            <p className="text-gray-700 mb-2"><strong>States:</strong> Current situation of the environment.</p>
            <p className="text-gray-700 mb-2"><strong>Rewards:</strong> Feedback signals indicating action quality.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="algorithms">⚙️</span> Popular RL Algorithms
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Algorithm</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-gray-700">Q-Learning</td>
                <td className="px-6 py-4 text-gray-700">Model-free</td>
                <td className="px-6 py-4 text-gray-700">Discrete action spaces</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">Deep Q-Networks (DQN)</td>
                <td className="px-6 py-4 text-gray-700">Deep RL</td>
                <td className="px-6 py-4 text-gray-700">Complex state spaces</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">Policy Gradient</td>
                <td className="px-6 py-4 text-gray-700">Model-free</td>
                <td className="px-6 py-4 text-gray-700">Continuous actions</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">Actor-Critic</td>
                <td className="px-6 py-4 text-gray-700">Hybrid</td>
                <td className="px-6 py-4 text-gray-700">Stable training</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="applications">🚀</span> Real-World Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Gaming & Entertainment</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>AlphaGo (defeated world champion)</li>
              <li>OpenAI Five (Dota 2)</li>
              <li>Game AI development</li>
              <li>Procedural content generation</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Autonomous Systems</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Self-driving cars</li>
              <li>Drone navigation</li>
              <li>Robot control</li>
              <li>Warehouse automation</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">Finance & Trading</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Algorithmic trading</li>
              <li>Portfolio optimization</li>
              <li>Risk management</li>
              <li>Fraud detection</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Optimization</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Resource allocation</li>
              <li>Supply chain management</li>
              <li>Energy grid optimization</li>
              <li>Recommendation systems</li>
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

      {/* Comments Section */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="comments">💬</span> Comments
        </h2>
        
        {status.type && (
          <div
            className={`mb-4 p-3 rounded-md ${
              status.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={newComment.name}
              onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              id="comment"
              value={newComment.comments}
              onChange={(e) => setNewComment(prev => ({ ...prev, comments: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{comment.Name}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{comment.Comment}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleCommentReaction(comment.id, 'likes')}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                >
                  👍 {comment.likes || 0}
                </button>
                <button
                  onClick={() => handleCommentReaction(comment.id, 'hearts')}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                >
                  ❤️ {comment.hearts || 0}
                </button>
                <button
                  onClick={() => handleCommentReaction(comment.id, 'claps')}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
                >
                  👏 {comment.claps || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default RLPage; 