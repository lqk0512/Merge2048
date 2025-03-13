var board;
var score = 0;
var rows = 5;
var columns = 5;
var colors = ["#EEE4DA", "#F2B179", "#f59575"];
var extraColor = "#EDC22E";
var xColor = "#fe3d3d";

window.onload = function() {
    highScore = localStorage.getItem("highScore") || 0;
    document.getElementById("high-score").innerText = highScore;
    setGame();
}

function setGame() {
    board = [];
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            let color = colors[Math.floor(Math.random() * colors.length)];
            let value = Math.random() < 0.5 ? 2 : 4; // Ngẫu nhiên chọn 2 hoặc 4
            board[r][c] = { value: value, color: color };
        }
    }
    renderBoard();
}


function renderBoard() {
    document.getElementById("board").innerHTML = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", () => mergeTiles(r, c));
            updateTile(tile, board[r][c], r, c);
            document.getElementById("board").append(tile);
        }
    }
    checkGameOver();
}

function updateTile(tile, cell, r, c) {
    tile.innerText = cell.value;
    tile.classList.value = "tile";
    tile.style.backgroundColor = cell.color;
    tile.dataset.value = cell.value;
}

let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
document.getElementById("high-score").innerText = highScore;

function mergeTiles(r, c) {
    let cell = board[r][c];
    let queue = [[r, c]];
    let visited = new Set([`${r}-${c}`]);
    let sum = cell.value;

    while (queue.length > 0) {
        let [x, y] = queue.pop();
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            let nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < rows && ny >= 0 && ny < columns && !visited.has(`${nx}-${ny}`) && board[nx][ny].color === cell.color) {
                queue.push([nx, ny]);
                visited.add(`${nx}-${ny}`);
                sum += board[nx][ny].value;
                board[nx][ny].value = 0;
            }
        });
    }

    // Cập nhật giá trị ô chính
    board[r][c].value = sum;

    // Nếu giá trị mới > 500, đổi sang màu thứ 5
    if (sum > 150) {
        board[r][c].color = xColor;
    }

    // Cập nhật điểm số
    score = board.flat().reduce((acc, tile) => acc + tile.value, 0);
    document.getElementById("score").innerText = score;

    // Cập nhật high score nếu cần
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    document.getElementById("high-score").innerText = highScore;


    // Nếu tổng điểm > 3000, thêm màu thứ 4 vào game
    if (score > 300 && !colors.includes(extraColor)) colors.push(extraColor);

    applyGravity();
    renderBoard();
}

function generateRandomValue() {
    if (score > 1000) {
        let values = [4, 8];
        return values[Math.floor(Math.random() * values.length)];
    }
    return Math.random() < 0.5 ? 2 : 4;
}

function applyGravity() {
    for (let c = 0; c < columns; c++) {
        let stack = [];
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][c].value !== 0) {
                stack.push(board[r][c]);
            }
        }
        for (let r = rows - 1; r >= 0; r--) {
            board[r][c] = stack.length > 0 ? stack.shift() : { value: generateRandomValue(), color: colors[Math.floor(Math.random() * colors.length)] };
        }
    }
}

function restartGame() {
    document.getElementById("game-over-box").classList.add("hidden");
    score = 0;
    document.getElementById("score").innerText = score;
    setGame();
}

function checkGameOver() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let color = board[r][c].color;
            if ((r > 0 && board[r - 1][c].color === color) ||
                (c > 0 && board[r][c - 1].color === color) ||
                (r < rows - 1 && board[r + 1][c].color === color) ||
                (c < columns - 1 && board[r][c + 1].color === color)) {
                return;
            }
        }
    }
  
    document.getElementById("final-score").innerText = score;
    document.getElementById("final-high-score").innerText = highScore;
    document.getElementById("game-over-box").classList.remove("hidden");
}
