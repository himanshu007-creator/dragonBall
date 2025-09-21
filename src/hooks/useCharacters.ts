import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCharacters, queryKeys } from '@/utils/api';
import { APIParams } from '@/types';

interface UseCharactersParams {
  filters: Omit<APIParams, 'page' | 'limit'>;
  limit?: number;
}

export function useCharacters({ filters, limit = 10 }: UseCharactersParams) {
  const result = useInfiniteQuery({
    queryKey: queryKeys.characters({ ...filters, page: 1, limit }),
    queryFn: ({ pageParam = 1 }) => {
      console.log('🔄 Fetching Dragon Ball characters - Page:', pageParam, 'Limit:', limit, 'Filters:', filters);
      return fetchCharacters({ ...filters, page: pageParam, limit });
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      console.log('📊 Dragon Ball API pagination - Current:', currentPage, 'Total:', totalPages, 'Items:', lastPage.items.length);
      
      // Return the next page number if there are more pages
      if (currentPage < totalPages) {
        const nextPage = currentPage + 1;
        console.log('✅ Has next page:', nextPage);
        return nextPage;
      }
      
      console.log('❌ No more pages available');
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus for better UX
  });

  // Add debugging for the result
  console.log('🎯 useCharacters result:', {
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    isLoading: result.isLoading,
    pagesCount: result.data?.pages.length,
    totalItems: result.data?.pages.reduce((acc, page) => acc + page.items.length, 0)
  });

  return result;
}
