'use client';

import React from 'react';

export const LoadingRow: React.FC = React.memo(() => {
  return (
    <>
      {/* Desktop Loading Row */}
      <div className="hidden md:flex items-center min-w-full border-b border-gray-200 bg-white animate-pulse">
        {/* Selection checkbox skeleton */}
        <div className="w-12 px-4 py-3 text-center">
          <div className="w-4 h-4 bg-gray-200 rounded mx-auto"></div>
        </div>

        {/* Character name skeleton */}
        <div className="w-48 px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="min-w-0 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Power level skeleton */}
        <div className="w-32 px-4 py-3 text-right">
          <div className="h-6 bg-gray-200 rounded-full w-16 ml-auto"></div>
        </div>

        {/* Location skeleton */}
        <div className="w-32 px-4 py-3">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>

        {/* Health skeleton */}
        <div className="w-32 px-4 py-3">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>

      {/* Mobile Loading Row */}
      <div className="md:hidden border-b border-gray-200 bg-white animate-pulse p-4">
        <div className="flex items-start space-x-4">
          {/* Selection checkbox skeleton */}
          <div className="w-4 h-4 bg-gray-200 rounded mt-2"></div>

          {/* Character avatar skeleton */}
          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full"></div>

          {/* Character details skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16 ml-2"></div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

LoadingRow.displayName = 'LoadingRow';