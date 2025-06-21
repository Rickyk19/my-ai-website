import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  AcademicCapIcon,
  StarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi! I'm your AI Assistant for Billion Hopes! I can help you with:\n\n🎓 Course information & pricing\n⭐ Student reviews & testimonials\n🚀 Website features & tools\n💡 Learning recommendations\n❓ Any questions about our platform\n\nWhat would you like to know?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "Tell me about AI courses",
        "What are the course prices?",
        "Show me student reviews",
        "What features do you offer?",
        "How do I access the Members Area?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Comprehensive knowledge base about the website
  const getAIResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();

    // Course Information
    if (message.includes('course') || message.includes('learn') || message.includes('ai') || message.includes('python') || message.includes('machine learning')) {
      return {
        text: "🎓 **Our AI Courses:**\n\n📚 **Complete Python Programming Masterclass**\n• Price: ₹4,999\n• Duration: 40+ hours\n• Level: Beginner to Advanced\n• Certificate included\n\n🤖 **AI Fundamentals Course**\n• Covers Machine Learning, Deep Learning\n• Neural Networks & Practical Applications\n• Expert instructors\n• Lifetime access\n\n🚀 **What You Get:**\n• Video lectures\n• PDF materials for each class\n• Interactive quizzes\n• Progress tracking\n• Student community access\n• Certificate of completion",
        suggestions: [
          "How do I purchase a course?",
          "What's included in Members Area?",
          "Tell me about instructors",
          "Show me student reviews"
        ]
      };
    }

    // Pricing Information
    if (message.includes('price') || message.includes('cost') || message.includes('fee') || message.includes('payment') || message.includes('₹')) {
      return {
        text: "💰 **Course Pricing:**\n\n🎯 **Complete Python Programming:** ₹4,999\n🤖 **AI Fundamentals:** ₹3,999\n🧠 **Machine Learning Mastery:** ₹5,999\n🚀 **Full AI Bundle:** ₹12,999 (Save 30%!)\n\n✅ **What's Included:**\n• One-time payment (No subscriptions!)\n• Lifetime access to content\n• All future updates included\n• Certificate upon completion\n• 24/7 access to Members Area\n• Download PDFs for offline study\n\n💳 **Payment Methods:**\n• Credit/Debit Cards\n• UPI\n• Net Banking\n• Digital Wallets",
        suggestions: [
          "How do I make payment?",
          "Is there any discount?",
          "What if I'm not satisfied?",
          "Tell me about refund policy"
        ]
      };
    }

    // Student Reviews
    if (message.includes('review') || message.includes('testimonial') || message.includes('rating') || message.includes('feedback') || message.includes('student')) {
      return {
        text: "⭐ **Student Reviews & Testimonials:**\n\n👨‍💻 **Rahul Sharma** - ⭐⭐⭐⭐⭐\n\"Excellent course! The AI concepts are explained so clearly. Got a job at TCS after completing this course!\"\n\n👩‍💼 **Priya Patel** - ⭐⭐⭐⭐⭐\n\"Best investment I made for my career. The Python course is comprehensive and practical.\"\n\n🎓 **Amit Kumar** - ⭐⭐⭐⭐⭐\n\"Amazing instructors and great support. The Members Area is fantastic with all resources.\"\n\n📊 **Overall Rating: 4.8/5**\n• 95% course completion rate\n• 90% students get job offers\n• 98% would recommend to friends\n\n💬 **Recent Feedback:**\n\"The AI Playground is incredible for hands-on practice!\"",
        suggestions: [
          "How many students enrolled?",
          "Success stories?",
          "What do students say about instructors?",
          "Any job placement assistance?"
        ]
      };
    }

    // Website Features
    if (message.includes('feature') || message.includes('tool') || message.includes('playground') || message.includes('quiz') || message.includes('tracker')) {
      return {
        text: "🚀 **Amazing Website Features:**\n\n🎮 **AI Playground**\n• Interactive AI tools\n• Text generator, Chatbot, Code generator\n• Hands-on practice environment\n\n🧠 **Smart Quizzes**\n• Multiple question types\n• Real-time scoring\n• Progress tracking\n• Difficulty levels\n\n📊 **Progress Tracker**\n• Level system (Beginner → Expert)\n• Achievement badges\n• Learning streaks\n• Course completion stats\n\n🤝 **Community Forum**\n• Connect with other students\n• Ask questions\n• Share projects\n\n💡 **Smart Recommendations**\n• AI-powered course suggestions\n• Personalized learning paths\n• Based on your progress",
        suggestions: [
          "How does AI Playground work?",
          "Tell me about quizzes",
          "What's in Members Area?",
          "Community features?"
        ]
      };
    }

    // Members Area
    if (message.includes('member') || message.includes('login') || message.includes('access') || message.includes('dashboard')) {
      return {
        text: "🔐 **Members Area - Your Learning Hub:**\n\n🎓 **After Purchase, You Get:**\n• Personal dashboard with all your courses\n• Video lectures for each class\n• Downloadable PDF materials\n• Interactive quizzes for every lesson\n• Progress tracking & certificates\n\n🚀 **How to Access:**\n1. Purchase any course\n2. Receive login credentials via email\n3. Go to Members Login\n4. Access your personal dashboard\n\n✨ **Members-Only Features:**\n• Progress Tracker with levels\n• Advanced quiz system\n• Course completion certificates\n• Priority support\n• Early access to new courses\n\n🔑 **Login:** Use the email you provided during purchase",
        suggestions: [
          "I forgot my login details",
          "How to download PDFs?",
          "Quiz system details",
          "Certificate information"
        ]
      };
    }

    // Technical Support
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue') || message.includes('error')) {
      return {
        text: "🛠️ **Technical Support & Help:**\n\n📧 **Contact Support:**\n• Email: support@billionhopes.com\n• Response time: Within 24 hours\n• Priority support for members\n\n❓ **Common Issues & Solutions:**\n\n🔐 **Login Problems:**\n• Check email for credentials\n• Try password reset\n• Clear browser cache\n\n📱 **Mobile Access:**\n• Website is fully mobile responsive\n• All features work on phones/tablets\n\n💻 **Video Playback:**\n• Ensure stable internet connection\n• Try different browser\n• Update browser to latest version\n\n📄 **PDF Downloads:**\n• Right-click and 'Save As'\n• Check download folder\n• Disable popup blockers",
        suggestions: [
          "Contact support directly",
          "Password reset help",
          "Mobile app available?",
          "System requirements"
        ]
      };
    }

    // Getting Started
    if (message.includes('start') || message.includes('begin') || message.includes('how') || message.includes('new')) {
      return {
        text: "🚀 **Getting Started with Billion Hopes:**\n\n**Step 1: Explore** 🔍\n• Browse our courses page\n• Check course details & pricing\n• Read student reviews\n\n**Step 2: Try Free Features** 🆓\n• AI Playground (no login required)\n• Sample quizzes\n• Course previews\n\n**Step 3: Purchase & Learn** 💳\n• Choose your course\n• Complete secure payment\n• Get instant access to Members Area\n\n**Step 4: Start Learning** 🎓\n• Watch video lectures\n• Download PDF materials\n• Take quizzes after each class\n• Track your progress\n\n🎯 **Pro Tip:** Start with our AI Playground to get a feel for our interactive learning approach!",
        suggestions: [
          "Show me course catalog",
          "What's the easiest course to start?",
          "Free trial available?",
          "How long to complete courses?"
        ]
      };
    }

    // Default response for general queries
    return {
      text: "🤖 I'm here to help you with everything about Billion Hopes!\n\nI can provide information about:\n\n🎓 **Courses & Pricing**\n⭐ **Student Reviews**\n🚀 **Website Features**\n🔐 **Members Area Access**\n🛠️ **Technical Support**\n💡 **Learning Guidance**\n\nWhat specific information would you like to know? Just ask me anything!",
      suggestions: [
        "Tell me about courses",
        "What are the prices?",
        "Show student reviews",
        "Website features",
        "How to get started?"
      ]
    };
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse.text,
        isBot: true,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <ChatBubbleLeftRightIcon className="h-8 w-8" />
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <SparklesIcon className="h-3 w-3 text-white" />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-sm text-blue-100">Billion Hopes Helper</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  }`}>
                    <div className="whitespace-pre-line text-sm">{message.text}</div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block w-full text-left p-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                          >
                            💡 {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Billion Hopes..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot; 