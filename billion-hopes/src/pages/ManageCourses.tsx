import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../utils/supabase';

interface Course {
  id: number;
  name: string;
  description: string;
  fees: number;
  duration: string;
  level: string;
  video_link?: string;
  category?: string;
  prerequisites?: string;
  learning_outcomes?: string;
  instructor: string;
  language: string;
  certificate_included: boolean;
  max_students?: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

const ManageCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setCourses(data || []);
    } catch (err: any) {
      console.error('Error loading courses:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setDeleteLoading(true);

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete.id);

      if (error) {
        throw new Error(error.message);
      }

      // Remove course from local state
      setCourses(prev => prev.filter(course => course.id !== courseToDelete.id));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err: any) {
      console.error('Error deleting course:', err);
      alert(`Failed to delete course: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const handleEditCourse = (course: Course) => {
    // Navigate to edit course page (you can implement this later)
    alert(`Edit functionality for "${course.name}" - Coming soon!`);
  };

  const confirmDelete = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      archived: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatPrerequisites = (prerequisites?: string) => {
    if (!prerequisites) return 'None';
    return prerequisites.split('|').filter(p => p.trim()).join(', ');
  };

  const formatLearningOutcomes = (outcomes?: string): string[] => {
    if (!outcomes) return [];
    return outcomes.split('|').filter(o => o.trim());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Courses</h1>
            <p className="text-gray-600">View, edit, and manage all your courses</p>
          </div>
          <button
            onClick={() => navigate('/add-course')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Course
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={loadCourses}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first course</p>
          <button
            onClick={() => navigate('/add-course')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                          <div className="text-sm text-gray-500">{course.level} • {course.language}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.instructor}</div>
                      <div className="text-sm text-gray-500">{course.category || 'Uncategorized'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{course.fees.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.duration}</div>
                      {course.max_students && (
                        <div className="text-sm text-gray-500">Max: {course.max_students} students</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(course)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Course"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(course)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Course"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Instructor:</span>
                    <span className="ml-2">{selectedCourse.instructor}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Price:</span>
                    <span className="ml-2">₹{selectedCourse.fees.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2">{selectedCourse.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Level:</span>
                    <span className="ml-2">{selectedCourse.level}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Language:</span>
                    <span className="ml-2">{selectedCourse.language}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2">{selectedCourse.category || 'Uncategorized'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedCourse.status)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Certificate:</span>
                    <span className="ml-2">{selectedCourse.certificate_included ? 'Included' : 'Not included'}</span>
                  </div>
                  {selectedCourse.max_students && (
                    <div>
                      <span className="font-medium text-gray-700">Max Students:</span>
                      <span className="ml-2">{selectedCourse.max_students}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <span className="ml-2">{new Date(selectedCourse.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Updated:</span>
                    <span className="ml-2">{new Date(selectedCourse.updated_at).toLocaleDateString()}</span>
                  </div>
                  {selectedCourse.video_link && (
                    <div>
                      <span className="font-medium text-gray-700">Video Link:</span>
                      <a 
                        href={selectedCourse.video_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 underline"
                      >
                        View Video
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
              <p className="text-gray-700">{formatPrerequisites(selectedCourse.prerequisites)}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              {formatLearningOutcomes(selectedCourse.learning_outcomes).length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {formatLearningOutcomes(selectedCourse.learning_outcomes).map((outcome: string, index: number) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">None specified</p>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center mb-4">
              <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Delete Course</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{courseToDelete.name}"? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleDeleteCourse}
                disabled={deleteLoading}
                className={`flex-1 bg-red-600 text-white py-2 px-4 rounded-lg transition-colors ${
                  deleteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Course'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageCourses; 