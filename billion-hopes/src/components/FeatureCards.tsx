import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  image: string;
  path: string;
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
  icon?: string;
}

interface CategorySection {
  title: string;
  cards: FeatureCard[];
  isOpen: boolean;
  color: string;
  description: string;
}

const FeatureCards: React.FC = () => {
  const [sections, setSections] = useState<CategorySection[]>([
    {
      title: "🏠 Core Pages",
      isOpen: true,
      color: "from-blue-500 to-purple-600",
      description: "Essential pages for getting started with your AI journey",
      cards: [
        {
          id: "home",
          title: "Home",
          description: "Welcome to Billion Hopes - Your AI learning journey starts here",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/",
          category: "core",
          isPopular: true,
          icon: "🏠"
        },
        {
          id: "courses",
          title: "Explore Courses",
          description: "Discover our comprehensive AI course library worth ₹1,25,976",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/courses",
          category: "core",
          isPopular: true,
          icon: "📚"
        },
        {
          id: "feedback",
          title: "Feedback",
          description: "Share your thoughts and help us improve our platform",
          image: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/feedback",
          category: "core",
          icon: "💬"
        }
      ]
    },
    {
      title: "🎓 Learning Hub",
      isOpen: true,
      color: "from-green-500 to-blue-600",
      description: "Educational content and AI knowledge resources",
      cards: [
        {
          id: "ai-explained",
          title: "AI Explained",
          description: "Understanding artificial intelligence fundamentals and concepts",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/ai-explained",
          category: "learning",
          icon: "🤖"
        },
        {
          id: "types-of-ai",
          title: "Types of AI",
          description: "Explore different categories of artificial intelligence systems",
          image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/ai-explained/types",
          category: "learning",
          isNew: true,
          icon: "🔬"
        },
        {
          id: "agi",
          title: "AGI Research",
          description: "Artificial General Intelligence and future possibilities",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/agi",
          category: "learning",
          icon: "🧠"
        }
      ]
    },
    {
      title: "🚀 Solutions & Trends",
      isOpen: false,
      color: "from-purple-500 to-pink-600",
      description: "Cutting-edge AI applications and industry insights",
      cards: [
        {
          id: "solutions",
          title: "AI Solutions",
          description: "Real-world applications and industry solutions powered by AI",
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/solutions",
          category: "solutions",
          icon: "⚙️"
        },
        {
          id: "trends",
          title: "Latest Trends",
          description: "Stay updated with cutting-edge AI developments and innovations",
          image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/trends",
          category: "solutions",
          isNew: true,
          icon: "📈"
        },
        {
          id: "data-lab",
          title: "Data Lab",
          description: "Experimental data science and AI research playground",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/data-lab",
          category: "solutions",
          icon: "🔬"
        }
      ]
    },
    {
      title: "👥 Members Area",
      isOpen: false,
      color: "from-orange-500 to-red-600",
      description: "Exclusive access for course purchasers and premium members",
      cards: [
        {
          id: "members-login",
          title: "Members Login",
          description: "Access your premium course library and exclusive content",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/members-login",
          category: "members",
          isPopular: true,
          icon: "🔐"
        },
        {
          id: "members-dashboard",
          title: "Members Dashboard",
          description: "Your personalized learning dashboard with progress tracking",
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/members-dashboard",
          category: "members",
          icon: "📊"
        }
      ]
    },
    {
      title: "📞 Support & Resources",
      isOpen: false,
      color: "from-teal-500 to-cyan-600",
      description: "Help center and educational resources for learners",
      cards: [
        {
          id: "resources",
          title: "AI Resources",
          description: "Curated collection of AI tools, papers, and learning materials",
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/resources",
          category: "support",
          icon: "📖"
        },
        {
          id: "contact",
          title: "Contact Us",
          description: "Get in touch with our team for support and inquiries",
          image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          path: "/contact",
          category: "support",
          icon: "📧"
        }
      ]
    }
  ]);

  const toggleSection = (index: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  const expandAll = () => {
    setSections(prev => prev.map(section => ({ ...section, isOpen: true })));
  };

  const collapseAll = () => {
    setSections(prev => prev.map(section => ({ ...section, isOpen: false })));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          🌟 Explore Our Platform
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Discover all the amazing features and sections available in your AI learning journey
        </p>
        
        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={expandAll}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            <span>🔽</span> Expand All
          </button>
          <button
            onClick={collapseAll}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            <span>🔼</span> Collapse All
          </button>
        </div>
      </div>

      {/* Collapsible Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={section.title} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(sectionIndex)}
            className={`w-full px-6 py-5 bg-gradient-to-r ${section.color} text-white transition-all duration-300 flex items-center justify-between group hover:shadow-lg`}
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-1">
                {section.title}
              </h3>
              <p className="text-white/90 text-sm">{section.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {section.cards.length} items
              </span>
              {section.isOpen ? (
                <svg className="w-5 h-5 transform transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 transform transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </button>

          {/* Cards Grid - Collapsible */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            section.isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gradient-to-br from-gray-50 to-white">
              {section.cards.map((card) => (
                <Link
                  key={card.id}
                  to={card.path}
                  className="group block"
                >
                  <div className="bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover:scale-105">
                    {/* Card Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Icon Overlay */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {card.icon}
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex space-x-2">
                        {card.isNew && (
                          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse shadow-lg">
                            ✨ NEW
                          </span>
                        )}
                        {card.isPopular && (
                          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                            🔥 POPULAR
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {card.description}
                      </p>
                      
                      {/* Action Section */}
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                          Explore {card.icon}
                        </span>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 transform group-hover:rotate-12">
                          <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Stats Footer */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center shadow-xl">
        <h3 className="text-2xl font-bold mb-6">Platform Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {sections.reduce((total, section) => total + section.cards.length, 0)}
            </div>
            <div className="text-blue-100">Total Features</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{sections.length}</div>
            <div className="text-blue-100">Categories</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {sections.reduce((count, section) => 
                count + section.cards.filter(card => card.isNew || card.isPopular).length, 0
              )}
            </div>
            <div className="text-blue-100">Featured Items</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">20</div>
            <div className="text-blue-100">AI Courses</div>
          </div>
        </div>
        <div className="mt-6 text-blue-100">
          🚀 Your complete AI learning platform with everything you need to succeed!
        </div>
      </div>
    </div>
  );
};

export default FeatureCards; 