// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("NiziU Chat App Initializing with AI...");

    // --- グローバルDOM要素 ---
    const chatLogDiv = document.getElementById('chat-log');
    const userInputField = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    // (他のDOM要素は必要に応じて取得)
    const screens = document.querySelectorAll('.screen');
    const footerNavItems = document.querySelectorAll('#footer-nav .nav-item');


    // --- APIキーのチェック (最初の雛形から流用) ---
    if (typeof GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === "YOUR_API_KEY" || GEMINI_API_KEY === "") {
        const errorMsg = "APIキーが設定されていません。config.js を確認してください。";
        console.error(errorMsg, "現在のキー:", typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : "undefined");
        if (chatLogDiv) appendChatMessage(errorMsg, 'system-error'); // システムエラーとして表示
        if(sendButton) sendButton.disabled = true;
        if(userInputField) userInputField.disabled = true;
        return;
    }
    console.log("API Key check passed.");


    // --- メンバーデータ (systemPrompt を追加) ---
    const members = [
        // ... (前回のメンバーデータ、各メンバーに systemPrompt を追加) ...
        {
            id: 'mako', name: 'マコ', faceIcon: 'images/faces/mako_face.png', color: '#F8B671', lightBg: '#E8A363', sendBtn: 'images/buttons/button_send_mako.png', msgCount: 9,
            systemPrompt: "あなたはNiziUのリーダー、マコです。優しくて頼りになるお姉さんキャラで、時には情熱的な一面も見せます。丁寧な言葉遣いを心がけ、ユーザーを励ますように話してください。語尾に「～だよ」「～だね」などをよく使います。",
            // (他の設定項目...)
            dob: '2001年4月4日', birthplace: '福岡', dialect: '軽い博多弁', personality: ['天然', 'しっかり者'], height: '159cm', weight: '49kg', bust: 'Cカップ', nippleColor: '薄い茶色', pubicHair: '少し生えている', pussyColor: 'ピンク', libido: '普通', favPosition: '正常位', sensitivity: 'すぐイっちゃう', favForeplay: 'フェラ'
        },
        {
            id: 'rio', name: 'リオ', faceIcon: 'images/faces/rio_face.png', color: '#76D5F0', lightBg: '#6AB3D4', sendBtn: 'images/buttons/button_send_rio.png', msgCount: 10,
            systemPrompt: "あなたはNiziUのダンス番長、リオです。クールビューティーで、サバサバした性格。でも実は情に厚くて涙もろい一面も。ユーザーとは友達のように気さくに話しますが、たまにツンデレな感じも出してください。「～じゃん」「～っしょ」のような口調も使います。",
            dob: '2002年2月4日', birthplace: '愛知', dialect: '名古屋弁', personality: ['クール', '情熱的'], height: '160cm', weight: '48kg', bust: 'Bカップ', nippleColor: 'ピンク', pubicHair: 'つるつる', pussyColor: '薄ピンク', libido: '強め', favPosition: '騎乗位', sensitivity: '感じやすい', favForeplay: 'キス'
        },
        // Maya
        {
            id: 'maya', name: 'マヤ', faceIcon: 'images/faces/maya_face.png', color: '#D191D7', lightBg: '#B074BE', sendBtn: 'images/buttons/button_send_maya.png', msgCount: 7,
            systemPrompt: "あなたはNiziUの白鳥、マヤです。おっとりしていて、みんなを包み込むような優しさを持っています。癒し系で、聞き上手。ユーザーの話をうんうんと頷きながら聞き、穏やかにアドバイスをくれます。「～ですわ」「～なのよ」のような、少しお嬢様っぽいけど親しみやすい口調です。",
            dob: '2002年4月8日', birthplace: '石川', dialect: '金沢弁', personality: ['おっとり', '優しい'], height: '159cm', weight: '45kg', bust: 'Dカップ', nippleColor: '濃い茶色', pubicHair: '普通', pussyColor: 'ベージュ', libido: '普通', favPosition: '後背位', sensitivity: '普通', favForeplay: '愛撫'
        },
        // Riku
        {
            id: 'riku', name: 'リク', faceIcon: 'images/faces/riku_face.png', color: '#FDE07C', lightBg: '#E6C463', sendBtn: 'images/buttons/button_send_riku.png', msgCount: 0,
            systemPrompt: "あなたはNiziUのエネルギッシュなリス、リクです。いつも明るく元気いっぱいで、周りを笑顔にします。リアクションが大きくて、少しお調子者なところも。関西弁（京都弁）を使い、ユーザーを楽しませるように話してください。「～やで！」「ほんまに～？」といった感じです。",
            dob: '2002年10月26日', birthplace: '京都', dialect: '京都弁', personality: ['明るい', '面白い'], height: '162cm', weight: '46kg', bust: 'Aカップ', nippleColor: '薄ピンク', pubicHair: '処理済み', pussyColor: 'ピンク', libido: '高め', favPosition: '対面座位', sensitivity: '超敏感', favForeplay: 'ディープキス'
        },
        // Ayaka
        {
            id: 'ayaka', name: 'アヤカ', faceIcon: 'images/faces/ayaka_face.png', color: '#E1E1E1', lightBg: '#A9A9A9', sendBtn: 'images/buttons/button_send_ayaka.png', msgCount: 1,
            systemPrompt: "あなたはNiziUのふわふわビューティー、アヤカです。マイペースで独特の雰囲気を持っていますが、芯はしっかりしています。少し不思議ちゃんな発言でユーザーを和ませてください。基本は標準語で、のんびりとした話し方です。「～かなぁ」「えっとね～」が口癖。",
            dob: '2003年6月20日', birthplace: '東京', dialect: '標準語', personality: ['ふわふわ', 'マイペース'], height: '166cm', weight: '47kg', bust: 'Bカップ', nippleColor: 'ピンク', pubicHair: '少し', pussyColor: '薄ピンク', libido: '普通', favPosition: '正常位', sensitivity: '普通', favForeplay: '耳舐め'
        },
        // Mayuka
        {
            id: 'mayuka', name: 'マユカ', faceIcon: 'images/faces/mayuka_face.png', color: '#7FDDC1', lightBg: '#65B8A3', sendBtn: 'images/buttons/button_send_mayuka.png', msgCount: 12,
            systemPrompt: "あなたはNiziUのカメレオン、マユカです。普段は控えめですが、ステージではカリスマ性を発揮します。洞察力が鋭く、ユーザーの隠れた気持ちも見抜くかもしれません。少しミステリアスな雰囲気で、でも親身になって話を聞いてくれます。時々、ドキッとするような核心を突く言葉も。",
            dob: '2003年11月13日', birthplace: '大阪', dialect: '関西弁', personality: ['カメレオン', '努力家'], height: '160cm', weight: '45kg', bust: 'Cカップ', nippleColor: '薄茶色', pubicHair: '整えている', pussyColor: 'ピンク', libido: 'やや強め', favPosition: '四つん這い', sensitivity: '感じやすい', favForeplay: '指'
        },
        // Rima
        {
            id: 'rima', name: 'リマ', faceIcon: 'images/faces/rima_face.png', color: '#F57C83', lightBg: '#D96168', sendBtn: 'images/buttons/button_send_rima.png', msgCount: 15,
            systemPrompt: "あなたはNiziUの魅力的なボイス、リマです。明るく社交的で、英語も堪能。インターナショナルな雰囲気を持っています。おしゃれやトレンドに敏感で、ユーザーに新しい発見を与えてくれるかも。フレンドリーなタメ口で、時々英語を交えながら話します。「Hey!」「You know?」など。",
            dob: '2004年3月26日', birthplace: '東京', dialect: '英語混じり', personality: ['ラップ担当', 'おしゃれ'], height: '161cm', weight: '44kg', bust: 'Aカップ', nippleColor: 'ピンク', pubicHair: 'つるつる', pussyColor: 'ローズピンク', libido: '興味津々', favPosition: '屈曲位', sensitivity: '奥が弱い', favForeplay: 'クンニ'
        },
        // Miihi
        {
            id: 'miihi', name: 'ミイヒ', faceIcon: 'images/faces/miihi_face.png', color: '#FBC1DA', lightBg: '#EAA0C3', sendBtn: 'images/buttons/button_send_miihi.png', msgCount: 17,
            systemPrompt: "あなたはNiziUのスマイルメーカー、ミイヒです。愛嬌たっぷりで、みんなの癒やし担当。甘えん坊で、少し泣き虫なところも。ユーザーにたくさん甘えて、元気づけてあげてください。語尾に「～みゃ」「～なの」を付けて可愛らしく話します。はんなりとした京都弁も時々出ます。",
            dob: '2004年8月12日', birthplace: '京都', dialect: 'はんなり京都弁', personality: ['スマイルメーカー', '甘えん坊'], height: '158cm', weight: '42kg', bust: 'Bカップ', nippleColor: '桜色', pubicHair: 'うぶ毛程度', pussyColor: 'ベビーピンク', libido: '普通', favPosition: '正常位（バックも好き)', sensitivity: 'クリが敏感', favForeplay: '優しいキス'
        },
        // Nina
        {
            id: 'nina', name: 'ニナ', faceIcon: 'images/faces/nina_face.png', color: '#6DA7F2', lightBg: '#4E7EC2', sendBtn: 'images/buttons/button_send_nina.png', msgCount: 2,
            systemPrompt: "あなたはNiziUの末っ子メインボーカル、ニナです。天真爛漫で、表情豊か。パワフルな歌声とは裏腹に、お茶目な一面も。アメリカ育ちなので、たまに英語のリアクションが出ます。「Oh my gosh!」「Really?」など。ユーザーとは姉妹のように、楽しくおしゃべりします。",
            dob: '2005年2月27日', birthplace: 'アメリカ ワシントン州', dialect: '英語（日本語勉強中）', personality: ['末っ子', 'パワフルボーカル'], height: '165cm', weight: '48kg', bust: 'Dカップ', nippleColor: '薄茶色', pubicHair: '少しあり', pussyColor: 'ピンクベージュ', libido: '旺盛', favPosition: '色々試したい', sensitivity: '全身敏感', favForeplay: 'ペッティング'
        },
    ];

    let currentMember = null;
    let previousScreenId = 'member-list-screen';
    let currentScreenId = 'member-list-screen';
    let conversationHistory = []; // 現在のチャットの会話履歴
    let isLoadingAI = false; // AI応答待ちフラグ

    // --- 初期化処理 ---
    function initializeApp() {
        renderMemberList();
        setupEventListeners();
        navigateTo(currentScreenId, true);
        console.log("App Initialized with AI features.");
    }

    // --- 画面遷移 ---
    function navigateTo(screenId, isInitial = false) {
        console.log(`Navigating to: ${screenId}`);
        if (currentScreenId !== screenId) {
             if (!['common-settings-screen', 'user-profile-screen'].includes(currentScreenId)) {
                previousScreenId = currentScreenId;
            }
        }
        screens.forEach(screen => screen.classList.toggle('active', screen.id === screenId));
        currentScreenId = screenId;

        footerNavItems.forEach(item => item.classList.toggle('active', item.dataset.screen === screenId));

        if (screenId === 'chat-room-screen' && currentMember) {
            loadChatRoomUI(currentMember);
            initializeConversationHistory(currentMember); // 新しい会話履歴を開始
        } else if (screenId === 'member-settings-screen' && currentMember) {
            loadMemberSettingsUI(currentMember);
        }

        if (currentMember && (screenId === 'chat-room-screen' || screenId === 'member-settings-screen')) {
            applyMemberTheme(currentMember);
        } else {
            resetToDefaultTheme();
        }
    }

    // --- テーマ適用 (変更なし) ---
    function applyMemberTheme(member) { /* ... (前回のコード) ... */
        const root = document.documentElement;
        root.style.setProperty('--member-main-color', member.color);
        root.style.setProperty('--member-light-bg-color', member.lightBg || '#f8f8f8');
        root.style.setProperty('--member-chat-bubble-user', member.color);
        console.log(`Theme applied for ${member.name}`);
    }
    function resetToDefaultTheme() { /* ... (前回のコード) ... */
        const root = document.documentElement;
        root.style.removeProperty('--member-main-color');
        root.style.removeProperty('--member-light-bg-color');
        root.style.removeProperty('--member-chat-bubble-user');
        console.log("Theme reset to default");
    }

    // --- メンバー一覧表示 (変更なし) ---
    function renderMemberList() { /* ... (前回のコード) ... */
        const memberListUl = document.getElementById('member-list');
        if (!memberListUl) return;
        memberListUl.innerHTML = '';

        members.forEach(member => {
            const li = document.createElement('li');
            li.classList.add('member-list-item');
            li.dataset.memberId = member.id;

            const clickableArea = document.createElement('div');
            clickableArea.classList.add('clickable-area');
            clickableArea.innerHTML = `
                <div class="member-icon-wrapper" style="border-color: ${member.color};">
                    <img src="${member.faceIcon}" alt="${member.name}">
                </div>
                <div class="member-name">${member.name}</div>
            `;
            clickableArea.addEventListener('click', () => openChatRoom(member.id));
            li.appendChild(clickableArea);

            const messageCountWrapper = document.createElement('div');
            messageCountWrapper.classList.add('message-count-wrapper');
            messageCountWrapper.innerHTML = `
                <img src="images/icons/icon_message_bubble.png" alt="msg">
                <span>${member.msgCount}</span>
            `;
            messageCountWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log(`Open past talks for ${member.name} (Not Implemented Yet)`);
                alert(`「${member.name}」の過去トーク選択機能は未実装です。`);
            });
            li.appendChild(messageCountWrapper);

            memberListUl.appendChild(li);
        });
    }


    // --- トークルーム関連 ---
    function openChatRoom(memberId) {
        currentMember = members.find(m => m.id === memberId);
        if (currentMember) {
            navigateTo('chat-room-screen');
        }
    }

    function loadChatRoomUI(member) {
        document.getElementById('chat-member-name').textContent = member.name;
        document.getElementById('send-button-icon').src = member.sendBtn;
        chatLogDiv.innerHTML = ''; // チャットログをクリア

        // 返信候補 (今回はダミーのまま)
        const suggestionsDiv = document.getElementById('reply-suggestions');
        suggestionsDiv.innerHTML = `
            <button class="suggestion-btn">気持ちいい？</button>
            <button class="suggestion-btn">どうしたの？</button>
            <button class="suggestion-btn">大好き！</button>
        `;
        suggestionsDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.style.borderColor = member.color;
            btn.style.color = member.color;
            btn.addEventListener('click', () => {
                userInputField.value += btn.textContent + " ";
                userInputField.focus();
            });
        });

        const chatRoomHeader = document.getElementById('chat-room-screen').querySelector('.screen-header');
        chatRoomHeader.style.backgroundColor = member.color;
        const headerTextColor = getContrastYIQ(member.color);
        chatRoomHeader.style.color = headerTextColor;
        chatRoomHeader.querySelectorAll('.header-btn img').forEach(img => {
            img.style.filter = headerTextColor === '#ffffff' ? 'brightness(0) invert(1)' : 'none';
        });
    }

    // --- 会話履歴の初期化 ---
    function initializeConversationHistory(member) {
        conversationHistory = [];
        if (member.systemPrompt) {
            // Gemini APIでは、最初のユーザー入力がシステムプロンプトの役割を果たすことが多い
            // または、contents の最初の数ターンで役割設定をする
            // ここでは、システムプロンプトを最初のユーザーメッセージとして扱い、
            // それに対するモデルの「了解」のような応答を仮で追加することで、役割を設定します。
            conversationHistory.push({
                role: "user",
                parts: [{ text: member.systemPrompt }]
            });
            conversationHistory.push({
                role: "model",
                parts: [{ text: `はい、${member.name}です！よろしくお願いします！` }] // モデルの初期応答
            });
            // この初期応答を画面に表示しても良い
            // appendChatMessage(`${member.name}です！よろしくお願いします！`, 'bot', member);
        }
        console.log("Conversation history initialized:", conversationHistory);
    }


    // --- メンバー設定画面関連 (変更なし) ---
    function openMemberSettings() { /* ... (前回のコード) ... */
        if (currentMember) {
            navigateTo('member-settings-screen');
        }
    }
    function loadMemberSettingsUI(member) { /* ... (前回のコード) ... */
        document.getElementById('settings-member-name').textContent = member.name;
        const settingsMemberIcon = document.getElementById('settings-member-icon');
        settingsMemberIcon.src = member.faceIcon;
        settingsMemberIcon.style.borderColor = member.color;

        document.getElementById('setting-dob').textContent = member.dob || '未設定';
        const settingColorSpan = document.getElementById('setting-color');
        settingColorSpan.textContent = member.name;
        settingColorSpan.style.backgroundColor = member.color;
        settingColorSpan.style.color = getContrastYIQ(member.color);

        document.getElementById('setting-birthplace').textContent = member.birthplace || '未設定';
        document.getElementById('setting-dialect').textContent = member.dialect || '未設定';
        document.getElementById('setting-personality').textContent = Array.isArray(member.personality) ? member.personality.join(', ') : (member.personality || '未設定');
        document.getElementById('setting-height').textContent = member.height || '未設定';
        document.getElementById('setting-weight').textContent = member.weight || '未設定';
        document.getElementById('setting-bust').textContent = member.bust || '未設定';
        document.getElementById('setting-nipple-color').textContent = member.nippleColor || '未設定';
        document.getElementById('setting-pubic-hair').textContent = member.pubicHair || '未設定';
        document.getElementById('setting-pussy-color').textContent = member.pussyColor || '未設定';
        document.getElementById('setting-libido').textContent = member.libido || '未設定';
        document.getElementById('setting-fav-position').textContent = member.favPosition || '未設定';
        document.getElementById('setting-sensitivity').textContent = member.sensitivity || '未設定';
        document.getElementById('setting-fav-foreplay').textContent = member.favForeplay || '未設定';


        const settingsScreen = document.getElementById('member-settings-screen');
        const settingsHeader = settingsScreen.querySelector('.screen-header');
        settingsHeader.style.backgroundColor = member.color;
        const headerTextColor = getContrastYIQ(member.color);
        settingsHeader.style.color = headerTextColor;
        settingsHeader.querySelectorAll('.header-btn img').forEach(img => {
             img.style.filter = headerTextColor === '#ffffff' ? 'brightness(0) invert(1)' : 'none';
        });
        const saveBtn = document.getElementById('save-settings-btn');
        saveBtn.style.backgroundColor = member.color;
        saveBtn.style.color = getContrastYIQ(member.color);
    }
    function getContrastYIQ(hexcolor){ /* ... (前回のコード) ... */
        if (!hexcolor) return '#333333';
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0,2),16);
        const g = parseInt(hexcolor.substr(2,2),16);
        const b = parseInt(hexcolor.substr(4,2),16);
        const yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '#333333' : '#ffffff';
    }


    // --- イベントリスナー設定 ---
    function setupEventListeners() {
        footerNavItems.forEach(item => {
            item.addEventListener('click', () => navigateTo(item.dataset.screen));
        });

        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            currentMember = null; // メンバー選択をリセット
            conversationHistory = []; // 会話履歴もリセット
            navigateTo('member-list-screen');
        });
        document.getElementById('member-settings-btn').addEventListener('click', openMemberSettings);
        document.getElementById('new-talk-btn').addEventListener('click', () => {
            if(currentMember) {
                alert(`「${currentMember.name}」との新しいトークを開始します。(チャットログクリア)`);
                chatLogDiv.innerHTML = ''; // チャットログクリア
                initializeConversationHistory(currentMember); // 会話履歴を再初期化
            }
        });
        document.getElementById('back-to-chat-btn').addEventListener('click', () => navigateTo('chat-room-screen'));

        document.querySelectorAll('.back-from-footer-screen').forEach(button => {
            button.addEventListener('click', () => {
                navigateTo(previousScreenId || 'member-list-screen');
            });
        });

        sendButton.addEventListener('click', handleSendMessage);
        userInputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
            }
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            if(currentMember) alert(`「${currentMember.name}」の設定を保存しました。(機能未実装)`);
        });
    }

    // --- メッセージ送信処理 ---
    function handleSendMessage() {
        if (isLoadingAI) return; // AI応答待ち中は送信しない

        const messageText = userInputField.value.trim();
        if (messageText === '' || !currentMember) return;

        appendChatMessage(messageText, 'user');
        conversationHistory.push({ role: "user", parts: [{ text: messageText }] });
        userInputField.value = '';
        toggleInputDisabled(true); // 入力UIを無効化

        callGeminiAPI();
    }

    // --- Gemini API 呼び出し ---
    async function callGeminiAPI() {
        isLoadingAI = true;
        appendChatMessage("...", 'bot-thinking', currentMember); // 考え中メッセージ

        const modelName = "gemini-1.5-flash-latest"; // または "gemini-1.0-pro"
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

        const requestBody = {
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.8, // 少し高めに設定して多様性を出す
                // topK: 40,
                // topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [ // ここは最初の雛形と同様
               { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
               { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
               { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }, // 注意: 性的コンテンツを許容
               { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ]
        };

        console.log("Calling Gemini API with history:", JSON.stringify(conversationHistory, null, 2));

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            removeThinkingMessage(); // 考え中メッセージを削除

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: "レスポンスのJSON解析に失敗" }}));
                console.error('API Error:', errorData);
                let errMsg = `APIエラー (${response.status}): ${errorData.error?.message || response.statusText}`;
                appendChatMessage(errMsg, 'system-error');
                popLastUserMessageFromHistoryOnError();
                return;
            }

            const data = await response.json();
            console.log("API Response:", data);

            let botResponseText = "";
            let blockReason = null;

            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    botResponseText = candidate.content.parts[0].text;
                }
                if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
                    blockReason = `AI応答終了理由: ${candidate.finishReason}`;
                    if (candidate.safetyRatings) candidate.safetyRatings.forEach(r => { if(r.blocked) blockReason += ` (${r.category})`; });
                }
            }
            if (data.promptFeedback?.blockReason) { // プロンプト自体がブロックされた場合
                blockReason = `リクエストブロック理由: ${data.promptFeedback.blockReason}`;
                if (data.promptFeedback.safetyRatings) data.promptFeedback.safetyRatings.forEach(r => { if(r.blocked) blockReason += ` (${r.category})`; });
                popLastUserMessageFromHistoryOnError();
            }

            if (botResponseText) {
                appendChatMessage(botResponseText, 'bot', currentMember);
                conversationHistory.push({ role: "model", parts: [{ text: botResponseText }] });
            } else if (blockReason) {
                appendChatMessage(blockReason, 'system-error');
            } else {
                appendChatMessage("AIから有効な応答がありませんでした。", 'system-error');
                popLastUserMessageFromHistoryOnError();
            }

        } catch (error) {
            console.error('Fetch/Network Error:', error);
            removeThinkingMessage();
            appendChatMessage(`通信エラー: ${error.message}`, 'system-error');
            popLastUserMessageFromHistoryOnError();
        } finally {
            isLoadingAI = false;
            toggleInputDisabled(false); // 入力UIを有効化
        }
    }

    function popLastUserMessageFromHistoryOnError() {
        if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "user") {
            conversationHistory.pop();
            console.log("Error: Last user message popped from history.");
        }
    }

    function toggleInputDisabled(isDisabled) {
        userInputField.disabled = isDisabled;
        sendButton.disabled = isDisabled;
        // 返信候補ボタンも無効化/有効化するならここ
        document.querySelectorAll('#reply-suggestions .suggestion-btn').forEach(btn => btn.disabled = isDisabled);
    }


    // --- チャットメッセージ追加関数 (UIに合わせて調整) ---
    function appendChatMessage(text, sender, memberData = null) {
        const messageGroup = document.createElement('div');
        messageGroup.classList.add('message-group', sender); // sender は 'user', 'bot', 'bot-thinking', 'system-error'

        if (sender === 'bot' && memberData) {
            messageGroup.innerHTML = `
                <div class="message-sender-info">
                    <div class="message-icon-bot" style="border-color: ${memberData.color};"><img src="${memberData.faceIcon}" alt="${memberData.name}"></div>
                    <span class="message-sender-name">${memberData.name}</span>
                </div>
                <div class="message-bubble bot-bubble">
                    <div class="message-text">${text.replace(/\n/g, '<br>')}</div> {/* 改行を<br>に */}
                </div>
            `;
        } else if (sender === 'user') {
            messageGroup.innerHTML = `
                <div class="message-bubble user">${text.replace(/\n/g, '<br>')}</div>
            `;
        } else if (sender === 'bot-thinking' && memberData) {
            messageGroup.classList.add('bot'); // botグループとしてスタイルを適用
            messageGroup.id = 'thinking-message-group'; // IDで識別
            messageGroup.innerHTML = `
                <div class="message-sender-info">
                    <div class="message-icon-bot" style="border-color: ${memberData.color};"><img src="${memberData.faceIcon}" alt="${memberData.name}"></div>
                    <span class="message-sender-name">${memberData.name}</span>
                </div>
                <div class="message-bubble bot-bubble">
                    <div class="message-text"><span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span></div>
                </div>
            `;
        } else if (sender === 'system-error') {
            messageGroup.innerHTML = `
                <div class="message-bubble system-error-bubble">${text}</div>
            `;
        }
        chatLogDiv.appendChild(messageGroup);
        chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
    }

    function removeThinkingMessage() {
        const thinkingMsg = document.getElementById('thinking-message-group');
        if (thinkingMsg) {
            thinkingMsg.remove();
        }
    }

    // --- アプリケーション実行 ---
    initializeApp();
});
