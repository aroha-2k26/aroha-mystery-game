const size = 4;
let board = [];
let tiles = [];
let score = 0;
let gameEnded = false;

let startX = 0;
let startY = 0;
let dragging = false;

window.onload = () => {
    init();
    addTile();
    addTile();
    updateUI();
};

document.getElementById("backButton").onclick = () => {
  window.location.href = "index.html";
};

function init() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board = [];
    tiles = [];

    for (let r = 0; r < size; r++) {
        board[r] = [];
        tiles[r] = [];
        for (let c = 0; c < size; c++) {
            board[r][c] = 0;
            const div = document.createElement("div");
            div.className = "tile";
            boardDiv.appendChild(div);
            tiles[r][c] = div;
        }
    }
}

function updateUI() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const val = board[r][c];
            const tile = tiles[r][c];
            tile.textContent = val || "";
            tile.className = "tile" + (val ? " x" + Math.min(val, 2048) : "");
        }
    }
    document.getElementById("score").textContent = score;
}

function addTile() {
    const empty = [];
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            if (board[r][c] === 0) empty.push({ r, c });

    if (!empty.length) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(line) {
    line = line.filter(v => v);
    for (let i = 0; i < line.length - 1; i++) {
        if (line[i] === line[i + 1]) {
            line[i] *= 2;
            score += line[i];
            line[i + 1] = 0;
        }
    }
    line = line.filter(v => v);
    while (line.length < size) line.push(0);
    return line;
}

function move(dir) {
    if (gameEnded) return;
    const old = JSON.stringify(board);

    if (dir === "left" || dir === "right") {
        for (let r = 0; r < size; r++) {
            let row = [...board[r]];
            if (dir === "right") row.reverse();
            row = slide(row);
            if (dir === "right") row.reverse();
            board[r] = row;
        }
    } else {
        for (let c = 0; c < size; c++) {
            let col = board.map(r => r[c]);
            if (dir === "down") col.reverse();
            col = slide(col);
            if (dir === "down") col.reverse();
            for (let r = 0; r < size; r++) board[r][c] = col[r];
        }
    }

    if (JSON.stringify(board) !== old) {
        addTile();
        updateUI();

        if (checkWin()) {
            showPopup("You Win!", "You reached 2048 🎉");
        } else if (isGameOver()) {
            showPopup("Game Over", "No more moves left 😢");
        }
    }
}

function checkWin() {
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            if (board[r][c] === 2048) return true;
    return false;
}

function isGameOver() {
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) return false;
            if (c < size - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < size - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    return true;
}

function showPopup(title, message) {
    gameEnded = true;
    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupMessage").textContent = message;
    document.getElementById("popupOverlay").style.display = "flex";
}

function restartGame() {
    score = 0;
    gameEnded = false;
    document.getElementById("popupOverlay").style.display = "none";
    init();
    addTile();
    addTile();
    updateUI();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
});

document.addEventListener("touchstart", e => {
    dragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener("touchend", e => {
    if (!dragging) return;
    dragging = false;
    handleSwipe(
        e.changedTouches[0].clientX - startX,
        e.changedTouches[0].clientY - startY
    );
});

document.addEventListener("mousedown", e => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener("mouseup", e => {
    if (!dragging) return;
    dragging = false;
    handleSwipe(e.clientX - startX, e.clientY - startY);
});

function handleSwipe(dx, dy) {
    const t = 40;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > t) move("right");
        else if (dx < -t) move("left");
    } else {
        if (dy > t) move("down");
        else if (dy < -t) move("up");
    }
}