document.addEventListener('DOMContentLoaded', function () {
    // TODO:福祉関係のtipsを増やす必要
    const tips = [
        "Tip: このプログラムは，HTML，CSS，JavaScriptで構成されています！",
        "Tip: 手話は，両手，腕，顔の表情，体の向き，口形などを用いて表現され，視覚によって受容される身体動作/視覚言語です",
        "Tip: 塩野目研究室では，週二回ゼミが行われています！",
        "Tip: ロードが終わらない時はブラウザでリロードをしてみてください！",
        "Tip: ローディング画面に表示されるヒントは，5秒ごとに変わっています！",
        "Tip: Chromeの場合，Ctrl + Shift + R，またはCmd + Shift + Rでキャッシュを無視してリロードできます！",
        "Tip: このプログラムは塩野目研究室の活動の一環である「3年プロジェクト」において，2024年に開発されました",
        "// ここに福祉関係のtipsを追加",
    ];

    function getRandomTip() {
        const randomIndex = Math.floor(Math.random() * tips.length);
        return tips[randomIndex];
    }

    function updateTip() {
        const loaderTipsElement = document.getElementById('loaderTips');
        if (loaderTipsElement) {
            loaderTipsElement.textContent = getRandomTip();
        }
    }

    // 初回のヒントを表示
    updateTip();

    // 3秒ごとにヒントを更新
    setInterval(updateTip, 5000);
});