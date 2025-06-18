import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isPurchased } from '../utils/payment';

const CourseContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = parseInt(id || '0');

  useEffect(() => {
    // Redirect if course is not purchased
    if (!isPurchased(courseId)) {
      navigate('/courses');
    }
  }, [courseId, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Content</h1>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Welcome to Your Course!</h2>
            <p className="text-gray-600">
              Congratulations on your purchase! You now have access to all course materials.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Modules:</h3>
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((module) => (
                <div key={module} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Module {module}</h4>
                  <p className="text-gray-600 text-sm">Content coming soon...</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-blue-600">
              <li>
                <a href="#" className="hover:underline">📚 Course Materials</a>
              </li>
              <li>
                <a href="#" className="hover:underline">📝 Assignment Guidelines</a>
              </li>
              <li>
                <a href="#" className="hover:underline">💬 Discussion Forum</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseContent; 