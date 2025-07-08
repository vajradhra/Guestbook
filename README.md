# 留言板 - Guestbook

一個功能完整的留言板網站，使用 jQuery、Tailwind CSS 和 Firebase Realtime Database，專為 GitHub Pages 設計。

## ✨ 特性

- 🎨 **現代化設計** - 使用 Tailwind CSS 打造的漸層背景、毛玻璃效果和流暢動畫
- 📱 **響應式佈局** - 完美適配桌面端和行動端
- 💬 **即時留言** - 使用 Firebase Realtime Database 實現即時同步
- 🔒 **永久儲存** - 留言資料儲存在 Firebase 雲端，永不遺失
- ⚡ **快速載入** - 輕量級程式碼，載入速度快
- 🎯 **使用者體驗** - 字元計數、自動儲存草稿、鍵盤快捷鍵
- 🗑️ **刪除功能** - 可以刪除不需要的留言
- 🔄 **即時同步** - 多個使用者可以同時看到新留言

## 🚀 功能

### 核心功能
- 使用者留言提交（姓名 + 內容）
- 即時留言顯示和同步
- 時間戳顯示（相對時間）
- 表單驗證
- 留言刪除功能

### 互動功能
- 成功/錯誤提示框
- 字元計數顯示
- 自動儲存草稿（會話儲存）
- 鍵盤快捷鍵（Ctrl+Enter 提交）
- 平滑滾動動畫
- 懸停效果
- 載入動畫

### 設計特色
- 漸層背景（紫色到藍色）
- 毛玻璃效果（backdrop-filter）
- 卡片式設計
- 圖示支援（Font Awesome）
- 現代化字體（Inter）

## 📁 檔案結構

```
Guestbook/
├── index.html          # 主頁面（Tailwind CSS + Firebase）
├── script.js           # jQuery + Firebase 功能
├── firebase-setup.md   # Firebase 設定指南
└── README.md           # 專案說明
```

## 🛠️ 技術棧

- **HTML5** - 語義化標記
- **Tailwind CSS** - 現代化CSS框架
- **jQuery** - JavaScript函式庫
- **Firebase Realtime Database** - 即時資料庫
- **Font Awesome** - 圖示庫
- **Google Fonts** - 字體

## 🔥 Firebase 設定

### 快速開始

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用 Realtime Database
4. 取得 Firebase 設定
5. 更新 `index.html` 中的 Firebase 設定

詳細設定步驟請參考 [firebase-setup.md](firebase-setup.md)

### 資料結構

```json
{
  "messages": {
    "-NxYz123456789": {
      "name": "使用者姓名",
      "content": "留言內容",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

## 🌐 部署到GitHub Pages

1. 將程式碼推送到GitHub倉庫
2. 設定 Firebase 專案（參考 firebase-setup.md）
3. 更新 `index.html` 中的 Firebase 設定
4. 進入倉庫設定（Settings）
5. 找到"Pages"選項
6. 選擇"Deploy from a branch"
7. 選擇主分支（通常是`main`或`master`）
8. 儲存設定

幾分鐘後，你的留言板就會在 `https://你的使用者名.github.io/倉庫名` 上線！

## 📝 使用說明

### 留言功能
1. 在左側表單中填寫姓名和留言內容
2. 點擊"發送留言"按鈕或按Ctrl+Enter
3. 留言會立即顯示在右側列表中並同步到雲端
4. 留言會永久儲存在 Firebase 資料庫中

### 刪除功能
- 點擊留言右上角的垃圾桶圖示可以刪除留言
- 刪除操作會同步到所有使用者的畫面

### 字元限制
- 姓名：最多50個字元
- 留言內容：最多500個字元

### 鍵盤快捷鍵
- `Ctrl + Enter`：提交留言

## 🎨 自訂

### 修改顏色主題
在 `index.html` 中修改 Tailwind CSS 類別：
```html
<!-- 背景漸層 -->
<body class="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">

<!-- 主色調 -->
<i class="fas fa-user text-purple-600"></i>
```

### 修改字元限制
在 `script.js` 中修改驗證邏輯：
```javascript
if (name.length > 50) { // 修改這裡的數字
    this.showToast('error', '姓名不能超過50個字元');
    return;
}
```

### 修改 Firebase 設定
在 `index.html` 中更新 Firebase 設定：
```javascript
const firebaseConfig = {
    apiKey: "你的_API_KEY",
    authDomain: "你的專案ID.firebaseapp.com",
    databaseURL: "https://你的專案ID-default-rtdb.firebaseio.com",
    // ... 其他設定
};
```

## 🔧 本地開發

1. 複製倉庫
```bash
git clone https://github.com/你的使用者名/Guestbook.git
cd Guestbook
```

2. 設定 Firebase（參考 firebase-setup.md）

3. 使用本地伺服器執行（推薦）
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用Live Server擴充功能（VS Code）
```

4. 在瀏覽器中存取 `http://localhost:8000`

## 📱 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔒 安全考量

- Firebase 資料庫規則已設定為允許讀寫
- 在生產環境中建議設定更嚴格的安全規則
- 所有使用者輸入都會進行驗證和轉義

## 💰 成本

Firebase Realtime Database 免費方案包括：
- 1GB 儲存空間
- 10GB/月 下載流量
- 100 個同時連線

對於小型留言板應用程式來說，免費方案通常足夠使用。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 🙏 致謝

- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [jQuery](https://jquery.com/) - JavaScript函式庫
- [Firebase](https://firebase.google.com/) - 即時資料庫
- [Font Awesome](https://fontawesome.com/) - 圖示庫
- [Google Fonts](https://fonts.google.com/) - 字體
- [Inter](https://rsms.me/inter/) - 主字體

---

⭐ 如果這個專案對你有幫助，請給它一個星標！
