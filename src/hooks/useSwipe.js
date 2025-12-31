import { useState, useCallback } from 'react';

/**
 * Custom hook for handling swipe gestures
 * @param {Function} onSwipeLeft - Callback for left swipe
 * @param {Function} onSwipeRight - Callback for right swipe
 * @param {boolean} enabled - Whether swipe is enabled
 * @returns {Object} Swipe handlers and state
 */
export const useSwipe = (onSwipeLeft, onSwipeRight, enabled = true) => {
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeStartY, setSwipeStartY] = useState(null);

  const handleTouchStart = useCallback((e) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    setSwipeStartX(touch.clientX);
    setSwipeStartY(touch.clientY);
  }, [enabled]);

  const handleTouchEnd = useCallback((e) => {
    if (!enabled || swipeStartX === null || swipeStartY === null) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;
    
    // Minimum swipe distance
    const minSwipeDistance = 50;
    
    // Check if it's a horizontal swipe (not vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right
        onSwipeRight();
      } else {
        // Swipe left
        onSwipeLeft();
      }
    }
    
    // Reset swipe tracking
    setSwipeStartX(null);
    setSwipeStartY(null);
  }, [enabled, swipeStartX, swipeStartY, onSwipeLeft, onSwipeRight]);

  return {
    handleTouchStart,
    handleTouchEnd
  };
};

