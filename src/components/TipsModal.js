import React, { useState } from 'react';
import { X, Lightbulb, Target, Zap, Keyboard, TrendingUp, BookOpen, RotateCcw, Star, Volume2, ChevronDown } from 'lucide-react';

const TipsModal = ({ isOpen, onClose, isMobile }) => {
  const [expandedSections, setExpandedSections] = useState({
    0: false,  // Cách sử dụng hiệu quả
    1: false,  // Chiến lược học tập
    2: false,  // Tính năng nổi bật
    3: false,  // Phím tắt & Thủ thuật
    4: false   // Mẹo ghi nhớ từ vựng
  });

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!isOpen) return null;

  const tipSections = [
    {
      icon: <Target size={24} />,
      title: '🎯 Cách sử dụng hiệu quả',
      color: '#68d391',
      items: [
        'Nhấn vào flashcard để lật và xem nghĩa',
        'Sử dụng nút mũi tên để điều hướng giữa các từ',
        'Vuốt sang trái/phải trên mobile để chuyển từ',
        'Nhấn nút yêu thích ⭐ để đánh dấu từ quan trọng',
        'Bật âm thanh 🔊 để nghe phát âm và tăng hiệu quả',
        'Sử dụng gợi ý 💡 khi gặp khó khăn'
      ]
    },
    {
      icon: <TrendingUp size={24} />,
      title: '📈 Chiến lược học tập',
      color: '#f6ad55',
      items: [
        'Học 10-15 từ mới mỗi ngày - đừng quá tải',
        'Ôn tập từ cũ trước khi học từ mới',
        'Luyện tập vào cùng một thời điểm mỗi ngày',
        'Tập trung vào từ yêu thích trước (bộ lọc ⭐)',
        'Sử dụng chế độ ngẫu nhiên để tránh ghi nhớ theo thứ tự',
        'Xem lại thống kê để biết điểm mạnh/yếu'
      ]
    },
    {
      icon: <Zap size={24} />,
      title: '⚡ Tính năng nổi bật',
      color: '#9f7aea',
      items: [
        'Flashcard Mode: Học bằng thẻ ghi nhớ tương tác',
        'Quiz Mode: Kiểm tra kiến thức với câu hỏi trắc nghiệm',
        'Practice Mode: Luyện viết và kiểm tra chính tả',
        'Bộ lọc từ yêu thích: Chỉ học những từ quan trọng',
        'Nhập hàng loạt: Thêm nhiều từ cùng lúc từ Excel/Word',
        'Thống kê: Theo dõi tiến độ học tập chi tiết'
      ]
    },
    {
      icon: <Keyboard size={24} />,
      title: '⌨️ Phím tắt & Thủ thuật',
      color: '#4299e1',
      items: [
        'Enter: Kiểm tra đáp án (trong Practice mode)',
        'Mũi tên ← →: Chuyển từ trước/sau',
        'Click vào flashcard: Lật thẻ xem mặt sau',
        'Nút Settings ⚙️: Tùy chỉnh chế độ học',
        'Nút Shuffle 🔀: Trộn ngẫu nhiên từ vựng',
        'Sử dụng auto-advance: Tự động chuyển từ khi đúng'
      ]
    },
    {
      icon: <Lightbulb size={24} />,
      title: '💡 Mẹo ghi nhớ từ vựng',
      color: '#fc8181',
      items: [
        'Liên kết từ mới với hình ảnh hoặc câu chuyện',
        'Đọc to từ vựng kèm phát âm để nhớ lâu hơn',
        'Học từ theo nhóm chủ đề (động vật, màu sắc, ...)',
        'Tạo câu ví dụ với từ mới',
        'Ôn tập nhiều lần với khoảng thời gian tăng dần',
        'Sử dụng từ vựng trong giao tiếp thực tế'
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '10px' : '20px'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        borderRadius: isMobile ? '16px' : '20px',
        padding: isMobile ? '20px' : '32px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        color: 'white',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? '20px' : '28px',
          paddingBottom: '16px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}>
              <Lightbulb size={isMobile ? 24 : 28} color="#2d3748" />
            </div>
            <h2 style={{
              margin: 0,
              fontSize: isMobile ? '1.4rem' : '1.6rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Mẹo và hướng dẫn
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '36px' : '40px',
              height: isMobile ? '36px' : '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#a0aec0'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#a0aec0';
            }}
          >
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '20px' : '24px'
        }}>
          {tipSections.map((section, index) => {
            const isExpanded = expandedSections[index];
            return (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, rgba(${section.color === '#68d391' ? '104, 211, 145' : section.color === '#f6ad55' ? '246, 173, 85' : section.color === '#9f7aea' ? '159, 122, 234' : section.color === '#4299e1' ? '66, 153, 225' : '252, 129, 129'}, 0.1) 0%, rgba(${section.color === '#68d391' ? '104, 211, 145' : section.color === '#f6ad55' ? '246, 173, 85' : section.color === '#9f7aea' ? '159, 122, 234' : section.color === '#4299e1' ? '66, 153, 225' : '252, 129, 129'}, 0.05) 100%)`,
                  borderRadius: '16px',
                  padding: isMobile ? '16px' : '20px',
                  border: `1px solid rgba(${section.color === '#68d391' ? '104, 211, 145' : section.color === '#f6ad55' ? '246, 173, 85' : section.color === '#9f7aea' ? '159, 122, 234' : section.color === '#4299e1' ? '66, 153, 225' : '252, 129, 129'}, 0.2)`,
                  transition: 'all 0.3s ease'
                }}
              >
                <button
                  onClick={() => toggleSection(index)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 0,
                    marginBottom: isExpanded ? '16px' : '0'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: 1
                  }}>
                    <div style={{
                      color: section.color,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {section.icon}
                    </div>
                    <h3 style={{
                      margin: 0,
                      fontSize: isMobile ? '1.1rem' : '1.2rem',
                      fontWeight: '700',
                      color: section.color,
                      textAlign: 'left'
                    }}>
                      {section.title}
                    </h3>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                    color: section.color
                  }}>
                    <ChevronDown size={isMobile ? 20 : 24} />
                  </div>
                </button>
                {isExpanded && (
                  <ul style={{
                    paddingLeft: '20px',
                    margin: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isMobile ? '10px' : '12px',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        style={{
                          lineHeight: '1.6',
                          fontSize: isMobile ? '0.9rem' : '0.95rem',
                          color: '#e2e8f0',
                          position: 'relative',
                          paddingLeft: '24px'
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: section.color,
                          fontWeight: 'bold'
                        }}>
                          •
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: isMobile ? '24px' : '32px',
          paddingTop: '20px',
          borderTop: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              border: 'none',
              borderRadius: isMobile ? '12px' : '14px',
              padding: isMobile ? '14px 32px' : '16px 40px',
              cursor: 'pointer',
              fontSize: isMobile ? '1rem' : '1.05rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
              minWidth: isMobile ? '120px' : '140px'
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
            Đã hiểu! ✨
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TipsModal;
