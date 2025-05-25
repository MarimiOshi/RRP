// Gemini SDKをインポート
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// --- ⚠️ APIキー設定 (重要) ---
// ここにあなたのGemini APIキーを設定してください。
// これはデモ用です。本番環境ではサーバーサイドでAPIキーを管理してください。
const API_KEY = "YOUR_GEMINI_API_KEY"; 
// ------------------------------

let genAI;
let model;
let chatSession; // チャットセッションを保持する変数
let geminiAvailable = false; // Gemini APIが利用可能かどうかのフラグ

// APIキーが設定されていれば、Gemini AI SDKを初期化
if (API_KEY && API_KEY !== "YOUR_GEMINI_API_KEY") {
    try {
        genAI = new GoogleGenerativeAI(API_KEY);
        // 使用するモデルを指定 (例: 'gemini-pro', 'gemini-1.5-flash-latest' など)
        model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
        geminiAvailable = true;
        console.log("Gemini AI SDK initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize GoogleGenerativeAI or get model:", error);
        alert("Gemini AI SDKの初期化に失敗しました。APIキーが正しいか、またはモデル名を確認してください。\n詳細はコンソールログを確認してください。");
    }
} else {
    console.warn("API_KEY is not set or is a placeholder in script.js. Gemini API will not be used. Running in dummy mode.");
}


