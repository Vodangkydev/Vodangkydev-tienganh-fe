// Sound utility functions

export const playFlipSound = (soundEnabled) => {
  if (!soundEnabled) return;
  
  // Create a simple flip sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const speakText = (text, language = 'en-US') => {
  if (!('speechSynthesis' in window)) return;

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;

  // Thử chọn giọng tiếng Anh tự nhiên, nhấn nhá rõ (tùy vào trình duyệt/máy)
  try {
    const voices = synth.getVoices ? synth.getVoices() : [];
    if (voices && voices.length > 0) {
      const langPrefix = language.split('-')[0].toLowerCase();
      const englishVoices = voices.filter(v => 
        v.lang && v.lang.toLowerCase().startsWith(langPrefix)
      );

      // Ưu tiên một số giọng phổ biến, nghe tự nhiên (gần giống Quizlet)
      const preferredNames = [
        'Google US English',
        'Google UK English Female',
        'Microsoft Aria Online',
        'Microsoft Jenny Online',
        'Microsoft Sonia Online',
      ];

      let selected = null;
      for (const name of preferredNames) {
        selected = englishVoices.find(v => v.name.includes(name));
        if (selected) break;
      }

      if (!selected && englishVoices.length > 0) {
        selected = englishVoices[0];
      }

      if (selected) {
        utterance.voice = selected;
      }
    }
  } catch (e) {
    console.warn('Unable to select custom TTS voice', e);
  }

  // Tùy chỉnh tốc độ / ngữ điệu cho giống cách đọc luyện nghe
  utterance.rate = 0.9;   // hơi chậm, nghe rõ
  utterance.pitch = 1.02; // cao hơn nhẹ cho rõ âm cuối
  utterance.volume = 0.9;
  
  // Hủy phát hiện tại và phát câu mới
  synth.cancel();
  synth.speak(utterance);
};

export const playCorrectSound = (soundEnabled) => {
  if (!soundEnabled) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Play a pleasant ascending tone
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

