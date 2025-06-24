import React, { useState, useEffect } from 'react';

interface Course {
  id: number;
  name: string;
  instructor: string;
}

interface CourseClass {
  id: number;
  course_id: number;
  class_number: number;
  title: string;
}

const DatabaseTest: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      setLoading(true);
      
      // Load all courses
      const coursesResponse = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=id,name,instructor&order=id', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      // Load all course classes
      const classesResponse = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/course_classes?select=*&order=course_id,class_number', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (coursesResponse.ok && classesResponse.ok) {
        const coursesData = await coursesResponse.json();
        const classesData = await classesResponse.json();
        
        setCourses(coursesData);
        setCourseClasses(classesData);
        
        console.log('🔍 DETAILED DATABASE ANALYSIS:');
        console.log(`📚 Total Courses: ${coursesData.length}`);
        console.log(`📖 Total Classes: ${classesData.length}`);
        
        // Analyze which courses have classes
        const coursesWithClasses = coursesData.filter((course: Course) => 
          classesData.some((cls: CourseClass) => cls.course_id === course.id)
        );
        
        const coursesWithoutClasses = coursesData.filter((course: Course) => 
          !classesData.some((cls: CourseClass) => cls.course_id === course.id)
        );
        
        console.log(`✅ Courses WITH classes: ${coursesWithClasses.length}`, coursesWithClasses);
        console.log(`❌ Courses WITHOUT classes: ${coursesWithoutClasses.length}`, coursesWithoutClasses);
        
        // Show class count per course
        coursesData.forEach((course: Course) => {
          const classCount = classesData.filter((cls: CourseClass) => cls.course_id === course.id).length;
          console.log(`Course ${course.id} (${course.name}): ${classCount} classes`);
        });
        
      } else {
        setError('Failed to load data from database');
      }
    } catch (err) {
      console.error('Database test error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = () => {
    console.log('🔄 FORCE REFRESHING DATABASE...');
    loadTestData();
  };

  const getClassCount = (courseId: number) => {
    return courseClasses.filter(cls => cls.course_id === courseId).length;
  };

  const coursesWithClasses = courses.filter(course => getClassCount(course.id) > 0);
  const coursesWithoutClasses = courses.filter(course => getClassCount(course.id) === 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading database analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">🔍 Database Analysis</h1>
            <button
              onClick={forceRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              🔄 Refresh Data
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{coursesWithClasses.length}</div>
              <div className="text-sm text-gray-600">Courses WITH Classes</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{coursesWithoutClasses.length}</div>
              <div className="text-sm text-gray-600">Courses WITHOUT Classes</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{courseClasses.length}</div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className={`text-lg font-semibold ${coursesWithClasses.length >= 20 ? 'text-green-600' : 'text-red-600'}`}>
              {coursesWithClasses.length >= 20 
                ? '✅ SUCCESS: All courses should show in Quiz Manager!' 
                : `❌ PROBLEM: Only ${coursesWithClasses.length} courses will show in Quiz Manager (need 20)`
              }
            </div>
          </div>
        </div>

        {/* Courses WITH Classes */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            ✅ Courses WITH Classes ({coursesWithClasses.length}) - These will show in Quiz Manager
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursesWithClasses.map(course => (
              <div key={course.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="font-medium text-gray-900">Course {course.id}: {course.name}</div>
                <div className="text-sm text-gray-600">{course.instructor}</div>
                <div className="text-sm text-green-600 font-medium">
                  📖 {getClassCount(course.id)} classes
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses WITHOUT Classes */}
        {coursesWithoutClasses.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              ❌ Courses WITHOUT Classes ({coursesWithoutClasses.length}) - These WON'T show in Quiz Manager
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesWithoutClasses.map(course => (
                <div key={course.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="font-medium text-gray-900">Course {course.id}: {course.name}</div>
                  <div className="text-sm text-gray-600">{course.instructor}</div>
                  <div className="text-sm text-red-600 font-medium">
                    📖 0 classes - NEEDS CLASSES ADDED
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                <strong>Fix:</strong> These courses need classes added to appear in Quiz Manager. 
                Run the SQL script again or add classes manually.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseTest; 