document.addEventListener('DOMContentLoaded', async () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const characterNameDisplay = document.getElementById('character-name');
    const characterAvatar = document.getElementById('character-avatar');

    // --- キャラクター設定 ---
    const currentCharacter = {
        name: "AIアシスタント「ジェマ」",
        avatar: "https://source.unsplash.com/random/80x80/?robot,cute", // ランダムな可愛いロボット画像
        systemInstruction: "あなたは「ジェマ」という名前の、親切で少しユーモラスなAIアシスタントです。ユーザーと楽しく会話することを心がけてください。人間らしい自然な言葉遣いをし、時々ジョークを交えることもあります。",
        // chatHistoryForDisplay: [] // UI表示や永続化のための履歴 (今回は未使用)
    };
    // -------------------------

    // キャラクター情報をUIに反映
    characterNameDisplay.textContent = currentCharacter.name;
    characterAvatar.src = currentCharacter.avatar;
    characterAvatar.alt = `${currentCharacter.name} Avatar`;

    // 初期メッセージ (キャラクターから)
    addMessageToChatLog(`こんにちは！私は${currentCharacter.name}です。どんなお話をしましょうか？`, "character");

    // Geminiが利用可能な場合、チャットセッションを初期化
    if (geminiAvailable) {
        try {
            await initializeChatSession();
        } catch (error) {
            // initializeChatSession内でエラーメッセージ表示済みなので、ここではログのみ
            console.error("Error during initial chat session initialization:", error);
            addMessageToChatLog("チャットの初期化中にエラーが発生しました。ダミー応答モードで動作します。", "character");
            geminiAvailable = false; // Gemini利用不可に設定
        }
    } else {
        if (API_KEY && API_KEY !== "YOUR_GEMINI_API_KEY") {
             // APIキーは設定されているが初期化に失敗した場合
             addMessageToChatLog("Geminiとの接続に問題があるため、ダミー応答モードで動作します。", "character");
        } else {
            // APIキーが未設定の場合
            addMessageToChatLog("APIキーが設定されていないため、ダミー応答モードで動作します。", "character");
        }
    }

    // チャットセッションの初期化 (または再初期化)
    async function initializeChatSession() {
        if (!model) {
            console.log("Gemini model is not available. Cannot initialize chat session.");
            throw new Error("Gemini model not available."); // geminiAvailableをfalseにするトリガー
        }

        const historyForChatInitialization = [];
        if (currentCharacter.systemInstruction) {
            historyForChatInitialization.push(
                {
                    role: "user", // システム指示は user ロールで与える
                    parts: [{ text: currentCharacter.systemInstruction }],
                },
                {
                    role: "model", // モデルからの確認応答を模倣
                    parts: [{ text: "はい、承知いたしました。そのように振る舞います。" }],
                }
            );
        }
        // もし永続化された会話履歴があれば、ここに追加する
        // currentCharacter.chatHistoryForDisplay.forEach(item => historyForChatInitialization.push(item));

        console.log("Starting chat with initial history:", historyForChatInitialization);
        try {
            chatSession = model.startChat({
                history: historyForChatInitialization,
                generationConfig: {
                    // maxOutputTokens: 256, // 例: 最大出力トークン数
                    // temperature: 0.7,      // 例: 生成の多様性 (0.0-1.0)
                    // topP: 0.9,             // 例: Top-pサンプリング
                    // topK: 40,              // 例: Top-kサンプリング
                },
            });
            console.log("Chat session initialized successfully with Gemini.");
        } catch (error) {
            console.error("Failed to start chat session with Gemini:", error);
            addMessageToChatLog("Geminiとのチャットセッション開始に失敗しました。詳細はコンソールを確認してください。", "character");
            throw error; // 上位のcatchでgeminiAvailableをfalseにする
        }
    }


    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    });

    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = `${userInput.scrollHeight}px`;
        sendButton.disabled = userInput.value.trim() === '';
    });
    sendButton.disabled = true; // 初期状態は無効

    function handleSendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        addMessageToChatLog(messageText, 'user');
        // currentCharacter.chatHistoryForDisplay.push({ role: "user", parts: [{ text: messageText }] }); // 表示用履歴に追加する場合

        userInput.value = '';
        userInput.style.height = 'auto';
        sendButton.disabled = true;

        showTypingIndicator();
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
            // XSS対策としてtextContentを使用するが、Geminiからの応答がMarkdown等を含む場合は、
            // 安全な方法でHTMLに変換する必要がある (例: DOMPurify と marked.js の組み合わせ)
            // 今回は簡単のためtextContentのまま
            p.textContent = text; 
            messageDiv.appendChild(p);
        }
        
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return messageDiv;
    }

    let typingIndicatorElement = null;

    function showTypingIndicator() {
        if (typingIndicatorElement) return;
        typingIndicatorElement = addMessageToChatLog('', 'character', true);
    }

    function removeTypingIndicator() {
        if (typingIndicatorElement) {
            chatLog.removeChild(typingIndicatorElement);
            typingIndicatorElement = null;
        }
    }

    async function getBotResponse(userMessage) {
        if (!geminiAvailable || !chatSession) {
            // ダミー応答 (APIキーがない、初期化失敗、またはチャットセッションがない場合)
            console.log("Gemini not available or chat session not initialized. Using dummy response.");
            setTimeout(() => {
                removeTypingIndicator();
                const responses = [
                    "ふむふむ、なるほどですね！",
                    "それは面白い視点ですね！",
                    "もっと詳しく聞かせていただけますか？",
                    `「${userMessage}」についてですね。興味深いです。`,
                    "わかります、わかります！",
                    "ええと、ちょっと考えてみますね…（ダミー応答中です）"
                ];
                const dummyResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessageToChatLog(dummyResponse, 'character');
            }, 1000 + Math.random() * 1000);
            return;
        }

        try {
            // Gemini APIにメッセージを送信
            const result = await chatSession.sendMessage(userMessage);
            const response = result.response;
            const botResponseText = response.text();

            // currentCharacter.chatHistoryForDisplay.push({ role: "model", parts: [{ text: botResponseText }] }); // 表示用履歴に追加する場合

            removeTypingIndicator();
            addMessageToChatLog(botResponseText, 'character');

        } catch (error) {
            console.error("Error fetching response from Gemini:", error);
            removeTypingIndicator();
            let errorMessage = "申し訳ありません、応答の取得中にエラーが発生しました。";
            if (error.message) {
                if (error.message.includes("API key not valid")) {
                    errorMessage = "APIキーが無効のようです。script.js内のAPI_KEYを確認してください。";
                } else if (error.message.toLowerCase().includes("quota")) {
                    errorMessage = "APIの利用上限に達したか、リクエスト頻度が高すぎる可能性があります。";
                } else if (error.message.toLowerCase().includes("candidate_blocked_due_to_safety") || error.message.toLowerCase().includes("safety_settings")) {
                    errorMessage = "応答が安全設定によりブロックされました。不適切な内容でないか確認し、別の表現でお試しください。";
                } else if (error.message.toLowerCase().includes("text not available") || response?.promptFeedback?.blockReason) {
                     errorMessage = "モデルが応答を生成できませんでした。入力内容を確認するか、別の質問をお試しください。";
                } else if (error.message.includes("429") || error.message.toLowerCase().includes("resource has been exhausted")) { // 429 Too Many Requests
                    errorMessage = "リクエストが多すぎます。少し時間をおいてから再度お試しください。";
                }
            }
            addMessageToChatLog(errorMessage, 'character');
            
            // 特定のエラー(例: 認証エラー)の場合、Gemini利用不可にするなどの措置も検討
            if (error.message && error.message.includes("API key not valid")) {
                geminiAvailable = false; 
                chatSession = null; // セッションもクリア
                console.warn("API key seems invalid. Disabling Gemini features.");
            }
            // セッションが途切れたり、回復不能なエラーの場合はチャットセッションの再初期化を試みることもできる
            // } else if (/* 特定のエラー条件 */) {
            //    try {
            //        await initializeChatSession();
            //        addMessageToChatLog("チャットセッションを再初期化しました。もう一度お試しください。", "character");
            //    } catch (reinitError) {
            //        addMessageToChatLog("チャットセッションの再初期化に失敗しました。", "character");
            //        geminiAvailable = false;
            //    }
            // }
        }
    }
});
