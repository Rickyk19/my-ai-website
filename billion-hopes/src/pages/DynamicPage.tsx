import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageDisplay from '../components/PageDisplay';

interface PageData {
  id: number;
  title: string;
  path: string;
  content: string;
  image?: string;
  section: string;
  status: string;
  lastModified: string;
}

const DynamicPage: React.FC = () => {
  const { section, pageName } = useParams<{ section: string; pageName: string }>();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPageData();
  }, [section, pageName]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real application, this would fetch from a database
      // For now, we'll simulate some sample pages
      const samplePages: PageData[] = [
        {
          id: 1,
          title: 'Types of AI',
          path: '/ai-explained/types',
          content: `
            <h1>Understanding Different Types of Artificial Intelligence</h1>
            
            <p>Artificial Intelligence (AI) is a broad field with many different approaches and applications. Understanding the various types of AI helps us grasp the current capabilities and future potential of this transformative technology.</p>
            
            <h2>1. Narrow AI (Weak AI)</h2>
            <p><strong>Narrow AI</strong> refers to AI systems that are designed to perform specific tasks within a limited domain. These systems excel at their designated functions but cannot generalize beyond their programming.</p>
            
            <blockquote>
              <p>Examples include: Virtual assistants like Siri and Alexa, recommendation systems, image recognition software, and game-playing AI like chess programs.</p>
            </blockquote>
            
            <h3>Characteristics of Narrow AI:</h3>
            <ul>
              <li>Task-specific functionality</li>
              <li>Limited scope of operation</li>
              <li>Cannot adapt to new domains without reprogramming</li>
              <li>Currently the most common form of AI in use today</li>
            </ul>
            
            <h2>2. General AI (Strong AI)</h2>
            <p><strong>General AI</strong> represents AI systems with human-level cognitive abilities across all domains. This type of AI would be able to understand, learn, and apply knowledge flexibly across different situations.</p>
            
            <table>
              <tr>
                <th>Aspect</th>
                <th>Narrow AI</th>
                <th>General AI</th>
              </tr>
              <tr>
                <td>Scope</td>
                <td>Specific tasks</td>
                <td>All cognitive tasks</td>
              </tr>
              <tr>
                <td>Learning</td>
                <td>Domain-specific</td>
                <td>Cross-domain transfer</td>
              </tr>
              <tr>
                <td>Current Status</td>
                <td>Widely deployed</td>
                <td>Theoretical/Research stage</td>
              </tr>
            </table>
            
            <h2>3. Superintelligence</h2>
            <p><strong>Superintelligence</strong> refers to AI that surpasses human intelligence in all aspects, including creativity, general wisdom, and problem-solving capabilities.</p>
            
            <h3>Potential Implications:</h3>
            <ol>
              <li><em>Scientific breakthroughs</em> at unprecedented speeds</li>
              <li><em>Solutions to global challenges</em> like climate change and disease</li>
              <li><em>Fundamental changes</em> to human society and economics</li>
              <li><em>New ethical and safety considerations</em> requiring careful governance</li>
            </ol>
            
            <h2>Machine Learning Approaches</h2>
            <p>Different types of AI are often categorized by their learning approaches:</p>
            
            <h3>Supervised Learning</h3>
            <p>Learning from labeled training data to make predictions on new, unseen data.</p>
            
            <h3>Unsupervised Learning</h3>
            <p>Finding patterns and structures in data without explicit labels or targets.</p>
            
            <h3>Reinforcement Learning</h3>
            <p>Learning through interaction with an environment, using rewards and penalties to improve performance.</p>
            
            <h2>Conclusion</h2>
            <p>As AI continues to evolve, understanding these different types helps us appreciate both the current capabilities and future potential of artificial intelligence. While we currently live in the age of Narrow AI, research continues toward more general and capable AI systems.</p>
            
            <p><strong>The journey toward more advanced AI raises important questions about safety, ethics, and the role of AI in human society.</strong></p>
          `,
          section: 'AI Explained',
          status: 'published',
          lastModified: '2024-01-15'
        },
        {
          id: 2,
          title: 'Machine Learning Fundamentals',
          path: '/ai-explained/ml',
          content: `
            <h1>Machine Learning Fundamentals</h1>
            
            <p>Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed for every task.</p>
            
            <h2>What is Machine Learning?</h2>
            <p>Machine learning algorithms build mathematical models based on training data to make predictions or decisions without being explicitly programmed to perform specific tasks.</p>
            
            <blockquote>
              <p>"Machine learning is the field of study that gives computers the ability to learn without being explicitly programmed." - Arthur Samuel, 1959</p>
            </blockquote>
            
            <h2>Types of Machine Learning</h2>
            
            <h3>1. Supervised Learning</h3>
            <ul>
              <li><strong>Definition:</strong> Learning with labeled training data</li>
              <li><strong>Goal:</strong> Predict outcomes for new data</li>
              <li><strong>Examples:</strong> Email spam detection, medical diagnosis, stock price prediction</li>
            </ul>
            
            <h3>2. Unsupervised Learning</h3>
            <ul>
              <li><strong>Definition:</strong> Finding patterns in data without labels</li>
              <li><strong>Goal:</strong> Discover hidden structures</li>
              <li><strong>Examples:</strong> Customer segmentation, data compression, anomaly detection</li>
            </ul>
            
            <h3>3. Reinforcement Learning</h3>
            <ul>
              <li><strong>Definition:</strong> Learning through trial and error with rewards</li>
              <li><strong>Goal:</strong> Maximize cumulative reward</li>
              <li><strong>Examples:</strong> Game playing AI, robotics, autonomous vehicles</li>
            </ul>
            
            <h2>Key Concepts</h2>
            
            <h3>Training and Testing</h3>
            <p>ML models are trained on historical data and tested on new data to evaluate their performance.</p>
            
            <h3>Features and Labels</h3>
            <p><em>Features</em> are input variables used to make predictions, while <em>labels</em> are the target outcomes we want to predict.</p>
            
            <h3>Overfitting and Underfitting</h3>
            <p>Balancing model complexity to avoid memorizing training data (overfitting) or being too simple (underfitting).</p>
            
            <h2>Popular Algorithms</h2>
            
            <table>
              <tr>
                <th>Algorithm</th>
                <th>Type</th>
                <th>Use Case</th>
              </tr>
              <tr>
                <td>Linear Regression</td>
                <td>Supervised</td>
                <td>Predicting continuous values</td>
              </tr>
              <tr>
                <td>Decision Trees</td>
                <td>Supervised</td>
                <td>Classification and regression</td>
              </tr>
              <tr>
                <td>K-Means</td>
                <td>Unsupervised</td>
                <td>Clustering similar data points</td>
              </tr>
              <tr>
                <td>Neural Networks</td>
                <td>Supervised/Unsupervised</td>
                <td>Complex pattern recognition</td>
              </tr>
            </table>
            
            <h2>Applications in Real World</h2>
            <ol>
              <li><strong>Healthcare:</strong> Medical image analysis, drug discovery, personalized treatment</li>
              <li><strong>Finance:</strong> Fraud detection, algorithmic trading, credit scoring</li>
              <li><strong>Technology:</strong> Search engines, recommendation systems, voice assistants</li>
              <li><strong>Transportation:</strong> Autonomous vehicles, route optimization, predictive maintenance</li>
            </ol>
            
            <h2>Getting Started</h2>
            <p>To begin your machine learning journey:</p>
            <ul>
              <li>Learn programming (Python or R recommended)</li>
              <li>Understand statistics and mathematics</li>
              <li>Practice with real datasets</li>
              <li>Take online courses or join communities</li>
            </ul>
            
            <p><strong>Machine learning is transforming industries and creating new possibilities. Start your learning journey today!</strong></p>
          `,
          section: 'AI Explained',
          status: 'published',
          lastModified: '2024-01-14'
        }
      ];

      // Create path from section and pageName
      const currentPath = section && pageName ? `/${section}/${pageName}` : '';
      
      // Find page by path
      const page = samplePages.find(p => 
        p.path === currentPath || 
        p.path.toLowerCase().includes(pageName?.toLowerCase() || '') ||
        p.title.toLowerCase().includes(pageName?.toLowerCase() || '')
      );

      if (page) {
        setPageData(page);
      } else {
        // Create a default page structure for new pages
        setPageData({
          id: 0,
          title: formatPageTitle(pageName || section || 'Page'),
          path: currentPath,
          content: `
            <h1>${formatPageTitle(pageName || section || 'Page')}</h1>
            <p>Welcome to this page. Content will be added soon.</p>
            <p>This page is part of the <strong>${formatSectionTitle(section)}</strong> section.</p>
            <p><em>Check back later for more detailed information and resources.</em></p>
          `,
          section: formatSectionTitle(section) || 'General',
          status: 'draft',
          lastModified: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {
      setError('Failed to load page content');
      console.error('Error loading page:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPageTitle = (title: string): string => {
    return title
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatSectionTitle = (section?: string): string => {
    if (!section) return '';
    return section
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => navigate('/')}
          className="hover:text-blue-600 transition-colors"
        >
          Home
        </button>
        <span>›</span>
        <span className="text-blue-600">{pageData.section}</span>
        <span>›</span>
        <span className="text-gray-900 font-medium">{pageData.title}</span>
      </nav>

      {/* Page Status Badge */}
      {pageData.status !== 'published' && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {pageData.status.charAt(0).toUpperCase() + pageData.status.slice(1)}
          </span>
        </div>
      )}

      {/* Page Content */}
      <PageDisplay
        content={pageData.content}
        className="bg-white rounded-lg shadow-sm border p-8"
      />

      {/* Page Metadata */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex justify-between items-center">
          <span>Last updated: {pageData.lastModified}</span>
          <span>Section: {pageData.section}</span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default DynamicPage; 