'use client';

import { DragonBallTableWrapper } from '@/components';

export default function Home() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dragon Ball Characters</h1>
          <p className="mt-2 text-gray-600">
            Browse through the complete collection of Dragon Ball characters
          </p>
        </div>
      </div>
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-6 min-h-0">
        <div className="max-w-7xl mx-auto h-full">
          <DragonBallTableWrapper />
        </div>
      </div>
    </div>
  );
}
