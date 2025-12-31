import { useState, useCallback } from 'react';
import axios from 'axios';
import { getWordId } from '../utils/helpers';
import { API_BASE_URL } from '../utils/constants';

/**
 * Custom hook for managing practice mode state and logic
 * @param {Function} showToast - Toast notification function
 * @param {Function} loadUserStats - Function to reload user stats
 * @param {string} languageMode - Language mode: 'vietnamese' or 'english'
 * @param {boolean} autoAdvance - Whether to auto advance on correct answer
 * @param {Function} handleNext - Function to move to next word
 * @returns {Object} Practice state and handlers
 */
export const usePractice = (
  showToast,
  loadUserStats,
  languageMode,
  autoAdvance,
  handleNext
) => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wordHint, setWordHint] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceResults, setPracticeResults] = useState({});
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);

  // Reset word state
  const resetWordState = useCallback(() => {
    setUserInput('');
    setFeedback(null);
    setIsAnswered(false);
    setShowHint(false);
    setWordHint('');
    setShowAnswer(false);
  }, []);

  // Reset practice
  const resetPractice = useCallback(() => {
    setPracticeResults({});
    setPracticeCompleted(false);
    setPracticeStarted(false);
    resetWordState();
  }, [resetWordState]);

  // Handle submit answer
  const handleSubmit = useCallback(async (currentWord, wordIndex, filteredWords) => {
    if (!userInput.trim() || !currentWord) return;
    
    // Mark practice as started
    if (!practiceStarted) {
      setPracticeStarted(true);
    }
    
    try {
      // Check answer with server
      const response = await axios.post(`${API_BASE_URL}/check-answer`, {
        wordId: getWordId(currentWord),
        answer: userInput.trim(),
        languageMode
      });
      
      const { result, correctAnswer, pronunciation } = response.data;
      
      const feedbackData = {
        result,
        correctAnswer,
        pronunciation: pronunciation || currentWord.pronunciation || ''
      };
      
      setFeedback(feedbackData);
      setIsAnswered(true);
      
      // Save result for current word
      setPracticeResults(prev => ({
        ...prev,
        [getWordId(currentWord)]: result
      }));
      
      // Reload stats from server
      await loadUserStats();

      // Auto advance only on correct answer (not on last word)
      const isLastWord = wordIndex === filteredWords.length - 1;
      
      if (!isLastWord && result === 'correct') {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    } catch (err) {
      console.error('Error checking answer:', err);
      showToast('Không thể kiểm tra đáp án. Vui lòng thử lại.', 'error');
    }
  }, [userInput, practiceStarted, languageMode, loadUserStats, handleNext, showToast]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setUserInput('');
    setFeedback(null);
    setIsAnswered(false);
    setShowAnswer(false);
  }, []);

  return {
    // State
    userInput,
    feedback,
    isAnswered,
    showHint,
    wordHint,
    showAnswer,
    practiceResults,
    practiceCompleted,
    practiceStarted,
    
    // Setters
    setUserInput,
    setFeedback,
    setIsAnswered,
    setShowHint,
    setWordHint,
    setShowAnswer,
    setPracticeResults,
    setPracticeCompleted,
    setPracticeStarted,
    
    // Handlers
    resetWordState,
    resetPractice,
    handleSubmit,
    handleRetry
  };
};

