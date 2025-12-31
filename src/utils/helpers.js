// Helper function to get word ID (supports both MongoDB _id and local id)
export const getWordId = (word) => {
  return word?._id || word?.id;
};

// Generate hint for a word based on difficulty
export const generateHint = (word, difficulty) => {
  if (!word) return '';
  
  const wordLength = word.length;
  let hint = '';
  
  switch (difficulty) {
    case 1: // Dễ - hiển thị 1-2 chữ cái đầu và cuối
      if (wordLength <= 3) {
        hint = word; // Hiển thị toàn bộ từ nếu quá ngắn
      } else if (wordLength <= 5) {
        hint = word.substring(0, 2) + '*'.repeat(wordLength - 2);
      } else {
        hint = word.substring(0, 2) + '*'.repeat(wordLength - 4) + word.substring(wordLength - 2);
      }
      break;
      
    case 2: // Trung bình - hiển thị 1 chữ cái đầu và cuối
      if (wordLength <= 2) {
        hint = word; // Hiển thị toàn bộ từ nếu quá ngắn
      } else {
        hint = word.substring(0, 1) + '*'.repeat(wordLength - 2) + word.substring(wordLength - 1);
      }
      break;
      
    case 3: // Khó - chỉ hiển thị 1 chữ cái đầu hoặc cuối
      if (wordLength <= 1) {
        hint = word;
      } else {
        // Random chọn hiển thị đầu hay cuối
        const showFirst = Math.random() < 0.5;
        if (showFirst) {
          hint = word.substring(0, 1) + '*'.repeat(wordLength - 1);
        } else {
          hint = '*'.repeat(wordLength - 1) + word.substring(wordLength - 1);
        }
      }
      break;
      
    default:
      hint = word;
  }
  
  return hint;
};

// Build quiz options for a word (1 correct + 3 incorrect)
export const buildQuizOptions = (word, sourceWords, mode = 'vietnamese') => {
  if (!word || !sourceWords || sourceWords.length < 4) return [];

  // mode === 'vietnamese': câu hỏi EN -> đáp án VN (mặc định, dễ cho người mới)
  // mode === 'english': câu hỏi VN -> đáp án EN
  const useVietnameseAsAnswer = mode === 'vietnamese';
  const correctText = useVietnameseAsAnswer ? word.vietnamese : word.english;

  // Lấy các đáp án sai khác với đáp án đúng
  const otherWords = sourceWords.filter(w => {
    if (getWordId(w) === getWordId(word)) return false;
    const candidate = useVietnameseAsAnswer ? w.vietnamese : w.english;
    return candidate.toLowerCase() !== correctText.toLowerCase();
  });

  // Nếu không đủ từ để tạo 3 đáp án sai thì trả về rỗng
  if (otherWords.length < 3) return [];

  // Shuffle đơn giản
  const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [
    { text: correctText, correct: true },
    ...shuffledOthers.map(w => ({
      text: useVietnameseAsAnswer ? w.vietnamese : w.english,
      correct: false
    }))
  ].sort(() => Math.random() - 0.5);

  return options;
};

