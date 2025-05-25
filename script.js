document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const characterNameDisplay = document.getElementById('character-name');
    const characterAvatar = document.getElementById('character-avatar');

    // --- 設定項目 (後で詳細に応じて変更) ---
    let currentCharacter = {
        name: "サンプルボット",
        avatar: "https://via.placeholder.com/80?text=Bot", // ダミー画像
        // Geminiとの会話履歴 (セッションごとに管理)
        chatHistory: [ 
            // Gemini APIに渡す履歴の形式に合わせる (例: {role: "user", parts: "こんにちは"}, {role: "model", parts: "こんにちは！"})
        ] 
    };
    // ------------------------------------

    characterNameDisplay.textContent = currentCharacter.name;
    characterAvatar.src = currentCharacter.avatar;
    characterAvatar.alt = `${currentCharacter.name} Avatar`;

    // 初期メッセージ (キャラクターから)
    addMessageToChatLog("こんにちは！どんなお話をしましょうか？", "character");

    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Enterキーでの改行送信を防ぐ
            handleSendMessage();
        }
    });

    // Textareaの高さ自動調整
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto'; // 一旦高さをリセット
        userInput.style.height = `${userInput.scrollHeight}px`; // 内容に合わせて高さを調整
        sendButton.disabled = userInput.value.trim() === ''; // 入力が空なら送信ボタンを無効化
    });
    sendButton.disabled = true; // 初期状態では送信ボタンを無効化


    function handleSendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        addMessageToChatLog(messageText, 'user');
        
        // Gemini API用に履歴を更新 (ユーザーメッセージ)
        // currentCharacter.chatHistory.push({ role: "user", parts: [{ text: messageText }] });

        userInput.value = ''; // 入力欄をクリア
        userInput.style.height = 'auto'; // 高さをリセット
        sendButton.disabled = true; // 送信後、ボタンを無効化

        showTypingIndicator(); // ローディング表示

        // Gemini APIにメッセージを送信 (現在はダミー応答)
        getBotResponse(messageText);
    }

    function addMessageToChatLog(text, sender, isTypingIndicator = false) {
        const messageDiv = document.createElement('div');
        
        if (isTypingIndicator) {
            messageDiv.classList.add('message', 'character-message', 'typing-indicator-container');
            messageDiv.innerHTML = `
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>`;
        } else {
            messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'character-message');
            const p = document.createElement('p');
            p.textContent = text; // XSS対策としてtextContentを使用
            messageDiv.appendChild(p);
        }
        
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight; // 自動スクロール
        return messageDiv; // タイピングインジケーター削除用に要素を返す
    }

    let typingIndicatorElement = null;

    function showTypingIndicator() {
        if (typingIndicatorElement) return; // 既に表示されていれば何もしない
        typingIndicatorElement = addMessageToChatLog('', 'character', true);
    }

    function removeTypingIndicator() {
        if (typingIndicatorElement) {
            chatLog.removeChild(typingIndicatorElement);
            typingIndicatorElement = null;
        }
    }

    async function getBotResponse(userMessage) {
        // === Gemini API連携部分はここに実装 ===
        // 雛形ではダミーの応答を返します。
        // 実際のAPI呼び出しは非同期処理になります。

        // // Gemini SDK を利用する場合の例 (HTML側で `window.genAI` が設定されている前提)
        // if (window.genAI) {
        //     try {
        //         // const model = window.genAI.getGenerativeModel({ model: "gemini-pro" }); // モデル名指定
        //         // const chat = model.startChat({
        //         //     history: currentCharacter.chatHistory.slice(0, -1) // 最後のユーザーメッセージは含めない
        //         // });
        //         // const result = await chat.sendMessage(userMessage);
        //         // const response = result.response;
        //         // const botResponseText = response.text();
                
        //         // // Gemini API用に履歴を更新 (モデルの応答)
        //         // currentCharacter.chatHistory.push({ role: "model", parts: [{ text: botResponseText }] });

        //         // removeTypingIndicator();
        //         // addMessageToChatLog(botResponseText, 'character');

        //     } catch (error) {
        //         console.error("Error fetching response from Gemini:", error);
        //         removeTypingIndicator();
        //         addMessageToChatLog("申し訳ありません、エラーが発生しました。", 'character');
        //     }
        // } else {
            // Gemini SDK がない場合のダミー応答
            setTimeout(() => {
                removeTypingIndicator();
                const responses = [
                    "そうなんですね！興味深いです。",
                    "へえ、面白いですね。",
                    "もう少し詳しく教えていただけますか？",
                    `「${userMessage}」についてですね。なるほど！`,
                    "それは知りませんでした！",
                    "うんうん、わかりますよ。"
                ];
                const dummyResponse = responses[Math.floor(Math.random() * responses.length)];
                
                // Gemini API用に履歴を更新 (モデルの応答 - ダミー)
                // currentCharacter.chatHistory.push({ role: "model", parts: [{ text: dummyResponse }] });

                addMessageToChatLog(dummyResponse, 'character');
            }, 1000 + Math.random() * 1000); // 1-2秒のランダムな遅延
        // }
    }
});
