import { useQuery } from '@tanstack/react-query';
import { searchAll, SearchResults } from '../services/SearchService';

export const useSearch = (query: string, enabled: boolean = true) => {
  return useQuery<SearchResults>({
    queryKey: ['search', query],
    queryFn: ({ signal }) => searchAll(query, signal),
    enabled: enabled && !!query.trim(),
    staleTime: 30 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
