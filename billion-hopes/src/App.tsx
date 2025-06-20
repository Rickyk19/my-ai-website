import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import TypesOfAI from './pages/TypesOfAI';
import Courses from './pages/Courses';
import CourseContent from './pages/CourseContent';
import Feedback from './pages/Feedback';
import Dashboard from './pages/Dashboard';
import AddCourse from './pages/AddCourse';
import ManageCourses from './pages/ManageCourses';
import MembersLogin from './pages/MembersLogin';
import MembersLoginDebug from './pages/MembersLoginDebug';
import SupabaseTestPage from './pages/SupabaseTestPage';
import SupabaseConnectionTest from './pages/SupabaseConnectionTest';
import MembersDashboard from './pages/MembersDashboard';
import ShowcasePage from './pages/ShowcasePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Placeholder components for different routes
const AIExplained = () => <div>AI Explained Page</div>;
const Solutions = () => <div>Solutions Page</div>;
const Trends = () => <div>Trends Page</div>;
const DataLab = () => <div>Data Lab Page</div>;
const AGI = () => <div>AGI Page</div>;
const Resources = () => <div>Resources Page</div>;
const Contact = () => <div>Contact Page</div>;
const Login = () => <div>Login Page</div>;
const SignUp = () => <div>Sign Up Page</div>;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="course/:id" element={<CourseContent />} />
            <Route path="ai-explained/types" element={<TypesOfAI />} />
            <Route path="ai-explained" element={<AIExplained />} />
            <Route path="solutions/*" element={<Solutions />} />
            <Route path="trends/*" element={<Trends />} />
            <Route path="data-lab/*" element={<DataLab />} />
            <Route path="agi/*" element={<AGI />} />
            <Route path="resources/*" element={<Resources />} />
            <Route path="contact" element={<Contact />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="showcase" element={<ShowcasePage />} />
            <Route path="dashboard" element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="add-course" element={
              <ProtectedRoute adminOnly={true}>
                <AddCourse />
              </ProtectedRoute>
            } />
            <Route path="manage-courses" element={
              <ProtectedRoute adminOnly={true}>
                <ManageCourses />
              </ProtectedRoute>
            } />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="members-login" element={<MembersLogin />} />
            <Route path="members-login-debug" element={<MembersLoginDebug />} />
            <Route path="supabase-test" element={<SupabaseTestPage />} />
            <Route path="connection-test" element={<SupabaseConnectionTest />} />
            <Route path="members-dashboard" element={<MembersDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
