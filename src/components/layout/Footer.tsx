import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSelector from '../ThemeSelector';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Website Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Website</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/ai-explained" className="hover:text-white transition-colors">
                  AI Explained
                </Link>
              </li>
              <li>
                <Link to="/types-of-ai" className="hover:text-white transition-colors">
                  Types of AI
                </Link>
              </li>
              <li>
                <Link to="/trends" className="hover:text-white transition-colors">
                  AI Trends
                </Link>
              </li>
              <li>
                <Link to="/data-lab" className="hover:text-white transition-colors">
                  Data Lab
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-white transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-white transition-colors">
                  Research Papers
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="hover:text-white transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/agi" className="hover:text-white transition-colors">
                  AGI Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Social</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://github.com/abcdcorporation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/abcdcorporation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/abcdcorporation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/abcdcorporation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="https://youtube.com/@abcdcorporation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/abcdcorporation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                © 2024 ABCD CORPORATION. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Theme Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 dark:text-gray-500">Theme:</span>
                <ThemeSelector />
              </div>
              
              {/* Links */}
              <div className="flex space-x-6 text-sm">
                <Link to="/privacy" className="hover:text-white dark:hover:text-gray-200 transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="hover:text-white dark:hover:text-gray-200 transition-colors">
                  Terms
                </Link>
                <Link to="/cookies" className="hover:text-white dark:hover:text-gray-200 transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 