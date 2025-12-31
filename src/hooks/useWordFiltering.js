import { useMemo } from 'react';
import { getWordId } from '../utils/helpers';

/**
 * Custom hook for filtering and sorting words
 * @param {Array} allWords - All words from vocabulary
 * @param {string} wordFilter - Filter mode: 'all' or 'favorites'
 * @param {string} sortMode - Sort mode: 'newest' or 'shuffle'
 * @param {Array} favorites - Array of favorite word IDs
 * @param {number} shuffleKey - Key for shuffle randomization
 * @param {number} maxQuestions - Maximum number of questions to return
 * @returns {Object} Filtered and sorted words
 */
export const useWordFiltering = (
  allWords,
  wordFilter,
  sortMode,
  favorites,
  shuffleKey,
  maxQuestions = Infinity
) => {
  const filteredWords = useMemo(() => {
    if (!allWords || allWords.length === 0) return [];

    // Filter by favorites if needed
    let words = allWords;
    if (wordFilter === 'favorites') {
      words = allWords.filter(word => favorites.includes(getWordId(word)));
    }

    // Remove duplicates (keep the newest one)
    const uniqueWords = words.reduce((acc, current) => {
      const existingIndex = acc.findIndex(word => 
        word.english.toLowerCase() === current.english.toLowerCase() &&
        word.vietnamese.toLowerCase() === current.vietnamese.toLowerCase()
      );
      
      if (existingIndex !== -1) {
        // Replace with the newer one (compare by created_at or ID)
        const currentId = getWordId(current);
        const existingId = getWordId(acc[existingIndex]);
        const currentTime = current.created_at || (typeof currentId === 'string' ? currentId : currentId);
        const existingTime = acc[existingIndex].created_at || (typeof existingId === 'string' ? existingId : existingId);
        if (currentTime > existingTime || (current.created_at && !acc[existingIndex].created_at)) {
          acc[existingIndex] = current;
        }
      } else {
        acc.push(current);
      }
      return acc;
    }, []);

    // Sort based on sortMode
    switch (sortMode) {
      case 'newest':
        // Sort by created_at descending (newest first), fallback to ID
        return [...uniqueWords].sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          const aId = getWordId(a);
          const bId = getWordId(b);
          if (typeof aId === 'string' && typeof bId === 'string') {
            return bId.localeCompare(aId);
          }
          return (bId || 0) - (aId || 0);
        });
      case 'shuffle':
        // Use seeded random function based on shuffleKey
        const shuffled = [...uniqueWords];
        const seededRandom = (seed) => {
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };

        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(seededRandom(shuffleKey + i) * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      default:
        return uniqueWords;
    }
  }, [allWords, wordFilter, sortMode, favorites, shuffleKey]);

  // Apply max questions limit
  const limitedFilteredWords = useMemo(() => {
    return filteredWords.slice(0, maxQuestions);
  }, [filteredWords, maxQuestions]);

  return {
    filteredWords,
    limitedFilteredWords
  };
};

