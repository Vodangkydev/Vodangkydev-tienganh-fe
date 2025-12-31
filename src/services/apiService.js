import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Set up axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Vocabulary API
export const vocabularyService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/vocabulary`);
    return response.data || [];
  },

  create: async (wordData) => {
    const response = await axios.post(`${API_BASE_URL}/vocabulary`, wordData);
    return response.data;
  },

  delete: async (wordId = null) => {
    if (wordId) {
      await axios.delete(`${API_BASE_URL}/vocabulary/${wordId}`);
    } else {
      await axios.delete(`${API_BASE_URL}/vocabulary`);
    }
  },

  update: async (wordId, wordData) => {
    const response = await axios.put(`${API_BASE_URL}/vocabulary/${wordId}`, wordData);
    return response.data;
  }
};

// Stats API
export const statsService = {
  get: async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return {
      correct: response.data.correct || 0,
      nearlyCorrect: response.data.nearlyCorrect || 0,
      incorrect: response.data.incorrect || 0,
      total: response.data.total || 0
    };
  },

  reset: async () => {
    await axios.delete(`${API_BASE_URL}/stats`);
  }
};

// Learning API (submit answer, get hint)
export const learningService = {
  submitAnswer: async (wordId, answer, languageMode) => {
    const response = await axios.post(`${API_BASE_URL}/learning/submit`, {
      wordId,
      answer,
      languageMode
    });
    return response.data;
  },

  getHint: async (wordId, languageMode) => {
    const response = await axios.get(`${API_BASE_URL}/hint`, {
      params: { wordId, languageMode }
    });
    return response.data;
  }
};

// Profile API
export const profileService = {
  get: async () => {
    const response = await axios.get(`${API_BASE_URL}/profile`);
    return response.data;
  }
};
