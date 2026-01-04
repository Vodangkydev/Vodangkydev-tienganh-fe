import React, { useRef } from 'react';
import { Star, Volume2, ListChecks, Eye, RotateCcw, AlertCircle, XCircle, Settings } from 'lucide-react';
import { getWordId } from '../utils/helpers';
import { speakText } from '../utils/soundUtils';
import '../styles/practice.css';

// Compact Icons Component (tạm thời, có thể tách ra sau)
const CompactIcons = {
  Checkmark: ({ size = 20, color = "#4caf50" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={color}/>
    </svg>
  ),
  Lightbulb: ({ size = 20, color = "#ff6b6b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" fill={color}/>
    </svg>
  ),
  MagnifyingGlass: ({ size = 20, color = "#ff6b6b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={color}/>
    </svg>
  )
};

const Practice = ({
  currentWord,
  userInput,
  setUserInput,
  feedback,
  isAnswered,
  showHint,
  wordHint,
  showAnswer,
  setShowAnswer,
  languageMode,
  favorites,
  isMobile,
  wordIndex,
  limitedFilteredWords,
  practiceCompleted,
  practiceResults,
  setPracticeCompleted,
  showPracticeSettings,
  setShowPracticeSettings,
  showSettings,
  setShowSettings,
  showTips,
  setShowTips,
  sortMode,
  wordFilter,
  autoAdvance,
  toggleHint,
  toggleFavorite,
  handleSubmit,
  handleNext,
  handlePrevious,
  handleRetry,
  handleKeyPress,
  handleSortModeChange,
  setLanguageMode,
  setWordFilter,
  resetPractice,
  speakWord
}) => {
  const wordDisplayRef = useRef(null);

  if (!currentWord) return null;

  // Wrapper to ensure sound plays when clicking next button
  const handleNextWithSound = () => {
    handleNext(false); // Explicitly pass false to ensure sound plays
  };

  // Handle input focus - scroll word display to top of screen immediately
  const handleInputFocus = (e) => {
    // Style changes
    e.target.style.borderColor = '#667eea';
    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), 0 8px 25px rgba(102, 126, 234, 0.15)';
    e.target.style.transform = 'translateY(-1px)';
    e.target.style.background = 'rgba(255, 255, 255, 0.95)';
    
    // Scroll word display section to top of screen immediately - works on both mobile and desktop
    if (wordDisplayRef.current) {
      const element = wordDisplayRef.current;
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = 20; // Small offset from top
      
      // Use requestAnimationFrame to ensure smooth scroll
      requestAnimationFrame(() => {
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        });
      });
    }
  };

  // Practice completed screen
  if (practiceCompleted) {
    return (
      <div style={{
        marginBottom: isMobile ? '20px' : '30px',
        padding: isMobile ? '20px' : '30px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: isMobile ? '12px' : '20px',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Kết quả
        </h2>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '15px 20px',
            background: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            minWidth: '100px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4caf50' }}>
              {Object.values(practiceResults).filter(r => r === 'correct').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>Đúng</div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '15px 20px',
            background: 'rgba(255, 152, 0, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            minWidth: '100px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff9800' }}>
              {Object.values(practiceResults).filter(r => r === 'nearly-correct').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>Gần đúng</div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '15px 20px',
            background: 'rgba(244, 67, 54, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            minWidth: '100px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f44336' }}>
              {Object.values(practiceResults).filter(r => r === 'incorrect').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>Sai</div>
          </div>
        </div>
        
        {/* Detail list */}
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          marginBottom: '20px'
        }}>
          {limitedFilteredWords.map((word) => {
            const wordId = getWordId(word);
            const result = practiceResults[wordId];
            const resultColor = result === 'correct' ? '#4caf50' : result === 'nearly-correct' ? '#ff9800' : '#f44336';
            const resultText = result === 'correct' ? '✓ Đúng' : result === 'nearly-correct' ? '~ Gần đúng' : '✗ Sai';
            
            return (
              <div key={word.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: '8px',
                background: 'white',
                borderRadius: '8px',
                border: `1px solid ${resultColor}40`
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {word.vietnamese} - {word.english}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {word.type}
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: `${resultColor}20`,
                  color: resultColor,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  {resultText}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Reset button */}
        <button
          onClick={resetPractice}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
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
          Làm lại
        </button>
      </div>
    );
  }

  // Main practice view
  return (
    <div className="slide-container">
      <div key={wordIndex}>
        {/* Word Display */}
        <div ref={wordDisplayRef} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: isMobile ? '15px' : '25px',
          paddingBottom: isMobile ? '12px' : '20px',
          borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="word-display" style={{ 
                margin: 0, 
                fontSize: isMobile ? '1.6rem' : '2.2rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() => speakWord(currentWord.english, 'en-US')}
              >
                {languageMode === 'vietnamese' ? currentWord.vietnamese : currentWord.english}
              </h2>
              <button
                onClick={() => speakWord(currentWord.english, 'en-US')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  borderRadius: '50%',
                  color: '#667eea'
                }}
                title="Phát âm"
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Volume2 size={20} />
              </button>
            </div>
            <div style={{ 
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div className="word-type">
                {currentWord.type}
              </div>
              <button
                onClick={() => toggleFavorite(getWordId(currentWord))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                title={favorites.includes(getWordId(currentWord)) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <Star 
                  size={20} 
                  fill={favorites.includes(getWordId(currentWord)) ? '#ffc107' : 'none'}
                  color={favorites.includes(getWordId(currentWord)) ? '#ffc107' : '#9ca3af'}
                />
              </button>
            </div>
          </div>
          
          {/* Settings button */}
          <div data-practice-settings style={{ position: 'relative', marginRight: '8px' }}>
            <button 
              onClick={() => setShowPracticeSettings(prev => !prev)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: isMobile ? '44px' : '48px',
                height: isMobile ? '44px' : '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                flexShrink: 0,
                transition: 'all 0.18s cubic-bezier(.4,0,.2,1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = 'none';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
              title="Cài đặt luyện tập"
            >
              <ListChecks size={isMobile ? 20 : 22} />
            </button>
            
            {/* Settings dropdown */}
            {showPracticeSettings && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 10000,
                  overflow: 'hidden',
                  border: '1px solid rgba(102,126,234,0.2)',
                  minWidth: '200px'
                }}
              >
                <button
                  onClick={() => {
                    handleSortModeChange();
                    setShowPracticeSettings(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRight: 'none',
                    borderBottom: 'none',
                    borderLeft: 'none',
                    background: sortMode === 'shuffle' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    color: 'rgb(45, 55, 72)',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: sortMode === 'shuffle' ? 600 : 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.background = sortMode === 'shuffle' ? 'rgba(102, 126, 234, 0.15)' : 'rgba(108, 117, 125, 0.08)'}
                  onMouseLeave={(e) => e.target.style.background = sortMode === 'shuffle' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.59 9.17L5.41 4L4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" fill={sortMode === 'shuffle' ? '#667eea' : '#9ca3af'}></path>
                  </svg>
                  <span>Ngẫu nhiên</span>
                </button>
                
                <button
                  onClick={() => {
                    setWordFilter(wordFilter === 'favorites' ? 'all' : 'favorites');
                    setShowPracticeSettings(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: wordFilter === 'favorites' ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                    color: '#2d3748',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: wordFilter === 'favorites' ? 600 : 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s ease',
                    borderTop: '1px solid rgba(148,163,184,0.2)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 193, 7, 0.15)'}
                  onMouseLeave={(e) => e.target.style.background = wordFilter === 'favorites' ? 'rgba(255, 193, 7, 0.1)' : 'transparent'}
                >
                  <Star 
                    size={18}
                    fill={wordFilter === 'favorites' ? '#ffc107' : 'none'}
                    color={wordFilter === 'favorites' ? '#ffc107' : '#9ca3af'}
                  />
                  <span>{wordFilter === 'favorites' ? 'Hiển thị tất cả' : 'Chỉ từ yêu thích'}</span>
                </button>
                
                <button
                  onClick={() => {
                    setLanguageMode(languageMode === 'vietnamese' ? 'english' : 'vietnamese');
                    setShowPracticeSettings(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'transparent',
                    color: '#2d3748',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s ease',
                    borderTop: '1px solid rgba(148,163,184,0.2)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(102, 126, 234, 0.08)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '1.2rem' }}>🌐</span>
                  <span>{languageMode === 'vietnamese' ? 'Chuyển VN→EN' : 'Chuyển EN→VN'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hint Button */}
        <div className="image-hint">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '20px',
            position: 'relative'
          }}>
            <button 
              onClick={toggleHint}
              style={{
                background: showHint 
                  ? 'linear-gradient(135deg, #ff4757 0%, #ff3742 50%, #ff2f3a 100%)'
                  : 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 50%, #ff4757 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                color: 'white',
                fontSize: isMobile ? '0.9rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '10px 16px' : '12px 20px',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                boxShadow: showHint 
                  ? '0 6px 20px rgba(255, 71, 87, 0.5)'
                  : '0 4px 15px rgba(255, 107, 107, 0.4)',
                transform: 'translateY(0)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = showHint 
                  ? '0 4px 15px rgba(255, 107, 107, 0.4)'
                  : '0 2px 10px rgba(255, 107, 107, 0.2)';
              }}
            >
              <CompactIcons.MagnifyingGlass size={20} color="white" />
              {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
            </button>
          </div>
          
          {showHint && wordHint && (
            <div className="word-hint">
              <div className="hint-display">{wordHint}</div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="input-section" style={{ 
          marginBottom: isMobile ? '20px' : '30px',
          padding: isMobile ? '12px' : '25px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: isMobile ? '12px' : '20px',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            gap: isMobile ? '10px' : '15px',
            alignItems: 'stretch',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <input
              type="text"
              className="input-field"
              placeholder={languageMode === 'vietnamese' ? "Nhập từ tiếng Anh..." : "Nhập từ tiếng Việt..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAnswered}
              style={{
                flex: 1,
                padding: isMobile ? '14px 16px' : '16px 20px',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: isMobile ? '12px' : '16px',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: '500',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                minHeight: isMobile ? '48px' : 'auto'
              }}
              onFocus={handleInputFocus}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            />
            <button 
              className="submit-btn"
              onClick={() => {
                if (isAnswered) {
                  if (wordIndex === limitedFilteredWords.length - 1) {
                    // Hiển thị kết quả khi nhấn nút "Kết quả"
                    setPracticeCompleted(true);
                  } else {
                    // Cho phép chuyển tiếp thủ công dù đúng hay sai
                    handleNext();
                  }
                } else if (!isAnswered) {
                  handleSubmit();
                }
              }}
              disabled={!userInput.trim() && !isAnswered}
              style={{
                background: isAnswered && feedback?.result === 'correct' 
                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: isMobile ? '12px' : '16px',
                padding: isMobile ? '14px 20px' : '16px 24px',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                width: isMobile ? '100%' : 'auto',
                minWidth: isMobile ? 'auto' : '120px',
                minHeight: isMobile ? '48px' : 'auto',
                position: 'relative',
                overflow: 'hidden',
                opacity: 1
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
              {isAnswered 
                ? (wordIndex === limitedFilteredWords.length - 1 
                    ? 'Kết quả' 
                    : 'Tiếp')
                : 'Kiểm tra'}
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`feedback ${feedback.result}`}>
            {feedback.result === 'correct' && (
              <>
                <CompactIcons.Checkmark size={24} color="#4caf50" style={{ marginRight: '10px' }} />
                Đúng rồi! 🎉
              </>
            )}
            {feedback.result === 'nearly-correct' && (
              <>
                <AlertCircle size={24} style={{ marginRight: '10px' }} />
                Gần đúng! Hãy thử lại! 💡
              </>
            )}
            {feedback.result === 'incorrect' && (
              <>
                <XCircle size={24} style={{ marginRight: '10px' }} />
                Chưa đúng. Hãy thử lại! 💪
              </>
            )}
            {feedback.pronunciation && (
              <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                Phát âm: <em>{feedback.pronunciation}</em>
              </div>
            )}
          </div>
        )}

        {/* Show Answer */}
        {isAnswered && (
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            {!showAnswer ? (
              <button 
                onClick={() => setShowAnswer(true)}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#ff5252'}
                onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
              >
                <Eye size={20} />
                Xem đáp án
              </button>
            ) : (
              <div style={{ 
                background: '#e8f5e8', 
                padding: '15px', 
                borderRadius: '10px', 
                textAlign: 'center',
                border: '2px solid #4caf50'
              }}>
                <strong style={{ color: '#2e7d32' }}>Đáp án đúng: {feedback.correctAnswer}</strong>
                {languageMode === 'vietnamese' && (
                  <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
                    (Từ tiếng Việt: {currentWord.vietnamese})
                  </div>
                )}
                {languageMode === 'english' && (
                  <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
                    (Từ tiếng Anh: {currentWord.english})
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Retry Button */}
        {isAnswered && feedback?.result !== 'correct' && (
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleRetry}
              style={{
                width: '100%',
                padding: '12px',
                background: '#ffa726',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff9800';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ffa726';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <RotateCcw size={16} />
              Thử lại
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        {!isAnswered && (
          <div className="navigation-buttons" style={{ 
            display: 'flex', 
            gap: '20px', 
            marginTop: '20px', 
            justifyContent: 'center',
            padding: '0 20px'
          }}>
            <button 
              onClick={handlePrevious}
              className="nav-button"
              style={{
                background: 'linear-gradient(135deg, #9c27b0 0%, #8e24aa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                width: '60px',
                height: '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                fontSize: '1.5rem',
                marginRight: 'auto',
                boxShadow: '0 3px 10px rgba(156, 39, 176, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #8e24aa 0%, #7b1fa2 100%)';
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 5px 15px rgba(156, 39, 176, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #9c27b0 0%, #8e24aa 100%)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 3px 10px rgba(156, 39, 176, 0.3)';
              }}
              title="Lùi"
            >
              ⬅️
            </button>
            
            <button 
              onClick={handleNextWithSound}
              className="nav-button"
              style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                width: '60px',
                height: '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                fontSize: '1.5rem',
                marginLeft: 'auto',
                boxShadow: '0 3px 10px rgba(76, 175, 80, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)';
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 5px 15px rgba(76, 175, 80, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 3px 10px rgba(76, 175, 80, 0.3)';
              }}
              title="Tiếp"
            >
              ➡️
            </button>
          </div>
        )}

        {/* Bottom Section - Controls */}
        <div style={{
          marginTop: isMobile ? '12px' : '15px',
          paddingTop: isMobile ? '12px' : '15px',
          borderTop: '1px solid #e2e8f0'
        }}>
          {/* Navigation Info */}
          <div style={{ 
            textAlign: 'center', 
            color: '#6c757d', 
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '500',
            padding: isMobile ? '6px 12px' : '8px 16px',
            background: 'rgba(108, 117, 125, 0.1)',
            borderRadius: isMobile ? '15px' : '20px',
            border: '1px solid rgba(108, 117, 125, 0.2)',
            marginBottom: isMobile ? '12px' : '15px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            Từ {wordIndex + 1} / {limitedFilteredWords.length}
          </div>

          {/* Settings and Tips Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '12px' : '15px'
          }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: isMobile ? '48px' : '52px',
                height: isMobile ? '48px' : '52px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '1rem' : '1.1rem',
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                e.target.style.transform = 'translateY(-3px) scale(1.08)';
                e.target.style.boxShadow = 'none';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
              title="Cài đặt"
            >
              <Settings size={22} />
            </button>

            <button
              onClick={() => setShowTips(true)}
              style={{
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                color: '#ff6b6b',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: isMobile ? '48px' : '52px',
                height: isMobile ? '48px' : '52px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: isMobile ? '0.65rem' : '0.7rem',
                fontWeight: 'bold',
                boxShadow: 'none',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ff8a95 0%, #fecfef 100%)';
                e.target.style.transform = 'translateY(-3px) scale(1.08)';
                e.target.style.boxShadow = 'none';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
              title="Mẹo và hướng dẫn"
            >
              <CompactIcons.Lightbulb size={18} color="#ff6b6b" />
              <span style={{ fontSize: '0.6rem', marginTop: '2px' }}>MẸO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
