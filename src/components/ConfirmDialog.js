import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Huỷ', isMobile }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: isMobile ? '20px' : '30px',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '24px 20px' : '32px',
          width: '100%',
          maxWidth: isMobile ? '100%' : '450px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          transform: 'translateZ(0)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '16px' : '20px',
            right: isMobile ? '16px' : '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '32px' : '36px',
            height: isMobile ? '32px' : '36px',
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
          <X size={isMobile ? 18 : 20} />
        </button>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '16px' : '20px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(211, 47, 47, 0.2) 100%)',
              borderRadius: '50%',
              width: isMobile ? '64px' : '80px',
              height: isMobile ? '64px' : '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(244, 67, 54, 0.3)'
            }}
          >
            <AlertTriangle
              size={isMobile ? 32 : 40}
              color="#f44336"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(244, 67, 54, 0.4))' }}
            />
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: '700',
            color: '#fff',
            textAlign: 'center',
            margin: '0 0 12px 0',
            lineHeight: '1.4'
          }}
        >
          {title || 'Xác nhận hành động'}
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            color: '#a0aec0',
            textAlign: 'center',
            margin: '0 0 28px 0',
            lineHeight: '1.6',
            padding: '0 8px'
          }}
        >
          {message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? '12px' : '16px',
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: isMobile ? '12px' : '14px',
              padding: isMobile ? '14px' : '16px',
              fontSize: isMobile ? '1rem' : '1.05rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: isMobile ? '48px' : '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: isMobile ? '12px' : '14px',
              padding: isMobile ? '14px' : '16px',
              fontSize: isMobile ? '1rem' : '1.05rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: isMobile ? '48px' : '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)'
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
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

