import { useState, useEffect, useCallback } from 'react';

export const useSettings = () => {
  // Language mode
  const [languageMode, setLanguageMode] = useState(() => {
    const saved = localStorage.getItem('languageMode');
    return saved || 'vietnamese';
  });

  // Difficulty
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem('difficulty');
    return saved ? parseInt(saved) : 1;
  });

  // Auto advance
  const [autoAdvance, setAutoAdvance] = useState(() => {
    const saved = localStorage.getItem('autoAdvance');
    return saved === 'true';
  });

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== 'false'; // default true
  });

  // Max questions
  const [maxQuestions, setMaxQuestions] = useState(() => {
    const saved = localStorage.getItem('maxQuestions');
    return saved ? parseInt(saved) : 10;
  });

  // Sort mode
  const [sortMode, setSortMode] = useState(() => {
    const saved = localStorage.getItem('sortMode');
    return saved || 'newest';
  });

  // Word filter
  const [wordFilter, setWordFilter] = useState('all');

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Save language mode to localStorage
  useEffect(() => {
    localStorage.setItem('languageMode', languageMode);
  }, [languageMode]);

  // Save difficulty to localStorage
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty.toString());
  }, [difficulty]);

  // Save auto advance to localStorage
  useEffect(() => {
    localStorage.setItem('autoAdvance', autoAdvance.toString());
  }, [autoAdvance]);

  // Save sound enabled to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  // Save max questions to localStorage
  useEffect(() => {
    localStorage.setItem('maxQuestions', maxQuestions.toString());
  }, [maxQuestions]);

  // Save sort mode to localStorage
  useEffect(() => {
    localStorage.setItem('sortMode', sortMode);
  }, [sortMode]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = useCallback((wordId) => {
    setFavorites(prev => {
      if (prev.includes(wordId)) {
        return prev.filter(id => id !== wordId);
      } else {
        return [...prev, wordId];
      }
    });
  }, []);

  return {
    languageMode,
    setLanguageMode,
    difficulty,
    setDifficulty,
    autoAdvance,
    setAutoAdvance,
    soundEnabled,
    setSoundEnabled,
    maxQuestions,
    setMaxQuestions,
    sortMode,
    setSortMode,
    wordFilter,
    setWordFilter,
    favorites,
    setFavorites,
    toggleFavorite
  };
};

