const player1Board = document.querySelector("#player1-board .grid");
const player2Board = document.querySelector("#player2-board .grid");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");

let player1Ships = [];
let player2Ships = [];
let currentPlayer = 1;
let gameOver = false;

const GRID_SIZE = 100;  // 10x10 grid
const SHIP_COUNT = 5;   // 5 ships per player

// Initialize game
function initializeGame() {
  player1Ships = generateRandomShips();
  player2Ships = generateRandomShips();
  currentPlayer = 1;
  gameOver = false;
  message.textContent = "Player 1's turn!";
  createBoard(player1Board);
  createBoard(player2Board);
}

// Generate random ship positions
function generateRandomShips() {
  let ships = new Set();
  while (ships.size < SHIP_COUNT) {
    ships.add(Math.floor(Math.random() * GRID_SIZE)); // Random cell in 10x10 grid
  }
  return Array.from(ships);
}

// Create a 10x10 grid and add click listeners
function createBoard(board) {
  board.innerHTML = "";
  for (let i = 0; i < GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;

    cell.addEventListener("click", () => handleCellClick(cell, board));

    board.appendChild(cell);
  }
}

// Handle cell clicks
function handleCellClick(cell, board) {
  if (gameOver || cell.classList.contains("hit") || cell.classList.contains("miss")) return;

  const index = parseInt(cell.dataset.index);
  const opponentShips = currentPlayer === 1 ? player2Ships : player1Ships;

  if (opponentShips.includes(index)) {
    cell.classList.add("hit");
    message.textContent = `Player ${currentPlayer} hit a ship!`;
    opponentShips.splice(opponentShips.indexOf(index), 1);

    // Check if game over
    if (opponentShips.length === 0) {
      gameOver = true;
      message.textContent = `Player ${currentPlayer} wins!`;
      return;
    }
  } else {
    cell.classList.add("miss");
    message.textContent = `Player ${currentPlayer} missed!`;
    switchPlayer();
  }
}

// Switch player turns
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  message.textContent = `Player ${currentPlayer}'s turn!`;
}

// Restart game
restartBtn.addEventListener("click", initializeGame);

// Initialize the game when the page loads
initializeGame();
