// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("NiziU Chat App Initializing...");

    const appContainer = document.getElementById('app-container');
    const screens = document.querySelectorAll('.screen');
    const footerNavItems = document.querySelectorAll('#footer-nav .nav-item');

    const members = [
        { id: 'mako', name: 'マコ', faceIcon: 'images/faces/mako_face.png', color: '#F8B671', lightBg: '#E8A363', sendBtn: 'images/buttons/button_send_mako.png', msgCount: 9, dob: '2001年4月4日', birthplace: '福岡', dialect: '軽い博多弁', personality: ['天然', 'しっかり者'], height: '159cm', weight: '49kg', bust: 'Cカップ', nippleColor: '薄い茶色', pubicHair: '少し生えている', pussyColor: 'ピンク', libido: '普通', favPosition: '正常位', sensitivity: 'すぐイっちゃう', favForeplay: 'フェラ' },
        { id: 'rio', name: 'リオ', faceIcon: 'images/faces/rio_face.png', color: '#76D5F0', lightBg: '#6AB3D4', sendBtn: 'images/buttons/button_send_rio.png', msgCount: 10, dob: '2002年2月4日', birthplace: '愛知', dialect: '名古屋弁', personality: ['クール', '情熱的'], height: '160cm', weight: '48kg', bust: 'Bカップ', nippleColor: 'ピンク', pubicHair: 'つるつる', pussyColor: '薄ピンク', libido: '強め', favPosition: '騎乗位', sensitivity: '感じやすい', favForeplay: 'キス' },
        { id: 'maya', name: 'マヤ', faceIcon: 'images/faces/maya_face.png', color: '#D191D7', lightBg: '#B074BE', sendBtn: 'images/buttons/button_send_maya.png', msgCount: 7, dob: '2002年4月8日', birthplace: '石川', dialect: '金沢弁', personality: ['おっとり', '優しい'], height: '159cm', weight: '45kg', bust: 'Dカップ', nippleColor: '濃い茶色', pubicHair: '普通', pussyColor: 'ベージュ', libido: '普通', favPosition: '後背位', sensitivity: '普通', favForeplay: '愛撫' },
        { id: 'riku', name: 'リク', faceIcon: 'images/faces/riku_face.png', color: '#FDE07C', lightBg: '#E6C463', sendBtn: 'images/buttons/button_send_riku.png', msgCount: 0, dob: '2002年10月26日', birthplace: '京都', dialect: '京都弁', personality: ['明るい', '面白い'], height: '162cm', weight: '46kg', bust: 'Aカップ', nippleColor: '薄ピンク', pubicHair: '処理済み', pussyColor: 'ピンク', libido: '高め', favPosition: '対面座位', sensitivity: '超敏感', favForeplay: 'ディープキス' },
        { id: 'ayaka', name: 'アヤカ', faceIcon: 'images/faces/ayaka_face.png', color: '#E1E1E1', lightBg: '#A9A9A9', sendBtn: 'images/buttons/button_send_ayaka.png', msgCount: 1, dob: '2003年6月20日', birthplace: '東京', dialect: '標準語', personality: ['ふわふわ', 'マイペース'], height: '166cm', weight: '47kg', bust: 'Bカップ', nippleColor: 'ピンク', pubicHair: '少し', pussyColor: '薄ピンク', libido: '普通', favPosition: '正常位', sensitivity: '普通', favForeplay: '耳舐め' },
        { id: 'mayuka', name: 'マユカ', faceIcon: 'images/faces/mayuka_face.png', color: '#7FDDC1', lightBg: '#65B8A3', sendBtn: 'images/buttons/button_send_mayuka.png', msgCount: 12, dob: '2003年11月13日', birthplace: '大阪', dialect: '関西弁', personality: ['カメレオン', '努力家'], height: '160cm', weight: '45kg', bust: 'Cカップ', nippleColor: '薄茶色', pubicHair: '整えている', pussyColor: 'ピンク', libido: 'やや強め', favPosition: '四つん這い', sensitivity: '感じやすい', favForeplay: '指' },
        { id: 'rima', name: 'リマ', faceIcon: 'images/faces/rima_face.png', color: '#F57C83', lightBg: '#D96168', sendBtn: 'images/buttons/button_send_rima.png', msgCount: 15, dob: '2004年3月26日', birthplace: '東京', dialect: '英語混じり', personality: ['ラップ担当', 'おしゃれ'], height: '161cm', weight: '44kg', bust: 'Aカップ', nippleColor: 'ピンク', pubicHair: 'つるつる', pussyColor: 'ローズピンク', libido: '興味津々', favPosition: '屈曲位', sensitivity: '奥が弱い', favForeplay: 'クンニ' },
        { id: 'miihi', name: 'ミイヒ', faceIcon: 'images/faces/miihi_face.png', color: '#FBC1DA', lightBg: '#EAA0C3', sendBtn: 'images/buttons/button_send_miihi.png', msgCount: 17, dob: '2004年8月12日', birthplace: '京都', dialect: 'はんなり京都弁', personality: ['スマイルメーカー', '甘えん坊'], height: '158cm', weight: '42kg', bust: 'Bカップ', nippleColor: '桜色', pubicHair: 'うぶ毛程度', pussyColor: 'ベビーピンク', libido: '普通', favPosition: '正常位（バックも好き)', sensitivity: 'クリが敏感', favForeplay: '優しいキス' },
        { id: 'nina', name: 'ニナ', faceIcon: 'images/faces/nina_face.png', color: '#6DA7F2', lightBg: '#4E7EC2', sendBtn: 'images/buttons/button_send_nina.png', msgCount: 2, dob: '2005年2月27日', birthplace: 'アメリカ ワシントン州', dialect: '英語（日本語勉強中）', personality: ['末っ子', 'パワフルボーカル'], height: '165cm', weight: '48kg', bust: 'Dカップ', nippleColor: '薄茶色', pubicHair: '少しあり', pussyColor: 'ピンクベージュ', libido: '旺盛', favPosition: '色々試したい', sensitivity: '全身敏感', favForeplay: 'ペッティング' },
    ];

    let currentMember = null;
    let previousScreenId = 'member-list-screen';
    let currentScreenId = 'member-list-screen';

    function initializeApp() {
        renderMemberList();
        setupEventListeners();
        navigateTo(currentScreenId, true);
        console.log("App Initialized.");
    }

    function navigateTo(screenId, isInitial = false) {
        console.log(`Navigating to: ${screenId}`);
        if (currentScreenId !== screenId) {
             if (!['common-settings-screen', 'user-profile-screen'].includes(currentScreenId)) {
                previousScreenId = currentScreenId;
            }
        }

        screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        currentScreenId = screenId;

        footerNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screenId);
        });

        if (screenId === 'chat-room-screen' && currentMember) {
            loadChatRoomUI(currentMember);
        } else if (screenId === 'member-settings-screen' && currentMember) {
            loadMemberSettingsUI(currentMember);
        }

        if (currentMember && (screenId === 'chat-room-screen' || screenId === 'member-settings-screen')) {
            applyMemberTheme(currentMember);
        } else {
            resetToDefaultTheme();
        }
    }

    function applyMemberTheme(member) {
        const root = document.documentElement;
        root.style.setProperty('--member-main-color', member.color);
        root.style.setProperty('--member-light-bg-color', member.lightBg || '#f8f8f8');
        root.style.setProperty('--member-chat-bubble-user', member.color);
        console.log(`Theme applied for ${member.name}`);
    }

    function resetToDefaultTheme() {
        const root = document.documentElement;
        root.style.removeProperty('--member-main-color');
        root.style.removeProperty('--member-light-bg-color');
        root.style.removeProperty('--member-chat-bubble-user');
        console.log("Theme reset to default");
    }

    function renderMemberList() {
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

    function openChatRoom(memberId) {
        currentMember = members.find(m => m.id === memberId);
        if (currentMember) {
            navigateTo('chat-room-screen');
        }
    }

    function loadChatRoomUI(member) {
        document.getElementById('chat-member-name').textContent = member.name;
        document.getElementById('send-button-icon').src = member.sendBtn;

        const chatLogDiv = document.getElementById('chat-log');
        chatLogDiv.innerHTML = `
            <div class="message-group bot">
                <div class="message-sender-info">
                    <div class="message-icon-bot" style="border-color: ${member.color};"><img src="${member.faceIcon}" alt="${member.name}"></div>
                    <span class="message-sender-name">${member.name}</span>
                </div>
                <div class="message-bubble bot-bubble">
                    <div class="message-text large-placeholder"></div>
                </div>
            </div>
            <div class="message-group user">
                <div class="message-bubble user">こんにちは！</div>
            </div>
            <div class="message-group bot">
                <div class="message-sender-info">
                    <div class="message-icon-bot" style="border-color: ${member.color};"><img src="${member.faceIcon}" alt="${member.name}"></div>
                    <span class="message-sender-name">${member.name}</span>
                </div>
                <div class="message-bubble bot-bubble">
                    <div class="message-text">${member.name}です！よろしくね！</div>
                </div>
            </div>
        `;

        const suggestionsDiv = document.getElementById('reply-suggestions');
        suggestionsDiv.innerHTML = `
            <button class="suggestion-btn">気持ちいい？</button>
            <button class="suggestion-btn">パンパンパンパン</button>
            <button class="suggestion-btn">ビュルルル</button>
        `;
        suggestionsDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.style.borderColor = member.color;
            btn.style.color = member.color;
            btn.addEventListener('click', () => {
                document.getElementById('user-input').value += btn.textContent + " ";
                document.getElementById('user-input').focus();
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

    function openMemberSettings() {
        if (currentMember) {
            navigateTo('member-settings-screen');
        }
    }

    function loadMemberSettingsUI(member) {
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

    function getContrastYIQ(hexcolor){
        if (!hexcolor) return '#333333';
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0,2),16);
        const g = parseInt(hexcolor.substr(2,2),16);
        const b = parseInt(hexcolor.substr(4,2),16);
        const yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '#333333' : '#ffffff';
    }

    function setupEventListeners() {
        footerNavItems.forEach(item => {
            item.addEventListener('click', () => navigateTo(item.dataset.screen));
        });

        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            currentMember = null;
            navigateTo('member-list-screen');
        });
        document.getElementById('member-settings-btn').addEventListener('click', openMemberSettings);
        document.getElementById('new-talk-btn').addEventListener('click', () => {
            if(currentMember) alert(`「${currentMember.name}」との新しいトークを開始します。(機能未実装)`);
        });
        document.getElementById('back-to-chat-btn').addEventListener('click', () => navigateTo('chat-room-screen'));

        document.querySelectorAll('.back-from-footer-screen').forEach(button => {
            button.addEventListener('click', () => {
                navigateTo(previousScreenId || 'member-list-screen');
            });
        });

        document.getElementById('send-button').addEventListener('click', () => {
            const userInputField = document.getElementById('user-input');
            const messageText = userInputField.value.trim();
            if (messageText !== '' && currentMember) {
                appendChatMessage(messageText, 'user'); // ユーザーメッセージを追加
                userInputField.value = '';
                // TODO: ここでAIに応答を要求し、appendChatMessage(aiResponse, 'bot', currentMember) のように呼び出す
                // ダミーAI応答 (テスト用)
                setTimeout(() => {
                     appendChatMessage(`${currentMember.name}からのダミー応答です！`, 'bot', currentMember);
                }, 1000);
            }
        });
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            if(currentMember) alert(`「${currentMember.name}」の設定を保存しました。(機能未実装)`);
        });
    }

    // チャットメッセージ追加関数 (新しい構造に対応)
    function appendChatMessage(text, sender, memberData = null) {
        const chatLogDiv = document.getElementById('chat-log');
        const messageGroup = document.createElement('div');
        messageGroup.classList.add('message-group', sender);

        if (sender === 'bot' && memberData) {
            messageGroup.innerHTML = `
                <div class="message-sender-info">
                    <div class="message-icon-bot" style="border-color: ${memberData.color};"><img src="${memberData.faceIcon}" alt="${memberData.name}"></div>
                    <span class="message-sender-name">${memberData.name}</span>
                </div>
                <div class="message-bubble bot-bubble">
                    <div class="message-text">${text}</div>
                </div>
            `;
        } else if (sender === 'user') {
            messageGroup.innerHTML = `
                <div class="message-bubble user">${text}</div>
            `;
        }
        // Placeholderの削除ロジック (最初のボットメッセージ追加時など)
        const placeholder = chatLogDiv.querySelector('.large-placeholder');
        if (placeholder && sender === 'bot') { // 最初のボットメッセージで大きなプレースホルダーを消す場合
            const parentBubble = placeholder.closest('.bot-bubble');
            if (parentBubble) {
                // parentBubble.innerHTML = `<div class="message-text">${text}</div>`; // これだと sender-infoが消える
                // なので、placeholderのあるmessage-groupごと新しいメッセージで置き換えるか、
                // もっと複雑なDOM操作が必要。
                // 今回はダミーのinnerHTMLで初期表示しているので、実際のメッセージ追加時は
                // chatLogDiv.innerHTML = '' でクリアしてから全履歴を再描画するか、
                // appendChatMessage で追加する形になります。
                // 今のダミー送信では、placeholderは残ったままになります。
            }
        }


        chatLogDiv.appendChild(messageGroup);
        chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
    }

    initializeApp();
});
