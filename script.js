// 留言板功能 - 使用jQuery和Firebase
class Guestbook {
    constructor() {
        this.messages = [];
        this.$form = $('#guestbookForm');
        this.$messagesList = $('#messagesList');
        this.$successToast = $('#successToast');
        this.$errorToast = $('#errorToast');
        this.$loadingMessage = $('#loadingMessage');
        
        // Firebase references
        this.database = null;
        this.messagesRef = null;
        
        this.init();
    }
    
    async init() {
        // 等待Firebase初始化
        await this.waitForFirebase();
        
        // 綁定表單提交事件
        this.$form.on('submit', (e) => this.handleSubmit(e));
        
        // 初始化Firebase連接
        this.initFirebase();
        
        // 載入現有留言
        this.loadMessages();
        
        // 初始化互動效果
        this.initInteractiveEffects();
    }
    
    waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.firebase && window.firebase.database) {
                    this.database = window.firebase.database;
                    this.messagesRef = window.firebase.ref(this.database, 'messages');
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }
    
    initFirebase() {
        // 監聽資料庫變化
        window.firebase.onValue(this.messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.messages = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                this.renderMessages();
            } else {
                this.messages = [];
                this.renderMessages();
            }
        }, (error) => {
            console.error('Firebase讀取錯誤:', error);
            this.showToast('error', '載入留言時發生錯誤');
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const name = $('#name').val().trim();
        const content = $('#content').val().trim();
        
        // 驗證輸入
        if (!name || !content) {
            this.showToast('error', '請填寫完整資訊');
            return;
        }
        
        if (name.length > 50) {
            this.showToast('error', '姓名不能超過50個字元');
            return;
        }
        
        if (content.length > 500) {
            this.showToast('error', '留言內容不能超過500個字元');
            return;
        }
        
        try {
            // 創建新留言
            const message = {
                name: name,
                content: content,
                timestamp: new Date().toISOString()
            };
            
            // 儲存到Firebase
            await this.saveMessage(message);
            
            // 清空表單
            this.$form[0].reset();
            
            // 隱藏字符計數器
            $('.char-counter').addClass('hidden');
            
            // 顯示成功提示
            this.showToast('success', '留言發送成功！');
            
        } catch (error) {
            console.error('儲存留言錯誤:', error);
            this.showToast('error', '儲存留言時發生錯誤');
        }
    }
    
    async saveMessage(message) {
        return new Promise((resolve, reject) => {
            window.firebase.push(this.messagesRef, message)
                .then((snapshot) => {
                    resolve(snapshot.key);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    
    loadMessages() {
        // 載入中提示會在Firebase回調中自動隱藏
        this.$loadingMessage.show();
    }
    
    renderMessages() {
        // 隱藏載入提示
        this.$loadingMessage.hide();
        
        // 清空現有留言
        this.$messagesList.find('.message-card').remove();
        
        if (this.messages.length === 0) {
            // 顯示空狀態
            this.$messagesList.append(`
                <div class="text-center py-8">
                    <i class="fas fa-comments text-gray-300 text-4xl mb-4"></i>
                    <p class="text-gray-500">還沒有留言，來寫第一條留言吧！</p>
                </div>
            `);
            return;
        }
        
        // 渲染留言
        this.messages.forEach(message => {
            this.renderMessage(message);
        });
    }
    
    renderMessage(message) {
        const timeAgo = this.getTimeAgo(new Date(message.timestamp));
        
        const messageHtml = `
            <div class="message-card bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-slide-up" data-message-id="${message.id}">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-user-circle text-purple-600 text-xl"></i>
                        <span class="font-semibold text-gray-800">${this.escapeHtml(message.name)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="text-sm text-gray-500">${timeAgo}</div>
                        <button class="delete-btn text-red-400 hover:text-red-600 transition-colors duration-200" data-message-id="${message.id}" title="刪除留言">
                            <i class="fas fa-trash-alt text-sm"></i>
                        </button>
                    </div>
                </div>
                <div class="text-gray-700 leading-relaxed">
                    ${this.escapeHtml(message.content)}
                </div>
            </div>
        `;
        
        this.$messagesList.append(messageHtml);
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return '剛剛';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}分鐘前`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}小時前`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}天前`;
        }
    }
    
    showToast(type, message) {
        const $toast = type === 'success' ? this.$successToast : this.$errorToast;
        
        $toast.find('span').text(message);
        $toast.removeClass('translate-x-full').addClass('translate-x-0');
        
        // 3秒後隱藏提示
        setTimeout(() => {
            $toast.removeClass('translate-x-0').addClass('translate-x-full');
        }, 3000);
    }
    
    escapeHtml(text) {
        return $('<div>').text(text).html();
    }
    
    initInteractiveEffects() {
        // 輸入框焦點效果
        $('.border-gray-200').on('focus', function() {
            $(this).parent().addClass('scale-105');
        }).on('blur', function() {
            $(this).parent().removeClass('scale-105');
        });
        
        // 按鈕點擊效果
        $('button[type="submit"]').on('click', function() {
            $(this).addClass('scale-95');
            setTimeout(() => {
                $(this).removeClass('scale-95');
            }, 150);
        });
        
        // 添加鍵盤快捷鍵
        $(document).on('keydown', (e) => {
            // Ctrl+Enter 提交表單
            if (e.ctrlKey && e.key === 'Enter') {
                const $activeElement = $(document.activeElement);
                if ($activeElement.is('textarea, input')) {
                    e.preventDefault();
                    this.$form.trigger('submit');
                }
            }
        });
        
        // 刪除留言功能
        $(document).on('click', '.delete-btn', (e) => {
            e.preventDefault();
            const messageId = $(e.currentTarget).data('message-id');
            this.deleteMessage(messageId);
        });
        
        // 字符計數功能
        this.initCharCounter();
        
        // 自動保存草稿功能
        this.initDraftSaving();
    }
    
    async deleteMessage(messageId) {
        if (confirm('確定要刪除這條留言嗎？')) {
            try {
                const messageRef = window.firebase.ref(this.database, `messages/${messageId}`);
                await window.firebase.remove(messageRef);
                this.showToast('success', '留言已刪除');
            } catch (error) {
                console.error('刪除留言錯誤:', error);
                this.showToast('error', '刪除留言時發生錯誤');
            }
        }
    }
    
    initCharCounter() {
        const updateCharCount = (element, maxLength) => {
            const $element = $(element);
            const currentLength = $element.val().length;
            const $counter = $element.siblings('.char-counter');
            
            if (currentLength > 0) {
                const remaining = maxLength - currentLength;
                const colorClass = remaining < 50 ? 'text-red-500' : 'text-gray-500';
                
                $counter
                    .removeClass('hidden text-red-500 text-gray-500')
                    .addClass(colorClass)
                    .text(`${currentLength}/${maxLength}`);
            } else {
                $counter.addClass('hidden');
            }
        };
        
        $('#name').on('input', function() {
            updateCharCount(this, 50);
        });
        
        $('#content').on('input', function() {
            updateCharCount(this, 500);
        });
    }
    
    initDraftSaving() {
        const saveDraft = () => {
            const name = $('#name').val();
            const content = $('#content').val();
            
            if (name || content) {
                sessionStorage.setItem('guestbook-draft', JSON.stringify({ name, content }));
            }
        };
        
        const loadDraft = () => {
            const draft = sessionStorage.getItem('guestbook-draft');
            if (draft) {
                const { name, content } = JSON.parse(draft);
                $('#name').val(name || '');
                $('#content').val(content || '');
                
                // 更新字符計數
                $('#name').trigger('input');
                $('#content').trigger('input');
            }
        };
        
        // 自動保存草稿
        $('#name, #content').on('input', saveDraft);
        
        // 頁面載入時恢復草稿
        loadDraft();
        
        // 表單提交成功後清除草稿
        this.$form.on('submit', () => {
            setTimeout(() => {
                sessionStorage.removeItem('guestbook-draft');
            }, 1000);
        });
    }
}

// 頁面載入完成後初始化
$(document).ready(() => {
    // 初始化留言板
    window.guestbook = new Guestbook();
    
    // 添加頁面載入動畫
    $('body').css('opacity', '0').animate({ opacity: 1 }, 500);
    
    // 添加滾動條樣式
    $('<style>')
        .text(`
            #messagesList::-webkit-scrollbar {
                width: 6px;
            }
            #messagesList::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            #messagesList::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }
            #messagesList::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        `)
        .appendTo('head');
});

// 響應式設計調整
$(window).on('resize', () => {
    // 在小螢幕上調整提示框位置
    if ($(window).width() <= 768) {
        $('#successToast, #errorToast').removeClass('right-6').addClass('right-4 left-4');
    } else {
        $('#successToast, #errorToast').removeClass('right-4 left-4').addClass('right-6');
    }
});

// 觸發初始調整
$(window).trigger('resize'); 