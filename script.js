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
        // Gemini APIでは、system promptはcontents配列の最初の要素として設定できます
        // 例：
        // systemInstruction: {
        //    role: "user",
        //    parts: [{ text: "あなたは「ねこみみメイドのミケ」という名前の、明るく元気なキャラクターです。語尾に「にゃん」を付けて、ご主人様（ユーザー）に尽くすように話してください。ご主人様からのどんな質問にも、メイドとして誠心誠意お答えしますにゃん！" }]
        // },
        // modelGreeting: {
        //    role: "model",
        //    parts: [{ text: "はい、ご主人様！ミケがお側におりますにゃん！何でもお申し付けくださいにゃん♪" }]
        // }
        //
        // このsystemInstructionとmodelGreetingを conversationHistory の初期値として設定します。
    };

    characterNameElement.textContent = character.name;
    characterIconElement.src = character.icon;
    // --- ここまでキャラクター設定 ---

    let conversationHistory = [];
    // キャラクターの初期設定を会話履歴に入れる場合
    // if (character.systemInstruction && character.modelGreeting) {
    //     conversationHistory.push(character.systemInstruction);
    //     conversationHistory.push(character.modelGreeting);
    //     // 初期挨拶をチャットログに表示する場合
    //     // appendMessage(character.modelGreeting.parts[0].text, 'bot');
    // }


    // APIキーの確認
    if (typeof GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === "YOUR_API_KEY" || GEMINI_API_KEY === "") {
        const errorMsg = "APIキーが設定されていません。config.js を確認してください。";
        appendMessage(errorMsg, 'bot', true);
        console.error(errorMsg, "現在のキー:", typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : "undefined");
        if(sendButton) sendButton.disabled = true;
        if(userInput) userInput.disabled = true;
        return;
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Shift+Enterで改行できるように
            event.preventDefault(); // Enterキーでのデフォルトの送信や改行を防ぐ
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        userInput.value = '';
        sendButton.disabled = true; // 送信中はボタンを無効化
        userInput.disabled = true;  // 送信中は入力欄を無効化

        conversationHistory.push({ role: "user", parts: [{ text: messageText }] });

        callGeminiAPI(); // ユーザーメッセージは conversationHistory から取得される
    }

    function appendMessage(text, sender, isError = false, isThinking = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);

        if (isError) {
            messageElement.classList.add('error-message'); // エラー用のCSSクラス
        }

        if (isThinking) {
            messageElement.classList.add('thinking-message');
            messageElement.innerHTML = `<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span> ${text}`;
        } else {
            // XSS対策としてtextContentを使用（ただし、意図的にHTMLを埋め込みたい場合は別途処理が必要）
            messageElement.textContent = text;
        }
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function removeThinkingMessage() {
        const thinkingMsg = chatLog.querySelector('.thinking-message');
        if (thinkingMsg) {
            chatLog.removeChild(thinkingMsg);
        }
    }

    async function callGeminiAPI() {
        // 推奨: gemini-1.5-flash-latest または gemini-1.0-pro
        // const modelName = "gemini-1.0-pro";
        const modelName = "gemini-1.5-flash-latest"; // 最新の推奨Flashモデル

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

        console.log("Calling API with URL:", API_URL);
        console.log("Conversation history being sent:", JSON.stringify(conversationHistory, null, 2));


        appendMessage("AIが考えています...", 'bot', false, true);

        const requestBody = {
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.7,
                // topK: 40, // 必要に応じて調整
                // topP: 0.95, // 必要に応じて調整
                maxOutputTokens: 2048, // 少し長めの応答も許容
                // stopSequences: ["特定文字列で停止"] // 必要に応じて
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            removeThinkingMessage();

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: "レスポンスのJSON解析に失敗しました。" } })); // JSON解析失敗時のフォールバック
                console.error('API Error Response:', errorData);
                let detailedErrorMessage = `APIエラー: ${errorData.error?.message || response.statusText}`;
                if (errorData.error && errorData.error.details) {
                    detailedErrorMessage += ` 詳細: ${JSON.stringify(errorData.error.details)}`;
                }
                appendMessage(detailedErrorMessage, 'bot', true);
                popLastUserMessageFromHistoryOnError();
                return;
            }

            const data = await response.json();
            console.log("API Response Data:", data);

            let botResponseText = "";
            let blockReason = null;

            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    botResponseText = candidate.content.parts[0].text;
                }

                if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
                     // "SAFETY" や "RECITATION" や "OTHER" など
                    blockReason = `AIの応答が途中で終了しました。理由: ${candidate.finishReason}`;
                    if (candidate.safetyRatings) {
                        candidate.safetyRatings.forEach(rating => {
                           if(rating.blocked) blockReason += ` (${rating.category} - ${rating.probability})`;
                        });
                    }
                }
            }

            // promptFeedback は candidates がなくても存在することがある
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                blockReason = `プロンプトリクエストがブロックされました。理由: ${data.promptFeedback.blockReason}`;
                if (data.promptFeedback.safetyRatings) {
                    data.promptFeedback.safetyRatings.forEach(rating => {
                       if(rating.blocked) blockReason += ` (${rating.category} - ${rating.probability})`;
                    });
                }
                // プロンプト自体がブロックされた場合、ユーザーの入力に問題があった可能性が高い
                popLastUserMessageFromHistoryOnError();
            }


            if (botResponseText) {
                appendMessage(botResponseText, 'bot');
                conversationHistory.push({ role: "model", parts: [{ text: botResponseText }] });
            } else if (blockReason) {
                appendMessage(blockReason, 'bot', true);
                // 応答がブロックされた場合も、会話履歴には何も追加しないか、エラーとして記録するかは設計次第
                // 今回は、ユーザーの最後のメッセージを履歴から削除し、再試行を促す
                popLastUserMessageFromHistoryOnError();
            }
            else {
                console.error('API Response format error or no content:', data);
                appendMessage("AIからの応答が空か、予期しない形式です。", 'bot', true);
                popLastUserMessageFromHistoryOnError();
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            removeThinkingMessage();
            appendMessage('AIとの通信中にエラーが発生しました。ネットワーク接続を確認してください。', 'bot', true);
            popLastUserMessageFromHistoryOnError();
        } finally {
            sendButton.disabled = false; // 処理完了後、ボタンを有効化
            userInput.disabled = false; // 処理完了後、入力欄を有効化
            userInput.focus(); // 入力欄にフォーカスを戻す
        }
    }

    function popLastUserMessageFromHistoryOnError() {
        // エラーが発生した場合、最後のユーザーメッセージを履歴から削除する
        // これにより、問題のあるプロンプトが再送信されるのを防ぐ
        if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "user") {
            console.log("エラーのため、最後のユーザーメッセージを履歴から削除します:", conversationHistory.pop());
        }
    }


    // 初期メッセージ (任意)
    const initialBotMessage = "こんにちは！何かお話ししましょう。";
    appendMessage(initialBotMessage, 'bot');
    // 初期メッセージを会話履歴に含める場合 (含めない方が、ユーザーの最初の発言から会話が始まるので自然かも)
    // conversationHistory.push({ role: "model", parts: [{ text: initialBotMessage }] });

    userInput.focus(); // ページ読み込み時に入力欄にフォーカス
});
