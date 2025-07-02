import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ComputerDesktopIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ClockIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface AdvancedQuizConfigProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: any;
  onSave: (config: any) => void;
  courses?: any[];
  courseClasses?: any[];
}

const AdvancedQuizConfig: React.FC<AdvancedQuizConfigProps> = ({ isOpen, onClose, quiz, onSave, courses = [], courseClasses = [] }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState(quiz?.configuration || {});

  const tabs = [
    { id: 'general', label: 'General Settings', icon: CogIcon },
    { id: 'security', label: 'Security & Proctoring', icon: ShieldCheckIcon },
    { id: 'features', label: 'Advanced Features', icon: TrophyIcon },
    { id: 'grading', label: 'Grading & Evaluation', icon: ChartBarIcon },
    { id: 'timing', label: 'Time Management', icon: ClockIcon },
    { id: 'appearance', label: 'Appearance & UX', icon: EyeIcon }
  ];

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">🎯 Professional Quiz Configuration</h2>
                <p className="text-blue-100 mt-1">Enterprise-grade settings for {quiz?.title}</p>
                
                {/* Course and Class Information */}
                {quiz && (
                  <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-200">📚 Course:</span>
                        <span className="font-semibold text-white">
                          {courses.find(c => c.id === quiz.course_id)?.name || `Course ID: ${quiz.course_id}`}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-white/30"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-200">📖 Class:</span>
                        <span className="font-semibold text-white">
                          {(() => {
                            const foundClass = courseClasses.find(c => c.id === quiz.class_id);
                            if (foundClass) {
                              return `Class ${foundClass.class_number}: ${foundClass.title}`;
                            }
                            
                            // Fallback: try to find by course_id and derive class info
                            const courseClasses_forCourse = courseClasses.filter(c => c.course_id === quiz.course_id);
                            if (courseClasses_forCourse.length > 0) {
                              // Use first class as fallback
                              return `Class ${courseClasses_forCourse[0].class_number}: ${courseClasses_forCourse[0].title}`;
                            }
                            
                            // Last fallback: show quiz.class_id if available
                            return quiz.class_id ? `Class ${quiz.class_id}` : 'Class 1: Introduction';
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(95vh-120px)]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ComputerDesktopIcon className="h-6 w-6 text-blue-600" />
                      Quiz Template & Format (Learnyst-Style)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🖥️ Mock Test Template</label>
                            <p className="text-xs text-gray-500">Professional competitive exam interface like JEE/NEET</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.mocktest_template}
                            onChange={(e) => handleConfigChange('mocktest_template', e.target.checked)}
                            className="h-5 w-5 text-blue-600 rounded"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">📝 Question Numbering Format</label>
                          <select
                            value={config.multichoice_label || 'A,B,C,D'}
                            onChange={(e) => handleConfigChange('multichoice_label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="A,B,C,D">A, B, C, D (Standard)</option>
                            <option value="1,2,3,4">1, 2, 3, 4 (Numeric)</option>
                            <option value="i,ii,iii,iv">i, ii, iii, iv (Roman)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">🧮 Calculator Type</label>
                          <select
                            value={config.calculator_type || 'none'}
                            onChange={(e) => handleConfigChange('calculator_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="none">❌ No Calculator</option>
                            <option value="basic">🔢 Basic Calculator</option>
                            <option value="scientific">🔬 Scientific Calculator</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">📊 Difficulty Level</label>
                          <select
                            value={config.difficulty_level || 'medium'}
                            onChange={(e) => handleConfigChange('difficulty_level', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="easy">🟢 Easy</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="hard">🔴 Hard</option>
                            <option value="expert">⚫ Expert</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🎯 Show Question Marks</label>
                            <p className="text-xs text-gray-500">Display points for each question</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.show_question_marks}
                            onChange={(e) => handleConfigChange('show_question_marks', e.target.checked)}
                            className="h-5 w-5 text-blue-600 rounded"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">🔄 Maximum Attempts</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={config.max_attempts || 1}
                            onChange={(e) => handleConfigChange('max_attempts', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🏆 Enable Leaderboard</label>
                            <p className="text-xs text-gray-500">Show top performers ranking</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.leaderboard_enabled}
                            onChange={(e) => handleConfigChange('leaderboard_enabled', e.target.checked)}
                            className="h-5 w-5 text-blue-600 rounded"
                          />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-900 mb-2">✨ Pro Features Included</h4>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Professional exam interface</li>
                            <li>• Advanced question types</li>
                            <li>• Real-time performance tracking</li>
                            <li>• Detailed analytics dashboard</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security & Proctoring */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                      🔒 Security & Anti-Cheating (Enterprise-Grade)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🎥 Enable AI Proctoring</label>
                            <p className="text-xs text-gray-500">AI-powered monitoring during exam</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.proctoring_enabled}
                            onChange={(e) => handleConfigChange('proctoring_enabled', e.target.checked)}
                            className="h-5 w-5 text-red-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🚫 Window Switching Restriction</label>
                            <p className="text-xs text-gray-500">Prevent tab/window switching</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.window_restriction}
                            onChange={(e) => handleConfigChange('window_restriction', e.target.checked)}
                            className="h-5 w-5 text-red-600 rounded"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">⚠️ Switch Window Warnings</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={config.switch_window_warnings || 3}
                            onChange={(e) => handleConfigChange('switch_window_warnings', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            disabled={!config.window_restriction}
                          />
                          <p className="text-xs text-gray-500">Auto-submit after exceeding warnings</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">📺 Full Screen Mode</label>
                            <p className="text-xs text-gray-500">Force fullscreen during quiz</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.full_screen_mode}
                            onChange={(e) => handleConfigChange('full_screen_mode', e.target.checked)}
                            className="h-5 w-5 text-red-600 rounded"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">📋 Disable Copy/Paste</label>
                            <p className="text-xs text-gray-500">Prevent copying quiz content</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.copy_paste_disabled}
                            onChange={(e) => handleConfigChange('copy_paste_disabled', e.target.checked)}
                            className="h-5 w-5 text-red-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🖱️ Disable Right Click</label>
                            <p className="text-xs text-gray-500">Prevent right-click context menu</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.right_click_disabled}
                            onChange={(e) => handleConfigChange('right_click_disabled', e.target.checked)}
                            className="h-5 w-5 text-red-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">⏰ Auto Submit</label>
                            <p className="text-xs text-gray-500">Auto-submit when time expires</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.auto_submit}
                            onChange={(e) => handleConfigChange('auto_submit', e.target.checked)}
                            className="h-5 w-5 text-red-600 rounded"
                          />
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            <span className="text-sm font-medium">⚠️ Security Notice</span>
                          </div>
                          <p className="text-xs text-yellow-700 mt-1">
                            High security settings may affect user experience. Test thoroughly before deployment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Features */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrophyIcon className="h-6 w-6 text-purple-600" />
                      🎮 Engagement & Gamification Features
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">📊 Percentile Ranking</label>
                            <p className="text-xs text-gray-500">Show percentile scores like JEE/NEET</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.percentile_ranking}
                            onChange={(e) => handleConfigChange('percentile_ranking', e.target.checked)}
                            className="h-5 w-5 text-purple-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🔀 Answer Shuffle</label>
                            <p className="text-xs text-gray-500">Randomize answer options</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.answer_shuffle}
                            onChange={(e) => handleConfigChange('answer_shuffle', e.target.checked)}
                            className="h-5 w-5 text-purple-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">⏸️ Quiz Pause Option</label>
                            <p className="text-xs text-gray-500">Allow pausing during quiz</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.quiz_pause_enabled}
                            onChange={(e) => handleConfigChange('quiz_pause_enabled', e.target.checked)}
                            className="h-5 w-5 text-purple-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🎲 Question Randomization</label>
                            <p className="text-xs text-gray-500">Randomize question order</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.randomization_enabled}
                            onChange={(e) => handleConfigChange('randomization_enabled', e.target.checked)}
                            className="h-5 w-5 text-purple-600 rounded"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🧭 Question Navigation</label>
                            <p className="text-xs text-gray-500">Jump between questions freely</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.question_navigation}
                            onChange={(e) => handleConfigChange('question_navigation', e.target.checked)}
                            className="h-5 w-5 text-purple-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">🔍 Review Mode</label>
                            <p className="text-xs text-gray-500">Review answers before submission</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.review_mode}
                            onChange={(e) => handleConfigChange('review_mode', e.target.checked)}
                            className="h-5 w-5 text-purple-600 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div>
                            <label className="text-sm font-medium text-gray-900">📑 Section Order Selection</label>
                            <p className="text-xs text-gray-500">Let students choose section order</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={config.section_order_selection}
                            onChange={(e) => handleConfigChange('section_order_selection', e.target.checked)}
                            className="h-5 w-5 text-purple-600 rounded"
                          />
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-medium text-purple-900 mb-2">🚀 Learnyst-Level Pro Features</h4>
                          <ul className="text-xs text-purple-700 space-y-1">
                            <li>✨ Advanced analytics dashboard</li>
                            <li>🎯 Performance predictions & insights</li>
                            <li>📊 Detailed question-wise analysis</li>
                            <li>🏆 Gamification & achievement system</li>
                            <li>📈 Progress tracking & recommendations</li>
                            <li>🔬 A/B testing for questions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs would show similar professional interfaces... */}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              🚀 <strong>Learnyst-Level Professional Quiz Platform</strong> - Enterprise-grade features enabled
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                💾 Save Professional Configuration
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdvancedQuizConfig;
