import { useRef, useCallback } from 'react';

/**
 * Custom hook for handling swipe gestures
 * @param {Function} onSwipeLeft - Callback for left swipe
 * @param {Function} onSwipeRight - Callback for right swipe
 * @param {boolean} enabled - Whether swipe is enabled
 * @returns {Object} Swipe handlers and state
 */
export const useSwipe = (onSwipeLeft, onSwipeRight, enabled = true) => {
  const swipeStartX = useRef(null);
  const swipeStartY = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    swipeStartX.current = touch.clientX;
    swipeStartY.current = touch.clientY;
  }, [enabled]);

  const handleTouchEnd = useCallback((e) => {
    if (!enabled || swipeStartX.current === null || swipeStartY.current === null) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartX.current;
    const deltaY = touch.clientY - swipeStartY.current;
    
    // Minimum swipe distance
    const minSwipeDistance = 50;
    
    // Check if it's a horizontal swipe (not vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < 0) {
        // Swipe left: finger moved from right to left
        // User swipes left = wants next (forward)
        onSwipeRight();
      } else {
        // Swipe right: finger moved from left to right
        // User swipes right = wants previous (backward)
        onSwipeLeft();
      }
    }
    
    // Reset swipe tracking
    swipeStartX.current = null;
    swipeStartY.current = null;
  }, [enabled, onSwipeLeft, onSwipeRight]);

  return {
    handleTouchStart,
    handleTouchEnd
  };
};

