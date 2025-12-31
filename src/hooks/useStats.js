import { useState, useEffect, useCallback } from 'react';
import { statsService } from '../services/apiService';

export const useStats = (isAuthenticated, onToast) => {
  const [stats, setStats] = useState({
    correct: 0,
    nearlyCorrect: 0,
    incorrect: 0,
    total: 0
  });

  // Load user stats
  const loadUserStats = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const statsData = await statsService.get();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
      setStats({ correct: 0, nearlyCorrect: 0, incorrect: 0, total: 0 });
    }
  }, [isAuthenticated]);

  // Reset stats
  const resetStats = useCallback(async () => {
    try {
      await statsService.reset();
      setStats({ correct: 0, nearlyCorrect: 0, incorrect: 0, total: 0 });
      onToast('Đã reset thống kê thành công!', 'success');
    } catch (err) {
      console.error('Error resetting stats:', err);
      onToast('Không thể reset thống kê. Vui lòng thử lại.', 'error');
    }
  }, [onToast]);

  // Update stats (for local updates)
  const updateStats = useCallback((updates) => {
    setStats(prev => ({ ...prev, ...updates }));
  }, []);

  // Load stats when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUserStats();
    } else {
      setStats({ correct: 0, nearlyCorrect: 0, incorrect: 0, total: 0 });
    }
  }, [isAuthenticated, loadUserStats]);

  return {
    stats,
    setStats,
    loadUserStats,
    resetStats,
    updateStats
  };
};

