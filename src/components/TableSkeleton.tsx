'use client';

import React from 'react';
import { LoadingRow } from './LoadingRow';

export const TableSkeleton: React.FC = React.memo(() => {
  // Generate 10 skeleton rows for initial loading
  const skeletonRows = Array.from({ length: 10 }, (_, index) => (
    <LoadingRow key={`skeleton-${index}`} />
  ));

  return (
    <div className="divide-y divide-gray-200">
      {skeletonRows}
    </div>
  );
});

TableSkeleton.displayName = 'TableSkeleton';