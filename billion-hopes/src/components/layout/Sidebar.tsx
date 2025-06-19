import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  title: string;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'AI Explained',
    items: [
      { title: 'Types of AI', path: '/ai-explained/types' },
      { title: 'ML', path: '/ai-explained/ml' },
      { title: 'DL & NNs', path: '/ai-explained/dl-nn' },
      { title: 'Agents', path: '/ai-explained/agents' },
      { title: 'RL', path: '/ai-explained/rl' },
      { title: 'Robotics', path: '/ai-explained/robotics' },
      { title: 'AI in Industry', path: '/ai-explained/industry' },
      { title: 'Ethics & Governance', path: '/ai-explained/ethics' },
      { title: 'YT Lectures', path: '/ai-explained/lectures' },
      { title: 'Resources', path: '/ai-explained/resources' },
    ],
  },
  {
    title: 'Solutions',
    items: [
      { title: 'Enroll in Courses', path: '/solutions/courses' },
      { title: 'Great Game AI', path: '/solutions/game-ai' },
      { title: 'National AI Roadmap', path: '/solutions/roadmap' },
    ],
  },
  {
    title: 'Trends',
    items: [
      { title: 'News', path: '/trends/news' },
      { title: 'Debates', path: '/trends/debates' },
      { title: 'Innovations', path: '/trends/innovations' },
      { title: 'AI in Industry', path: '/trends/industry' },
      { title: 'Resources', path: '/trends/resources' },
    ],
  },
  {
    title: 'Data Lab',
    items: [
      { title: 'Learn About Data', path: '/data-lab/learn' },
      { title: 'Datasets', path: '/data-lab/datasets' },
      { title: 'Sources', path: '/data-lab/sources' },
    ],
  },
  {
    title: 'AGI',
    items: [
      { title: 'What is AGI', path: '/agi/what-is-agi' },
      { title: 'Brain & AI', path: '/agi/brain-ai' },
      { title: 'Future of Intelligence', path: '/agi/future' },
    ],
  },
  {
    title: 'AI Resources',
    items: [
      { title: 'Books', path: '/resources/books' },
      { title: 'Papers', path: '/resources/papers' },
      { title: 'Lectures', path: '/resources/lectures' },
      { title: 'OGs', path: '/resources/ogs' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-24 overflow-y-auto">
      <nav className="p-4 flex flex-col min-h-[calc(100vh-6rem)]">
        <div className="flex-grow">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2"
              >
                <span>{section.title}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 transform transition-transform ${
                    openSection === section.title ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openSection === section.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="pl-4 space-y-2 mt-2">
                      {section.items.map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className="block text-gray-600 hover:text-blue-600 py-1"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <Link
          to="/feedback"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-3 px-4 mt-4 rounded-lg hover:bg-gray-50 transition-colors border-t border-gray-200"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
          <span>Share Feedback</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar; 