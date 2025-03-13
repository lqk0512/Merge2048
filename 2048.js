var board;
var score = 0;
var rows = 5;
var columns = 5;
var colors = ["#EEE4DA", "#F2B179", "#f59575"];
var extraColor = "#EDC22E";

window.onload = function() {
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
    board[r][c].value = sum;
    score = board.flat().reduce((acc, tile) => acc + tile.value, 0);
    if (score > 3000 && !colors.includes(extraColor)) colors.push(extraColor);
    applyGravity();
    renderBoard();
    document.getElementById("score").innerText = score;

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
            if (stack.length > 0) {
                board[r][c] = stack.shift();
            } else {
                let color = colors[Math.floor(Math.random() * colors.length)];
                let value = Math.random() < 0.5 ? 2 : 4; // Ngẫu nhiên chọn 2 hoặc 4
                board[r][c] = { value: value, color: color };
            }
        }
    }
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
    alert("Game Over! Your score: " + score);
    setGame();
}
