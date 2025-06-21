import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Recommendation {
  id: string;
  type: 'course' | 'article' | 'video' | 'quiz' | 'project';
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  enrollments: number;
  tags: string[];
  reason: string;
  confidence: number;
  price?: string;
  instructor?: string;
}

interface UserPreferences {
  interests: string[];
  currentLevel: string;
  learningGoals: string[];
  preferredContentTypes: string[];
  timeAvailable: string;
}

const SmartRecommendations: React.FC = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    interests: ['machine-learning', 'neural-networks'],
    currentLevel: 'intermediate',
    learningGoals: ['career-change', 'skill-improvement'],
    preferredContentTypes: ['courses', 'hands-on-projects'],
    timeAvailable: '5-10-hours'
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  const mockRecommendations: Recommendation[] = [
    {
      id: 'rec-1',
      type: 'course',
      title: 'Advanced Neural Networks with PyTorch',
      description: 'Master deep learning concepts and build sophisticated neural networks using PyTorch framework.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Deep Learning',
      difficulty: 'advanced',
      duration: '8 weeks',
      rating: 4.8,
      enrollments: 12500,
      tags: ['pytorch', 'neural-networks', 'deep-learning'],
      reason: 'Based on your interest in neural networks and intermediate level',
      confidence: 95,
      price: '$129',
      instructor: 'Dr. Sarah Chen'
    },
    {
      id: 'rec-2',
      type: 'project',
      title: 'Build an AI Chatbot from Scratch',
      description: 'Create a conversational AI using natural language processing and machine learning techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Natural Language Processing',
      difficulty: 'intermediate',
      duration: '2 weeks',
      rating: 4.6,
      enrollments: 8200,
      tags: ['nlp', 'chatbot', 'python'],
      reason: 'Perfect hands-on project matching your learning style',
      confidence: 88
    },
    {
      id: 'rec-3',
      type: 'quiz',
      title: 'Machine Learning Fundamentals Assessment',
      description: 'Test your understanding of core ML concepts including supervised and unsupervised learning.',
      thumbnail: 'https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Machine Learning',
      difficulty: 'intermediate',
      duration: '30 mins',
      rating: 4.4,
      enrollments: 15600,
      tags: ['assessment', 'machine-learning', 'fundamentals'],
      reason: 'Recommended to validate your current ML knowledge',
      confidence: 82
    },
    {
      id: 'rec-4',
      type: 'video',
      title: 'Computer Vision Applications in Healthcare',
      description: 'Explore how AI is revolutionizing medical imaging and diagnostic processes.',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Computer Vision',
      difficulty: 'intermediate',
      duration: '45 mins',
      rating: 4.7,
      enrollments: 9800,
      tags: ['computer-vision', 'healthcare', 'applications'],
      reason: 'Trending topic in your interest areas',
      confidence: 76
    },
    {
      id: 'rec-5',
      type: 'article',
      title: 'The Future of Artificial General Intelligence',
      description: 'Deep dive into AGI research, challenges, and potential breakthrough technologies.',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'AI Research',
      difficulty: 'advanced',
      duration: '15 mins',
      rating: 4.5,
      enrollments: 6400,
      tags: ['agi', 'research', 'future-tech'],
      reason: 'Aligns with your advanced learning goals',
      confidence: 79
    },
    {
      id: 'rec-6',
      type: 'course',
      title: 'Data Science for Business Decisions',
      description: 'Learn how to apply data science techniques to solve real business problems.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Data Science',
      difficulty: 'intermediate',
      duration: '6 weeks',
      rating: 4.6,
      enrollments: 11200,
      tags: ['data-science', 'business', 'analytics'],
      reason: 'Great for career transition goals',
      confidence: 85,
      price: '$99',
      instructor: 'Prof. Michael Rodriguez'
    }
  ];

  useEffect(() => {
    // Simulate AI-powered recommendation generation
    const generateRecommendations = () => {
      // Filter and sort based on user preferences
      let filtered = mockRecommendations.filter(rec => {
        const matchesLevel = rec.difficulty === userPreferences.currentLevel || 
                           (userPreferences.currentLevel === 'intermediate' && rec.difficulty === 'advanced');
        const matchesContentType = userPreferences.preferredContentTypes.some(type => 
          type.includes(rec.type) || rec.type === 'course'
        );
        return matchesLevel && matchesContentType;
      });

      // Sort by confidence score
      filtered.sort((a, b) => b.confidence - a.confidence);
      
      setRecommendations(filtered);
    };

    generateRecommendations();
  }, [userPreferences]);

  const filteredRecommendations = recommendations.filter(rec => 
    activeFilter === 'all' || rec.type === activeFilter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      case 'project': return '🚀';
      case 'quiz': return '🧠';
      case 'video': return '🎥';
      case 'article': return '📰';
      default: return '💡';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'from-blue-500 to-indigo-600';
      case 'project': return 'from-green-500 to-emerald-600';
      case 'quiz': return 'from-purple-500 to-pink-600';
      case 'video': return 'from-red-500 to-orange-600';
      case 'article': return 'from-yellow-500 to-amber-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              🎯 Smart Recommendations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered personalized learning recommendations tailored just for you!
            </p>
          </motion.div>
        </div>

        {/* User Preferences Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Learning Profile</h2>
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ⚙️ Update Preferences
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Current Level</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(userPreferences.currentLevel)}`}>
                {userPreferences.currentLevel}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-1">
                {userPreferences.interests.slice(0, 2).map((interest) => (
                  <span key={interest} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {interest.replace('-', ' ')}
                  </span>
                ))}
                {userPreferences.interests.length > 2 && (
                  <span className="text-xs text-gray-500">+{userPreferences.interests.length - 2} more</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Learning Goals</h3>
              <div className="flex flex-wrap gap-1">
                {userPreferences.learningGoals.slice(0, 2).map((goal) => (
                  <span key={goal} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {goal.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Time Available</h3>
              <span className="text-sm text-gray-600">{userPreferences.timeAvailable.replace('-', ' ')} per week</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['all', 'course', 'project', 'quiz', 'video', 'article'].map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getTypeIcon(filter)} {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}s
            </motion.button>
          ))}
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={rec.thumbnail}
                  alt={rec.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 left-4 w-10 h-10 rounded-lg bg-gradient-to-r ${getTypeColor(rec.type)} flex items-center justify-center`}>
                  <span className="text-white text-lg">{getTypeIcon(rec.type)}</span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full">
                  <span className={`text-sm font-semibold ${getConfidenceColor(rec.confidence)}`}>
                    {rec.confidence}% match
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">⏰ {rec.duration}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rec.description}</p>

                {/* Rating and Enrollments */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-medium text-gray-700 ml-1">{rec.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{rec.enrollments.toLocaleString()} enrolled</span>
                  </div>
                  {rec.price && (
                    <span className="text-lg font-bold text-blue-600">{rec.price}</span>
                  )}
                </div>

                {/* Recommendation Reason */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-purple-800">
                    <span className="font-medium">Why recommended:</span> {rec.reason}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {rec.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium">
                  {rec.type === 'course' ? 'Enroll Now' : 
                   rec.type === 'quiz' ? 'Take Quiz' :
                   rec.type === 'project' ? 'Start Project' :
                   rec.type === 'video' ? 'Watch Now' : 'Read Article'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">🤖 AI Insights</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Our AI analyzed your learning patterns, preferences, and goals to curate these personalized recommendations. 
            The more you learn, the smarter our suggestions become!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold">{recommendations.length}</div>
              <div className="text-purple-200">Recommendations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {Math.round(recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length)}%
              </div>
              <div className="text-purple-200">Avg. Match Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {recommendations.filter(rec => rec.confidence >= 85).length}
              </div>
              <div className="text-purple-200">High Confidence</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SmartRecommendations;