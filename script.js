function createDeck() {
    const suits = ["club", "diamond", "heart", "spade"];
    const deck = [];
    for (let suit of suits) {
        for (let value = 1; value <= 13; value++) {
            deck.push({ value, suit });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

// グローバル変数
let deck = createDeck();
let currentCard = deck.pop();
let playerScore = 0;
let computerScore = 0;
let playerTurn = true;

// 初期カードを表示
updateCardImage(currentCard);
updateDeckDisplay(deck, "playerDeck");
updateDeckDisplay(deck, "computerDeck"); // 初期状態からコンピューターデッキを表示

// カードの画像パスを取得
function getCardImagePath(card) {
    return `images/${card.value}_${card.suit}.png`; // 例：1_club.png
}

// カードの画像を更新
function updateCardImage(card, isFlipped = true) {
    const cardImage = document.getElementById("cardImage");
    cardImage.src = getCardImagePath(card);

    if (isFlipped) {
        cardImage.classList.add("flipped");
        setTimeout(() => cardImage.classList.remove("flipped"), 300); // めくるアニメーション
    }
}

// デッキ表示を更新 (5枚だけ表示)
function updateDeckDisplay(deck, elementId) {
    const deckElement = document.getElementById(elementId);
    deckElement.innerHTML = ''; // 初期化

    // 上から5枚のみ表示
    const displayCount = Math.min(5, deck.length); // 5枚もしくはデッキの枚数
    for (let i = 0; i < displayCount; i++) {
        const backImg = document.createElement("img");
        backImg.src = "images/back.png"; // 裏面の画像
        backImg.alt = "裏向きのカード";

        // 軽い重なり具合を設定
        const offsetX = i * 1; // 右方向へのずらし量（px）
        const offsetY = i * 1.5; // 下方向へのずらし量（px）
        const rotateAngle = i * 0.2; // 軽い回転角度（度）

        // CSS変数でスタイルを適用
        backImg.style.setProperty('--offset-x', `${offsetX}px`);
        backImg.style.setProperty('--offset-y', `${offsetY}px`);
        backImg.style.setProperty('--rotate-angle', `${rotateAngle}deg`);

        deckElement.appendChild(backImg);
    }
}

// ボタンイベントの設定
function setupButtons() {
    document.getElementById("highButton").addEventListener("click", () => {
        if (playerTurn) makeGuess("high");
    });
    document.getElementById("lowButton").addEventListener("click", () => {
        if (playerTurn) makeGuess("low");
    });
}

// ゲームスタート
function startGame() {
    setupButtons();
    document.getElementById("message").innerText = "ゲームスタート！あなたのターンです。";
}

// プレイヤーの予想を判定する
function makeGuess(playerGuess) {
    if (deck.length === 0) {
        endGame();
        return;
    }

    playerTurn = false;
    document.getElementById("message").innerText = "自分のターン...";

    let nextCard = deck.pop();
    updateCardImage(nextCard);

    let isCorrect = (playerGuess === "high" && nextCard.value > currentCard.value) ||
                    (playerGuess === "low" && nextCard.value < currentCard.value);

    if (isCorrect) {
        playerScore++;
        document.getElementById("message").innerText = "正解！一枚手に入れた！コンピューターのターンです";
        currentCard = nextCard;
    } else {
        document.getElementById("message").innerText = "不正解！コンピューターのターンです";
    }

    updateScores();
    updateDeckDisplay(deck, "playerDeck");
    setTimeout(computerTurn, 3000);
}

// コンピューターのターン
function computerTurn() {
    if (deck.length === 0) {
        endGame();
        return;
    }

    document.getElementById("message").innerText = "コンピューターのターン...";

    setTimeout(() => {
        let computerGuess = Math.random() < 0.5 ? "high" : "low";
        let nextCard = deck.pop();
        updateCardImage(nextCard);

        let isCorrect = (computerGuess === "high" && nextCard.value > currentCard.value) ||
                        (computerGuess === "low" && nextCard.value < currentCard.value);

        if (isCorrect) {
            computerScore++;
            document.getElementById("message").innerText = "コンピューターは正解しました。あなたのターンです。";
            currentCard = nextCard;
        } else {
            document.getElementById("message").innerText = "コンピューターは間違えました！あなたのターンです。";
        }

        updateScores();
        updateDeckDisplay(deck, "computerDeck");
        playerTurn = true;
    }, 2000);
}

// スコアを更新
function updateScores() {
    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("computerScore").innerText = computerScore;
}

// ゲーム終了時の処理
function endGame() {
    let resultMessage = playerScore > computerScore ? "あなたの勝ちです！" : "コンピューターの勝ちです。";
    if (playerScore === computerScore) resultMessage = "引き分けです。";
    document.getElementById("message").innerText = `ゲーム終了！ ${resultMessage}`;
    document.getElementById("highButton").disabled = true;
    document.getElementById("lowButton").disabled = true;
}

window.onload = function() {
    startGame();

    const bgm = document.getElementById("bgm");

    // BGMの自動再生を試みる
    bgm.play().then(() => {
        console.log("BGM is playing");
    }).catch(error => {
        console.error("Error playing BGM:", error);
    });
};