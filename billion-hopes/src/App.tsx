import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import TypesOfAI from './pages/TypesOfAI';
import MLPage from './pages/MLPage';
import DLNNPage from './pages/DLNNPage';
import Courses from './pages/Courses';
import CourseContent from './pages/CourseContent';
import ClassContent from './pages/ClassContent';
import ClassQuiz from './pages/ClassQuiz';
import DynamicQuizPage from './pages/DynamicQuizPage';
import Feedback from './pages/Feedback';
import Dashboard from './pages/Dashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AddCourse from './pages/AddCourse';
import ManageCourses from './pages/ManageCourses';
import ManageQuizzes from './pages/ManageQuizzes';
import QuizManager from './pages/QuizManager';
import StudentQuizInterface from './pages/StudentQuizInterface';
import MembersLogin from './pages/MembersLogin';
import MembersLoginDebug from './pages/MembersLoginDebug';
import SupabaseTestPage from './pages/SupabaseTestPage';
import SupabaseConnectionTest from './pages/SupabaseConnectionTest';
import MembersDashboard from './pages/MembersDashboard';
import ShowcasePage from './pages/ShowcasePage';
import AIPlayground from './pages/AIPlayground';
import ProgressTracker from './pages/ProgressTracker';
import AIQuizzes from './pages/AIQuizzes';
import CommunityForum from './pages/CommunityForum';
import SmartRecommendations from './pages/SmartRecommendations';
import ProtectedRoute from './components/ProtectedRoute';
import MemberProtectedRoute from './components/MemberProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import QuizDemoPage from './pages/QuizDemoPage';
import DatabaseTest from './pages/DatabaseTest';
import AnalyticsDebug from './pages/AnalyticsDebug';
import SupabaseConnectionVerify from './pages/SupabaseConnectionVerify';
import AgentsPage from './pages/AgentsPage';
import RLPage from './pages/RLPage';
import RoboticsPage from './pages/RoboticsPage';
import AIIndustryPage from './pages/AIIndustryPage';
import EthicsPage from './pages/EthicsPage';
import YTLecturesPage from './pages/YTLecturesPage';
import AIResourcesPage from './pages/AIResourcesPage';

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
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="course/:id" element={<CourseContent />} />
            <Route path="course/:courseId/class/:classNumber" element={
              <MemberProtectedRoute>
                <ClassContent />
              </MemberProtectedRoute>
            } />
            <Route path="course/:courseId/class/:classNumber/quiz" element={
              <MemberProtectedRoute>
                <DynamicQuizPage />
              </MemberProtectedRoute>
            } />
            <Route path="quiz/course/:courseId/class/:classNumber" element={
              <MemberProtectedRoute>
                <ClassQuiz />
              </MemberProtectedRoute>
            } />
            <Route path="ai-explained/types" element={<TypesOfAI />} />
            <Route path="ai-explained/ml" element={<MLPage />} />
            <Route path="ai-explained/dl-nn" element={<DLNNPage />} />
            <Route path="ai-explained/agents" element={<AgentsPage />} />
            <Route path="ai-explained/rl" element={<RLPage />} />
            <Route path="ai-explained/robotics" element={<RoboticsPage />} />
            <Route path="ai-explained/industry" element={<AIIndustryPage />} />
            <Route path="ai-explained/ethics" element={<EthicsPage />} />
            <Route path="ai-explained/lectures" element={<YTLecturesPage />} />
            <Route path="ai-explained/resources" element={<AIResourcesPage />} />
            <Route path="ai-explained" element={<AIExplained />} />
            <Route path="solutions/*" element={<Solutions />} />
            <Route path="trends/*" element={<Trends />} />
            <Route path="data-lab/*" element={<DataLab />} />
            <Route path="agi/*" element={<AGI />} />
            <Route path="resources/*" element={<Resources />} />
            <Route path="contact" element={<Contact />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="showcase" element={<ShowcasePage />} />
            <Route path="ai-playground" element={<AIPlayground />} />
            <Route path="progress" element={
              <MemberProtectedRoute>
                <ProgressTracker />
              </MemberProtectedRoute>
            } />
            <Route path="ai-quizzes" element={<AIQuizzes />} />
            <Route path="community" element={<CommunityForum />} />
            <Route path="recommendations" element={<SmartRecommendations />} />
            <Route path="analytics-dashboard" element={
              <ProtectedRoute adminOnly={true}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
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
            <Route path="quiz-manager" element={
              <ProtectedRoute adminOnly={true}>
                <QuizManager />
              </ProtectedRoute>
            } />
            <Route path="manage-quizzes" element={
              <ProtectedRoute adminOnly={true}>
                <ManageQuizzes />
              </ProtectedRoute>
            } />
            <Route path="student-quiz-demo" element={
              <MemberProtectedRoute>
                <StudentQuizInterface />
              </MemberProtectedRoute>
            } />
            <Route path="quiz-integration-demo" element={
              <MemberProtectedRoute>
                <QuizDemoPage />
              </MemberProtectedRoute>
            } />
            <Route path="database-test" element={<DatabaseTest />} />
            <Route path="analytics-debug" element={<AnalyticsDebug />} />
            <Route path="supabase-verify" element={<SupabaseConnectionVerify />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="members-login" element={<MembersLogin />} />
            <Route path="members-login-debug" element={<MembersLoginDebug />} />
            <Route path="supabase-test" element={<SupabaseTestPage />} />
            <Route path="connection-test" element={<SupabaseConnectionTest />} />
            <Route path="members-dashboard" element={
              <MemberProtectedRoute>
                <MembersDashboard />
              </MemberProtectedRoute>
            } />
            <Route path="quiz-demo" element={<QuizDemoPage />} />
          </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
