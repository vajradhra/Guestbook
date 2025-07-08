# Firebase 設定指南

## 🔥 設定 Firebase 專案

### 1. 建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「建立專案」
3. 輸入專案名稱（例如：`guestbook-app`）
4. 選擇是否啟用 Google Analytics（可選）
5. 點擊「建立專案」

### 2. 啟用 Realtime Database

1. 在 Firebase Console 中，點擊左側選單的「Realtime Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式開始」（稍後可以設定安全規則）
4. 選擇資料庫位置（建議選擇離你最近的區域）
5. 點擊「完成」

### 3. 設定資料庫規則

在 Realtime Database 頁面中，點擊「規則」標籤，將規則設定為：

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": true
    }
  }
}
```

**注意：** 這是測試模式，允許所有人讀寫。在生產環境中應該設定更嚴格的規則。

### 4. 取得 Firebase 設定

1. 在 Firebase Console 中，點擊專案設定（齒輪圖示）
2. 在「一般」標籤中，向下滾動到「你的應用程式」
3. 點擊「新增應用程式」圖示
4. 選擇「網頁」平台
5. 輸入應用程式暱稱（例如：`guestbook-web`）
6. 點擊「註冊應用程式」
7. 複製 Firebase 設定物件

### 5. 更新 HTML 檔案

將 `index.html` 中的 Firebase 設定替換為你的實際設定：

```javascript
const firebaseConfig = {
    apiKey: "你的_API_KEY",
    authDomain: "你的專案ID.firebaseapp.com",
    databaseURL: "https://你的專案ID-default-rtdb.firebaseio.com",
    projectId: "你的專案ID",
    storageBucket: "你的專案ID.appspot.com",
    messagingSenderId: "你的_SENDER_ID",
    appId: "你的_APP_ID",
    measurementId: "你的_MEASUREMENT_ID"
};
```

## 📊 資料結構

Firebase Realtime Database 中的資料結構如下：

```json
{
  "messages": {
    "-NxYz123456789": {
      "name": "使用者姓名",
      "content": "留言內容",
      "timestamp": "2024-01-01T12:00:00.000Z"
    },
    "-NxYz987654321": {
      "name": "另一個使用者",
      "content": "另一條留言",
      "timestamp": "2024-01-01T13:00:00.000Z"
    }
  }
}
```

## 🔒 安全規則建議

在生產環境中，建議使用以下安全規則：

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": "newData.hasChildren(['name', 'content', 'timestamp']) && 
                 newData.child('name').isString() && 
                 newData.child('name').val().length <= 50 &&
                 newData.child('content').isString() && 
                 newData.child('content').val().length <= 500 &&
                 newData.child('timestamp').isString()"
    }
  }
}
```

## 🚀 部署到 GitHub Pages

1. 將更新後的程式碼推送到 GitHub
2. 在 GitHub 倉庫設定中啟用 GitHub Pages
3. 你的留言板就會在 `https://你的使用者名.github.io/倉庫名` 上線

## 📱 功能特色

- ✅ **即時同步** - 多個使用者可以同時看到新留言
- ✅ **永久儲存** - 留言資料儲存在 Firebase 雲端
- ✅ **刪除功能** - 可以刪除不需要的留言
- ✅ **載入動畫** - 優雅的載入提示
- ✅ **錯誤處理** - 完整的錯誤提示和處理

## 🔧 故障排除

### 常見問題

1. **Firebase 未初始化**
   - 檢查 Firebase 設定是否正確
   - 確認網路連線正常

2. **無法讀取資料**
   - 檢查資料庫規則設定
   - 確認資料庫 URL 正確

3. **無法寫入資料**
   - 檢查寫入權限
   - 確認資料格式正確

### 除錯技巧

1. 開啟瀏覽器開發者工具
2. 查看 Console 中的錯誤訊息
3. 檢查 Network 標籤中的 Firebase 請求

## 💰 成本考量

Firebase Realtime Database 的免費方案包括：
- 1GB 儲存空間
- 10GB/月 下載流量
- 100 個同時連線

對於小型留言板應用程式來說，免費方案通常足夠使用。

## 📞 支援

如果遇到問題，可以：
1. 查看 [Firebase 文件](https://firebase.google.com/docs)
2. 檢查 [Firebase 社群論壇](https://firebase.google.com/community)
3. 提交 GitHub Issue 