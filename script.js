// script.js (一時的なテスト用)
document.addEventListener('DOMContentLoaded', () => {
    console.log("--- テスト開始 ---");
    console.log("script.js が読み込まれました。");

    if (typeof GEMINI_API_KEY !== 'undefined') {
        console.log("GEMINI_API_KEY は定義されています。");
        console.log("APIキーの値:", GEMINI_API_KEY); // APIキーの値を直接表示（実際のキーが表示されるので注意）

        if (GEMINI_API_KEY === "YOUR_API_KEY") {
            console.warn("警告: APIキーが 'YOUR_API_KEY' のままです。config.js を編集してください。");
            alert("APIキーが 'YOUR_API_KEY' のままです。config.js を編集してください。");
        } else if (GEMINI_API_KEY === "") {
            console.warn("警告: APIキーが空文字列です。config.js に正しいキーを設定してください。");
            alert("APIキーが空文字列です。config.js に正しいキーを設定してください。");
        } else {
            console.log("APIキーは正しく設定されているようです。");
        }
    } else {
        console.error("エラー: GEMINI_API_KEY が未定義です。");
        console.error("考えられる原因: ");
        console.error("1. config.js が script.js より前に読み込まれていない。 (index.htmlを確認)");
        console.error("2. config.js 内で GEMINI_API_KEY が正しく定義されていない。(スペルミス、constのつけ忘れなど)");
        console.error("3. config.js ファイル自体が見つからない。(ファイル名、場所を確認)");
        alert("GEMINI_API_KEY が未定義です。開発者コンソールで詳細を確認してください。");
    }
    console.log("--- テスト終了 ---");
});
