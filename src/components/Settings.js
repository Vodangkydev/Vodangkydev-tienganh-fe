import React, { useState } from 'react';
import { X, LogOut, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const Settings = ({
  isOpen,
  onClose,
  isMobile,
  user,
  stats,
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
  wordFilter,
  setWordFilter,
  sortMode,
  setSortMode,
  quizMode,
  setQuizMode,
  onLogout,
  onResetStats,
  onDeleteVocabulary,
  onOpenBulkImport
}) => {
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isVocabExpanded, setIsVocabExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  return (
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
        maxWidth: isMobile ? 'none' : '500px',
        maxHeight: isMobile ? '85vh' : '75vh',
        color: 'white',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '8px' : '14px' }}>
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.3rem' : '1.5rem' }}>⚙️ Cài đặt</h2>
          <button 
            onClick={onClose}
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

        {/* Settings Content with Grid Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '15px' : '20px',
          marginBottom: '20px'
        }}>
          
          {/* User Info Section - Full Width */}
          <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
            <div style={{ 
              padding: isMobile ? '8px' : '14px', 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)', 
              borderRadius: isMobile ? '12px' : '16px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  width: isMobile ? '48px' : '56px',
                  height: isMobile ? '48px' : '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}>
                  <img src="/cloud-icon.png" alt="Cloud" style={{ width: isMobile ? '32px' : '38px', height: isMobile ? '32px' : '38px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#a0aec0', marginBottom: '4px' }}>
                    Tài khoản
                  </div>
                  <div style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: '700', color: '#667eea' }}>
                    {user?.username}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: isMobile ? '10px' : '12px',
                  padding: isMobile ? '6px' : '10px',
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255, 71, 87, 0.4)',
                  minHeight: '48px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ff3742 0%, #ff2f3a 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 71, 87, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 71, 87, 0.4)';
                }}
              >
                <LogOut size={20} />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Learning Settings Card */}
          <div style={{
            padding: isMobile ? '8px' : '14px',
            background: 'rgba(102, 126, 234, 0.08)',
            borderRadius: isMobile ? '12px' : '16px',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#667eea', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 Chế độ học tập
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#a0aec0', marginBottom: '10px' }}>Chế độ học</div>
              <select
                value={languageMode}
                onChange={(e) => setLanguageMode(e.target.value)}
                style={{
                  background: '#1a202c',
                  border: '1px solid #4a5568',
                  borderRadius: '10px',
                  padding: isMobile ? '12px' : '14px',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  width: '100%',
                  minHeight: '48px',
                  cursor: 'pointer'
                }}
              >
                <option value="vietnamese">Tiếng Việt → Tiếng Anh</option>
                <option value="english">Tiếng Anh → Tiếng Việt</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#a0aec0', marginBottom: '10px' }}>Mức độ khó</div>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                style={{
                  background: '#1a202c',
                  border: '1px solid #4a5568',
                  borderRadius: '10px',
                  padding: isMobile ? '12px' : '14px',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  width: '100%',
                  minHeight: '48px',
                  cursor: 'pointer'
                }}
              >
                <option value={1}>Dễ (1)</option>
                <option value={2}>Trung bình (2)</option>
                <option value={3}>Khó (3)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#a0aec0', marginBottom: '10px' }}>Số lượng câu hỏi tối đa</div>
              <input
                type="number"
                min="5"
                max="50"
                value={maxQuestions}
                onChange={(e) => {
                  const value = Math.max(5, Math.min(50, parseInt(e.target.value) || 10));
                  setMaxQuestions(value);
                }}
                style={{
                  background: '#1a202c',
                  border: '1px solid #4a5568',
                  borderRadius: '10px',
                  padding: isMobile ? '12px' : '14px',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  width: '100%',
                  minHeight: '48px',
                  cursor: 'pointer'
                }}
              />
              <div style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', color: '#718096', marginTop: '6px' }}>
                Tối thiểu: 5, Tối đa: 50
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  style={{ accentColor: '#4299e1', transform: isMobile ? 'scale(1.4)' : 'scale(1.2)' }}
                />
                <span style={{ fontSize: isMobile ? '0.9rem' : '0.95rem', fontWeight: '500' }}>Tự động chuyển từ tiếp theo</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  style={{ accentColor: '#4299e1', transform: isMobile ? 'scale(1.4)' : 'scale(1.2)' }}
                />
                <span style={{ fontSize: isMobile ? '0.9rem' : '0.95rem', fontWeight: '500' }}>Bật âm thanh</span>
              </label>
            </div>
          </div>

          {/* Display Settings Card */}
          <div style={{
            padding: isMobile ? '8px' : '14px',
            background: 'rgba(255, 154, 158, 0.08)',
            borderRadius: isMobile ? '12px' : '16px',
            border: '1px solid rgba(255, 154, 158, 0.2)'
          }}>
            <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#ff9a9e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⭐ Hiển thị
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#a0aec0', marginBottom: '10px' }}>Loại bài tập</div>
              <select
                value={quizMode ? 'quiz' : 'practice'}
                onChange={(e) => setQuizMode(e.target.value === 'quiz')}
                style={{
                  background: '#1a202c',
                  border: '1px solid #4a5568',
                  borderRadius: '10px',
                  padding: isMobile ? '12px' : '14px',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  width: '100%',
                  minHeight: '48px',
                  cursor: 'pointer'
                }}
              >
                <option value="practice">Tự luận (Nhập từ)</option>
                <option value="quiz">Trắc nghiệm</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#a0aec0', marginBottom: '10px' }}>Bộ lọc từ vựng</div>
              <select
                value={wordFilter}
                onChange={(e) => setWordFilter(e.target.value)}
                style={{
                  background: '#1a202c',
                  border: '1px solid #4a5568',
                  borderRadius: '10px',
                  padding: isMobile ? '12px' : '14px',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  width: '100%',
                  minHeight: '48px',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tất cả từ</option>
                <option value="favorites">Chỉ từ yêu thích</option>
              </select>
            </div>

            <div>
              <div style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#a0aec0', marginBottom: '10px' }}>Chế độ sắp xếp</div>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
                style={{
                  background: '#1a202c',
                  border: '1px solid #4a5568',
                  borderRadius: '10px',
                  padding: isMobile ? '12px' : '14px',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  width: '100%',
                  minHeight: '48px',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Mới nhất</option>
                <option value="shuffle">Ngẫu nhiên</option>
              </select>
            </div>
          </div>

        </div>

        {/* Statistics Section - Full Width with Collapse */}
        <div style={{ 
          padding: isMobile ? '20px' : '24px',
          background: 'rgba(76, 175, 80, 0.08)',
          borderRadius: isMobile ? '12px' : '16px',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          marginTop: '10px',
          transition: 'all 0.3s ease'
        }}>
          <button
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 0,
              marginBottom: isStatsExpanded ? (isMobile ? '8px' : '14px') : '0',
              color: '#4caf50'
            }}
          >
            <div style={{ 
              fontSize: isMobile ? '1rem' : '1.1rem', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              📊 Thống kê học tập
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              transform: isStatsExpanded ? 'rotate(0deg)' : 'rotate(180deg)'
            }}>
              <ChevronDown size={isMobile ? 20 : 24} />
            </div>
          </button>
          
          {isStatsExpanded && (
            <div style={{
              opacity: 1,
              transition: 'opacity 0.3s ease'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
                gap: isMobile ? '12px' : '15px',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  textAlign: 'center',
                  padding: isMobile ? '12px' : '16px',
                  background: '#1a202c',
                  borderRadius: '12px',
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <div style={{ 
                    fontSize: isMobile ? '1.8rem' : '2rem', 
                    fontWeight: 'bold', 
                    color: '#4caf50',
                    marginBottom: '4px'
                  }}>
                    {stats.correct}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#a0aec0', fontWeight: '500' }}>Đúng</div>
                </div>
                <div style={{ 
                  textAlign: 'center',
                  padding: isMobile ? '12px' : '16px',
                  background: '#1a202c',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 152, 0, 0.2)'
                }}>
                  <div style={{ 
                    fontSize: isMobile ? '1.8rem' : '2rem', 
                    fontWeight: 'bold', 
                    color: '#ff9800',
                    marginBottom: '4px'
                  }}>
                    {stats.nearlyCorrect}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#a0aec0', fontWeight: '500' }}>Gần đúng</div>
                </div>
                <div style={{ 
                  textAlign: 'center',
                  padding: isMobile ? '12px' : '16px',
                  background: '#1a202c',
                  borderRadius: '12px',
                  border: '1px solid rgba(244, 67, 54, 0.2)'
                }}>
                  <div style={{ 
                    fontSize: isMobile ? '1.8rem' : '2rem', 
                    fontWeight: 'bold', 
                    color: '#f44336',
                    marginBottom: '4px'
                  }}>
                    {stats.incorrect}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#a0aec0', fontWeight: '500' }}>Sai</div>
                </div>
                <div style={{ 
                  textAlign: 'center',
                  padding: isMobile ? '12px' : '16px',
                  background: '#1a202c',
                  borderRadius: '12px',
                  border: '1px solid rgba(66, 153, 225, 0.2)'
                }}>
                  <div style={{ 
                    fontSize: isMobile ? '1.8rem' : '2rem', 
                    fontWeight: 'bold', 
                    color: '#4299e1',
                    marginBottom: '4px'
                  }}>
                    {stats.total}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#a0aec0', fontWeight: '500' }}>Tổng</div>
                </div>
              </div>
              <button 
                onClick={onResetStats}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: isMobile ? '10px' : '12px',
                  padding: isMobile ? '12px' : '14px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  minHeight: '48px',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)';
                }}
              >
                Reset thống kê
              </button>
            </div>
          )}
        </div>

        {/* Vocabulary Management Section */}
        <div style={{ gridColumn: isMobile ? '1' : '1 / -1', marginTop: '20px' }}>
          <div style={{
            padding: isMobile ? '20px' : '24px',
            background: 'rgba(102, 126, 234, 0.08)',
            borderRadius: isMobile ? '12px' : '16px',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 0.3s ease'
          }}>
            <button
              onClick={() => setIsVocabExpanded(!isVocabExpanded)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 0,
                marginBottom: isVocabExpanded ? (isMobile ? '8px' : '14px') : '0',
                color: '#667eea'
              }}
            >
              <div style={{ 
                fontSize: isMobile ? '1rem' : '1.1rem', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                📚 Quản lý từ vựng
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                transform: isVocabExpanded ? 'rotate(0deg)' : 'rotate(180deg)'
              }}>
                <ChevronDown size={isMobile ? 20 : 24} />
              </div>
            </button>
            
            {isVocabExpanded && (
              <div style={{
                opacity: 1,
                transition: 'opacity 0.3s ease'
              }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px' }}>
                  <button
                    onClick={() => {
                      onOpenBulkImport();
                      onClose();
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: isMobile ? '10px' : '12px',
                      padding: isMobile ? '6px' : '10px',
                      fontSize: isMobile ? '1rem' : '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                      minHeight: '48px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
                    }}
                  >
                    <Plus size={20} />
                    Thêm từ vựng
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: isMobile ? '10px' : '12px',
                      padding: isMobile ? '6px' : '10px',
                      fontSize: isMobile ? '1rem' : '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
                      minHeight: '48px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.4)';
                    }}
                  >
                    <X size={20} />
                    Xóa từ vựng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', marginTop: isMobile ? '20px' : '30px' }}>
          <button 
            onClick={onClose}
            style={{
              background: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: isMobile ? '6px' : '8px',
              padding: isMobile ? '14px 24px' : '12px 24px',
              cursor: 'pointer',
              fontSize: isMobile ? '1rem' : '1rem',
              transition: 'all 0.3s ease',
              minHeight: isMobile ? '48px' : 'auto',
              width: isMobile ? '100%' : 'auto'
            }}
            onMouseEnter={(e) => e.target.style.background = '#3182ce'}
            onMouseLeave={(e) => e.target.style.background = '#4299e1'}
          >
            Lưu cài đặt
          </button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await onDeleteVocabulary();
          onClose();
          // Tự động mở modal thêm từ vựng sau khi xóa xong
          setTimeout(() => {
            onOpenBulkImport();
          }, 300);
        }}
        title="Xóa tất cả từ vựng?"
        message="Bạn có chắc chắn muốn xóa TẤT CẢ từ vựng? Hành động này không thể hoàn tác! Chỉ còn lại từ 'xin chào - hello'."
        confirmText="Xác nhận xóa"
        cancelText="Huỷ"
        isMobile={isMobile}
      />
    </div>
  );
};

export default Settings;
