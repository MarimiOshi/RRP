// scenarios/mako.js
const scenarioMako = {
    start: {
        memberImage: "images/mako_neutral.png",
        backgroundImage: "images/bg_practice_room.jpg",
        situation: "練習が終わり、スタジオにはあなたとマコだけが残っている。彼女は少し汗を拭いながら、こちらに微笑みかけた。",
        characterName: "マコ",
        dialogue: "お疲れ様！今日の練習、どうだった？",
        choices: [
            { text: "「マコのおかげで楽しかったよ！」", nextScene: "mako_002_positive", affection: 5 },
            { text: "「ちょっと疲れたけど、充実してたね」", nextScene: "mako_002_neutral", affection: 2 },
            { text: "「もっとマコと練習したかったな」", nextScene: "mako_002_eager", affection: 7, flags: { "mako_showed_interest": true } }
        ]
    },
    mako_002_positive: {
        memberImage: "images/mako_smile.png",
        situation: "あなたの言葉に、マコは嬉しそうに顔を輝かせる。",
        characterName: "マコ",
        dialogue: "本当？よかった！私も、あなたと一緒だといつもより頑張れるんだ。…ねえ、この後、少し時間あるかな？",
        choices: [
            { text: "「もちろん！どうかしたの？」", nextScene: "mako_003_invitation", affection: 10 },
            { text: "「ごめん、今日はちょっと予定が…」", nextScene: "mako_003_refuse", affection: -5 },
            { text: "（黙って頷く）", nextScene: "mako_003_invitation_silent", affection: 8 }
        ]
    },
    // ... (他のシーンを追加) ...

    // 下系の展開に進む前の段階 (例)
    mako_010_private_talk: {
        memberImage: "images/mako_shy.png",
        backgroundImage: "images/bg_mako_room_night.jpg", // マコの部屋（夜）などの背景
        situation: "二人きり、マコの部屋で静かな時間が流れる。彼女は少し顔を赤らめながら、あなたの目を見つめている。",
        characterName: "マコ",
        // Gemini APIでセリフを生成する場合の指示（後述）
        useGeminiDialogue: true,
        geminiPromptBase: "あなたはマコです。主人公と二人きりの部屋にいます。好感度はかなり高いです。主人公を誘うような、少し大胆なセリフを言ってください。ただし、直接的すぎないように、雰囲気で伝えてください。",
        dialogue: "…なんだか、ドキドキするね。あなたとこうしていると…。", // APIを使わない場合のデフォルトセリフ
        choices: [
            { text: "「俺もだよ」と優しく手を握る", nextScene: "mako_011_touch", affection: 15, flags: {"mako_mood_high": true} },
            { text: "「どうしたの？」と心配するフリ", nextScene: "mako_011_evade", affection: -5 },
            { text: "「そろそろ帰ろうか？」", nextScene: "mako_ending_friendzone", affection: -20 }
        ]
    },

    // 中出しクリアのシーン (例)
    mako_ending_nakadashi_clear: {
        memberImage: "images/mako_happy_after.png", // それっぽい画像
        backgroundImage: "images/bg_mako_room_morning.jpg", // 朝など
        situation: "朝日が差し込む部屋で、あなたはマコの温もりを感じながら目覚めた。昨夜の熱い記憶が蘇る。",
        characterName: "マコ",
        dialogue: "ん…おはよ…。すごく…幸せだったよ。あなたの愛、全部…もらっちゃった…♡",
        isEnding: true,
        endingTitle: "最高の思い出",
        endingMessage: "あなたはマコと最も深い絆で結ばれました。\n彼女の心も体も、あなたの愛で満たされています。\nGAME CLEAR!",
        choices: [] // エンディングなので選択肢なし、またはリスタートボタンのみ
    },

    // 好感度が足りない場合の中出し失敗エンド (例)
    mako_ending_nakadashi_fail: {
        // ... (クリアに至らなかった場合の内容)
        isEnding: true,
        endingTitle: "あと一歩…",
        // ...
    }
};

// 同様に scenarioRima, scenarioMiihi を作成
