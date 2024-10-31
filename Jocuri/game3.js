let playerBoard = [];
let opponentBoard = [];
let playerScore = 0;
let opponentScore = 0;
let currentPlayer = 'player';
let gameMode = '';

const boardSize = 10;
let shipSizes = []; // This will hold the randomized ship sizes for each game
let totalShipCells = 0; // Sum of all ship cells for scoring purposes

document.getElementById('player-score').textContent = playerScore;
document.getElementById('opponent-score').textContent = opponentScore;

function createBoard(board, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    board.length = 0;
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            container.appendChild(cell);
            row.push({ hasShip: false, hit: false });
        }
        board.push(row);
    }
}

function generateRandomShipSizes() {
    const numShips = Math.floor(Math.random() * 5) + 2; // Random number of ships between 2 and 6
    shipSizes = [];
    totalShipCells = 0;

    for (let i = 0; i < numShips; i++) {
        const shipLength = Math.floor(Math.random() * 4) + 2; // Random length between 2 and 5
        shipSizes.push(shipLength);
        totalShipCells += shipLength;
    }
}

function placeShips(board, isPlayer = false) {
    for (const size of shipSizes) {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);
            const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            if (canPlaceShip(board, row, col, size, direction)) {
                placeShip(board, row, col, size, direction, isPlayer);
                placed = true;
            }
        }
    }
}

function canPlaceShip(board, row, col, size, direction) {
    if (direction === 'horizontal') {
        if (col + size > boardSize) return false;
        for (let i = 0; i < size; i++) {
            if (board[row][col + i].hasShip) return false;
        }
    } else {
        if (row + size > boardSize) return false;
        for (let i = 0; i < size; i++) {
            if (board[row + i][col].hasShip) return false;
        }
    }
    return true;
}

function placeShip(board, row, col, size, direction, isPlayer) {
    for (let i = 0; i < size; i++) {
        if (direction === 'horizontal') {
            board[row][col + i].hasShip = true;
            if (isPlayer && gameMode === 'single') {
                document.querySelector(`#player-board .cell[data-row="${row}"][data-col="${col + i}"]`).classList.add('ship');
            }
        } else {
            board[row + i][col].hasShip = true;
            if (isPlayer && gameMode === 'single') {
                document.querySelector(`#player-board .cell[data-row="${row + i}"][data-col="${col}"]`).classList.add('ship');
            }
        }
    }
}

function startGame(mode) {
    gameMode = mode;
    currentPlayer = 'player';
    playerScore = 0;
    opponentScore = 0;
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('opponent-score').textContent = opponentScore;

    document.getElementById('mode-selection').style.display = 'none';
    document.getElementById('in-game-options').style.display = 'block';

    createBoard(playerBoard, 'player-board');
    createBoard(opponentBoard, 'opponent-board');

    generateRandomShipSizes(); // Generate new random ship sizes for this game

    placeShips(playerBoard, true);
    placeShips(opponentBoard);
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (currentPlayer === 'player') {
        makeMove(opponentBoard, row, col);
        currentPlayer = 'opponent';
        if (gameMode === 'single') opponentMove();
    } else if (gameMode === 'two') {
        makeMove(playerBoard, row, col);
        currentPlayer = 'player';
    }
}

function makeMove(board, row, col) {
    const cell = document.querySelector(
        `#${currentPlayer === 'player' ? 'opponent' : 'player'}-board .cell[data-row="${row}"][data-col="${col}"]`
    );
    if (!board[row][col].hit) {
        board[row][col].hit = true;
        if (board[row][col].hasShip) {
            cell.classList.add('hit');
            if (currentPlayer === 'player') playerScore++;
            else opponentScore++;
            if (currentPlayer === 'opponent' && gameMode === 'single') {
                document.querySelector(`#player-board .cell[data-row="${row}"][data-col="${col}"]`).classList.add('hit');
            }
            updateScore();
        } else {
            cell.classList.add('miss');
        }
        checkGameEnd();
    }
}

function opponentMove() {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (!playerBoard[row][col].hit) {
        makeMove(playerBoard, row, col);
        currentPlayer = 'player';
    } else {
        opponentMove();
    }
}

function updateScore() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('opponent-score').textContent = opponentScore;
}

function checkGameEnd() {
    if (playerScore === totalShipCells) {
        alert("Congratulations! You win! 🎉");
        endGame();
    } else if (opponentScore === totalShipCells) {
        alert("Game over! The opponent wins.");
        endGame();
    }
}

function endGame() {
    document.getElementById('in-game-options').style.display = 'block';
    document.getElementById('mode-selection').style.display = 'none';
    playerScore = 0;
    opponentScore = 0;
}

function playAgain() {
    startGame(gameMode); // Restart the game with the current mode
}

function goBack() {
    document.getElementById('player-board').innerHTML = '';
    document.getElementById('opponent-board').innerHTML = '';
    document.getElementById('mode-selection').style.display = 'block';
    document.getElementById('in-game-options').style.display = 'none';
}
