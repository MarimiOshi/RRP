// script.js
document.addEventListener('DOMContentLoaded', () => {
    // HTML要素の取得は最初に行う
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const characterNameElement = document.getElementById('character-name');
    const characterIconElement = document.getElementById('character-icon');

    console.log("DOM Content Loaded. Initializing chat.");

    // --- APIキーのチェックと初期化処理 ---
    // config.js が正しく読み込まれ、GEMINI_API_KEY がグローバルスコープで定義されていることを期待
    if (typeof GEMINI_API_KEY === 'undefined') {
        const errorMsg = "致命的エラー: APIキー (GEMINI_API_KEY) が未定義です。config.jsが正しく読み込まれているか、またはGEMINI_API_KEYがconfig.js内で正しく定義されているか確認してください。";
        console.error(errorMsg);
        if (chatLog && userInput && sendButton) { // 要素が存在すればエラー表示
            appendMessage(errorMsg, 'bot', true);
            sendButton.disabled = true;
            userInput.disabled = true;
        } else {
            alert(errorMsg); // DOM要素が取得できない場合はalertで通知
        }
        return; // APIキーがない場合は処理を中断
    }

    if (GEMINI_API_KEY === "YOUR_API_KEY" || GEMINI_API_KEY === "" || typeof GEMINI_API_KEY !== 'string') {
        const errorMsg = "APIキーが無効です。config.jsを開き、'YOUR_API_KEY'を実際のAPIキーに置き換えてください。キーは文字列である必要があります。";
        console.error(errorMsg, "現在のキーの値:", GEMINI_API_KEY);
        appendMessage(errorMsg, 'bot', true);
        if(sendButton) sendButton.disabled = true;
        if(userInput) userInput.disabled = true;
        return; // APIキーが無効なら処理を中断
    }
    console.log("API Key check passed. Key:", GEMINI_API_KEY.substring(0, 5) + "..."); // キーの一部だけ表示

    // --- キャラクター設定 ---
    let character = {
        name: "AIアシスタント",
        icon: "https://via.placeholder.com/80/007bff/ffffff?text=AI",
        // systemInstruction: { role: "user", parts: [{ text: "あなたは「賢いフクロウのフク先生」です。ユーザーの質問に常に敬語で、論理的かつ詳細に答えてください。時折、知識や豆知識を披露してください。" }] },
        // modelGreeting: { role: "model", parts: [{ text: "初めまして。フク先生と申します。何かご質問はございますかな？どのようなことでもお答えいたしましょう。" }] }
    };

    if (characterNameElement) characterNameElement.textContent = character.name;
    if (characterIconElement) characterIconElement.src = character.icon;

    let conversationHistory = [];
    // if (character.systemInstruction && character.modelGreeting) {
    //     conversationHistory.push(character.systemInstruction);
    //     conversationHistory.push(character.modelGreeting);
    //     if (chatLog) appendMessage(character.modelGreeting.parts[0].text, 'bot');
    // }

    // --- イベントリスナー設定 ---
    if (sendButton) sendButton.addEventListener('click', sendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
        userInput.focus(); // 初期フォーカス
    } else {
        console.warn("userInput element not found.");
    }


    function sendMessage() {
        if (!userInput || !sendButton || !chatLog) {
            console.error("Required DOM elements for sending message are missing.");
            return;
        }

        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        userInput.value = '';
        sendButton.disabled = true;
        userInput.disabled = true;

        conversationHistory.push({ role: "user", parts: [{ text: messageText }] });
        console.log("User message added to history. Current history:", JSON.stringify(conversationHistory));

        callGeminiAPI();
    }

    function appendMessage(text, sender, isError = false, isThinking = false) {
        if (!chatLog) {
            console.error("chatLog element not found, cannot append message:", text);
            return;
        }
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);

        if (isError) messageElement.classList.add('error-message');

        if (isThinking) {
            messageElement.classList.add('thinking-message');
            messageElement.innerHTML = `<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span> ${text}`;
        } else {
            messageElement.textContent = text;
        }
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function removeThinkingMessage() {
        if (!chatLog) return;
        const thinkingMsg = chatLog.querySelector('.thinking-message');
        if (thinkingMsg) chatLog.removeChild(thinkingMsg);
    }

    async function callGeminiAPI() {
        const modelName = "gemini-1.5-flash-latest";
        const API_URL_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

        // APIキーの再チェック（念のため）
        if (typeof GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === "YOUR_API_KEY" || GEMINI_API_KEY.trim() === "") {
            console.error("callGeminiAPI: APIキーが無効です。処理を中断します。");
            appendMessage("APIキー設定エラーのため、AIに応答を要求できませんでした。", "bot", true);
            enableInput();
            return;
        }

        const API_URL = `${API_URL_BASE}?key=${GEMINI_API_KEY}`;

        console.log("Attempting to call API. URL:", API_URL);
        console.log("Conversation history being sent:", JSON.stringify(conversationHistory, null, 2));

        appendMessage("AIが考えています...", 'bot', false, true);

        const requestBody = {
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
            safetySettings: [
               { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
               { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
               { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
               { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            removeThinkingMessage();

            if (!response.ok) {
                // response.text() を試みて、より詳細なエラーメッセージを取得
                let errorText = `HTTPエラー ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    console.error('API Error Response (JSON):', errorData);
                    errorText = `APIエラー(${response.status}): ${errorData.error?.message || response.statusText}`;
                    if (errorData.error?.details) errorText += ` 詳細: ${JSON.stringify(errorData.error.details)}`;
                } catch (jsonError) {
                    console.warn("API Error response was not valid JSON. Falling back to text.", jsonError);
                    // JSONで解析できなかった場合は、テキストとしてエラーメッセージを取得しようと試みる
                    try {
                        const textResponse = await response.text(); // response.json()の前に呼ぶとストリームが消費されるので注意、ここでは既に失敗後
                        console.error('API Error Response (Text):', textResponse);
                        if (textResponse) errorText = `APIエラー(${response.status}): ${textResponse.substring(0, 200)}`; // 長すぎる場合は切り詰める
                    } catch (textParseError) {
                        console.error("Could not parse API error response as text either.", textParseError);
                    }
                }
                appendMessage(errorText, 'bot', true);
                popLastUserMessageFromHistoryOnError();
                return;
            }

            const data = await response.json();
            console.log("API Response Data:", data);

            let botResponseText = "";
            let blockReason = null;

            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content?.parts?.length > 0) {
                    botResponseText = candidate.content.parts[0].text;
                }
                if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
                    blockReason = `AIの応答が途中で終了しました。理由: ${candidate.finishReason}`;
                    if (candidate.safetyRatings) candidate.safetyRatings.forEach(r => { if(r.blocked) blockReason += ` (${r.category})`; });
                }
            }

            if (data.promptFeedback?.blockReason) {
                blockReason = `リクエストがブロックされました。理由: ${data.promptFeedback.blockReason}`;
                if (data.promptFeedback.safetyRatings) data.promptFeedback.safetyRatings.forEach(r => { if(r.blocked) blockReason += ` (${r.category})`; });
                popLastUserMessageFromHistoryOnError();
            }

            if (botResponseText) {
                appendMessage(botResponseText, 'bot');
                conversationHistory.push({ role: "model", parts: [{ text: botResponseText }] });
            } else if (blockReason) {
                appendMessage(blockReason, 'bot', true);
            } else {
                appendMessage("AIからの応答が空か、予期しない形式です。", 'bot', true);
                popLastUserMessageFromHistoryOnError();
            }

        } catch (error) {
            // このcatchは主にネットワークエラー (ERR_NAME_NOT_RESOLVED, ERR_CONNECTION_REFUSED など) や
            // fetch自体が失敗するケース (CORSポリシー違反など、ただし今回は同一オリジンなので通常は起きない) を捉える
            console.error('Fetch Error / Network Error:', error);
            removeThinkingMessage();
            let displayErrorMessage = 'AIとの通信中にネットワークエラーが発生しました。';
            if (error.message.includes("Failed to fetch")) { // ブラウザがよく出す一般的なメッセージ
                displayErrorMessage += " インターネット接続を確認するか、APIサーバーがオンラインであるか確認してください。";
            } else if (error.name === 'TypeError' && error.message.toLowerCase().includes('failed to parse url')) {
                displayErrorMessage = 'APIのURL形式が不正です。APIキーが正しく設定されているか確認してください。';
            } else {
                displayErrorMessage += ` 詳細: ${error.message}`;
            }
            appendMessage(displayErrorMessage, 'bot', true);
            popLastUserMessageFromHistoryOnError();
        } finally {
            enableInput();
        }
    }

    function popLastUserMessageFromHistoryOnError() {
        if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "user") {
            console.log("エラーのため、最後のユーザーメッセージを履歴から削除:", conversationHistory.pop());
        }
    }

    function enableInput() {
        if (sendButton) sendButton.disabled = false;
        if (userInput) {
            userInput.disabled = false;
            userInput.focus();
        }
    }

    // 初期メッセージ
    const initialBotMessage = "こんにちは！何かお話ししましょう。";
    if (chatLog) {
        appendMessage(initialBotMessage, 'bot');
    } else {
        console.error("初期メッセージ表示失敗: chatLog element not found.");
    }
    // conversationHistory.push({ role: "model", parts: [{ text: initialBotMessage }] });

    console.log("Chat initialization complete.");
});
