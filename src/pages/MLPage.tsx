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

const MLPage: React.FC = () => {
  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    clap: 0
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    name: '',
    comments: ''
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReaction = (type: 'like' | 'love' | 'clap') => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  // Load comments from Supabase
  const loadComments = async () => {
    try {
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/comments?order=created_at.desc', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleCommentReaction = async (commentId: number, reactionType: 'likes' | 'hearts' | 'claps') => {
    try {
      const currentComment = comments.find(c => c.id === commentId);
      if (!currentComment) return;

      const currentCount = currentComment[reactionType] || 0;
      const newCount = currentCount + 1;

      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, [reactionType]: newCount }
          : comment
      ));
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newComment.name.trim() || !newComment.comments.trim()) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const requestBody = {
        Name: newComment.name,
        Comment: newComment.comments,
        page_name: 'ml',
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
        <span role="img" aria-label="machine">🤖</span> Machine Learning (ML)
      </h1>

      <p className="text-gray-700 mb-8">
        Machine Learning is a subset of artificial intelligence that enables computers to <strong>learn and improve from experience</strong> without being explicitly programmed for every task.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="checkmark">✅</span> Types of Machine Learning
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">1. Supervised Learning</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> Learning with labeled training data.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Email spam detection</li>
              <li>Medical diagnosis</li>
              <li>Stock price prediction</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">2. Unsupervised Learning</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> Finding patterns in data without labels.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Customer segmentation</li>
              <li>Data compression</li>
              <li>Anomaly detection</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">3. Reinforcement Learning</h3>
            <p className="text-gray-700 mb-2"><strong>Definition:</strong> Learning through trial and error with rewards.</p>
            <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Game playing AI</li>
              <li>Autonomous vehicles</li>
              <li>Trading algorithms</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="algorithms">⚙️</span> Popular Algorithms
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
                <td className="px-6 py-4 text-gray-700">Linear Regression</td>
                <td className="px-6 py-4 text-gray-700">Supervised</td>
                <td className="px-6 py-4 text-gray-700">Predicting continuous values</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">Decision Trees</td>
                <td className="px-6 py-4 text-gray-700">Supervised</td>
                <td className="px-6 py-4 text-gray-700">Classification and regression</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">K-Means</td>
                <td className="px-6 py-4 text-gray-700">Unsupervised</td>
                <td className="px-6 py-4 text-gray-700">Clustering</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700">Neural Networks</td>
                <td className="px-6 py-4 text-gray-700">Both</td>
                <td className="px-6 py-4 text-gray-700">Complex pattern recognition</td>
              </tr>
            </tbody>
          </table>
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
            className={`px-4 py-2 rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{comment.Name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{comment.Comment}</p>
                
                <div className="flex gap-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleCommentReaction(comment.id, 'likes')}
                    className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-lg">👍</span>
                    <span className="text-gray-600">{comment.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => handleCommentReaction(comment.id, 'hearts')}
                    className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-pink-50 transition-colors text-sm"
                  >
                    <span className="text-lg">❤️</span>
                    <span className="text-gray-600">{comment.hearts || 0}</span>
                  </button>
                  <button
                    onClick={() => handleCommentReaction(comment.id, 'claps')}
                    className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-yellow-50 transition-colors text-sm"
                  >
                    <span className="text-lg">👏</span>
                    <span className="text-gray-600">{comment.claps || 0}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default MLPage; 
