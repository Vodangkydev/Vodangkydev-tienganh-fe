# Hướng dẫn tái cấu trúc dự án

## ✅ Đã hoàn thành

### 1. Cấu trúc thư mục mới
- `src/utils/` - Chứa các hàm tiện ích
  - `constants.js` - API_BASE_URL và các constants
  - `helpers.js` - getWordId và các helper functions
  - `soundUtils.js` - Các hàm phát âm thanh (playFlipSound, speakText, playCorrectSound)

- `src/services/` - Chứa các service gọi API
  - `apiService.js` - Vocabulary, Stats, Learning services
  - `authService.js` - Authentication service (login, register, logout, checkAuth)

- `src/hooks/` - Custom React hooks
  - `useAuth.js` - Hook quản lý authentication state và logic

- `src/components/` - React components
  - `LoginModal.js` - Modal đăng nhập/đăng ký (đã cập nhật với code thật)
  - `Toast.js` - Component hiển thị thông báo (đã cập nhật với code thật)
  - `Flashcard.js` - Component flashcard (placeholder, cần cập nhật)
  - `Quiz.js` - Component quiz (placeholder, cần cập nhật)
  - `Practice.js` - Component practice (placeholder, cần cập nhật)
  - `Settings.js` - Component settings (placeholder, cần cập nhật)
  - `Header.js` - Component header (placeholder)
  - `Footer.js` - Component footer (placeholder)

## 🔄 Cần tiếp tục

### 2. Tách các component lớn từ App.js

#### Flashcard Component
- Cần tách toàn bộ logic và UI của flashcard mode (dòng 1817-2200+ trong App.js)
- Bao gồm:
  - State: isFlipped, showFlashcardHint, flashcardFavoritesOnly, showFlashcardSettings
  - Functions: toggleFlashcardHint, handleTouchStart, handleTouchEnd
  - UI: Card front/back, controls, settings

#### Quiz Component  
- Cần tách logic và UI của quiz mode (dòng 1100-1400+ trong App.js)
- Bao gồm:
  - State: quizMode, quizQuestions, quizScore, quizCompleted, quizView
  - Functions: buildQuizOptions, handleQuizAnswer, submitQuiz
  - UI: Question list, answer options, results

#### Practice Component
- Cần tách logic và UI của practice mode
- Bao gồm:
  - State: userInput, feedback, showHint, isAnswered
  - Functions: handleSubmit, handleNext, handlePrevious, toggleHint
  - UI: Input field, feedback display, navigation buttons

### 3. Cập nhật App.js
- Import và sử dụng các component mới
- Giữ lại chỉ phần routing và state management chính
- Xóa code đã tách sang các component

### 4. Kiểm tra và sửa lỗi
- Kiểm tra tất cả imports
- Đảm bảo các props được truyền đúng
- Test các chức năng sau khi tách

## 📝 Lưu ý

1. File App.js hiện tại rất lớn (4697 dòng), cần tách từng phần một cách cẩn thận
2. Đảm bảo tất cả dependencies được import đúng
3. Kiểm tra các state và props được truyền giữa các component
4. Test từng component sau khi tách để đảm bảo không có lỗi

## 🎯 Cách tiếp tục

1. Đọc phần code cần tách trong App.js
2. Tạo component mới với đầy đủ logic và UI
3. Cập nhật App.js để import và sử dụng component mới
4. Test và sửa lỗi
5. Lặp lại cho các component còn lại

