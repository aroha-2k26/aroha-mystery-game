const game = document.getElementById("game");
const refImg = document.getElementById("refImg");
const popup = document.getElementById("popup");
const img = "assets/images/Aroha.png";
refImg.src = img;
let tiles = [];
let emptyIndex = 8;
function init() {
    tiles = Array.from({ length: 9 }, (_, i) => i);
    shuffle();
    render();
}
function shuffle() {
    do {
        tiles.sort(() => Math.random() - 0.5);
    } while (!isSolvable());
}
function isSolvable() {
    let inv = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 9; j++) {
            if (tiles[i] !== 8 && tiles[j] !== 8 && tiles[i] > tiles[j]) inv++;
        }
    }
    return inv % 2 === 0;
}
function render() {
    game.innerHTML = "";
    tiles.forEach((value, index) => {
        const tile = document.createElement("div");
        tile.className = "tile";
        if (value === 8) {
            tile.classList.add("empty");
            emptyIndex = index;
        } else {
            const col = value % 3;
            const row = Math.floor(value / 3);
            tile.style.backgroundImage = `url(${img})`;
            tile.style.backgroundPosition = `${(col / 2) * 100}% ${(row / 2) * 100}%`;
        }
        tile.onclick = () => move(index);
        game.appendChild(tile);
    });
}
function move(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    const isAdjacent =
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1);

    if (isAdjacent) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        render();
        checkWin();
    }
}
function checkWin() {
    if (tiles.slice(0, 8).every((val, i) => val === i)) {
        popup.style.display = "flex";
    }
}

document.getElementById("backButton").onclick = () => {
  window.location.href = "index.html";
};

init();