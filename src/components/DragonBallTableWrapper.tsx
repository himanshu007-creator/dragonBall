'use client';

import React, { Suspense } from 'react';
import { DragonBallTable, DragonBallTableProps } from './DragonBallTable';
import { TableSkeleton } from './TableSkeleton';

export const DragonBallTableWrapper: React.FC<DragonBallTableProps> = (props) => {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DragonBallTable {...props} />
    </Suspense>
  );
};

DragonBallTableWrapper.displayName = 'DragonBallTableWrapper';