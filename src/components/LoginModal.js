import React from 'react';
import { X, Loader } from 'lucide-react';
import '../styles/loginModal.css';

const LoginModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  form, 
  setForm, 
  isRegister, 
  setIsRegister, 
  loading,
  isMobile 
}) => {
  if (!show) return null;

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
        maxWidth: isMobile ? 'none' : '400px',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '8px' : '14px' }}>
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.3rem' : '1.5rem' }}>
            🎓 Bắt đầu học
          </h2>
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

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>
              Tên người dùng
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Nhập tên người dùng"
              required
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: isMobile ? '14px' : '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minHeight: isMobile ? '48px' : 'auto',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              isRegister ? 'Đăng ký' : 'Đăng nhập'
            )}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setForm({ username: '', password: '' });
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
              {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: '#a0aec0', margin: 0 }}>
            {isRegister ? 'Tạo tài khoản mới để bắt đầu học' : 'Đăng nhập để quản lý từ vựng cá nhân'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

