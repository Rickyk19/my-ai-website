import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ArrowRightOnRectangleIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

interface StudentLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children, showNavigation = true }) => {
  const { isStudent, studentUser, logoutStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutStudent();
    navigate('/members-login');
  };

  if (!isStudent || !studentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AcademicCapIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please log in to access your courses</p>
          <Link 
            to="/members-login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Student Header */}
      {showNavigation && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/members-dashboard" className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">ABCD CORPORATION</span>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link 
                  to="/members-dashboard" 
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <HomeIcon className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link 
                  to="/my-courses" 
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  My Courses
                </Link>
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="h-4 w-4" />
                  <span>Welcome, {studentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={showNavigation ? "pt-0" : ""}>
        {children}
      </main>
    </div>
  );
};

export default StudentLayout; 