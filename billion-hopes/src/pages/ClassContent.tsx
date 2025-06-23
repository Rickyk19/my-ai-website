import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  PlusIcon,
  StarIcon,
  PaperAirplaneIcon,
  HeartIcon,
  ArrowUturnLeftIcon,
  EllipsisVerticalIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

interface ClassData {
  id: number;
  course_id: number;
  class_number: number;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  pdf_materials?: string[];
  learning_objectives: string[];
  prerequisites?: string[];
}

interface Comment {
  id: number;
  user_name: string;
  user_email: string;
  comment: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
  isLiked: boolean;
}

interface Reply {
  id: number;
  user_name: string;
  comment: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

const ClassContent: React.FC = () => {
  const { courseId, classNumber } = useParams<{ courseId: string; classNumber: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [rating, setRating] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    loadClassData();
    loadComments();
  }, [courseId, classNumber]);

  const loadClassData = () => {
    // Mock class data - in production, this would come from your API
    const mockClassData: ClassData = {
      id: parseInt(classNumber || '1'),
      course_id: parseInt(courseId || '1'),
      class_number: parseInt(classNumber || '1'),
      title: 'Python Basics & Setup',
      description: 'Introduction to Python programming and development environment setup. Learn how to install Python, set up your IDE, and write your first Python program.',
      video_url: 'https://www.youtube.com/watch?v=H7wd6JmTd18',
      duration_minutes: 45,
      pdf_materials: [
        'Python Installation Guide.pdf',
        'IDE Setup Instructions.pdf',
        'Class 1 Exercises.pdf',
        'Additional Resources.pdf'
      ],
      learning_objectives: [
        'Install Python on your computer',
        'Set up a development environment',
        'Understand Python syntax basics',
        'Write and run your first Python program',
        'Use variables and basic data types'
      ],
      prerequisites: [
        'Basic computer literacy',
        'No prior programming experience required'
      ]
    };

    setClassData(mockClassData);
  };

  const loadComments = () => {
    // Mock comments data
    const mockComments: Comment[] = [
      {
        id: 1,
        user_name: 'Priya Sharma',
        user_email: 'priya@example.com',
        comment: 'Excellent explanation! The step-by-step installation guide was very helpful. I was able to set up everything without any issues.',
        timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: 1,
            user_name: 'Dr. Sarah Johnson',
            comment: 'Thank you Priya! I\'m glad the setup guide worked well for you. Feel free to ask if you have any questions.',
            timestamp: new Date(Date.now() - 1 * 3600000), // 1 hour ago
            likes: 2,
            isLiked: false
          }
        ]
      },
      {
        id: 2,
        user_name: 'Rahul Kumar',
        user_email: 'rahul@example.com',
        comment: 'I had trouble with the IDE setup on Mac. Could you provide more details about the macOS installation process?',
        timestamp: new Date(Date.now() - 4 * 3600000), // 4 hours ago
        likes: 3,
        isLiked: true,
        replies: [
          {
            id: 2,
            user_name: 'Anita Patel',
            comment: 'I had the same issue! Here\'s what worked for me: make sure you have Xcode command line tools installed first.',
            timestamp: new Date(Date.now() - 3 * 3600000), // 3 hours ago
            likes: 4,
            isLiked: false
          }
        ]
      },
      {
        id: 3,
        user_name: 'Sneha Reddy',
        user_email: 'sneha@example.com',
        comment: 'The video quality is excellent and the pace is perfect for beginners. Looking forward to the next class!',
        timestamp: new Date(Date.now() - 6 * 3600000), // 6 hours ago
        likes: 8,
        isLiked: false,
        replies: []
      }
    ];

    setComments(mockComments);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      user_name: 'John Doe', // Current user
      user_email: 'student@example.com',
      comment: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim()) return;

    const reply: Reply = {
      id: Date.now(),
      user_name: 'John Doe',
      comment: replyText,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));

    setReplyText('');
    setReplyingTo(null);
  };

  const toggleLike = (commentId: number, isReply: boolean = false, replyId?: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (isReply && replyId) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId
                ? { 
                    ...reply, 
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked 
                  }
                : reply
            )
          };
        } else {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
      }
      return comment;
    }));
  };

  const downloadPDF = (filename: string) => {
    // In production, this would download the actual PDF
    const link = document.createElement('a');
    link.href = `/pdfs/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading class content...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Course
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Class {classData.class_number}: {classData.title}
                </h1>
                <p className="text-gray-600">Complete Python Programming Masterclass</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-1" />
                {classData.duration_minutes} minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                {!isVideoPlaying ? (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="bg-white bg-opacity-20 rounded-full p-6 hover:bg-opacity-30 transition-all">
                      <PlayIcon className="h-16 w-16 text-white" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`${classData.video_url}?autoplay=1`}
                    title={classData.title}
                    frameBorder="0"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* Class Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Class</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{classData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🎯 Learning Objectives</h3>
                  <ul className="space-y-2">
                    {classData.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {classData.prerequisites && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">📋 Prerequisites</h3>
                    <ul className="space-y-2">
                      {classData.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-gray-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ChatBubbleLeftIcon className="h-6 w-6 mr-2" />
                Discussion ({comments.length})
              </h2>

              {/* Add New Comment */}
              <div className="mb-8">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">JD</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this class..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Rate this class:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="text-yellow-400 hover:text-yellow-500"
                            >
                              {star <= rating ? (
                                <StarSolidIcon className="h-5 w-5" />
                              ) : (
                                <StarIcon className="h-5 w-5" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6">
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {comment.user_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{comment.user_name}</h4>
                            <span className="text-sm text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.comment}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleLike(comment.id)}
                            className={`flex items-center space-x-1 transition-colors ${
                              comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            {comment.isLiked ? (
                              <HeartSolidIcon className="h-4 w-4" />
                            ) : (
                              <HeartIcon className="h-4 w-4" />
                            )}
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                            <span className="text-sm">Reply</span>
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pl-6 border-l-2 border-gray-200"
                          >
                            <div className="flex space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">JD</span>
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write a reply..."
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  rows={2}
                                />
                                <div className="mt-2 flex space-x-2">
                                  <button
                                    onClick={() => handleAddReply(comment.id)}
                                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                                  >
                                    Reply
                                  </button>
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {reply.user_name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-medium text-gray-900 text-sm">{reply.user_name}</h5>
                                    <span className="text-xs text-gray-500">{formatTimeAgo(reply.timestamp)}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm mb-2">{reply.comment}</p>
                                  <button
                                    onClick={() => toggleLike(comment.id, true, reply.id)}
                                    className={`flex items-center space-x-1 transition-colors ${
                                      reply.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                                    }`}
                                  >
                                    {reply.isLiked ? (
                                      <HeartSolidIcon className="h-3 w-3" />
                                    ) : (
                                      <HeartIcon className="h-3 w-3" />
                                    )}
                                    <span className="text-xs">{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* PDF Materials */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Class Materials
              </h3>
              <div className="space-y-3">
                {classData.pdf_materials?.map((material, index) => (
                  <button
                    key={index}
                    onClick={() => downloadPDF(material)}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center">
                      <DocumentArrowDownIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{material}</span>
                    </div>
                    <span className="text-xs text-gray-500">PDF</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/quiz/course/${courseId}/class/${classNumber}`)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
                  </svg>
                  Take Quiz
                </button>
                <button
                  onClick={() => navigate(`/members-dashboard`)}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Course Progress</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>✅ 3 classes completed</p>
                  <p>📚 9 classes remaining</p>
                  <p>⏱️ Estimated time left: 6.5 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassContent; 