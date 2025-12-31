# Hướng dẫn Refactoring App.js

## ✅ Đã hoàn thành

### 1. Components đã tách
- ✅ `components/Icons.js` - CompactIcons component
- ✅ `components/BulkImportModal.js` - Modal nhập hàng loạt từ vựng
- ✅ `components/TipsModal.js` - Modal hiển thị mẹo và hướng dẫn

### 2. Custom Hooks đã tạo
- ✅ `hooks/useVocabulary.js` - Quản lý từ vựng (load, delete, bulk import)
- ✅ `hooks/useStats.js` - Quản lý thống kê (load, reset, update)
- ✅ `hooks/useSettings.js` - Quản lý settings (language mode, difficulty, favorites, etc.)

### 3. Utils đã có sẵn
- ✅ `utils/constants.js` - API configuration
- ✅ `utils/helpers.js` - Helper functions (getWordId)
- ✅ `utils/soundUtils.js` - Sound functions

## ⚠️ Cần hoàn thành

### 1. Cập nhật Settings Component
File `components/Settings.js` hiện chỉ là placeholder. Cần di chuyển toàn bộ Settings modal từ App.js (dòng 2259-2790) vào component này.

**Props cần truyền vào Settings:**
```javascript
<Settings
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  isMobile={isMobile}
  user={user}
  stats={stats}
  languageMode={languageMode}
  setLanguageMode={setLanguageMode}
  difficulty={difficulty}
  setDifficulty={setDifficulty}
  autoAdvance={autoAdvance}
  setAutoAdvance={setAutoAdvance}
  soundEnabled={soundEnabled}
  setSoundEnabled={setSoundEnabled}
  maxQuestions={maxQuestions}
  setMaxQuestions={setMaxQuestions}
  wordFilter={wordFilter}
  setWordFilter={setWordFilter}
  sortMode={sortMode}
  setSortMode={setSortMode}
  onLogout={logout}
  onResetStats={resetStats}
  onDeleteVocabulary={deleteVocabulary}
  onOpenBulkImport={() => {
    setShowModal(true);
    setShowSettings(false);
  }}
/>
```

### 2. Refactor App.js

**Các bước refactor:**

1. **Import các hooks và components mới:**
```javascript
import { useAuth } from './hooks/useAuth';
import { useVocabulary } from './hooks/useVocabulary';
import { useStats } from './hooks/useStats';
import { useSettings } from './hooks/useSettings';
import { CompactIcons } from './components/Icons';
import BulkImportModal from './components/BulkImportModal';
import TipsModal from './components/TipsModal';
import Settings from './components/Settings';
```

2. **Thay thế state management bằng hooks:**
```javascript
// Thay vì:
const [allWords, setAllWords] = useState([]);
const [loading, setLoading] = useState(true);
// ... nhiều state khác

// Dùng:
const { allWords, loading, error, loadAllWords, deleteVocabulary, bulkImportWords } = 
  useVocabulary(isAuthenticated, showToast);
const { stats, setStats, loadUserStats, resetStats, updateStats } = 
  useStats(isAuthenticated, showToast);
const { languageMode, setLanguageMode, favorites, toggleFavorite, ... } = 
  useSettings();
const { isAuthenticated, user, login, register, logout } = useAuth(showToast);
```

3. **Thay thế modals bằng components:**
```javascript
// Thay vì inline modal code, dùng:
<BulkImportModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onImport={bulkImportWords}
  isMobile={isMobile}
/>

<TipsModal
  isOpen={showTips}
  onClose={() => setShowTips(false)}
  isMobile={isMobile}
/>

<Settings
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  // ... props
/>
```

4. **Loại bỏ code trùng lặp:**
- Xóa CompactIcons definition (đã có trong Icons.js)
- Xóa API config duplicate (đã có trong constants.js)
- Xóa getWordId duplicate (đã có trong helpers.js)
- Xóa sound functions duplicate (đã có trong soundUtils.js)
- Xóa authentication logic duplicate (dùng useAuth hook)
- Xóa vocabulary management logic (dùng useVocabulary hook)
- Xóa stats management logic (dùng useStats hook)
- Xóa settings state management (dùng useSettings hook)

### 3. Helper Functions cần di chuyển

Các helper functions sau nên di chuyển vào `utils/helpers.js`:
- `generateHint(word, difficulty)` - Tạo gợi ý từ
- `buildQuizOptions(word, sourceWords, mode)` - Tạo câu hỏi trắc nghiệm

### 4. Cấu trúc App.js sau refactor

App.js sẽ chỉ còn:
- Import statements
- Hook calls (useAuth, useVocabulary, useStats, useSettings)
- Local UI state (currentWord, userInput, feedback, etc.)
- Filtered words logic (useMemo)
- Event handlers (handleSubmit, handleNext, etc.)
- Render logic (JSX)

**Kích thước dự kiến:** ~500-800 dòng (giảm từ 2921 dòng)

## 📋 Checklist

- [x] Tách CompactIcons
- [x] Tạo useVocabulary hook
- [x] Tạo useStats hook
- [x] Tạo useSettings hook
- [x] Tạo BulkImportModal component
- [x] Tạo TipsModal component
- [ ] Cập nhật Settings component
- [ ] Di chuyển helper functions vào utils
- [ ] Refactor App.js để sử dụng hooks và components
- [ ] Test lại toàn bộ tính năng
- [ ] Kiểm tra và sửa lỗi linter

## 🎯 Lợi ích sau refactor

1. **Dễ bảo trì:** Code được tổ chức rõ ràng, mỗi file có trách nhiệm riêng
2. **Dễ test:** Hooks và components có thể test độc lập
3. **Tái sử dụng:** Hooks có thể dùng lại ở các component khác
4. **Dễ đọc:** App.js ngắn gọn, dễ hiểu hơn
5. **Chuẩn cấu trúc:** Tuân thủ best practices của React

## 📝 Lưu ý

- Backend (`tienganh-be/server.js`) đã có cấu trúc tốt, không cần thay đổi
- Các service files (`services/apiService.js`, `services/authService.js`) đã tốt
- Các component hiện có (Flashcard, Quiz, Practice) không cần thay đổi

