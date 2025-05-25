// script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const characterNameElement = document.getElementById('character-name');
    const characterIconElement = document.getElementById('character-icon');

    // --- キャラクター設定 (後で詳細に設定可能) ---
    let character = {
        name: "AIアシスタント",
        icon: "https://via.placeholder.com/80/007bff/ffffff?text=AI", // デフォルトアイコン
        // systemPrompt: "あなたは親切でフレンドリーなAIアシスタントです。ユーザーの質問に簡潔かつ丁寧に答えてください。"
        // Gemini APIでは、system promptはcontents配列の最初の要素として設定できます
        // 例: { role: "user", parts: [{ text: "あなたは「キャラクター名」という名前の「性格」なキャラクターです。以下の制約を守って会話してください：制約１、制約２..." }] }, { role: "model", parts: [{text: "はい、承知いたしました。「キャラクター名」として、あなたとのお話を楽しみにしています！"}] }
        // のようなやり取りを履歴の最初に入れることで、キャラクター設定を模倣できます。
        // もしくは、ユーザーの入力の前に毎回固定の指示文を付与します。
        // 今回はシンプルに、ユーザーの入力のみを送ります。キャラクター設定はAPI呼び出し時に工夫します。
    };

    characterNameElement.textContent = character.name;
    characterIconElement.src = character.icon;
    // --- ここまでキャラクター設定 ---

    let conversationHistory = []; // 会話履歴を保存

    // APIキーの確認
    if (typeof GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === "YOUR_API_KEY") {
        appendMessage("APIキーが設定されていません。config.js を確認してください。", 'bot', true);
        console.error("APIキーが設定されていません。config.js を確認してください。");
        sendButton.disabled = true;
        userInput.disabled = true;
        return;
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        userInput.value = '';

        // ユーザーのメッセージを履歴に追加
        conversationHistory.push({ role: "user", parts: [{ text: messageText }] });

        callGeminiAPI(messageText);
    }

    function appendMessage(text, sender, isError = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        if (isError) {
            messageElement.style.backgroundColor = 'red';
            messageElement.style.color = 'white';
        }
        messageElement.textContent = text;
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight; // 自動スクロール
    }

    async function callGeminiAPI(userMessage) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

        // キャラクター設定を考慮したプロンプトを作成 (例)
        // ここでは、会話履歴全体をコンテキストとして渡します。
        // 必要であれば、ここにキャラクターの性格や口調を指示する固定のテキストを `conversationHistory` の先頭に追加することもできます。
        // 例： const systemInstruction = { role: "user", parts: [{ text: "あなたは「猫耳メイドの○○」です。語尾に「にゃん」を付けてください。" }]};
        //      const modelGreeting = { role: "model", parts: [{ text: "はい、ご主人様！にゃん！" }]};
        //      const fullHistory = [systemInstruction, modelGreeting, ...conversationHistory];

        const requestBody = {
            // "contents" には、これまでの会話の履歴を含めます
            // Gemini APIは、"user" と "model" の役割を交互に期待することが多いです
            contents: conversationHistory,
            generationConfig: {
                // temperature: 0.7, // 応答のランダム性 (0.0-1.0)
                // topK: 40,
                // topP: 0.95,
                // maxOutputTokens: 1024, // 最大出力トークン数
            },
            // safetySettings: [ // 必要に応じてコンテンツフィルタリング設定
            //    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            //    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            //    // ... 他のカテゴリ
            // ]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                appendMessage(`APIエラー: ${errorData.error?.message || response.statusText}`, 'bot', true);
                // エラーが発生した場合、最後のユーザーメッセージを履歴から削除する（任意）
                conversationHistory.pop();
                return;
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
                const botResponse = data.candidates[0].content.parts[0].text;
                appendMessage(botResponse, 'bot');
                // ボットの応答を履歴に追加
                conversationHistory.push({ role: "model", parts: [{ text: botResponse }] });
            } else {
                console.error('API Response format error:', data);
                // 応答がないか、形式が不正な場合のエラーメッセージ
                let errorMessage = "AIからの応答がありませんでした。";
                if (data.promptFeedback && data.promptFeedback.blockReason) {
                    errorMessage = `AIからの応答がブロックされました。理由: ${data.promptFeedback.blockReason}`;
                    if (data.promptFeedback.safetyRatings) {
                        data.promptFeedback.safetyRatings.forEach(rating => {
                           if(rating.blocked) errorMessage += ` (${rating.category})`;
                        });
                    }
                }
                appendMessage(errorMessage, 'bot', true);
                // エラーが発生した場合、最後のユーザーメッセージを履歴から削除する（任意）
                conversationHistory.pop();
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            appendMessage('AIとの通信中にエラーが発生しました。', 'bot', true);
            // エラーが発生した場合、最後のユーザーメッセージを履歴から削除する（任意）
            conversationHistory.pop();
        }
    }

    // 初期メッセージ (任意)
    appendMessage('こんにちは！何かお話ししましょう。', 'bot');
    // conversationHistory.push({ role: "model", parts: [{ text: "こんにちは！何かお話ししましょう。" }] }); // 初期メッセージも履歴に含める場合

});
