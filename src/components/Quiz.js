import React from 'react';
import { Star, Volume2, ListChecks } from 'lucide-react';
import { speakText } from '../utils/soundUtils';
import '../styles/quiz.css';

const Quiz = ({
  quizMode,
  quizQuestions,
  quizCompleted,
  quizView,
  quizScore,
  quizTotalQuestions,
  quizFavoritesOnly,
  showQuizSettings,
  setShowQuizSettings,
  languageMode,
  favorites,
  isMobile,
  sortMode,
  filteredWords,
  maxQuestions,
  handleQuizAnswer,
  submitQuiz,
  resetCurrentQuiz,
  setQuizView,
  setQuizQuestions,
  setQuizScore,
  setQuizTotalQuestions,
  setQuizCompleted,
  setLanguageMode,
  setQuizFavoritesOnly,
  handleSortModeChange,
  buildQuizOptions,
  getWordId,
  setFavorites
}) => {
  if (!quizMode) return null;

  const displayedQuestions = quizFavoritesOnly 
    ? quizQuestions.filter(q => favorites.includes(q.wordId))
    : quizQuestions;

  const answeredCount = displayedQuestions.filter(q => q.selectedIndex != null).length;
  const totalDisplayed = displayedQuestions.length;

  const speakWord = (text, lang) => {
    speakText(text, lang || 'en-US');
  };

  // Summary view
  if (quizView === 'summary') {
    return (
      <div style={{
        marginBottom: isMobile ? '20px' : '30px',
        padding: isMobile ? '16px' : '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 64, 175, 0.9) 100%)',
        borderRadius: isMobile ? '12px' : '20px',
        border: '1px solid rgba(129, 140, 248, 0.3)',
        color: 'white',
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ textAlign: 'center', margin: 'auto 0' }}>
          <h2 style={{ marginBottom: '10px', fontSize: isMobile ? '1.4rem' : '1.8rem' }}>
            Đừng bỏ cuộc lúc này! Hãy vững tin.
          </h2>
          <p style={{ marginBottom: '12px', fontSize: isMobile ? '1rem' : '1.1rem' }}>
            Bạn đúng <strong>{quizScore}</strong> / <strong>{quizTotalQuestions}</strong> câu.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={resetCurrentQuiz}
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: isMobile ? '0.95rem' : '1rem',
                minWidth: '150px'
              }}
            >
              Làm lại
            </button>
            <button
              onClick={() => setQuizView('detail')}
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: isMobile ? '0.95rem' : '1rem',
                minWidth: '180px'
              }}
            >
              Xem kết quả chi tiết
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz view
  return (
    <div style={{
      marginBottom: isMobile ? '20px' : '30px',
      padding: isMobile ? '16px' : '24px',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 64, 175, 0.9) 100%)',
      borderRadius: isMobile ? '12px' : '20px',
      border: '1px solid rgba(129, 140, 248, 0.3)',
      color: 'white',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: isMobile ? '12px' : '8px',
        gap: isMobile ? '8px' : '12px'
      }}>
        <div style={{ 
          fontSize: isMobile ? '0.875rem' : '1rem', 
          opacity: 0.9, 
          flex: 1,
          lineHeight: '1.5',
          wordBreak: 'break-word'
        }}>
          {quizCompleted && quizView === 'detail'
            ? 'Danh sách câu hỏi và đáp án của bạn'
            : languageMode === 'vietnamese'
              ? 'Chọn nghĩa tiếng Việt đúng cho mỗi từ tiếng Anh'
              : 'Chọn từ tiếng Anh đúng cho mỗi nghĩa tiếng Việt'}
        </div>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'space-between' : 'flex-end'
        }}>
          <div style={{ fontSize: isMobile ? '0.875rem' : '0.95rem', opacity: 0.8 }}>
            {answeredCount}/{totalDisplayed}
          </div>
          
          {/* Settings button */}
          {!quizCompleted && (
            <div data-quiz-settings style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowQuizSettings(prev => !prev)}
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
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                flexShrink: 0,
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
              title="Cài đặt trắc nghiệm"
            >
              <ListChecks size={isMobile ? 20 : 22} />
            </button>
            
            {/* Settings dropdown */}
            {showQuizSettings && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: isMobile ? '0' : '0',
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  border: '1px solid rgba(102,126,234,0.2)',
                  minWidth: isMobile ? '180px' : '200px',
                  width: isMobile ? 'calc(100vw - 64px)' : 'auto',
                  maxWidth: isMobile ? '280px' : 'none'
                }}
              >
                <button
                  onClick={() => {
                    // Calculate new sort mode first
                    const sortModes = ['newest', 'shuffle'];
                    const currentIndex = sortModes.indexOf(sortMode);
                    const nextIndex = (currentIndex + 1) % sortModes.length;
                    const newSortMode = sortModes[nextIndex];
                    
                    // Call handleSortModeChange to update state
                    handleSortModeChange();
                    
                    // Create a shuffled or sorted copy of filteredWords based on newSortMode
                    let wordsToUse = [...filteredWords];
                    if (newSortMode === 'shuffle') {
                      // Shuffle the array - tích vào là ngẫu nhiên
                      for (let i = wordsToUse.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [wordsToUse[i], wordsToUse[j]] = [wordsToUse[j], wordsToUse[i]];
                      }
                    } else if (newSortMode === 'newest') {
                      // Sort by newest (created_at descending, or by ID) - không tích là từ mới nhất dùng trước
                      wordsToUse.sort((a, b) => {
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
                    }
                    
                    if (wordsToUse && wordsToUse.length >= 4) {
                      const total = Math.min(maxQuestions, wordsToUse.length);
                      const quizWords = wordsToUse.slice(0, total);
                      // Tạo lại questions với options được shuffle lại
                      const questions = quizWords.map((word) => ({
                        wordId: getWordId(word),
                        english: word.english,
                        vietnamese: word.vietnamese,
                        // buildQuizOptions sẽ tự động shuffle các đáp án (câu chính và câu phụ)
                        options: buildQuizOptions(word, wordsToUse, languageMode),
                        selectedIndex: null
                      }));
                      setQuizQuestions(questions);
                      setQuizScore(0);
                      setQuizTotalQuestions(total);
                      setQuizCompleted(false);
                      setQuizView('doing');
                    }
                    setShowQuizSettings(false);
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
                    setQuizFavoritesOnly(prev => !prev);
                    setShowQuizSettings(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: quizFavoritesOnly ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                    color: '#2d3748',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: quizFavoritesOnly ? 600 : 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s ease',
                    borderTop: '1px solid rgba(148,163,184,0.2)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 193, 7, 0.15)'}
                  onMouseLeave={(e) => e.target.style.background = quizFavoritesOnly ? 'rgba(255, 193, 7, 0.1)' : 'transparent'}
                >
                  <Star 
                    size={18}
                    fill={quizFavoritesOnly ? '#ffc107' : 'none'}
                    color={quizFavoritesOnly ? '#ffc107' : '#9ca3af'}
                  />
                  <span>{quizFavoritesOnly ? 'Hiển thị tất cả' : 'Chỉ từ yêu thích'}</span>
                </button>
                
                <button
                  onClick={() => {
                    const newMode = languageMode === 'vietnamese' ? 'english' : 'vietnamese';
                    setQuizQuestions(prev => {
                      const allWords = prev.map(q => ({
                        id: q.wordId,
                        english: q.english,
                        vietnamese: q.vietnamese
                      }));
                      return prev.map(q => ({
                        ...q,
                        selectedIndex: null,
                        options: buildQuizOptions(
                          { id: q.wordId, english: q.english, vietnamese: q.vietnamese },
                          allWords,
                          newMode
                        )
                      }));
                    });
                    setLanguageMode(newMode);
                    setShowQuizSettings(false);
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
          )}
        </div>
      </div>

      {/* Questions list */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? '16px' : '18px', 
        maxHeight: isMobile ? 'calc(100vh - 280px)' : '750px',
        overflowY: 'auto',
        paddingRight: isMobile ? '4px' : '8px',
        marginRight: isMobile ? '-4px' : '0'
      }}>
        {displayedQuestions.map((q, qIndex) => {
          const questionText = languageMode === 'vietnamese' ? q.english : q.vietnamese;
          const speakTextContent = q.english;
          const speakLang = 'en-US';

          return (
            <div 
              id={`quiz-question-${qIndex}`}
              key={q.wordId || qIndex} 
              style={{ 
                paddingBottom: isMobile ? '12px' : '6px', 
                borderBottom: '1px dashed rgba(148, 163, 184, 0.4)'
              }}
            >
              <div style={{ 
                marginBottom: isMobile ? '10px' : '8px', 
                fontSize: isMobile ? '1rem' : '1.3rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: isMobile ? '6px' : '8px',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <span style={{ 
                  flex: 1,
                  minWidth: 0,
                  wordBreak: 'break-word',
                  lineHeight: '1.4'
                }}>
                  {qIndex + 1}. {questionText}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '4px' : '7px',
                  flexShrink: 0
                }}>
                  <button
                    onClick={() => speakWord(speakTextContent, speakLang)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: isMobile ? '4px' : '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      borderRadius: '50%',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                    title="Phát âm"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    }}
                  >
                    <Volume2 size={isMobile ? 18 : 20} />
                  </button>
                  <button
                    onClick={() => {
                      setFavorites(prev => prev.includes(q.wordId)
                        ? prev.filter(id => id !== q.wordId)
                        : [...prev, q.wordId]
                      );
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={favorites.includes(q.wordId) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Star 
                      size={isMobile ? 18 : 20}
                      fill={favorites.includes(q.wordId) ? '#ffc107' : 'none'}
                      color={favorites.includes(q.wordId) ? '#ffc107' : '#9ca3af'}
                    />
                  </button>
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: isMobile ? '8px' : '10px'
              }}>
                {q.options.map((opt, idx) => {
                  const isSelected = q.selectedIndex === idx;
                  let bg = 'rgba(15, 23, 42, 0.9)';
                  let border = '1px solid rgba(148, 163, 184, 0.4)';

                  if (quizCompleted) {
                    if (opt.correct) {
                      bg = 'rgba(22, 163, 74, 0.15)';
                      border = '1px solid rgba(34, 197, 94, 0.7)';
                    } else if (isSelected) {
                      bg = 'rgba(220, 38, 38, 0.15)';
                      border = '1px solid rgba(248, 113, 113, 0.8)';
                    }
                  } else if (isSelected) {
                    bg = 'rgba(59, 130, 246, 0.2)';
                    border = '1px solid rgba(59, 130, 246, 0.8)';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(qIndex, idx)}
                      disabled={quizCompleted}
                      className={`quiz-option ${isSelected ? 'selected' : ''} ${quizCompleted && opt.correct ? 'correct' : ''} ${quizCompleted && isSelected && !opt.correct ? 'incorrect' : ''}`}
                      style={{
                        padding: isMobile ? '12px' : '12px 14px',
                        borderRadius: '12px',
                        border,
                        background: bg,
                        color: 'white',
                        cursor: quizCompleted ? 'default' : 'pointer',
                        textAlign: 'left',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        transition: 'all 0.2s ease',
                        wordBreak: 'break-word',
                        lineHeight: '1.5'
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {quizView === 'doing' && (
        <button
          onClick={submitQuiz}
          disabled={totalDisplayed === 0 || (answeredCount < 5 && answeredCount < totalDisplayed)}
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            opacity: totalDisplayed === 0 || (answeredCount < 5 && answeredCount < totalDisplayed) ? 0.6 : 1,
            color: 'white',
            fontWeight: 600,
            cursor: totalDisplayed === 0 || (answeredCount < 5 && answeredCount < totalDisplayed) ? 'not-allowed' : 'pointer',
            fontSize: isMobile ? '0.95rem' : '1rem',
            marginBottom: '4px'
          }}
        >
          Nộp bài
        </button>
      )}

      {/* Detail view - Reset button */}
      {quizCompleted && quizView === 'detail' && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={resetCurrentQuiz}
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}
          >
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
