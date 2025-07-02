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

const DLNNPage: React.FC = () => {
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
        page_name: 'dlnn',
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
        <span role="img" aria-label="neural">🧠</span> Deep Learning & Neural Networks
      </h1>

      <p className="text-gray-700 mb-8">
        Deep Learning is a subset of machine learning that uses <strong>neural networks with multiple layers</strong> to model and understand complex patterns in data, inspired by the human brain.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="checkmark">✅</span> What are Neural Networks?
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-700 mb-4">
            <strong>Neural Networks</strong> are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information through weighted connections.
          </p>
          <h3 className="text-lg font-semibold mb-2">Key Components:</h3>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            <li><strong>Neurons:</strong> Basic processing units</li>
            <li><strong>Weights:</strong> Connection strengths between neurons</li>
            <li><strong>Layers:</strong> Input, hidden, and output layers</li>
            <li><strong>Activation Functions:</strong> Determine neuron output</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="layers">🏗️</span> Types of Neural Networks
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">1. Feedforward Neural Networks</h3>
            <p className="text-gray-700 mb-2"><strong>Structure:</strong> Information flows in one direction from input to output.</p>
            <p className="text-gray-700 mb-2"><strong>Use Cases:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Simple classification tasks</li>
              <li>Regression problems</li>
              <li>Basic pattern recognition</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">2. Convolutional Neural Networks (CNNs)</h3>
            <p className="text-gray-700 mb-2"><strong>Specialty:</strong> Excellent for image and visual data processing.</p>
            <p className="text-gray-700 mb-2"><strong>Applications:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Image classification</li>
              <li>Object detection</li>
              <li>Medical image analysis</li>
              <li>Computer vision</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">3. Recurrent Neural Networks (RNNs)</h3>
            <p className="text-gray-700 mb-2"><strong>Specialty:</strong> Handle sequential data with memory capabilities.</p>
            <p className="text-gray-700 mb-2"><strong>Applications:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Natural language processing</li>
              <li>Speech recognition</li>
              <li>Time series prediction</li>
              <li>Machine translation</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">4. Transformer Networks</h3>
            <p className="text-gray-700 mb-2"><strong>Innovation:</strong> Attention mechanisms for better context understanding.</p>
            <p className="text-gray-700 mb-2"><strong>Famous Examples:</strong></p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>GPT (ChatGPT)</li>
              <li>BERT</li>
              <li>T5</li>
              <li>Vision Transformers</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="deep">🔍</span> Deep Learning vs Traditional ML
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aspect</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Traditional ML</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Deep Learning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-gray-700 font-medium">Data Requirements</td>
                <td className="px-6 py-4 text-gray-700">Works with small datasets</td>
                <td className="px-6 py-4 text-gray-700">Requires large datasets</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 font-medium">Feature Engineering</td>
                <td className="px-6 py-4 text-gray-700">Manual feature selection</td>
                <td className="px-6 py-4 text-gray-700">Automatic feature extraction</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 font-medium">Computational Power</td>
                <td className="px-6 py-4 text-gray-700">CPU sufficient</td>
                <td className="px-6 py-4 text-gray-700">Requires GPU/TPU</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-700 font-medium">Interpretability</td>
                <td className="px-6 py-4 text-gray-700">More interpretable</td>
                <td className="px-6 py-4 text-gray-700">Black box (less interpretable)</td>
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
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Computer Vision</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Autonomous vehicles</li>
              <li>Medical imaging</li>
              <li>Facial recognition</li>
              <li>Quality control</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Natural Language Processing</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>ChatGPT and language models</li>
              <li>Machine translation</li>
              <li>Sentiment analysis</li>
              <li>Text summarization</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">Healthcare</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Drug discovery</li>
              <li>Disease diagnosis</li>
              <li>Personalized medicine</li>
              <li>Medical imaging analysis</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Entertainment</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Content recommendation</li>
              <li>Game AI</li>
              <li>Music generation</li>
              <li>Video enhancement</li>
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

export default DLNNPage; 