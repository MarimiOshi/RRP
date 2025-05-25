// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("NiziU Chat App Initializing...");

    // --- グローバル変数・定数 ---
    const appContainer = document.getElementById('app-container');
    const screens = document.querySelectorAll('.screen');
    const footerNavItems = document.querySelectorAll('#footer-nav .nav-item');

    // メンバーデータ (仮)
    const members = [
        { id: 'mako', name: 'マコ', faceIcon: 'assets/faces/mako_face.png', color: '#ff8c00', lightBg: '#fff3e0', sendBtn: 'assets/buttons/button_send_mako.png', msgCount: 9, dob: '2001年4月4日', birthplace: '福岡', dialect: '軽い博多弁', personality: ['天然', 'しっかり者'], height: '159cm', weight: '49kg', bust: 'Cカップ', nippleColor: '薄い茶色', pubicHair: '少し生えている', pussyColor: 'ピンク', libido: '普通', favPosition: '正常位', sensitivity: 'すぐイっちゃう', favForeplay: 'フェラ' },
        { id: 'rio', name: 'リオ', faceIcon: 'assets/faces/rio_face.png', color: '#1e90ff', lightBg: '#e3f2fd', sendBtn: 'assets/buttons/button_send_rio.png', msgCount: 10, dob: '2002年2月4日', birthplace: '愛知', dialect: '名古屋弁', personality: ['クール', '情熱的'], height: '160cm', weight: '48kg', bust: 'Bカップ', nippleColor: 'ピンク', pubicHair: 'つるつる', pussyColor: '薄ピンク', libido: '強め', favPosition: '騎乗位', sensitivity: '感じやすい', favForeplay: 'キス' },
        { id: 'maya', name: 'マヤ', faceIcon: 'assets/faces/maya_face.png', color: '#dda0dd', lightBg: '#f3e5f5', sendBtn: 'assets/buttons/button_send_maya.png', msgCount: 7, dob: '2002年4月8日', birthplace: '石川', dialect: '金沢弁', personality: ['おっとり', '優しい'], height: '159cm', weight: '45kg', bust: 'Dカップ', nippleColor: '濃い茶色', pubicHair: '普通', pussyColor: 'ベージュ', libido: '普通', favPosition: '後背位', sensitivity: '普通', favForeplay: '愛撫' },
        // 他のメンバーも同様に追加... (リク、アヤカ、マユカ、リマ、ミイヒ、ニナ)
        // 全員分は長くなるので、代表して3名分のみ記載します。
        // 必要な情報を追加・修正してください。
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
            item.querySelector('.nav-icon-on').style.display = isActive ? 'inline-block' : 'none';
            item.querySelector('.nav-icon-off').style.display = isActive ? 'none' : 'inline-block';
        });

        // 特定の画面に遷移した際の追加処理
        if (screenId === 'chat-room-screen' && currentMember) {
            loadChatRoomUI(currentMember);
        } else if (screenId === 'member-settings-screen' && currentMember) {
            loadMemberSettingsUI(currentMember);
        }

        // 画面遷移時にルートのCSS変数をリセットまたは設定
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
        root.style.setProperty('--member-light-bg-color', member.lightBg);
        root.style.setProperty('--member-chat-bubble-user', member.color);
        // 必要に応じて他のテーマ関連のCSS変数を設定
        console.log(`Theme applied for ${member.name}`);
    }

    function resetToDefaultTheme() {
        const root = document.documentElement;
        // デフォルトテーマに戻す (style.cssの:rootで定義された値に戻すには、明示的にデフォルト値を再設定するか、
        // JSで設定した値を削除する。ここではデフォルト値を再設定する例)
        root.style.setProperty('--member-main-color', '#FFA500'); // :rootのデフォルト値 (例)
        root.style.setProperty('--member-light-bg-color', '#fff3e0'); // :rootのデフォルト値 (例)
        root.style.setProperty('--member-chat-bubble-user', '#FFA500'); // :rootのデフォルト値 (例)
        // または removeProperty を使う (ただし、:rootの定義が優先される)
        // root.style.removeProperty('--member-main-color');
        // root.style.removeProperty('--member-light-bg-color');
        console.log("Theme reset to default");
    }


    // --- メンバー一覧表示 ---
    function renderMemberList() {
        const memberListUl = document.getElementById('member-list');
        if (!memberListUl) return;
        memberListUl.innerHTML = ''; // リストをクリア

        members.forEach(member => {
            const li = document.createElement('li');
            li.classList.add('member-list-item');
            li.dataset.memberId = member.id;
            // メンバーカラーをアイコンの枠線に適用
            li.innerHTML = `
                <div class="member-icon-wrapper" style="border-color: ${member.color};">
                    <img src="${member.faceIcon}" alt="${member.name}">
                </div>
                <div class="member-name">${member.name}</div>
                <div class="message-count-wrapper">
                    <img src="assets/icons/chat_bubble.png" alt="msg">
                    <span>${member.msgCount}</span>
                </div>
            `;
            // 左側（名前やアイコン）クリックでトークルームへ
            li.querySelector('.member-icon-wrapper').addEventListener('click', () => openChatRoom(member.id));
            li.querySelector('.member-name').addEventListener('click', () => openChatRoom(member.id));
            // 右側（メッセージ数）クリックで過去トーク選択（今回はダミーでトークルームへ）
            li.querySelector('.message-count-wrapper').addEventListener('click', (e) => {
                e.stopPropagation(); // 親要素のクリックイベント発火を防ぐ
                console.log(`Open past talks for ${member.name} (Not Implemented Yet)`);
                alert(`「${member.name}」の過去トーク選択機能は未実装です。`);
                // openChatRoom(member.id); // 仮でトークルームを開く
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
        document.getElementById('send-button-icon').src = member.sendBtn;

        // ダミーチャットログ表示
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
        `; // TODO: 実際のチャットログ表示処理

        // ダミー返信候補表示
        const suggestionsDiv = document.getElementById('reply-suggestions');
        suggestionsDiv.innerHTML = `
            <button class="suggestion-btn" style="border-color:${member.color}; color:${member.color};">気持ちいい？</button>
            <button class="suggestion-btn" style="border-color:${member.color}; color:${member.color};">パンパンパンパン</button>
            <button class="suggestion-btn" style="border-color:${member.color}; color:${member.color};">ビュルルル</button>
        `;
        suggestionsDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('user-input').value += btn.textContent + " ";
                document.getElementById('user-input').focus();
            });
        });

        // 背景色などテーマ適用
        document.getElementById('chat-log-container').style.backgroundColor = member.lightBg;
        document.getElementById('chat-room-screen').querySelector('.screen-header').style.backgroundColor = member.color;
        document.getElementById('chat-room-screen').querySelector('.screen-header').style.color = 'white';
        document.querySelectorAll('#chat-room-screen .header-btn img').forEach(img => img.style.filter = 'brightness(0) invert(1)');

    }

    // --- メンバー設定画面関連 ---
    function openMemberSettings() {
        if (currentMember) {
            navigateTo('member-settings-screen');
        } else {
            alert("トーク中のメンバーがいません。"); // 通常はトークルームからのみ遷移
        }
    }

    function loadMemberSettingsUI(member) {
        document.getElementById('settings-member-name').textContent = member.name;
        document.getElementById('settings-member-icon').src = member.faceIcon;
        document.getElementById('settings-member-icon').style.borderColor = member.color;

        // 各設定項目に値をセット (実際の値はmemberオブジェクトから取得)
        document.getElementById('setting-dob').textContent = member.dob || '未設定';
        document.getElementById('setting-color').textContent = member.name; // カラー名は表示しないので仮
        document.getElementById('setting-color').style.backgroundColor = member.color;
        document.getElementById('setting-color').style.color = getContrastYIQ(member.color); // 背景色に応じて文字色変更

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

        document.getElementById('member-settings-screen').style.backgroundColor = member.lightBg;
        document.getElementById('member-settings-screen').querySelector('.screen-header').style.backgroundColor = member.color;
        document.getElementById('member-settings-screen').querySelector('.screen-header').style.color = 'white';
        document.querySelectorAll('#member-settings-screen .header-btn img').forEach(img => img.style.filter = 'brightness(0) invert(1)');
        document.getElementById('save-settings-btn').style.backgroundColor = member.color;

    }

    function getContrastYIQ(hexcolor){ // 背景色に対する適切な文字色（白か黒）を返す
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0,2),16);
        const g = parseInt(hexcolor.substr(2,2),16);
        const b = parseInt(hexcolor.substr(4,2),16);
        const yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '#333333' : '#ffffff';
    }

    // --- イベントリスナー設定 ---
    function setupEventListeners() {
        // フッターナビゲーション
        footerNavItems.forEach(item => {
            item.addEventListener('click', () => {
                navigateTo(item.dataset.screen);
            });
        });

        // トークルームのヘッダーボタン
        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            currentMember = null; // トークルームを離れるので現在のメンバーをリセット
            navigateTo('member-list-screen');
        });
        document.getElementById('member-settings-btn').addEventListener('click', openMemberSettings);
        document.getElementById('new-talk-btn').addEventListener('click', () => {
            if(currentMember) {
                alert(`「${currentMember.name}」との新しいトークを開始します。(機能未実装)`);
                // TODO: 新しいトークのロジック
            }
        });

        // メンバー設定画面のヘッダーボタン
        document.getElementById('back-to-chat-btn').addEventListener('click', () => navigateTo('chat-room-screen'));

        // トーク送信ボタン (ダミー)
        document.getElementById('send-button').addEventListener('click', () => {
            const userInputField = document.getElementById('user-input');
            if (userInputField.value.trim() !== '' && currentMember) {
                alert(`To ${currentMember.name}: ${userInputField.value}`);
                // TODO: 実際のメッセージ送信処理 (AI連携)
                // ダミーでユーザーメッセージを表示
                const chatLogDiv = document.getElementById('chat-log');
                const userMsgDiv = document.createElement('div');
                userMsgDiv.classList.add('message-bubble', 'user');
                userMsgDiv.textContent = userInputField.value;
                chatLogDiv.appendChild(userMsgDiv);
                chatLogDiv.scrollTop = chatLogDiv.scrollHeight;

                userInputField.value = '';
            }
        });

        // 設定保存ボタン (ダミー)
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            if(currentMember) {
                alert(`「${currentMember.name}」の設定を保存しました。(機能未実装)`);
                // TODO: 実際の保存処理
            }
        });

        // TODO: メッセージのスワイプ再生成、長押し編集のリスナー
    }


    // --- アプリケーション実行 ---
    initializeApp();

});
