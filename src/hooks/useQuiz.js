import { useState, useCallback } from 'react';
import { getWordId, buildQuizOptions } from '../utils/helpers';
import { playFlipSound } from '../utils/soundUtils';

/**
 * Custom hook for managing quiz state and logic
 * @param {Array} filteredWords - Filtered words to use for quiz
 * @param {string} languageMode - Language mode: 'vietnamese' or 'english'
 * @param {number} maxQuestions - Maximum number of questions
 * @param {Array} favorites - Array of favorite word IDs
 * @param {Function} showToast - Toast notification function
 * @param {Function} setStats - Function to update stats
 * @param {boolean} soundEnabled - Whether sound is enabled
 * @returns {Object} Quiz state and handlers
 */
export const useQuiz = (
  filteredWords,
  languageMode,
  maxQuestions,
  favorites,
  showToast,
  setStats,
  soundEnabled = true
) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotalQuestions, setQuizTotalQuestions] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizView, setQuizView] = useState('doing');
  const [quizFavoritesOnly, setQuizFavoritesOnly] = useState(false);
  const [showQuizSettings, setShowQuizSettings] = useState(false);

  // Initialize quiz
  const initializeQuiz = useCallback(() => {
    if (!filteredWords || filteredWords.length < 4) {
      showToast('Cần ít nhất 4 từ vựng để tạo bài trắc nghiệm!', 'warning');
      return false;
    }

    const total = Math.min(maxQuestions, filteredWords.length);
    const quizWords = filteredWords.slice(0, total);
    const questions = quizWords.map((word) => ({
      wordId: getWordId(word),
      english: word.english,
      vietnamese: word.vietnamese,
      options: buildQuizOptions(word, filteredWords, languageMode),
      selectedIndex: null
    }));

    setQuizQuestions(questions);
    setQuizScore(0);
    setQuizTotalQuestions(total);
    setQuizCompleted(false);
    setQuizView('doing');
    return true;
  }, [filteredWords, maxQuestions, languageMode, showToast]);

  // Reset current quiz
  const resetCurrentQuiz = useCallback(() => {
    if (!filteredWords || filteredWords.length < 4) return;
    const total = Math.min(maxQuestions, filteredWords.length);
    const quizWords = filteredWords.slice(0, total);
    const questions = quizWords.map((word) => ({
      wordId: getWordId(word),
      english: word.english,
      vietnamese: word.vietnamese,
      options: buildQuizOptions(word, filteredWords, languageMode),
      selectedIndex: null
    }));
    setQuizQuestions(questions);
    setQuizScore(0);
    setQuizTotalQuestions(total);
    setQuizCompleted(false);
    setQuizView('doing');
  }, [filteredWords, maxQuestions, languageMode]);

  // Handle quiz answer selection
  const handleQuizAnswer = useCallback((questionIndex, optionIndex) => {
    if (quizCompleted) return;

    // Play sound when selecting an answer
    playFlipSound(soundEnabled);

    setQuizQuestions(prev =>
      prev.map((q, idx) =>
        idx === questionIndex ? { ...q, selectedIndex: optionIndex } : q
      )
    );

    // Auto scroll to next question
    const totalQuestions = quizQuestions.length;
    setTimeout(() => {
      const nextQuestionIndex = questionIndex + 1;
      if (nextQuestionIndex < totalQuestions) {
        const nextQuestionElement = document.getElementById(`quiz-question-${nextQuestionIndex}`);
        if (nextQuestionElement) {
          nextQuestionElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    }, 100);
  }, [quizCompleted, quizQuestions.length, soundEnabled]);

  // Submit quiz and calculate score
  const submitQuiz = useCallback(() => {
    if (quizCompleted || quizQuestions.length === 0) return;

    // Get displayed questions (with filter if needed)
    const displayedQuestions = quizFavoritesOnly 
      ? quizQuestions.filter(q => favorites.includes(q.wordId))
      : quizQuestions;
    
    // Only count answered questions
    const answeredQuestions = displayedQuestions.filter(q => q.selectedIndex != null);
    const totalDisplayed = displayedQuestions.length;
    
    // Require at least 5 answers or all available questions
    if (answeredQuestions.length < 5 && answeredQuestions.length < totalDisplayed) {
      showToast(`Cần chọn ít nhất ${totalDisplayed < 5 ? totalDisplayed : 5} câu hỏi để nộp bài!`, 'warning');
      return;
    }

    // Calculate score
    let correctCount = 0;
    answeredQuestions.forEach((q) => {
      const selected = q.options[q.selectedIndex];
      if (selected && selected.correct) {
        correctCount += 1;
      }
    });

    setQuizScore(correctCount);
    setQuizTotalQuestions(answeredQuestions.length);
    setQuizCompleted(true);
    setQuizView('summary');

    // Update stats
    setStats(prev => ({
      ...prev,
      total: prev.total + answeredQuestions.length,
      correct: prev.correct + correctCount,
      incorrect: prev.incorrect + (answeredQuestions.length - correctCount)
    }));
  }, [quizCompleted, quizQuestions, quizFavoritesOnly, favorites, showToast, setStats]);

  return {
    // State
    quizQuestions,
    quizScore,
    quizTotalQuestions,
    quizCompleted,
    quizView,
    quizFavoritesOnly,
    showQuizSettings,
    
    // Setters
    setQuizQuestions,
    setQuizScore,
    setQuizTotalQuestions,
    setQuizCompleted,
    setQuizView,
    setQuizFavoritesOnly,
    setShowQuizSettings,
    
    // Handlers
    initializeQuiz,
    resetCurrentQuiz,
    handleQuizAnswer,
    submitQuiz
  };
};

