import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  DocumentIcon, 
  VideoCameraIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../utils/supabase';

interface CourseFormData {
  name: string;
  description: string;
  fees: string;
  duration: string;
  level: string;
  videoLink: string;
  pdfFile: File | null;
  thumbnail: File | null;
  category: string;
  prerequisites: string[];
  learningOutcomes: string[];
  instructor: string;
  language: string;
  certificateIncluded: boolean;
  maxStudents: string;
  status: 'draft' | 'published' | 'archived';
}

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseFormData>({
    name: '',
    description: '',
    fees: '',
    duration: '',
    level: 'Beginner',
    videoLink: '',
    pdfFile: null,
    thumbnail: null,
    category: '',
    prerequisites: [''],
    learningOutcomes: [''],
    instructor: '',
    language: 'English',
    certificateIncluded: true,
    maxStudents: '',
    status: 'draft'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'All Levels'];
  const categories = ['AI Fundamentals', 'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'AI Ethics', 'Data Science', 'Robotics', 'Other'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Other'];

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: 'pdfFile' | 'thumbnail', file: File | null) => {
    setCourseData(prev => ({
      ...prev,
      [field]: file
    }));

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'pdfFile') {
          setPdfPreview(file.name);
        } else if (field === 'thumbnail') {
          setThumbnailPreview(e.target?.result as string);
        }
      };
      if (field === 'thumbnail') {
        reader.readAsDataURL(file);
      } else {
        setPdfPreview(file.name);
      }
    } else {
      if (field === 'pdfFile') {
        setPdfPreview('');
      } else if (field === 'thumbnail') {
        setThumbnailPreview('');
      }
    }
  };

  const addArrayItem = (field: 'prerequisites' | 'learningOutcomes') => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'prerequisites' | 'learningOutcomes', index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'prerequisites' | 'learningOutcomes', index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const validateForm = (): boolean => {
    if (!courseData.name.trim()) {
      setSubmitMessage({type: 'error', text: 'Course name is required'});
      return false;
    }
    if (!courseData.description.trim()) {
      setSubmitMessage({type: 'error', text: 'Course description is required'});
      return false;
    }
    if (!courseData.fees.trim() || isNaN(Number(courseData.fees))) {
      setSubmitMessage({type: 'error', text: 'Valid course fees are required'});
      return false;
    }
    if (!courseData.duration.trim()) {
      setSubmitMessage({type: 'error', text: 'Course duration is required'});
      return false;
    }
    if (!courseData.instructor.trim()) {
      setSubmitMessage({type: 'error', text: 'Instructor name is required'});
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Prepare course data for database
      const courseDataToSave = {
        name: courseData.name.trim(),
        description: courseData.description.trim(),
        fees: parseFloat(courseData.fees),
        duration: courseData.duration.trim(),
        level: courseData.level,
        video_link: courseData.videoLink.trim() || null,
        category: courseData.category || null,
        prerequisites: courseData.prerequisites.filter(p => p.trim()).join('|'),
        learning_outcomes: courseData.learningOutcomes.filter(o => o.trim()).join('|'),
        instructor: courseData.instructor.trim(),
        language: courseData.language,
        certificate_included: courseData.certificateIncluded,
        max_students: courseData.maxStudents ? parseInt(courseData.maxStudents) : null,
        status: courseData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Attempting to save course data:', courseDataToSave);

      // Insert course data into Supabase
      const { data, error } = await supabase
        .from('courses')
        .insert([courseDataToSave])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      console.log('Course saved successfully:', data);
      setSubmitMessage({type: 'success', text: `Course "${courseData.name}" created successfully! Course ID: ${data[0]?.id || 'Unknown'}`});
      
      // Reset form after successful submission
      setTimeout(() => {
        setCourseData({
          name: '',
          description: '',
          fees: '',
          duration: '',
          level: 'Beginner',
          videoLink: '',
          pdfFile: null,
          thumbnail: null,
          category: '',
          prerequisites: [''],
          learningOutcomes: [''],
          instructor: '',
          language: 'English',
          certificateIncluded: true,
          maxStudents: '',
          status: 'draft'
        });
        setPdfPreview('');
        setThumbnailPreview('');
        setSubmitMessage(null);
      }, 5000);

    } catch (error: any) {
      console.error('Error creating course:', error);
      setSubmitMessage({
        type: 'error', 
        text: `Failed to create course: ${error.message}. Please check the console for more details.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Course</h1>
        <p className="text-gray-600">Create a new paid course for your students</p>
      </div>

      {submitMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {submitMessage.type === 'success' ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
          {submitMessage.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Course Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                value={courseData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Advanced Machine Learning"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor Name *
              </label>
              <input
                type="text"
                value={courseData.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Dr. Sarah Johnson"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Fees (₹) *
              </label>
              <input
                type="number"
                value={courseData.fees}
                onChange={(e) => handleInputChange('fees', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2999"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                value={courseData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 12 weeks, 3 months, 40 hours"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={courseData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={courseData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={courseData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Students (Optional)
              </label>
              <input
                type="number"
                value={courseData.maxStudents}
                onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 100"
                min="1"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide a detailed description of the course content, what students will learn, and any special features..."
              required
            />
          </div>
        </div>

        {/* Course Materials */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentIcon className="h-6 w-6 text-green-600" />
            Course Materials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Link (YouTube/Vimeo)
              </label>
              <input
                type="url"
                value={courseData.videoLink}
                onChange={(e) => handleInputChange('videoLink', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('thumbnail', e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-32 h-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF Study Material
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload('pdfFile', e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {pdfPreview && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <DocumentIcon className="h-4 w-4" />
                <span>{pdfPreview}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
          
          {courseData.prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={prerequisite}
                onChange={(e) => updateArrayItem('prerequisites', index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Basic Python knowledge"
              />
              {courseData.prerequisites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('prerequisites', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('prerequisites')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add prerequisite
          </button>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Outcomes</h2>
          
          {courseData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => updateArrayItem('learningOutcomes', index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Build and deploy machine learning models"
              />
              {courseData.learningOutcomes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('learningOutcomes', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('learningOutcomes')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add learning outcome
          </button>
        </div>

        {/* Additional Settings */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={courseData.certificateIncluded}
                  onChange={(e) => handleInputChange('certificateIncluded', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Certificate included
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={courseData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published' | 'archived')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors ${
              isSubmitting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Creating Course...' : 'Create Course'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddCourse; 