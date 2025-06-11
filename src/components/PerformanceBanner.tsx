"use client";

import React, { useState } from 'react';
import { PERFORMANCE_CONFIG } from '../config/performance';

const PerformanceBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || PERFORMANCE_CONFIG.youtubeStrategy === 'immediate') {
    return null;
  }

  const getSavingsText = () => {
    switch (PERFORMANCE_CONFIG.youtubeStrategy) {
      case 'facade':
        return 'Saving ~9MB and 3s of load time per page';
      case 'lazy-facade':
        return 'Saving ~9MB and optimizing load time with lazy loading';
      default:
        return '';
    }
  };

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-3 mx-4 my-2 rounded-r-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-sm text-green-700">
              <strong>Performance Optimized:</strong> {getSavingsText()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 ml-4 text-green-400 hover:text-green-600"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PerformanceBanner; 