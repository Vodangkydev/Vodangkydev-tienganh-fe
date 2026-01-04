import React, { useRef } from 'react';
import { Star, Volume2, ListChecks } from 'lucide-react';
import { getWordId } from '../utils/helpers';
import { speakText, playFlipSound } from '../utils/soundUtils';
import '../styles/flashcard.css';

const Flashcard = ({
  currentWord,
  isFlipped,
  setIsFlipped,
  showFlashcardHint,
  wordHint,
  languageMode,
  favorites,
  isMobile,
  slideDirection,
  wordIndex,
  limitedFlashcardFilteredWords,
  limitedFilteredWords,
  flashcardMode,
  flashcardFavoritesOnly,
  showFlashcardSettings,
  setShowFlashcardSettings,
  sortMode,
  toggleFlashcardHint,
  toggleFavorite,
  handleSortModeChange,
  setLanguageMode,
  setFlashcardFavoritesOnly,
  handleNext,
  handlePrevious,
  handleTouchStart,
  handleTouchEnd,
  soundEnabled
}) => {
  const touchStartRef = useRef(null);
  const isSwipingRef = useRef(false);

  if (!currentWord) return null;

  // Function to speak English only
  const speakEnglish = () => {
    speakText(currentWord.english, 'en-US');
  };

  // Wrapper to ensure sound plays when clicking next button
  const handleNextWithSound = () => {
    handleNext(false); // Explicitly pass false to ensure sound plays
  };

  const handleFlip = (e) => {
    // Prevent flip if it was a swipe gesture
    if (isSwipingRef.current) {
      isSwipingRef.current = false;
      return;
    }
    setIsFlipped(!isFlipped);
    playFlipSound(soundEnabled);
  };

  const onCardTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    isSwipingRef.current = false;
    // Call useSwipe handler first
    if (handleTouchStart) {
      handleTouchStart(e);
    }
  };

  const onCardTouchEnd = (e) => {
    // Call useSwipe handler first to detect swipe
    if (handleTouchEnd) {
      handleTouchEnd(e);
    }
    
    // Then check if it was a swipe to prevent flip
    if (touchStartRef.current) {
      const touchEnd = e.changedTouches[0];
      const deltaX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);
      
      // If horizontal movement is significant, it's a swipe
      if (deltaX > 50 && deltaX > deltaY) {
        isSwipingRef.current = true;
        // Reset after a short delay to allow navigation
        setTimeout(() => {
          isSwipingRef.current = false;
        }, 300);
      }
      touchStartRef.current = null;
    }
  };

  return (
    <div className="slide-container" style={{ paddingBottom: isMobile ? '120px' : '40px' }}>
      <div className={`slide-content slide-${slideDirection}`} key={wordIndex}>
        <div 
          className="flashcard"
          onClick={handleFlip}
          onTouchStart={onCardTouchStart}
          onTouchEnd={onCardTouchEnd}
          style={{
            cursor: 'pointer',
            width: '100%',
            minHeight: isMobile ? '400px' : '300px',
            position: 'relative',
            marginBottom: isMobile ? '20px' : '30px',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            touchAction: 'pan-x pan-y'
          }}
        >
          {/* Front of card */}
          <div className="flashcard-content flashcard-front" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
            borderRadius: '20px',
            padding: isMobile ? '30px 20px' : '40px',
            boxShadow: '0 10px 40px rgba(45, 55, 72, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            top: 0,
            left: 0
          }}>
            {/* Hint button */}
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              borderRadius: '20px',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFlashcardHint();
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}>
              <div style={{ fontSize: '1.2rem' }}>💡</div>
              <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', opacity: 0.8 }}>
                {showFlashcardHint && wordHint ? wordHint : (languageMode === 'vietnamese' ? 'Hiển thị gợi ý' : 'Show hint')}
              </span>
            </div>
            
            {/* Favorite and Sound buttons */}
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(getWordId(currentWord));
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  borderRadius: '50%'
                }}
                title={favorites.includes(getWordId(currentWord)) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Star 
                  size={20} 
                  fill={favorites.includes(getWordId(currentWord)) ? '#ffc107' : 'none'}
                  color={favorites.includes(getWordId(currentWord)) ? '#ffc107' : '#f1f5f9'}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakEnglish();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  borderRadius: '50%'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
                title="Phát âm"
              >
                <Volume2 size={20} color="#f1f5f9" />
              </button>
            </div>

            <h3 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '700', marginBottom: '15px', textAlign: 'center' }}>
              {languageMode === 'vietnamese' ? currentWord.vietnamese : currentWord.english}
            </h3>
            <div style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', opacity: 0.8, textAlign: 'center' }}>
              {languageMode === 'vietnamese' ? 'Nhấn để xem đáp án' : 'Click to see answer'}
            </div>
          </div>

          {/* Back of card */}
          <div className="flashcard-content flashcard-back" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
            borderRadius: '20px',
            padding: isMobile ? '30px 20px' : '40px',
            boxShadow: '0 10px 40px rgba(45, 55, 72, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transform: 'rotateY(180deg)',
            top: 0,
            left: 0
          }}>
            {/* Hint button */}
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              borderRadius: '20px',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFlashcardHint();
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}>
              <div style={{ fontSize: '1.2rem' }}>💡</div>
              <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', opacity: 0.8 }}>
                {showFlashcardHint && wordHint ? wordHint : (languageMode === 'vietnamese' ? 'Hiển thị gợi ý' : 'Show hint')}
              </span>
            </div>
            
            {/* Favorite and Sound buttons */}
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(getWordId(currentWord));
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  borderRadius: '50%'
                }}
                title={favorites.includes(getWordId(currentWord)) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Star 
                  size={20} 
                  fill={favorites.includes(getWordId(currentWord)) ? '#ffc107' : 'none'}
                  color={favorites.includes(getWordId(currentWord)) ? '#ffc107' : '#f1f5f9'}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakEnglish();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  borderRadius: '50%'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
                title="Phát âm"
              >
                <Volume2 size={20} color="#f1f5f9" />
              </button>
            </div>

            <h3 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>
              {languageMode === 'vietnamese' ? currentWord.english : currentWord.vietnamese}
            </h3>
            <div style={{ 
              fontSize: isMobile ? '0.85rem' : '1rem', 
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              marginTop: '10px'
            }}>
              {currentWord.type}
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Controls - Settings */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: isMobile ? '10px' : '20px',
        position: 'relative'
      }}>
        <div data-flashcard-settings style={{ position: 'relative' }}>
          <button
            onClick={() => setShowFlashcardSettings(prev => !prev)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '48px' : '56px',
              height: isMobile ? '48px' : '56px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.18s cubic-bezier(.4,0,.2,1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
            }}
            title="Cài đặt flashcard"
          >
            <ListChecks size={isMobile ? 20 : 22} />
          </button>
          
          {/* Dropdown menu */}
          {showFlashcardSettings && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '8px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: 1000,
                overflow: 'hidden',
                border: '1px solid rgba(102,126,234,0.2)',
                minWidth: '200px'
              }}
            >
              <button
                onClick={() => {
                  handleSortModeChange();
                  setShowFlashcardSettings(false);
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
                  transition: 'background 0.2s'
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
                  setFlashcardFavoritesOnly(prev => !prev);
                  setShowFlashcardSettings(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: flashcardFavoritesOnly ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                  color: '#2d3748',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: flashcardFavoritesOnly ? 600 : 500,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background 0.2s ease',
                  borderTop: '1px solid rgba(148,163,184,0.2)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 193, 7, 0.15)'}
                onMouseLeave={(e) => e.target.style.background = flashcardFavoritesOnly ? 'rgba(255, 193, 7, 0.1)' : 'transparent'}
              >
                <Star 
                  size={18}
                  fill={flashcardFavoritesOnly ? '#ffc107' : 'none'}
                  color={flashcardFavoritesOnly ? '#ffc107' : '#9ca3af'}
                />
                <span>{flashcardFavoritesOnly ? 'Hiển thị tất cả' : 'Chỉ từ yêu thích'}</span>
              </button>
              
              <button
                onClick={() => {
                  setLanguageMode(languageMode === 'vietnamese' ? 'english' : 'vietnamese');
                  setIsFlipped(false);
                  setShowFlashcardSettings(false);
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

      {/* Navigation buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center',
        marginTop: isMobile ? '10px' : '20px'
      }}>
        <button 
          onClick={handlePrevious}
          style={{
            background: 'linear-gradient(135deg, #9c27b0 0%, #8e24aa 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '28px',
            width: '70px',
            height: '56px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            fontSize: '1.8rem',
            boxShadow: '0 4px 15px rgba(156, 39, 176, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #8e24aa 0%, #7b1fa2 100%)';
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 6px 25px rgba(156, 39, 176, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #9c27b0 0%, #8e24aa 100%)';
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(156, 39, 176, 0.4)';
          }}
        >
          ⬅️
        </button>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
          gap: '8px'
        }}>
          <div style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: '#6c757d', fontWeight: '600' }}>
            {wordIndex + 1} / {flashcardMode ? limitedFlashcardFilteredWords.length : limitedFilteredWords.length}
          </div>
        </div>
        
        <button 
          onClick={handleNextWithSound}
          style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '28px',
            width: '70px',
            height: '56px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            fontSize: '1.8rem',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)';
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 6px 25px rgba(76, 175, 80, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
          }}
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
