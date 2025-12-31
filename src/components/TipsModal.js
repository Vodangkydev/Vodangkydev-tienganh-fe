import React from 'react';
import { X } from 'lucide-react';

const TipsModal = ({ isOpen, onClose, isMobile }) => {
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
      zIndex: 1000
    }}>
      <div style={{
        background: '#2d3748',
        borderRadius: '15px',
        padding: '30px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>💡 Mẹo và hướng dẫn</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '5px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* How to Use */}
          <div>
            <h3 style={{ color: '#68d391', marginBottom: '15px', fontSize: '1.2rem' }}>
              🎯 Cách sử dụng
            </h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Nhập từ tiếng Anh hoặc tiếng Việt tương ứng với từ hiển thị</li>
              <li>Nhấn Enter hoặc nút "Kiểm tra" để kiểm tra đáp án</li>
              <li>Sử dụng nút "Xem gợi ý" khi gặp khó khăn</li>
              <li>Dùng các nút mũi tên để chuyển từ</li>
              <li>Nhấn nút sắp xếp (🔀) để thay đổi thứ tự từ vựng</li>
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h3 style={{ color: '#fbb6ce', marginBottom: '15px', fontSize: '1.2rem' }}>
              💡 Mẹo học hiệu quả
            </h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Học từ vựng theo chủ đề để dễ nhớ hơn</li>
              <li>Luyện tập đều đặn mỗi ngày 15-30 phút</li>
              <li>Đọc to từ vựng để cải thiện phát âm</li>
              <li>Sử dụng từ vựng trong câu để nhớ lâu hơn</li>
              <li>Ôn tập lại những từ đã học trước đó</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 style={{ color: '#f6ad55', marginBottom: '15px', fontSize: '1.2rem' }}>
              ⚡ Tính năng
            </h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>Chế độ học:</strong> Chuyển đổi giữa VN→EN và EN→VN</li>
              <li><strong>Sắp xếp:</strong> Mới nhất hoặc ngẫu nhiên</li>
              <li><strong>Thống kê:</strong> Theo dõi tiến độ học tập</li>
              <li><strong>Gợi ý:</strong> Nhận gợi ý khi gặp khó khăn</li>
              <li><strong>Nhập hàng loạt:</strong> Thêm nhiều từ vựng cùng lúc</li>
              <li><strong>Reset:</strong> Xóa thống kê và bắt đầu lại</li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 style={{ color: '#9f7aea', marginBottom: '15px', fontSize: '1.2rem' }}>
              ⌨️ Phím tắt
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ background: '#1a202c', padding: '10px', borderRadius: '8px' }}>
                <strong>Enter:</strong> Kiểm tra đáp án
              </div>
              <div style={{ background: '#1a202c', padding: '10px', borderRadius: '8px' }}>
                <strong>← →:</strong> Chuyển từ
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button 
            onClick={onClose}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#45a049'}
            onMouseLeave={(e) => e.target.style.background = '#4caf50'}
          >
            Đã hiểu!
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipsModal;

