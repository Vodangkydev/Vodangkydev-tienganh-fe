import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { XCircle, AlertCircle, Loader, RotateCcw, Plus, Eye, X, Settings, Star, Volume2, LogOut, LogIn, FileText, BookOpen, Sliders } from 'lucide-react';
import axios from 'axios';
import './App.css';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import Practice from './components/Practice';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import BulkImportModal from './components/BulkImportModal';
import TipsModal from './components/TipsModal';
import SettingsModal from './components/Settings';
import { useAuth } from './hooks/useAuth';
import { useVocabulary } from './hooks/useVocabulary';
import { useStats } from './hooks/useStats';
import { useSettings } from './hooks/useSettings';
import { useWordFiltering } from './hooks/useWordFiltering';
import { useQuiz } from './hooks/useQuiz';
import { usePractice } from './hooks/usePractice';
import { useSwipe } from './hooks/useSwipe';
import { useToast } from './hooks/useToast';
import { getWordId, generateHint, buildQuizOptions } from './utils/helpers';
import { playFlipSound, speakText, playCorrectSound } from './utils/soundUtils';
import { API_BASE_URL } from './utils/constants';

function App() {
  // Toast hook
  const { toast, showToast, hideToast } = useToast();

  // Custom hooks
  const { isAuthenticated, user, login, register, logout, loginLoading } = useAuth(showToast);
  const { allWords, loading, error, loadAllWords, deleteVocabulary, bulkImportWords } = 
    useVocabulary(isAuthenticated, showToast);
  const { stats, setStats, loadUserStats, resetStats, updateStats } = 
    useStats(isAuthenticated, showToast);
  const {
    languageMode, setLanguageMode,
    difficulty, setDifficulty,
    autoAdvance, setAutoAdvance,
    soundEnabled, setSoundEnabled,
    maxQuestions, setMaxQuestions,
    sortMode, setSortMode,
    wordFilter, setWordFilter,
    favorites, setFavorites,
    toggleFavorite
  } = useSettings();

  // Local UI state (some states needed before filtering)
  const [currentWord, setCurrentWord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFlashcardHint, setShowFlashcardHint] = useState(false);
  const [flashcardFavoritesOnly, setFlashcardFavoritesOnly] = useState(false);
  const [showFlashcardSettings, setShowFlashcardSettings] = useState(false);
  const [showPracticeSettings, setShowPracticeSettings] = useState(false);
  const [showPracticeModeDropdown, setShowPracticeModeDropdown] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');
  const [shuffleKey, setShuffleKey] = useState(0);
  const prevShuffleKeyRef = useRef(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wordHint, setWordHint] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Load data when authenticated (handled by hooks)
  useEffect(() => {
    if (isAuthenticated) {
      loadAllWords();
      loadUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Vocabulary is now managed by backend, no need for localStorage

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Word filtering hook
  const { filteredWords, limitedFilteredWords } = useWordFiltering(
    allWords,
    wordFilter,
    sortMode,
    favorites,
    shuffleKey,
    maxQuestions
  );

  // Flashcard filtering hook (separate filter for favorites only)
  const { filteredWords: flashcardFilteredWords, limitedFilteredWords: limitedFlashcardFilteredWords } = useWordFiltering(
    allWords,
    flashcardFavoritesOnly ? 'favorites' : 'all',
    sortMode,
    favorites,
    shuffleKey,
    maxQuestions
  );

  // Quiz hook
  const quiz = useQuiz(
    filteredWords,
    languageMode,
    maxQuestions,
    favorites,
    showToast,
    setStats,
    soundEnabled
  );

  // Update current word when wordIndex or filtered words change
  useEffect(() => {
    const wordsToUse = flashcardMode ? limitedFlashcardFilteredWords : limitedFilteredWords;
    if (wordsToUse.length > 0) {
      // Ensure wordIndex is within bounds
      const validIndex = wordIndex >= wordsToUse.length ? 0 : wordIndex;
      if (validIndex !== wordIndex) {
        setWordIndex(validIndex);
      } else {
        setCurrentWord(wordsToUse[validIndex]);
        practice.resetWordState();
        setIsFlipped(false); // Reset flashcard flip when changing words
        setShowFlashcardHint(false); // Reset hint khi chuyển từ
      }
    } else {
      setCurrentWord(null);
    }
  }, [wordIndex, limitedFilteredWords, limitedFlashcardFilteredWords, flashcardMode]);

  // Update currentWord when shuffleKey changes (both flashcard and practice mode)
  useEffect(() => {
    // Only update if shuffleKey actually changed (not just on mount)
    if (shuffleKey !== prevShuffleKeyRef.current) {
      const wordsToUse = flashcardMode ? limitedFlashcardFilteredWords : limitedFilteredWords;
      if (wordsToUse.length > 0 && wordIndex < wordsToUse.length) {
        setCurrentWord(wordsToUse[wordIndex]);
        practice.resetWordState();
        setIsFlipped(false);
        setShowFlashcardHint(false);
        prevShuffleKeyRef.current = shuffleKey;
      }
    }
  }, [shuffleKey, flashcardMode, limitedFlashcardFilteredWords, limitedFilteredWords, wordIndex]);

  // Reset wordIndex when filter changes
  useEffect(() => {
    setWordIndex(0);
  }, [wordFilter]);

  // Reset wordIndex when allWords changes (after loading)
  useEffect(() => {
    if (allWords.length > 0) {
      setWordIndex(0);
    }
  }, [allWords.length]);

  // Đóng dropdown khi chuyển sang flashcard mode
  useEffect(() => {
    if (flashcardMode) {
      setShowPracticeModeDropdown(false);
    }
  }, [flashcardMode]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPracticeModeDropdown && !event.target.closest('[data-practice-dropdown]')) {
        setShowPracticeModeDropdown(false);
      }
      if (quiz.showQuizSettings && !event.target.closest('[data-quiz-settings]')) {
        quiz.setShowQuizSettings(false);
      }
      if (showPracticeSettings && !event.target.closest('[data-practice-settings]')) {
        setShowPracticeSettings(false);
      }
      if (showFlashcardSettings && !event.target.closest('[data-flashcard-settings]')) {
        setShowFlashcardSettings(false);
      }
    };

    if (showPracticeModeDropdown || quiz.showQuizSettings || showPracticeSettings || showFlashcardSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPracticeModeDropdown, quiz.showQuizSettings, showPracticeSettings, showFlashcardSettings]);

  // Authentication handled by useAuth hook
  const handleLogin = async (username, password, isRegister = false) => {
    setLoginError('');
    // Client-side validation
    if (!username || !password) {
      showToast('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.', 'error');
      setLoginError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    
    if (username.length < 3) {
      showToast('Tên đăng nhập phải có ít nhất 3 ký tự.', 'error');
      setLoginError('Tên đăng nhập phải có ít nhất 3 ký tự.');
      return;
    }
    
    if (username.length > 30) {
      showToast('Tên đăng nhập không được vượt quá 30 ký tự.', 'error');
      setLoginError('Tên đăng nhập không được vượt quá 30 ký tự.');
      return;
    }
    
    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự.', 'error');
      setLoginError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    
    const result = isRegister 
      ? await register(username, password)
      : await login(username, password);
    
    if (result.success) {
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '' });
      await loadAllWords();
      await loadUserStats();
      setLoginError('');
    } else {
      setLoginError(result.error || 'Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentWord(null);
    // allWords is managed by useVocabulary hook, will be cleared automatically
  };

  // Sound functions - using utils
  const handlePlayFlipSound = () => playFlipSound(soundEnabled);
  const handleSpeakText = (text, language) => speakText(text, language);
  const handlePlayCorrectSound = () => playCorrectSound(soundEnabled);

  // Vocabulary loading handled by useVocabulary hook
  // Reset sort mode when words are loaded
  useEffect(() => {
    if (allWords.length > 0) {
      setSortMode('newest');
      setShuffleKey(0);
    }
  }, [allWords.length]);

  // Create ref for handleNext to pass to practice hook
  const handleNextRef = useRef(null);

  // Practice hook (initialize early to avoid circular dependency)
  const practice = usePractice(
    showToast,
    loadUserStats,
    languageMode,
    autoAdvance,
    handleNextRef // Pass ref instead of null
  );

  // Navigation handlers
  const handleNext = useCallback((silent = false) => {
    setSlideDirection('right');
    const wordsToUse = flashcardMode ? limitedFlashcardFilteredWords : limitedFilteredWords;
    
    if (wordIndex < wordsToUse.length - 1) {
      setWordIndex(wordIndex + 1);
    } else {
      // Loop back to first word if not at last word with practice result
      if (!flashcardMode && !quizMode && practice.practiceStarted) {
        const currentWordId = wordsToUse[wordIndex] ? getWordId(wordsToUse[wordIndex]) : null;
        if (currentWordId && practice.practiceResults[currentWordId]) {
          return;
        }
      }
      setWordIndex(0);
    }
    // Reset word state
    practice.resetWordState();
    // Reset flashcard state
    setIsFlipped(false);
    setShowFlashcardHint(false);
    // Play sound only if not silent (for auto advance)
    if (!silent) {
      handlePlayCorrectSound();
    }
  }, [wordIndex, flashcardMode, quizMode, limitedFlashcardFilteredWords, limitedFilteredWords, practice]);

  // Update handleNext ref when it changes
  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  const handlePrevious = useCallback(() => {
    setSlideDirection('left');
    const wordsToUse = flashcardMode ? limitedFlashcardFilteredWords : limitedFilteredWords;
    if (wordIndex > 0) {
      setWordIndex(wordIndex - 1);
    } else {
      setWordIndex(wordsToUse.length - 1);
    }
    // Reset word state
    practice.resetWordState();
    // Reset flashcard state
    setIsFlipped(false);
    setShowFlashcardHint(false);
    // Play sound
    handlePlayCorrectSound();
  }, [wordIndex, flashcardMode, limitedFlashcardFilteredWords, limitedFilteredWords, practice]);

  // Swipe gesture handlers (must be after handleNext and handlePrevious are defined)
  // Vuốt qua phải = chuyển tiếp (next), Vuốt qua trái = lùi (previous)
  // Note: deltaX > 0 = swipe right, deltaX < 0 = swipe left
  const { handleTouchStart, handleTouchEnd } = useSwipe(
    handlePrevious, // onSwipeLeft -> previous (vuốt trái = lùi)
    handleNext,      // onSwipeRight -> next (vuốt phải = chuyển tiếp)
    flashcardMode
  );

  // Reset practice function (includes wordIndex reset)
  const resetPractice = useCallback(() => {
    practice.resetPractice();
    setWordIndex(0);
    setIsFlipped(false);
    setShowFlashcardHint(false);
  }, [practice]);

  // toggleFavorite is now provided by useSettings hook

  const handleSortModeChange = () => {
    const sortModes = ['newest', 'shuffle'];
    const currentIndex = sortModes.indexOf(sortMode);
    const nextIndex = (currentIndex + 1) % sortModes.length;
    const newSortMode = sortModes[nextIndex];
    
    setSortMode(newSortMode);
    
    // Ở chế độ Flashcard: không nhảy từ, chỉ xếp lại thứ tự
    if (flashcardMode) {
      // Giữ nguyên wordIndex để số thứ tự không đổi
      // If switching to shuffle, generate new shuffle order
      if (newSortMode === 'shuffle') {
        setShuffleKey(prev => prev + 1);
      }
    } else {
      // Ở chế độ Luyện tập: reset về từ đầu
      setWordIndex(0);
      // If switching to shuffle, generate new shuffle order
      if (newSortMode === 'shuffle') {
        setShuffleKey(prev => prev + 1);
      }
    }
  };


  // Auto-detect word type based on common patterns
  // Bulk import handled by BulkImportModal component
  const handleBulkImport = async (words) => {
    const result = await bulkImportWords(words);
    if (result.success) {
      setShowModal(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      if (!practice.isAnswered && !quizMode) {
        practice.handleSubmit(currentWord, wordIndex, filteredWords);
      } else if (!quizMode && practice.feedback?.result === 'correct' && !autoAdvance) {
        // Chỉ chuyển từ thủ công nếu không bật autoAdvance
        handleNext();
      }
    }
  };

  // Quiz handlers are now provided by useQuiz hook
  // Use quiz.resetCurrentQuiz, quiz.handleQuizAnswer, quiz.submitQuiz


  const toggleHint = async () => {
    if (!practice.showHint && currentWord) {
      // Khi languageMode === 'english': mặt trước là English, gợi ý = Vietnamese hint (dạng v** v**)
      // Khi languageMode === 'vietnamese': mặt trước là Vietnamese, gợi ý = English hint (dạng ca**)
      if (languageMode === 'english') {
        // Tạo gợi ý cho từ tiếng Việt (dạng v** v**) theo mức độ khó
        const targetWord = currentWord.vietnamese;
        const hint = generateHint(targetWord, difficulty);
        practice.setWordHint(hint);
        practice.setShowHint(true);
      } else {
        // Tạo gợi ý cho từ tiếng Anh (dạng ca**)
        try {
          // Get hint from server
          const wordId = getWordId(currentWord);
          const response = await axios.get(`${API_BASE_URL}/hint/${wordId}`, {
            params: { difficulty }
          });
          practice.setWordHint(response.data.hint);
          practice.setShowHint(true);
        } catch (err) {
          console.error('Error getting hint:', err);
          // Fallback to local hint generation
          const targetWord = currentWord.english;
          const hint = generateHint(targetWord, difficulty);
          practice.setWordHint(hint);
          practice.setShowHint(true);
        }
      }
    } else {
      practice.setShowHint(!practice.showHint);
    }
  };

  // Toggle hint for flashcard mode
  const toggleFlashcardHint = async () => {
    if (!showFlashcardHint && currentWord) {
      try {
        // Khi languageMode === 'english': mặt trước là English, gợi ý = Vietnamese hint (dạng v** v**)
        // Khi languageMode === 'vietnamese': mặt trước là Vietnamese, gợi ý = English hint (dạng ca**)
        if (languageMode === 'english') {
          // Tạo gợi ý cho từ tiếng Việt (dạng v** v**) theo mức độ khó
          const targetWord = currentWord.vietnamese;
          const hint = generateHint(targetWord, difficulty);
          setWordHint(hint);
        } else {
          // Tạo gợi ý cho từ tiếng Anh (dạng ca**)
          const targetWord = currentWord.english;
          const hint = generateHint(targetWord, difficulty);
          setWordHint(hint);
        }
        setShowFlashcardHint(true);
      } catch (err) {
        console.error('Error generating flashcard hint:', err);
      }
    } else {
      setShowFlashcardHint(!showFlashcardHint);
    }
  };

  const speakWord = (text, lang) => {
    // Dùng chung logic với speakText để đảm bảo giọng đọc tiếng Anh tự nhiên
    speakText(text, lang || 'en-US');
  };


  // generateHint is now imported from utils/helpers

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="header">
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '2.5rem', marginBottom: isMobile ? '4px' : '10px' }}>
            🎓 Học Tiếng Anh Thông Minh
          </h1>
          <p style={{ fontSize: isMobile ? '0.85rem' : '1.1rem' }}>
            Quản lý từ vựng cá nhân của bạn
          </p>
        </header>
        
        <div className="vocabulary-card" style={{ 
          position: 'relative',
          padding: isMobile ? '16px 12px' : '30px',
          marginBottom: isMobile ? '0px' : '20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <img src="/cloud-icon.png" alt="Cloud Logo" style={{ width: '64px', height: '64px', marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '15px', color: '#2d3748' }}>
              Chào mừng đến với ứng dụng học tiếng Anh
            </h2>
            <p style={{ color: '#6c757d', marginBottom: '30px', lineHeight: '1.6' }}>
              Nhập tên người dùng và mật khẩu để quản lý từ vựng cá nhân và theo dõi tiến độ học tập.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '15px 30px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              <LogIn size={20} />
              Bắt đầu học
            </button>
          </div>
          
          <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '10px', color: '#667eea' }}>Hướng dẫn sử dụng:</h3>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6c757d' }}>
              • Nhập tên và mật khẩu người dùng để đăng nhập <br></br>
              (Ví dụ: 
              Tên người dùng: vodangky312  <br></br>
              Mật khẩu: 123456)
            </p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6c757d' }}>
              • Nếu chưa có tài khoản, hệ thống sẽ tự động tạo mới
            </p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6c757d' }}>
              • Mỗi người dùng sẽ có từ vựng riêng biệt
            </p>
          </div>
        </div>
        
        {/* Login Modal */}
        {showLoginModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: isMobile ? '10px' : '20px'
          }}>
            <div style={{
              background: '#2d3748',
              borderRadius: isMobile ? '12px' : '15px',
              padding: isMobile ? '8px' : '18px',
              width: isMobile ? '95%' : '90%',
              maxWidth: isMobile ? 'none' : '400px',
              color: 'white',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '8px' : '14px' }}>
                <h2 style={{ margin: 0, fontSize: isMobile ? '1.3rem' : '1.5rem' }}>
                  🎓 Bắt đầu học
                </h2>
                <button 
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    padding: '5px',
                    borderRadius: '50%',
                    width: isMobile ? '36px' : '40px',
                    height: isMobile ? '36px' : '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <X size={isMobile ? 20 : 24} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogin(loginForm.username, loginForm.password, isRegisterMode);
              }}>

                {loginError && (
                  <div style={{
                    color: '#ef4444',
                    fontWeight: 600,
                    textAlign: 'center',
                    margin: '0 0 18px 0',
                    fontSize: '1rem',
                  }}>
                    {loginError}
                  </div>
                )}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>
                    Tên người dùng
                  </label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Nhập tên người dùng"
                    required
                    minLength={3}
                    maxLength={30}
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px' : '10px',
                      border: '1px solid #4a5568',
                      borderRadius: '8px',
                      background: '#1a202c',
                      color: 'white',
                      fontSize: '1rem',
                      minHeight: isMobile ? '48px' : 'auto'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Nhập mật khẩu"
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px' : '10px',
                      border: '1px solid #4a5568',
                      borderRadius: '8px',
                      background: '#1a202c',
                      color: 'white',
                      fontSize: '1rem',
                      minHeight: isMobile ? '48px' : 'auto'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: isMobile ? '14px' : '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loginLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: isMobile ? '48px' : 'auto',
                    opacity: loginLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '15px'
                  }}
                >
                  {loginLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    isRegisterMode ? 'Đăng ký' : 'Đăng nhập'
                  )}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setLoginForm({ username: '', password: '' });
                      setLoginError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textDecoration: 'underline'
                    }}
                  >
                    {isRegisterMode ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
                  </button>
                </div>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: '#a0aec0', margin: 0 }}>
                  {isRegisterMode ? 'Tạo tài khoản mới để bắt đầu học' : 'Đăng nhập để quản lý từ vựng cá nhân'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>🎓 Học Tiếng Anh Thông Minh</h1>
          <p>Đang tải...</p>
        </header>
        <div className="vocabulary-card">
          <div className="loading">
            <Loader className="animate-spin" size={48} />
            <p>Đang tải từ vựng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1>🎓 Học Tiếng Anh Thông Minh</h1>
        </header>
        <div className="vocabulary-card">
          <div className="error">
            {error}
            <button 
              onClick={loadAllWords}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    // Kiểm tra nếu đang ở chế độ yêu thích (practice mode hoặc flashcard mode)
    const isFavoritesMode = flashcardMode ? flashcardFavoritesOnly : (wordFilter === 'favorites');
    
    if (isFavoritesMode) {
      return (
        <div className="app">
          <header className="header">
            <h1>🎓 Học Tiếng Anh Thông Minh</h1>
          </header>
          <div className="vocabulary-card">
            <div className="error" style={{textAlign: 'center', padding: '30px 20px'}}>
              <p style={{fontSize: '1.2rem', marginBottom: '15px', fontWeight: '600', color: '#2d3748'}}>
                Không có từ vựng nào để học.
              </p>
              <p style={{fontSize: '1rem', marginBottom: '25px', color: '#718096'}}>
                Vui lòng thêm từ vào danh sách yêu thích để bắt đầu học.
              </p>
              <button
                onClick={() => {
                  if (flashcardMode) {
                    setFlashcardFavoritesOnly(false);
                  } else {
                    setWordFilter('all');
                  }
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Trường hợp không có từ vựng nào (không phải do filter yêu thích)
    return (
      <div className="app">
        <header className="header">
          <h1>🎓 Học Tiếng Anh Thông Minh</h1>
        </header>
        <div className="vocabulary-card">
          <div className="error">
            Không có từ vựng nào để học.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.4rem' : '2.5rem', marginBottom: isMobile ? '4px' : '10px' }}>
              🎓 Học Tiếng Anh Thông Minh
            </h1>
            <p style={{ fontSize: isMobile ? '0.85rem' : '1.1rem' }}>
              Luyện tập từ vựng với ☁️ nha
            </p>
          </div>
        </div>
      </header>

      <div className="vocabulary-card" style={{ 
        position: 'relative',
        padding: quizMode 
          ? (isMobile ? '16px 0' : '30px 0') 
          : (isMobile ? '16px 12px' : '30px'),
        marginBottom: isMobile ? '0px' : '20px'
      }}>
        {/* Mode Toggle */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: isMobile ? '12px' : '20px',
          justifyContent: 'center'
        }}>
          {/* Nút Luyện tập kèm dropdown chọn chế độ Nhập từ / Trắc nghiệm */}
          <div 
            data-practice-dropdown
            style={{ flex: 1, position: 'relative' }}
          >
            <button
              onClick={() => {
                setFlashcardMode(false);
                setShowPracticeModeDropdown(prev => !prev);
              }}
              style={{
                width: '100%',
                padding: isMobile ? '10px' : '12px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: isMobile ? '10px' : '12px',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                boxShadow: !flashcardMode ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={18} />
                <span>Luyện tập ({quizMode ? 'Trắc nghiệm' : 'Nhập từ'})</span>
              </span>
              <span style={{ fontSize: '0.8rem', transform: showPracticeModeDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {showPracticeModeDropdown && !flashcardMode && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '6px',
                  background: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  border: '1px solid rgba(102,126,234,0.2)'
                }}
              >
                {/* Nút Nhập từ (tự gõ đáp án) */}
                <button
                  onClick={() => {
                    setQuizMode(false);
                    setShowPracticeModeDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 14px' : '12px 16px',
                    border: 'none',
                    background: !quizMode ? 'rgba(16,185,129,0.08)' : 'transparent',
                    color: !quizMode ? '#059669' : '#2d3748',
                    cursor: 'pointer',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: !quizMode ? 600 : 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>✍️</span>
                  <span>Nhập từ</span>
                </button>
                {/* Nút Trắc nghiệm */}
                <button
                  onClick={() => {
                    if (quiz.initializeQuiz()) {
                    setQuizMode(true);
                    setShowPracticeModeDropdown(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 14px' : '12px 16px',
                    border: 'none',
                    background: quizMode ? 'rgba(16,185,129,0.08)' : 'transparent',
                    color: quizMode ? '#059669' : '#2d3748',
                    cursor: 'pointer',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: quizMode ? 600 : 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderTop: '1px solid rgba(148,163,184,0.3)'
                  }}
                >
                  <span>✅</span>
                  <span>Trắc nghiệm</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setFlashcardMode(true)}
            style={{
              flex: 1,
              padding: isMobile ? '10px' : '12px 20px',
              background: flashcardMode ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' : 'rgba(255, 154, 158, 0.1)',
              color: flashcardMode ? '#ff6b6b' : '#ff9a9e',
              border: 'none',
              borderRadius: isMobile ? '10px' : '12px',
              fontSize: isMobile ? '0.9rem' : '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: flashcardMode ? '0 4px 15px rgba(255, 154, 158, 0.4)' : 'none'
            }}
          >
            <FileText size={18} />
            Flashcard
          </button>
        </div>

        {/* Flashcard Mode UI */}
        {flashcardMode ? (
          <Flashcard
            currentWord={currentWord}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            showFlashcardHint={showFlashcardHint}
            wordHint={wordHint}
            languageMode={languageMode}
            favorites={favorites}
            isMobile={isMobile}
            slideDirection={slideDirection}
            wordIndex={wordIndex}
            limitedFlashcardFilteredWords={limitedFlashcardFilteredWords}
            limitedFilteredWords={limitedFilteredWords}
            flashcardMode={flashcardMode}
            flashcardFavoritesOnly={flashcardFavoritesOnly}
            showFlashcardSettings={showFlashcardSettings}
            setShowFlashcardSettings={setShowFlashcardSettings}
            sortMode={sortMode}
            toggleFlashcardHint={toggleFlashcardHint}
            toggleFavorite={toggleFavorite}
            handleSortModeChange={handleSortModeChange}
            setLanguageMode={setLanguageMode}
            setFlashcardFavoritesOnly={setFlashcardFavoritesOnly}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
          />
        ) : quizMode ? (
          <Quiz
            quizMode={quizMode}
            quizQuestions={quiz.quizQuestions}
            quizCompleted={quiz.quizCompleted}
            quizView={quiz.quizView}
            quizScore={quiz.quizScore}
            quizTotalQuestions={quiz.quizTotalQuestions}
            quizFavoritesOnly={quiz.quizFavoritesOnly}
            showQuizSettings={quiz.showQuizSettings}
            setShowQuizSettings={quiz.setShowQuizSettings}
            languageMode={languageMode}
            favorites={favorites}
            isMobile={isMobile}
            sortMode={sortMode}
            filteredWords={filteredWords}
            maxQuestions={maxQuestions}
            handleQuizAnswer={quiz.handleQuizAnswer}
            submitQuiz={quiz.submitQuiz}
            resetCurrentQuiz={quiz.resetCurrentQuiz}
            setQuizView={quiz.setQuizView}
            setQuizQuestions={quiz.setQuizQuestions}
            setQuizScore={quiz.setQuizScore}
            setQuizTotalQuestions={quiz.setQuizTotalQuestions}
            setQuizCompleted={quiz.setQuizCompleted}
            setLanguageMode={setLanguageMode}
            setQuizFavoritesOnly={quiz.setQuizFavoritesOnly}
            handleSortModeChange={handleSortModeChange}
            buildQuizOptions={buildQuizOptions}
            getWordId={getWordId}
            setFavorites={setFavorites}
          />
        ) : (
          <Practice
            currentWord={currentWord}
            userInput={practice.userInput}
            setUserInput={practice.setUserInput}
            feedback={practice.feedback}
            isAnswered={practice.isAnswered}
            showHint={practice.showHint}
            wordHint={practice.wordHint}
            showAnswer={practice.showAnswer}
            setShowAnswer={practice.setShowAnswer}
            languageMode={languageMode}
            favorites={favorites}
            isMobile={isMobile}
            wordIndex={wordIndex}
            limitedFilteredWords={limitedFilteredWords}
            practiceCompleted={practice.practiceCompleted}
            practiceResults={practice.practiceResults}
            setPracticeCompleted={practice.setPracticeCompleted}
            showPracticeSettings={showPracticeSettings}
            setShowPracticeSettings={setShowPracticeSettings}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            showTips={showTips}
            setShowTips={setShowTips}
            sortMode={sortMode}
            wordFilter={wordFilter}
            autoAdvance={autoAdvance}
            toggleHint={toggleHint}
            toggleFavorite={toggleFavorite}
            handleSubmit={(e) => practice.handleSubmit(currentWord, wordIndex, filteredWords)}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleRetry={practice.handleRetry}
            handleKeyPress={handleKeyPress}
            handleSortModeChange={handleSortModeChange}
            setLanguageMode={setLanguageMode}
            setWordFilter={setWordFilter}
            resetPractice={resetPractice}
            speakWord={speakWord}
          />
        )}
        
      </div>

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={showModal}
        onClose={() => {
                  setShowModal(false);
                  setShowSettings(true);
                }}
        onImport={handleBulkImport}
        isMobile={isMobile}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />


      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isMobile={isMobile}
        user={user}
        stats={stats}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        autoAdvance={autoAdvance}
        setAutoAdvance={setAutoAdvance}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        maxQuestions={maxQuestions}
        setMaxQuestions={setMaxQuestions}
        wordFilter={wordFilter}
        setWordFilter={setWordFilter}
        sortMode={sortMode}
        setSortMode={setSortMode}
        onLogout={handleLogout}
        onResetStats={resetStats}
        onDeleteVocabulary={() => deleteVocabulary()}
        onOpenBulkImport={() => {
          setShowModal(true);
                      setShowSettings(false);
        }}
      />

      {/* Tips Modal */}
      <TipsModal
        isOpen={showTips}
        onClose={() => setShowTips(false)}
        isMobile={isMobile}
      />
    </div>
  );
}

export default App;

