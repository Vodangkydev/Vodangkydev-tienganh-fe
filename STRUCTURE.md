# Cấu trúc dự án sau khi tái cấu trúc

## 📁 Cấu trúc thư mục

```
tienganh-fe/
├── src/
│   ├── components/          # React Components
│   │   ├── Flashcard.js
│   │   ├── Quiz.js
│   │   ├── Practice.js
│   │   ├── LoginModal.js    ✅ Đã hoàn thành
│   │   ├── Toast.js         ✅ Đã hoàn thành
│   │   ├── Settings.js
│   │   ├── Header.js
│   │   └── Footer.js
│   │
│   ├── services/            # API Services
│   │   ├── apiService.js    ✅ Đã hoàn thành
│   │   └── authService.js    ✅ Đã hoàn thành
│   │
│   ├── hooks/              # Custom Hooks
│   │   └── useAuth.js       ✅ Đã hoàn thành
│   │
│   ├── utils/              # Utility Functions
│   │   ├── constants.js     ✅ Đã hoàn thành
│   │   ├── helpers.js       ✅ Đã hoàn thành
│   │   └── soundUtils.js    ✅ Đã hoàn thành
│   │
│   ├── styles/             # CSS Files (MỚI)
│   │   ├── common.css       ✅ Đã tạo
│   │   ├── flashcard.css    ✅ Đã tạo
│   │   ├── quiz.css         ✅ Đã tạo
│   │   ├── practice.css     ✅ Đã tạo
│   │   ├── toast.css        ✅ Đã tạo
│   │   └── loginModal.css   ✅ Đã tạo
│   │
│   ├── App.js              # Main App (cần tiếp tục tách)
│   ├── App.css             # Import các CSS files
│   └── index.js
│
└── RESTRUCTURE_GUIDE.md    # Hướng dẫn tái cấu trúc
```

## ✅ Đã hoàn thành

### 1. Cấu trúc thư mục
- ✅ Tạo thư mục `components/`, `services/`, `hooks/`, `utils/`, `styles/`

### 2. Services & Utils
- ✅ `apiService.js` - Vocabulary, Stats, Learning services
- ✅ `authService.js` - Authentication service
- ✅ `constants.js` - API_BASE_URL
- ✅ `helpers.js` - getWordId
- ✅ `soundUtils.js` - Sound functions

### 3. Hooks
- ✅ `useAuth.js` - Authentication hook

### 4. Components
- ✅ `LoginModal.js` - Đã có code đầy đủ + CSS
- ✅ `Toast.js` - Đã có code đầy đủ + CSS

### 5. CSS
- ✅ Tách CSS ra các file riêng:
  - `common.css` - Styles chung
  - `flashcard.css` - Flashcard styles
  - `quiz.css` - Quiz styles
  - `practice.css` - Practice styles
  - `toast.css` - Toast styles
  - `loginModal.css` - Login modal styles
- ✅ Cập nhật `App.css` để import các file CSS mới

## 🔄 Cần tiếp tục

### 1. Tách các Component lớn từ App.js

#### Flashcard Component
- Cần tách logic và UI flashcard mode (dòng 1817-2200+)
- Import CSS: `../styles/flashcard.css`
- State: isFlipped, showFlashcardHint, flashcardFavoritesOnly
- Functions: toggleFlashcardHint, handleTouchStart, handleTouchEnd

#### Quiz Component
- Cần tách logic và UI quiz mode (dòng 1100-1400+)
- Import CSS: `../styles/quiz.css`
- State: quizMode, quizQuestions, quizScore, quizCompleted
- Functions: buildQuizOptions, handleQuizAnswer, submitQuiz

#### Practice Component
- Cần tách logic và UI practice mode
- Import CSS: `../styles/practice.css`
- State: userInput, feedback, showHint, isAnswered
- Functions: handleSubmit, handleNext, handlePrevious, toggleHint

### 2. Cập nhật App.js
- Import và sử dụng các component mới
- Xóa code đã tách sang các component
- Giữ lại chỉ phần routing và state management chính

### 3. Cập nhật các Component còn lại
- Flashcard.js - Import CSS và thêm code
- Quiz.js - Import CSS và thêm code
- Practice.js - Import CSS và thêm code
- Settings.js - Tách settings modal

## 📝 Lưu ý khi tách Component

1. **Import CSS**: Mỗi component cần import CSS tương ứng
   ```javascript
   import '../styles/flashcard.css';
   ```

2. **Props**: Xác định props cần thiết cho mỗi component
   - State từ App.js
   - Functions từ App.js
   - Callbacks để update state

3. **Dependencies**: Đảm bảo import đầy đủ:
   - React hooks (useState, useEffect, ...)
   - Icons từ lucide-react
   - Utils và services

4. **Test**: Sau khi tách, test từng component để đảm bảo không có lỗi

## 🎯 Cách sử dụng CSS mới

### Trong Component:
```javascript
import '../styles/flashcard.css';
```

### Trong App.css:
```css
@import './styles/common.css';
@import './styles/flashcard.css';
```

## 📚 Tài liệu tham khảo

- Xem `RESTRUCTURE_GUIDE.md` để biết chi tiết cách tách từng component
- Xem code trong `App.js` để hiểu logic cần tách

