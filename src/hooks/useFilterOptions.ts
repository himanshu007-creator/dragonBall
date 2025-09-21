import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions, queryKeys } from '@/utils/api';

export function useFilterOptions() {
  return useQuery({
    queryKey: queryKeys.filterOptions(),
    queryFn: fetchFilterOptions,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
