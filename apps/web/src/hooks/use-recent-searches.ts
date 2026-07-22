'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';

const MAX_RECENT = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useLocalStorage<string[]>('ff-recent-searches', []);

  const addSearch = useCallback(
    (term: string) => {
      setSearches((prev) => {
        const filtered = prev.filter((s) => s !== term);
        return [term, ...filtered].slice(0, MAX_RECENT);
      });
    },
    [setSearches],
  );

  const removeSearch = useCallback(
    (term: string) => {
      setSearches((prev) => prev.filter((s) => s !== term));
    },
    [setSearches],
  );

  const clearSearches = useCallback(() => {
    setSearches([]);
  }, [setSearches]);

  return { searches, addSearch, removeSearch, clearSearches };
}
