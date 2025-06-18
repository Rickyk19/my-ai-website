import React from 'react';
import { motion } from 'framer-motion';
import { initializePayment, isPurchased } from '../utils/payment';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  image: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "AI Fundamentals Masterclass",
    description: "Master the basics of artificial intelligence, including machine learning, neural networks, and deep learning concepts.",
    price: 199.99,
    duration: "12 weeks",
    level: "Beginner",
    image: "/course-ai-basics.jpg"
  },
  {
    id: 2,
    title: "Deep Learning Specialization",
    description: "Advanced deep learning techniques, neural network architectures, and practical implementation using PyTorch.",
    price: 299.99,
    duration: "16 weeks",
    level: "Advanced",
    image: "/course-deep-learning.jpg"
  },
  {
    id: 3,
    title: "Natural Language Processing",
    description: "Learn to build and train models that can understand, analyze, and generate human language.",
    price: 249.99,
    duration: "14 weeks",
    level: "Intermediate",
    image: "/course-nlp.jpg"
  },
  {
    id: 4,
    title: "Computer Vision Expert",
    description: "Master image processing, object detection, and visual recognition using modern AI techniques.",
    price: 279.99,
    duration: "15 weeks",
    level: "Advanced",
    image: "/course-cv.jpg"
  },
  {
    id: 5,
    title: "AI Ethics & Governance",
    description: "Understanding ethical implications, bias in AI, and responsible AI development practices.",
    price: 149.99,
    duration: "8 weeks",
    level: "All Levels",
    image: "/course-ethics.jpg"
  },
  {
    id: 6,
    title: "Reinforcement Learning",
    description: "Learn to train agents that can make decisions and improve from experience using modern RL algorithms.",
    price: 259.99,
    duration: "14 weeks",
    level: "Intermediate",
    image: "/course-rl.jpg"
  }
];

const Courses: React.FC = () => {
  const handlePurchase = (course: Course) => {
    if (isPurchased(course.id)) {
      window.location.href = `/course/${course.id}`;
      return;
    }

    initializePayment({
      courseId: course.id,
      amount: course.price,
      courseName: course.title,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Courses</h1>
      <p className="text-xl text-gray-600 mb-12">
        Transform your career with our comprehensive AI courses. Learn from industry experts and get hands-on experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 bg-blue-100">
              {/* Course image placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                <span className="text-white text-xl font-semibold">{course.title.split(' ')[0]}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                <span className="text-2xl font-bold text-blue-600">₹{Math.round(course.price * 82)}</span>
              </div>
              <div className="flex gap-4 mb-4">
                <span className="text-sm text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                </span>
                <span className="text-sm text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {course.level}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <button 
                className={`w-full ${
                  isPurchased(course.id)
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-3 px-6 rounded-lg font-semibold transition-colors`}
                onClick={() => handlePurchase(course)}
              >
                {isPurchased(course.id) ? 'Access Course' : 'Buy Now'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Courses; 