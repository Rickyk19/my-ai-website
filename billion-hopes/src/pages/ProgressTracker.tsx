import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  category: string;
  points: number;
}

interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}

interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
}

interface UserStats {
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  totalTimeSpent: number; // in minutes
  coursesCompleted: number;
  coursesInProgress: number;
  achievementsEarned: number;
}

const ProgressTracker: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 2450,
    level: 8,
    pointsToNextLevel: 550,
    totalTimeSpent: 1847, // ~30 hours
    coursesCompleted: 3,
    coursesInProgress: 5,
    achievementsEarned: 12
  });

  const [streak, setStreak] = useState<LearningStreak>({
    currentStreak: 7,
    longestStreak: 15,
    lastActivityDate: new Date()
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-course',
      title: 'First Steps',
      description: 'Complete your first AI course',
      icon: '🎯',
      earned: true,
      earnedDate: new Date('2024-01-10'),
      category: 'milestone',
      points: 100
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      earned: true,
      earnedDate: new Date('2024-01-15'),
      category: 'streak',
      points: 200
    },
    {
      id: 'ai-expert',
      title: 'AI Expert',
      description: 'Complete 5 advanced AI courses',
      icon: '🧠',
      earned: false,
      category: 'expertise',
      points: 500
    },
    {
      id: 'speed-learner',
      title: 'Speed Learner',
      description: 'Complete a course in under 2 hours',
      icon: '⚡',
      earned: true,
      earnedDate: new Date('2024-01-12'),
      category: 'performance',
      points: 150
    },
    {
      id: 'community-helper',
      title: 'Community Helper',
      description: 'Help 10 fellow learners in discussions',
      icon: '🤝',
      earned: false,
      category: 'community',
      points: 300
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Score 100% on 3 different quizzes',
      icon: '💯',
      earned: true,
      earnedDate: new Date('2024-01-14'),
      category: 'performance',
      points: 250
    }
  ]);

  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([
    {
      courseId: '1',
      courseName: 'Introduction to Machine Learning',
      progress: 100,
      completedLessons: 12,
      totalLessons: 12,
      timeSpent: 480,
      lastAccessed: new Date('2024-01-15')
    },
    {
      courseId: '2',
      courseName: 'Deep Learning Fundamentals',
      progress: 75,
      completedLessons: 9,
      totalLessons: 12,
      timeSpent: 360,
      lastAccessed: new Date('2024-01-16')
    },
    {
      courseId: '3',
      courseName: 'Natural Language Processing',
      progress: 45,
      completedLessons: 5,
      totalLessons: 11,
      timeSpent: 225,
      lastAccessed: new Date('2024-01-16')
    },
    {
      courseId: '4',
      courseName: 'Computer Vision Basics',
      progress: 20,
      completedLessons: 2,
      totalLessons: 10,
      timeSpent: 120,
      lastAccessed: new Date('2024-01-14')
    }
  ]);

  const getLevelInfo = (level: number) => {
    return {
      title: level < 5 ? 'Beginner' : level < 10 ? 'Intermediate' : level < 15 ? 'Advanced' : 'Expert',
      color: level < 5 ? 'from-green-400 to-green-600' : 
             level < 10 ? 'from-blue-400 to-blue-600' : 
             level < 15 ? 'from-purple-400 to-purple-600' : 'from-yellow-400 to-yellow-600'
    };
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearned = achievements.filter(a => !a.earned);
  const levelInfo = getLevelInfo(userStats.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              📊 Progress Tracker
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your learning journey, earn achievements, and level up your AI skills!
            </p>
          </motion.div>
        </div>

        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${levelInfo.color} flex items-center justify-center`}>
                <span className="text-white text-2xl font-bold">{userStats.level}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${levelInfo.color} text-white`}>
                {levelInfo.title}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Level Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${levelInfo.color}`}
                style={{ width: `${((3000 - userStats.pointsToNextLevel) / 3000) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{userStats.pointsToNextLevel} points to level {userStats.level + 1}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white text-2xl">🔥</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{streak.currentStreak}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Streak</h3>
            <p className="text-sm text-gray-600">Longest: {streak.longestStreak} days</p>
            <p className="text-xs text-gray-500 mt-1">Keep learning to maintain your streak!</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{userStats.totalPoints.toLocaleString()}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Points</h3>
            <p className="text-sm text-gray-600">{userStats.achievementsEarned} achievements earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-2xl">📚</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{userStats.coursesCompleted}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Courses Completed</h3>
            <p className="text-sm text-gray-600">{userStats.coursesInProgress} in progress</p>
            <p className="text-xs text-gray-500 mt-1">{formatTime(userStats.totalTimeSpent)} total study time</p>
          </motion.div>
        </div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Course Progress</h2>
          <div className="space-y-6">
            {courseProgress.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                    <p className="text-sm text-gray-600">
                      {course.completedLessons}/{course.totalLessons} lessons • {formatTime(course.timeSpent)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">{course.progress}%</span>
                    <p className="text-xs text-gray-500">
                      Last accessed: {course.lastAccessed.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earned Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              🏆 Achievements Earned
              <span className="ml-3 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {earnedAchievements.length}
              </span>
            </h2>
            <div className="space-y-4">
              {earnedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Earned {achievement.earnedDate?.toLocaleDateString()} • +{achievement.points} points
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              🎯 Upcoming Achievements
              <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {unearned.length}
              </span>
            </h2>
            <div className="space-y-4">
              {unearned.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="text-3xl grayscale">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Reward: +{achievement.points} points
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">🚀 Keep Learning!</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            You're doing great! Continue your learning journey to unlock more achievements, 
            level up, and become an AI expert. Every lesson brings you closer to your goals!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Next Goal: Level {userStats.level + 1}
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm">
              {userStats.pointsToNextLevel} points to go!
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProgressTracker;