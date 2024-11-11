const player1Board = document.getElementById('player1-board');
const player2Board = document.getElementById('player2-board');
const resetButton = document.getElementById('reset-button');
const player1ShipsLeft = document.getElementById('player1-ships-left');
const player2ShipsLeft = document.getElementById('player2-ships-left');

const gridSize = 10;
let currentPlayer = 1;
let player1Ships = [];
let player2Ships = [];
let player1ShipsRemaining, player2ShipsRemaining;



const shipLengths = [2, 3, 4];  


function initializeBoard(boardElement) {
    boardElement.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        boardElement.appendChild(cell);
    }
}

function updateBoardInteractivity() {
    if (currentPlayer === 1) {
        setBoardClickable(player1Board, false);
        setBoardClickable(player2Board, true);
    } else {
        setBoardClickable(player1Board, true);
        setBoardClickable(player2Board, false);
    }
}

function setBoardClickable(boardElement, isClickable) {
    boardElement.classList.toggle('inactive', !isClickable);
    boardElement.querySelectorAll('.cell').forEach(cell => {
        if (isClickable) {
            cell.addEventListener('click', cellClickHandler);
        } else {
            cell.removeEventListener('click', cellClickHandler);
        }
    });
}

function cellClickHandler(event) {
    const cell = event.target;
    const opponentShips = currentPlayer === 1 ? player2Ships : player1Ships;
    const shipsLeftDisplay = currentPlayer === 1 ? player2ShipsLeft : player1ShipsLeft;

    if (cell.classList.contains('hit') || cell.classList.contains('miss')) return; 

    const cellIndex = Number(cell.dataset.index);
    let hitShip = false;

    for (const ship of opponentShips) {
        const cellIndexPosition = ship.indexOf(cellIndex);
        if (cellIndexPosition !== -1) {
            cell.classList.add('hit');
            ship[cellIndexPosition] = null;  
            hitShip = true;

            if (ship.every(part => part === null)) {
                updateShipsRemaining();
            }
            break;
        }
    }

    if (!hitShip) {
        cell.classList.add('miss');
        togglePlayer();
    }
}

function updateShipsRemaining() {
    if (currentPlayer === 1) {
        player2ShipsRemaining--;
        player2ShipsLeft.textContent = player2ShipsRemaining;
    } else {
        player1ShipsRemaining--;
        player1ShipsLeft.textContent = player1ShipsRemaining;
    }

    if (player1ShipsRemaining === 0 || player2ShipsRemaining === 0) {
        alert(currentPlayer === 1 ? "Player 1 wins!" : "Player 2 wins!");
        resetGame();
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateBoardInteractivity();
}

function placeShipsRandomly(playerShips) {
    for (let length of shipLengths) {
        let placed = false;
        while (!placed) {
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const startIndex = Math.floor(Math.random() * gridSize * gridSize);

            const shipPositions = [];
            for (let i = 0; i < length; i++) {
                let index;
                if (orientation === 'horizontal') {
                    index = startIndex + i;
                    if (Math.floor(startIndex / gridSize) !== Math.floor(index / gridSize)) break;
                } else {
                    index = startIndex + i * gridSize;
                    if (index >= gridSize * gridSize) break;
                }
                shipPositions.push(index);
            }

            if (shipPositions.length === length && shipPositions.every(pos => !playerShips.flat().includes(pos))) {
                playerShips.push(shipPositions);
                placed = true;
            }
        }
    }
}

function resetGame() {
    player1Ships = [];
    player2Ships = [];

    player1ShipsRemaining = shipLengths.length;
    player2ShipsRemaining = shipLengths.length;

    placeShipsRandomly(player1Ships);
    placeShipsRandomly(player2Ships);

    initializeBoard(player1Board);
    initializeBoard(player2Board);

    player1ShipsLeft.textContent = player1ShipsRemaining;
    player2ShipsLeft.textContent = player2ShipsRemaining;

    currentPlayer = 1;
    updateBoardInteractivity();
}

resetGame();
resetButton.addEventListener('click', resetGame);
