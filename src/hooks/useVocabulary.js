import { useState, useEffect, useCallback } from 'react';
import { vocabularyService } from '../services/apiService';
import { getWordId } from '../utils/helpers';

export const useVocabulary = (isAuthenticated, onToast) => {
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create default words
  const createDefaultWords = useCallback(() => {
    return [
      { vietnamese: 'xin chào', english: 'hello', type: 'greeting', pronunciation: '/həˈloʊ/', image_url: '', difficulty: 1 },
      { vietnamese: 'cảm ơn', english: 'thank you', type: 'expression', pronunciation: '/θæŋk juː/', image_url: '', difficulty: 1 },
      { vietnamese: 'tạm biệt', english: 'goodbye', type: 'greeting', pronunciation: '/ɡʊdˈbaɪ/', image_url: '', difficulty: 1 },
      { vietnamese: 'vui vẻ', english: 'happy', type: 'adjective', pronunciation: '/ˈhæpi/', image_url: '', difficulty: 1 },
      { vietnamese: 'đẹp', english: 'beautiful', type: 'adjective', pronunciation: '/ˈbjuːtɪfəl/', image_url: '', difficulty: 2 },
      { vietnamese: 'học', english: 'learn', type: 'verb', pronunciation: '/lɜːrn/', image_url: '', difficulty: 1 },
      { vietnamese: 'nước', english: 'water', type: 'noun', pronunciation: '/ˈwɔːtər/', image_url: '', difficulty: 1 },
      { vietnamese: 'mặt trời', english: 'sun', type: 'noun', pronunciation: '/sʌn/', image_url: '', difficulty: 1 }
    ];
  }, []);

  // Load all words
  const loadAllWords = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let words = await vocabularyService.getAll();
      
      // If no words, create default words
      if (words.length === 0) {
        const defaultWords = createDefaultWords();
        // Save default words to server
        for (const word of defaultWords) {
          try {
            await vocabularyService.create({
              vietnamese: word.vietnamese,
              english: word.english,
              type: word.type,
              pronunciation: word.pronunciation,
              image_url: word.image_url,
              difficulty: word.difficulty
            });
          } catch (err) {
            console.error('Error saving default word:', err);
          }
        }
        // Reload from server
        words = await vocabularyService.getAll();
      }
      
      setAllWords(words);
    } catch (err) {
      console.error('Error loading words:', err);
      setError('Không thể tải từ vựng. Vui lòng thử lại.');
      onToast('Không thể tải từ vựng. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, createDefaultWords, onToast]);

  // Delete vocabulary
  const deleteVocabulary = useCallback(async (wordId = null) => {
    try {
      await vocabularyService.delete(wordId);
      onToast(
        wordId ? 'Đã xóa từ vựng thành công!' : 'Đã xóa toàn bộ từ vựng thành công!',
        'success'
      );
      await loadAllWords();
    } catch (err) {
      console.error('Error deleting vocabulary:', err);
      onToast('Không thể xóa từ vựng. Vui lòng thử lại.', 'error');
    }
  }, [loadAllWords, onToast]);

  // Bulk import words
  const bulkImportWords = useCallback(async (words) => {
    try {
      const promises = words.map(word => 
        vocabularyService.create({
          vietnamese: word.vietnamese,
          english: word.english,
          type: word.type,
          pronunciation: word.pronunciation || '',
          image_url: word.image_url || '',
          difficulty: word.difficulty || 1
        })
      );
      
      await Promise.all(promises);
      await loadAllWords();
      onToast(`Đã nhập thành công ${words.length} từ vựng!`, 'success');
      return { success: true };
    } catch (err) {
      console.error('Error importing vocabulary:', err);
      onToast('Không thể nhập từ vựng. Vui lòng thử lại.', 'error');
      return { success: false, error: err };
    }
  }, [loadAllWords, onToast]);

  // Load words when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllWords();
    } else {
      setAllWords([]);
      setLoading(false);
    }
  }, [isAuthenticated, loadAllWords]);

  return {
    allWords,
    setAllWords,
    loading,
    error,
    loadAllWords,
    deleteVocabulary,
    bulkImportWords
  };
};

