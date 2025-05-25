document.addEventListener('DOMContentLoaded', () => {
    const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // ★★★ここにあなたのAPIキーを入力★★★

    let genAI;
    try {
        if (typeof GoogleGenerativeAI !== "undefined") {
            genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        } else {
            console.error("GoogleGenerativeAI SDK not loaded!");
            alert("SDKの読み込みに失敗しました。");
        }
    } catch (e) {
        console.error("Error initializing GoogleGenerativeAI:", e);
        alert("Gemini APIの初期化に失敗しました。APIキーを確認してください。");
    }


    // --- DOM Elements ---
    const memberSelectScreen = document.getElementById('member-select-screen');
    const mainGameScreen = document.getElementById('main-game-screen');
    const endingScreen = document.getElementById('ending-screen');
    const screens = document.querySelectorAll('.screen');

    const memberButtons = document.querySelectorAll('.member-button');
    const currentMemberNameEl = document.getElementById('current-member-name');
    const affectionScoreEl = document.getElementById('affection-score');
    const memberImageEl = document.getElementById('member-image');
    const imageAreaEl = document.getElementById('image-area'); // 背景用
    const situationTextEl = document.getElementById('situation-text');
    const characterNameDisplayEl = document.getElementById('character-name-display');
    const dialogueTextEl = document.getElementById('dialogue-text');
    const choiceButtons = [
        document.getElementById('choice-1'),
        document.getElementById('choice-2'),
        document.getElementById('choice-3')
    ];
    const endingTitleEl = document.getElementById('ending-title');
    const endingMessageEl = document.getElementById('ending-message');
    const restartButton = document.getElementById('restart-button');


    // --- Game State ---
    let currentGame; // { member: 'mako', scenario: scenarioMako, currentSceneId: 'start', affection: 0, flags: {} }

    // --- Scenario Data (グローバルスコープから参照) ---
    const scenarios = {
        mako: scenarioMako,
        rima: typeof scenarioRima !== 'undefined' ? scenarioRima : {}, // 定義されていれば使う
        miihi: typeof scenarioMiihi !== 'undefined' ? scenarioMiihi : {}
    };

    // --- Functions ---

    function switchScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    async function generateDialogueWithGemini(promptBase, memberName, currentAffection, situation) {
        if (!genAI) {
            console.error("Gemini AI not initialized for dialogue generation.");
            return "（AIとの接続エラー）";
        }
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // モデル確認

        // プロンプトの組み立て（より詳細に指示を出す）
        const prompt = `
ロールプレイゲームのキャラクターのセリフを生成します。
キャラクター名: ${memberName} (NiziUのメンバー)
現在の状況: ${situation}
キャラクターの好感度: ${currentAffection} (0-100で高いほど親密)
ベースとなる指示: ${promptBase}

上記の情報を踏まえ、${memberName}の性格や話し方を考慮し、自然で魅力的なセリフを生成してください。
最終目標は主人公との親密な関係なので、それを匂わせる、あるいは進展させるようなセリフが望ましいです。
ただし、性的描写は直接的ではなく、婉曲的、暗示的な表現に留めてください。
セリフのみを返してください。`;

        try {
            dialogueTextEl.textContent = "（考え中...）"; // 思考中メッセージ
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text.trim();
        } catch (error) {
            console.error('Error generating dialogue with Gemini:', error);
            return `（${memberName}は言葉に詰まっているようだ...）`; // エラー時の代替セリフ
        }
    }


    function loadScene(sceneId) {
        const scene = currentGame.scenario[sceneId];
        if (!scene) {
            console.error(`Scene not found: ${sceneId} for member ${currentGame.member}`);
            // エラーハンドリング: スタートシーンに戻すなど
            loadScene('start');
            return;
        }

        currentGame.currentSceneId = sceneId;

        // UI Update
        currentMemberNameEl.textContent = currentGame.member.charAt(0).toUpperCase() + currentGame.member.slice(1);
        affectionScoreEl.textContent = currentGame.affection;

        if (scene.memberImage) {
            memberImageEl.src = scene.memberImage;
            memberImageEl.style.display = 'block';
        } else {
            memberImageEl.style.display = 'none';
        }
        if (scene.backgroundImage) {
            imageAreaEl.style.backgroundImage = `url('${scene.backgroundImage}')`;
        } else {
            imageAreaEl.style.backgroundImage = 'none'; // 背景リセット
        }

        situationTextEl.textContent = scene.situation || "";
        characterNameDisplayEl.textContent = scene.characterName || currentGame.member.charAt(0).toUpperCase() + currentGame.member.slice(1);


        // Dialogue (Gemini API or fixed)
        if (scene.useGeminiDialogue && scene.geminiPromptBase) {
            generateDialogueWithGemini(scene.geminiPromptBase, scene.characterName || currentGame.member, currentGame.affection, scene.situation)
                .then(generatedDialogue => {
                    dialogueTextEl.textContent = generatedDialogue;
                });
        } else {
            dialogueTextEl.textContent = scene.dialogue || "";
        }


        // Choices
        choiceButtons.forEach((button, index) => {
            if (scene.choices && scene.choices[index]) {
                const choiceData = scene.choices[index];
                button.textContent = choiceData.text;
                button.style.display = 'block';
                // 古いイベントリスナーを削除してから新しいのを追加 (重要)
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                choiceButtons[index] = newButton; // 配列内の参照も更新

                newButton.addEventListener('click', () => {
                    // 好感度変動
                    if (typeof choiceData.affection === 'number') {
                        currentGame.affection += choiceData.affection;
                        if (currentGame.affection < 0) currentGame.affection = 0; // マイナス防止
                    }
                    // フラグ設定
                    if (choiceData.flags) {
                        for (const flag in choiceData.flags) {
                            currentGame.flags[flag] = choiceData.flags[flag];
                        }
                    }

                    // 「中出しクリア」の判定ロジック例
                    // 例: 特定のシーンID + 好感度 + フラグで判定
                    if (choiceData.nextScene === "trigger_nakadashi_mako") { // 仮のトリガー
                        if (currentGame.affection >= 80 && currentGame.flags.mako_mood_high) {
                            loadScene("mako_ending_nakadashi_clear");
                        } else {
                            loadScene("mako_ending_nakadashi_fail"); // 好感度不足などの失敗エンド
                        }
                        return; // シーン遷移したのでここで終了
                    }


                    if (choiceData.nextScene) {
                        loadScene(choiceData.nextScene);
                    } else if (scene.isEnding) {
                        // isEnding が true で nextScene がない場合、そのままエンディング表示へ
                        showEnding(scene);
                    } else {
                        console.warn("No nextScene defined and not an ending scene.");
                    }
                });
            } else {
                button.style.display = 'none';
            }
        });

        // エンディングシーンの処理
        if (scene.isEnding) {
            // 選択肢はエンディングメッセージ表示後に処理するため、ここでは何もしないか、
            // またはエンディング専用のボタン（リスタートなど）を表示する
            choiceButtons.forEach(btn => btn.style.display = 'none'); // 通常の選択肢は隠す
            showEnding(scene);
        }
    }

    function showEnding(scene) {
        switchScreen('ending-screen');
        endingTitleEl.textContent = scene.endingTitle || "エンディング";
        endingMessageEl.innerHTML = scene.endingMessage ? scene.endingMessage.replace(/\n/g, '<br>') : "物語はここで終わります。"; // 改行を<br>に
    }


    function startGame(member) {
        if (!scenarios[member] || Object.keys(scenarios[member]).length === 0) {
            alert(`${member}のシナリオデータが見つかりません。`);
            return;
        }
        currentGame = {
            member: member,
            scenario: scenarios[member],
            currentSceneId: 'start',
            affection: 0,
            flags: {} // ゲーム固有のフラグを初期化
        };
        switchScreen('main-game-screen');
        loadScene('start');
    }

    // --- Event Listeners ---
    memberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const member = button.dataset.member;
            startGame(member);
        });
    });

    restartButton.addEventListener('click', () => {
        switchScreen('member-select-screen');
    });

    // --- Initial Setup ---
    switchScreen('member-select-screen'); // 最初はメンバー選択画面を表示
});
