'use client';

import React, { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Character, SelectionState } from '@/types';
import { TableRow } from './TableRow';
import { LoadingRow } from './LoadingRow';

// Separate component for intersection observer trigger
const InfiniteScrollTrigger: React.FC<{
  onTrigger: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
}> = ({ onTrigger, hasNextPage, isLoading }) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = triggerRef.current;
    if (!element || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          console.log('🎯 Intersection-based infinite loading triggered');
          onTrigger();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Trigger 100px before the element comes into view
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onTrigger, hasNextPage, isLoading]);

  return <div ref={triggerRef} className="h-1 w-full" />;
};

export interface VirtualizedTableBodyProps {
  data: Character[];
  selectionState: SelectionState;
  onRowSelect: (id: string) => void;
  isLoading: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  enableVirtualization?: boolean;
}

// Remove fixed height - use flex layout instead

export const VirtualizedTableBody: React.FC<VirtualizedTableBodyProps> = React.memo(({
  data,
  selectionState,
  onRowSelect,
  isLoading,
  hasNextPage = false,
  fetchNextPage,
  enableVirtualization = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Add loading row to data if we have more pages
  const allItems = React.useMemo(() => {
    return hasNextPage ? [...data, null] : data; // null represents loading row
  }, [data, hasNextPage]);

  const virtualizer = useVirtualizer({
    count: allItems.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 72, // Estimated row height
    overscan: 5,
  });

  // Handle infinite loading with scroll detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      // Trigger loading when we're 80% down the page
      if (scrollPercentage > 0.8 && hasNextPage && !isLoading) {
        console.log('Scroll-based infinite loading triggered', {
          scrollPercentage,
          hasNextPage,
          isLoading,
          dataLength: data.length
        });
        fetchNextPage();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isLoading, fetchNextPage, data.length]);

  // Backup: Handle infinite loading with virtual items (for virtualized mode)
  useEffect(() => {
    if (!enableVirtualization || data.length < 20) return;
    
    const virtualItems = virtualizer.getVirtualItems();
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    // Trigger loading when we're close to the end (within 3 items)
    if (
      lastItem.index >= allItems.length - 3 &&
      hasNextPage &&
      !isLoading
    ) {
      console.log('Virtual-based infinite loading triggered', {
        lastItemIndex: lastItem.index,
        totalItems: allItems.length,
        hasNextPage,
        isLoading
      });
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allItems.length,
    isLoading,
    virtualizer,
    enableVirtualization,
    data.length,
  ]);

  if (!enableVirtualization || data.length < 20) {
    // Use regular rendering for smaller datasets
    return (
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <div className="divide-y divide-gray-200">
            {data.map((character) => {
              const isSelected = selectionState.selectedIds.has(character.id);
              return (
                <TableRow
                  key={character.id}
                  character={character}
                  isSelected={isSelected}
                  onSelect={() => onRowSelect(character.id)}
                />
              );
            })}
            {/* Show loading row when fetching more data */}
            {hasNextPage && <LoadingRow />}
          </div>
          
          {/* Invisible trigger element for infinite scroll */}
          {hasNextPage && !isLoading && (
            <InfiniteScrollTrigger 
              onTrigger={fetchNextPage}
              hasNextPage={hasNextPage}
              isLoading={isLoading}
            />
          )}
        </div>
        
        {/* Loading indicator overlay */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm font-medium">Loading more characters...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{
          contain: 'strict',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const character = allItems[virtualItem.index] as Character | null;
            const isLoaderRow = !character;

            return (
              <div
                key={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="border-b border-gray-200"
              >
                {isLoaderRow ? (
                  <LoadingRow />
                ) : (
                  <TableRow
                    character={character}
                    isSelected={selectionState.selectedIds.has(character.id)}
                    onSelect={() => onRowSelect(character.id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Loading indicator overlay */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span className="text-sm font-bold">Loading more Dragon Ball characters...</span>
          </div>
        </div>
      )}
    </div>
  );
});

VirtualizedTableBody.displayName = 'VirtualizedTableBody';