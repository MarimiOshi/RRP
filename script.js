// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("NiziU Chat App Initializing...");

    // --- グローバル変数・定数 ---
    const appContainer = document.getElementById('app-container');
    const screens = document.querySelectorAll('.screen');
    const footerNavItems = document.querySelectorAll('#footer-nav .nav-item');

    // メンバーデータ (仮) - パスを images/ に変更
    const members = [
        { id: 'mako', name: 'マコ', faceIcon: 'images/faces/mako_face.png', color: '#ff8c00', lightBg: '#fff3e0', sendBtn: 'images/buttons/button_send_mako.png', msgCount: 9, dob: '2001年4月4日', birthplace: '福岡', dialect: '軽い博多弁', personality: ['天然', 'しっかり者'], height: '159cm', weight: '49kg', bust: 'Cカップ', nippleColor: '薄い茶色', pubicHair: '少し生えている', pussyColor: 'ピンク', libido: '普通', favPosition: '正常位', sensitivity: 'すぐイっちゃう', favForeplay: 'フェラ' },
        { id: 'rio', name: 'リオ', faceIcon: 'images/faces/rio_face.png', color: '#1e90ff', lightBg: '#e3f2fd', sendBtn: 'images/buttons/button_send_rio.png', msgCount: 10, dob: '2002年2月4日', birthplace: '愛知', dialect: '名古屋弁', personality: ['クール', '情熱的'], height: '160cm', weight: '48kg', bust: 'Bカップ', nippleColor: 'ピンク', pubicHair: 'つるつる', pussyColor: '薄ピンク', libido: '強め', favPosition: '騎乗位', sensitivity: '感じやすい', favForeplay: 'キス' },
        { id: 'maya', name: 'マヤ', faceIcon: 'images/faces/maya_face.png', color: '#dda0dd', lightBg: '#f3e5f5', sendBtn: 'images/buttons/button_send_maya.png', msgCount: 7, dob: '2002年4月8日', birthplace: '石川', dialect: '金沢弁', personality: ['おっとり', '優しい'], height: '159cm', weight: '45kg', bust: 'Dカップ', nippleColor: '濃い茶色', pubicHair: '普通', pussyColor: 'ベージュ', libido: '普通', favPosition: '後背位', sensitivity: '普通', favForeplay: '愛撫' },
        // 他のメンバーも同様に追加... (リク、アヤカ、マユカ、リマ、ミイヒ、ニナ)
        // 全員分は長くなるので、代表して3名分のみ記載します。
        // 必要な情報を追加・修正してください。
        // faceIcon と sendBtn のパスが 'images/' から始まるように注意。
        { id: 'riku', name: 'リク', faceIcon: 'images/faces/riku_face.png', color: '#ffd700', lightBg: '#fff9c4', sendBtn: 'images/buttons/button_send_riku.png', msgCount: 0, dob: '2002年10月26日', birthplace: '京都', dialect: '京都弁', personality: ['明るい', '面白い'], height: '162cm', weight: '46kg', bust: 'Aカップ', nippleColor: '薄ピンク', pubicHair: '処理済み', pussyColor: 'ピンク', libido: '高め', favPosition: '対面座位', sensitivity: '超敏感', favForeplay: 'ディープキス' },
        { id: 'ayaka', name: 'アヤカ', faceIcon: 'images/faces/ayaka_face.png', color: '#ffffff', lightBg: '#f5f5f5', sendBtn: 'images/buttons/button_send_ayaka.png', msgCount: 1, dob: '2003年6月20日', birthplace: '東京', dialect: '標準語', personality: ['ふわふわ', 'マイペース'], height: '166cm', weight: '47kg', bust: 'Bカップ', nippleColor: 'ピンク', pubicHair: '少し', pussyColor: '薄ピンク', libido: '普通', favPosition: '正常位', sensitivity: '普通', favForeplay: '耳舐め' },
        { id: 'mayuka', name: 'マユカ', faceIcon: 'images/faces/mayuka_face.png', color: '#90ee90', lightBg: '#e8f5e9', sendBtn: 'images/buttons/button_send_mayuka.png', msgCount: 12, dob: '2003年11月13日', birthplace: '大阪', dialect: '関西弁', personality: ['カメレオン', '努力家'], height: '160cm', weight: '45kg', bust: 'Cカップ', nippleColor: '薄茶色', pubicHair: '整えている', pussyColor: 'ピンク', libido: 'やや強め', favPosition: '四つん這い', sensitivity: '感じやすい', favForeplay: '指' },
        { id: 'rima', name: 'リマ', faceIcon: 'images/faces/rima_face.png', color: '#ff69b4', lightBg: '#fce4ec', sendBtn: 'images/buttons/button_send_rima.png', msgCount: 15, dob: '2004年3月26日', birthplace: '東京', dialect: '英語混じり', personality: ['ラップ担当', 'おしゃれ'], height: '161cm', weight: '44kg', bust: 'Aカップ', nippleColor: 'ピンク', pubicHair: 'つるつる', pussyColor: 'ローズピンク', libido: '興味津々', favPosition: '屈曲位', sensitivity: '奥が弱い', favForeplay: 'クンニ' },
        { id: 'miihi', name: 'ミイヒ', faceIcon: 'images/faces/miihi_face.png', color: '#add8e6', lightBg: '#e1f5fe', sendBtn: 'images/buttons/button_send_miihi.png', msgCount: 17, dob: '2004年8月12日', birthplace: '京都', dialect: 'はんなり京都弁', personality: ['スマイルメーカー', '甘えん坊'], height: '158cm', weight: '42kg', bust: 'Bカップ', nippleColor: '桜色', pubicHair: 'うぶ毛程度', pussyColor: 'ベビーピンク', libido: '普通', favPosition: '正常位（バックも好き)', sensitivity: 'クリが敏感', favForeplay: '優しいキス' },
        { id: 'nina', name: 'ニナ', faceIcon: 'images/faces/nina_face.png', color: '#8a2be2', lightBg: '#ede7f6', sendBtn: 'images/buttons/button_send_nina.png', msgCount: 2, dob: '2005年2月27日', birthplace: 'アメリカ ワシントン州', dialect: '英語（日本語勉強中）', personality: ['末っ子', 'パワフルボーカル'], height: '165cm', weight: '48kg', bust: 'Dカップ', nippleColor: '薄茶色', pubicHair: '少しあり', pussyColor: 'ピンクベージュ', libido: '旺盛', favPosition: '色々試したい', sensitivity: '全身敏感', favForeplay: 'ペッティング' },
    ];

    let currentMember = null; // 現在選択されているメンバー
    let currentScreenId = 'member-list-screen'; // 初期画面

    // --- 初期化処理 ---
    function initializeApp() {
        renderMemberList();
        setupEventListeners();
        navigateTo(currentScreenId, true); // 初期画面表示
        console.log("App Initialized.");
    }

    // --- 画面遷移 ---
    function navigateTo(screenId, isInitial = false) {
        console.log(`Navigating to: ${screenId}`);
        screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        currentScreenId = screenId;

        // フッターナビのアクティブ状態更新
        footerNavItems.forEach(item => {
            const isActive = item.dataset.screen === screenId;
            item.classList.toggle('active', isActive);
            // アイコンの表示切り替えはCSSの .active セレクタで行うように変更
        });

        // 特定の画面に遷移した際の追加処理
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

    // --- テーマ適用 ---
    function applyMemberTheme(member) {
        const root = document.documentElement;
        root.style.setProperty('--member-main-color', member.color);
        root.style.setProperty('--member-light-bg-color', member.lightBg || '#f8f8f8'); // lightBgが未定義の場合のフォールバック
        root.style.setProperty('--member-chat-bubble-user', member.color);
        console.log(`Theme applied for ${member.name}`);
    }

    function resetToDefaultTheme() {
        const root = document.documentElement;
        // CSSの:rootで定義された初期値に戻すために、設定したプロパティを削除する
        root.style.removeProperty('--member-main-color');
        root.style.removeProperty('--member-light-bg-color');
        root.style.removeProperty('--member-chat-bubble-user');
        console.log("Theme reset to default (by removing properties)");
    }


    // --- メンバー一覧表示 ---
    function renderMemberList() {
        const memberListUl = document.getElementById('member-list');
        if (!memberListUl) return;
        memberListUl.innerHTML = '';

        members.forEach(member => {
            const li = document.createElement('li');
            li.classList.add('member-list-item');
            li.dataset.memberId = member.id;
            li.innerHTML = `
                <div class="member-icon-wrapper" style="border-color: ${member.color};">
                    <img src="${member.faceIcon}" alt="${member.name}">
                </div>
                <div class="member-name">${member.name}</div>
                <div class="message-count-wrapper">
                    <img src="images/icons/chat_bubble.png" alt="msg">
                    <span>${member.msgCount}</span>
                </div>
            `;
            const clickableArea = document.createElement('div'); // クリック領域を広げるためのラッパー
            clickableArea.style.display = 'flex';
            clickableArea.style.alignItems = 'center';
            clickableArea.style.flexGrow = '1';
            clickableArea.style.cursor = 'pointer';
            
            const iconAndName = li.childNodes[0].parentNode.removeChild(li.childNodes[0]); // icon-wrapper
            const nameDiv = li.childNodes[0].parentNode.removeChild(li.childNodes[0]); // member-name
            clickableArea.appendChild(iconAndName);
            clickableArea.appendChild(nameDiv);

            clickableArea.addEventListener('click', () => openChatRoom(member.id));
            
            li.insertBefore(clickableArea, li.firstChild); // message-count-wrapper の前に挿入

            li.querySelector('.message-count-wrapper').addEventListener('click', (e) => {
                e.stopPropagation();
                console.log(`Open past talks for ${member.name} (Not Implemented Yet)`);
                alert(`「${member.name}」の過去トーク選択機能は未実装です。`);
            });
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
        document.getElementById('send-button-icon').src = member.sendBtn; // パスが images/ から始まることを確認

        const chatLogDiv = document.getElementById('chat-log');
        chatLogDiv.innerHTML = `
            <div class="message-bubble bot">
                <div class="message-icon-bot"><img src="${member.faceIcon}" alt="${member.name}"></div>
                <div class="message-text large-placeholder"></div>
            </div>
            <div class="message-bubble user">こんにちは！</div>
            <div class="message-bubble bot">
                <div class="message-icon-bot"><img src="${member.faceIcon}" alt="${member.name}"></div>
                <div class="message-text">${member.name}です！よろしくね！</div>
            </div>
        `;

        const suggestionsDiv = document.getElementById('reply-suggestions');
        suggestionsDiv.innerHTML = `
            <button class="suggestion-btn">気持ちいい？</button>
            <button class="suggestion-btn">パンパンパンパン</button>
            <button class="suggestion-btn">ビュルルル</button>
        `;
        suggestionsDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.style.borderColor = member.color; // JSでスタイル設定
            btn.style.color = member.color;      // JSでスタイル設定
            btn.addEventListener('click', () => {
                document.getElementById('user-input').value += btn.textContent + " ";
                document.getElementById('user-input').focus();
            });
        });

        // テーマ適用 (CSSカスタムプロパティ経由)
        // 個別の要素への直接スタイル設定は applyMemberTheme でカバーされる部分以外
        document.getElementById('chat-log-container').style.backgroundColor = member.lightBg; // これはカスタムプロパティでOK
        const chatRoomHeader = document.getElementById('chat-room-screen').querySelector('.screen-header');
        chatRoomHeader.style.backgroundColor = member.color;
        chatRoomHeader.style.color = getContrastYIQ(member.color);
        chatRoomHeader.querySelectorAll('.header-btn img').forEach(img => {
            img.style.filter = getContrastYIQ(member.color) === '#ffffff' ? 'brightness(0) invert(1)' : 'none';
        });
    }

    // --- メンバー設定画面関連 ---
    function openMemberSettings() {
        if (currentMember) {
            navigateTo('member-settings-screen');
        }
    }

    function loadMemberSettingsUI(member) {
        document.getElementById('settings-member-name').textContent = member.name;
        const settingsMemberIcon = document.getElementById('settings-member-icon');
        settingsMemberIcon.src = member.faceIcon; // パスが images/ から
        settingsMemberIcon.style.borderColor = member.color;

        document.getElementById('setting-dob').textContent = member.dob || '未設定';
        const settingColorSpan = document.getElementById('setting-color');
        settingColorSpan.textContent = member.name; // 実際のカラーコードは表示しない
        settingColorSpan.style.backgroundColor = member.color;
        settingColorSpan.style.color = getContrastYIQ(member.color);

        // 他の設定項目も同様に
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
        // settingsScreen.style.backgroundColor = member.lightBg; // カスタムプロパティでOK
        const settingsHeader = settingsScreen.querySelector('.screen-header');
        settingsHeader.style.backgroundColor = member.color;
        settingsHeader.style.color = getContrastYIQ(member.color);
        settingsHeader.querySelectorAll('.header-btn img').forEach(img => {
             img.style.filter = getContrastYIQ(member.color) === '#ffffff' ? 'brightness(0) invert(1)' : 'none';
        });
        document.getElementById('save-settings-btn').style.backgroundColor = member.color;
        document.getElementById('save-settings-btn').style.color = getContrastYIQ(member.color);
    }

    function getContrastYIQ(hexcolor){
        if (!hexcolor) return '#333333'; // hexcolorがundefinedの場合のフォールバック
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
            currentMember = null;
            navigateTo('member-list-screen');
        });
        document.getElementById('member-settings-btn').addEventListener('click', openMemberSettings);
        document.getElementById('new-talk-btn').addEventListener('click', () => {
            if(currentMember) alert(`「${currentMember.name}」との新しいトークを開始します。(機能未実装)`);
        });
        document.getElementById('back-to-chat-btn').addEventListener('click', () => navigateTo('chat-room-screen'));

        document.getElementById('send-button').addEventListener('click', () => {
            const userInputField = document.getElementById('user-input');
            if (userInputField.value.trim() !== '' && currentMember) {
                // alert(`To ${currentMember.name}: ${userInputField.value}`);
                const chatLogDiv = document.getElementById('chat-log');
                const userMsgDiv = document.createElement('div');
                userMsgDiv.classList.add('message-bubble', 'user');
                // userMsgDiv.style.backgroundColor = currentMember.color; // カスタムプロパティで対応
                userMsgDiv.textContent = userInputField.value;
                chatLogDiv.appendChild(userMsgDiv);
                chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
                userInputField.value = '';
            }
        });
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            if(currentMember) alert(`「${currentMember.name}」の設定を保存しました。(機能未実装)`);
        });
    }

    initializeApp();
});
