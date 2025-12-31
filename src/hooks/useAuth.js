import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { vocabularyService } from '../services/apiService';
import { statsService } from '../services/apiService';

export const useAuth = (onToast) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthentication = useCallback(async () => {
    const result = await authService.checkAuth();
    setIsAuthenticated(result.isAuthenticated);
    setUser(result.user);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      setLoginLoading(true);
      const { user: userData } = await authService.login(username, password);
      setUser(userData);
      setIsAuthenticated(true);
      onToast(`Chào mừng ${username}!`, 'success');
      return { success: true };
    } catch (err) {
      let errorMessage = 'Sai thông tin';
      
      if (err.response) {
        const statusCode = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error || '';
        
        console.log('Login error - Status:', statusCode);
        console.log('Login error - Message:', serverMessage);
        console.log('Login error - Full response:', err.response.data);
        
        // Nếu status code là 401 hoặc message chứa "Invalid credentials" -> Sai thông tin
        if (statusCode === 401 || serverMessage.toLowerCase().includes('invalid credentials')) {
          errorMessage = 'Sai thông tin';
        } else if (serverMessage) {
          errorMessage = serverMessage;
        }
      } else {
        console.log('Login error - No response:', err);
      }
      
      console.log('Login - Final error message:', errorMessage);
      console.log('Login - Calling onToast');
      
      // Luôn gọi onToast để hiển thị thông báo
      onToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoginLoading(false);
    }
  }, [onToast]);

  const register = useCallback(async (username, password) => {
    try {
      setLoginLoading(true);
      const { user: userData } = await authService.register(username, password);
      setUser(userData);
      setIsAuthenticated(true);
      onToast(`Chào mừng ${username}!`, 'success');
      return { success: true };
    } catch (err) {
      let errorMessage = 'Tài khoản đã tồn tại. Vui lòng chọn tên đăng nhập khác.';
      
      if (err.response) {
        const statusCode = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error || '';
        
        console.log('Register error - Status:', statusCode);
        console.log('Register error - Message:', serverMessage);
        console.log('Register error - Full response:', err.response.data);
        
        // Nếu status code là 400 và message chứa "already exists" -> Tài khoản đã tồn tại
        if (statusCode === 400 && serverMessage.toLowerCase().includes('already exists')) {
          errorMessage = 'Tài khoản đã tồn tại. Vui lòng chọn tên đăng nhập khác.';
        } else if (serverMessage) {
          errorMessage = serverMessage;
        }
      } else {
        console.log('Register error - No response:', err);
      }
      
      console.log('Register - Final error message:', errorMessage);
      console.log('Register - Calling onToast');
      
      // Luôn gọi onToast để hiển thị thông báo
      onToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoginLoading(false);
    }
  }, [onToast]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    onToast('Đã đăng xuất thành công!', 'success');
  }, [onToast]);

  return {
    isAuthenticated,
    user,
    loginLoading,
    login,
    register,
    logout,
    checkAuthentication
  };
};
