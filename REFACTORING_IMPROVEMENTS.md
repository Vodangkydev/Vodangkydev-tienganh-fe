# Cải thiện cấu trúc code - Bước tiếp theo

## ✅ Đã hoàn thành

1. **Hooks đã tạo:**
   - ✅ `useWordFiltering` - Đã sử dụng
   - ✅ `useToast` - Đã sử dụng
   - ✅ `useQuiz` - Đã tạo nhưng chưa sử dụng
   - ✅ `usePractice` - Đã tạo nhưng chưa sử dụng
   - ✅ `useSwipe` - Đã tạo nhưng chưa sử dụng

2. **Components đã tách:**
   - ✅ `BulkImportModal`
   - ✅ `TipsModal`
   - ✅ `SettingsModal`
   - ✅ `Toast`

## 🔄 Còn có thể cải thiện

### 1. Sử dụng các hooks đã tạo (Ưu tiên cao)

#### a) Sử dụng `useQuiz` hook
**Hiện tại:** Quiz logic vẫn còn trong App.js:
- `resetCurrentQuiz()` (dòng 464-482)
- `handleQuizAnswer()` (dòng 486-509)
- `submitQuiz()` (dòng 512-550)
- Quiz state: `quizQuestions`, `quizScore`, `quizTotalQuestions`, `quizCompleted`, `quizView`

**Cần làm:**
```javascript
const quiz = useQuiz(
  filteredWords,
  languageMode,
  maxQuestions,
  favorites,
  showToast,
  setStats
);
// Thay thế tất cả quiz logic bằng quiz.*
```

#### b) Sử dụng `usePractice` hook
**Hiện tại:** Practice logic vẫn còn trong App.js:
- `handleSubmit()` (dòng 295-351)
- `handleNext()` (dòng 353-377)
- `handlePrevious()` (dòng 390-405)
- `resetPractice()` (dòng 380-388)
- `handleRetry()` (dòng 407-412)
- Practice state: `userInput`, `feedback`, `isAnswered`, `showHint`, `wordHint`, `showAnswer`, `practiceResults`, `practiceCompleted`, `practiceStarted`

**Cần làm:**
```javascript
const practice = usePractice(
  showToast,
  loadUserStats,
  languageMode,
  autoAdvance,
  handleNext // Cần tạo handleNext riêng hoặc tích hợp vào hook
);
// Thay thế tất cả practice logic bằng practice.*
```

#### c) Sử dụng `useSwipe` hook
**Hiện tại:** Swipe handlers vẫn còn trong App.js:
- `handleTouchStart()` (dòng 239-246)
- `handleTouchEnd()` (dòng 247-260)
- Swipe state: `swipeStartX`, `swipeStartY`

**Cần làm:**
```javascript
const { handleTouchStart, handleTouchEnd } = useSwipe(
  handlePrevious,
  handleNext,
  flashcardMode
);
// Xóa swipe state và handlers cũ
```

### 2. Tạo hooks mới (Ưu tiên trung bình)

#### a) `useWordNavigation` hook
**Logic có thể tách:**
- `handleNext()` - Navigation logic
- `handlePrevious()` - Navigation logic
- `wordIndex` state management
- `currentWord` state management
- `slideDirection` state

**Lợi ích:**
- Tách biệt navigation logic
- Dễ test và maintain
- Có thể tái sử dụng

#### b) `useHint` hook
**Logic có thể tách:**
- `toggleHint()` - Practice mode hint
- `toggleFlashcardHint()` - Flashcard mode hint
- Hint state: `showHint`, `wordHint`, `showFlashcardHint`

**Lợi ích:**
- Tách biệt hint logic
- Dễ quản lý hint cho các mode khác nhau

#### c) `useFlashcard` hook
**Logic có thể tách:**
- Flashcard state: `isFlipped`, `showFlashcardHint`, `flashcardFavoritesOnly`, `showFlashcardSettings`
- Flashcard handlers: `toggleFlashcardHint()`, flip logic

**Lợi ích:**
- Tách biệt flashcard logic
- Dễ quản lý flashcard mode

### 3. Tối ưu hóa (Ưu tiên thấp)

#### a) Tách UI handlers
- `handleSortModeChange()` - Có thể tích hợp vào `useSettings`
- `handleKeyPress()` - Có thể tách thành hook `useKeyboardShortcuts`
- `handleBulkImport()` - Đã có component, có thể đơn giản hóa

#### b) Tách utility functions
- `resetWordState()` - Có thể tích hợp vào `usePractice`
- `speakWord()` - Đã có trong `soundUtils`, có thể sử dụng trực tiếp

## 📊 Ước tính cải thiện

**Hiện tại:**
- App.js: ~1307 dòng
- Còn nhiều logic inline

**Sau khi áp dụng tất cả:**
- App.js: ~800-900 dòng (giảm ~30-40%)
- Code được tổ chức tốt hơn
- Dễ test và maintain hơn

## 🎯 Kế hoạch thực hiện

### Bước 1: Sử dụng hooks đã tạo (Quan trọng nhất)
1. ✅ Sử dụng `useQuiz` - Thay thế quiz logic
2. ✅ Sử dụng `usePractice` - Thay thế practice logic  
3. ✅ Sử dụng `useSwipe` - Thay thế swipe handlers

### Bước 2: Tạo hooks mới (Nếu cần)
1. Tạo `useWordNavigation` - Nếu navigation logic phức tạp
2. Tạo `useHint` - Nếu hint logic cần tách riêng
3. Tạo `useFlashcard` - Nếu flashcard logic cần tách riêng

### Bước 3: Tối ưu hóa
1. Tối ưu các handlers còn lại
2. Đảm bảo không có code duplicate
3. Kiểm tra và sửa lỗi

## 💡 Lưu ý

- Các hooks đã tạo (`useQuiz`, `usePractice`, `useSwipe`) cần được điều chỉnh một chút để phù hợp với logic hiện tại trong App.js
- Một số state có thể cần được quản lý ở level cao hơn (App.js) để chia sẻ giữa các hooks
- Cần test kỹ sau mỗi bước refactor

