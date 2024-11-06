// Initialize grids and players' data
const player1Board = document.getElementById('player1-board');
const player2Board = document.getElementById('player2-board');
const resetButton = document.getElementById('reset-button');
const player1ShipsLeft = document.getElementById('player1-ships-left');
const player2ShipsLeft = document.getElementById('player2-ships-left');

const gridSize = 10;
let currentPlayer = 1;
let player1Ships = [];
let player2Ships = [];
let totalShips = 0; // Number of ships for each player (same for both players)

// Initialize boards and add event listeners
function initializeBoard(boardElement, playerShips) {
    boardElement.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        boardElement.appendChild(cell);
    }
}

// Function to enable or disable click events based on the current player
function updateBoardInteractivity() {
    if (currentPlayer === 1) {
        setBoardClickable(player1Board, false);  // Disable Player 1's board
        setBoardClickable(player2Board, true);   // Enable Player 2's board
    } else {
        setBoardClickable(player1Board, true);   // Enable Player 1's board
        setBoardClickable(player2Board, false);  // Disable Player 2's board
    }
}

// Set board cells as clickable or not
function setBoardClickable(boardElement, isClickable) {
    if (isClickable) {
        boardElement.classList.remove('inactive');
        boardElement.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', cellClickHandler);
        });
    } else {
        boardElement.classList.add('inactive');
        boardElement.querySelectorAll('.cell').forEach(cell => {
            cell.removeEventListener('click', cellClickHandler);
        });
    }
}

// Handle cell click for both players
function cellClickHandler(event) {
    const cell = event.target;
    const opponentShips = currentPlayer === 1 ? player2Ships : player1Ships;
    const shipsLeftDisplay = currentPlayer === 1 ? player2ShipsLeft : player1ShipsLeft;

    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
        return;  // Ignore already clicked cells
    }

    const cellIndex = cell.dataset.index;
    if (opponentShips.includes(Number(cellIndex))) {
        cell.classList.add('hit');
        
        // Decrease the opponent's ship count and update display
        if (currentPlayer === 1) {
            player2ShipsRemaining--;
            player2ShipsLeft.textContent = player2ShipsRemaining;
        } else {
            player1ShipsRemaining--;
            player1ShipsLeft.textContent = player1ShipsRemaining;
        }

        // Check if the game is over
        if (player1ShipsRemaining === 0) {
            alert("Player 2 castiga!");
            resetGame();
            return;
        }
        else if(player2ShipsRemaining === 0){
            alert("Player 1 castiga!");
            resetGame();
            return;
        }

        // Stay on the same player's turn since they hit a ship
    } else {
        cell.classList.add('miss');
        // Toggle player only on a miss
        togglePlayer();
    }
}

// Toggle player turn and update board view
function togglePlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateBoardInteractivity();
}

// Randomly place ships for players with the same number
function placeShipsRandomly(playerShips) {
    const shipCount = Math.floor(Math.random() * 4) + 2;  // Random number between 2 and 5
    while (playerShips.length < shipCount) {
        const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
        if (!playerShips.includes(randomIndex)) {
            playerShips.push(randomIndex);
        }
    }
    return shipCount;
}

// Reset the game
function resetGame() {
    player1Ships = [];
    player2Ships = [];
    
    // Generate a random number of ships and assign the same number to both players
    totalShips = Math.floor(Math.random() * 4) + 2;  // Random number between 2 and 5
    player1ShipsRemaining = totalShips;
    player2ShipsRemaining = totalShips;

    // Place ships for both players
    placeShipsRandomly(player1Ships);
    placeShipsRandomly(player2Ships);

    initializeBoard(player1Board, player1Ships);
    initializeBoard(player2Board, player2Ships);

    // Update ship count displays
    player1ShipsLeft.textContent = player1ShipsRemaining;
    player2ShipsLeft.textContent = player2ShipsRemaining;

    currentPlayer = 1;
    updateBoardInteractivity();
}

// Initialize the game
resetGame();
resetButton.addEventListener('click', resetGame);
