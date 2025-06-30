import React from 'react';
import FeatureCards from '../components/FeatureCards';

const ShowcasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🚀 Platform Navigation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore all the amazing features and sections of ABCD CORPORATION AI platform. 
              Click on any section to expand and discover what's available!
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium">Interactive Cards</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-700 font-medium">Beautiful Images</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 font-medium">Toggle Sections</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Component */}
      <div className="py-12">
        <FeatureCards />
      </div>

      {/* Instructions Footer */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              💡 How to Use This Navigation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-2xl mb-3">🔽</div>
                <h4 className="font-semibold text-gray-800 mb-2">Toggle Sections</h4>
                <p className="text-gray-600 text-sm">
                  Click on any section header to expand or collapse the cards within that category.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-2xl mb-3">📱</div>
                <h4 className="font-semibold text-gray-800 mb-2">Click to Navigate</h4>
                <p className="text-gray-600 text-sm">
                  Each card is clickable and will take you directly to that section of the platform.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-2xl mb-3">🎨</div>
                <h4 className="font-semibold text-gray-800 mb-2">Visual Indicators</h4>
                <p className="text-gray-600 text-sm">
                  Look for "NEW" and "🔥 POPULAR" badges to identify featured content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage; 