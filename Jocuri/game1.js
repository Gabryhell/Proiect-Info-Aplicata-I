// Game Elements
const game = document.getElementById("game");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const scoreBoard = document.getElementById("score");
const modeSelector = document.getElementById("mode-selector");
const menu = document.getElementById("menu");

// Game State
let player1Score = 0;
let player2Score = 0;
let gameMode = "single";  // single or two
let paddle1Y = 160, paddle2Y = 160;
let ballX = 392, ballY = 192;
let ballSpeedX = 4, ballSpeedY = 4;
const paddleSpeed = 5;

// Control player paddles
let keys = {};

document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

// Function to start the game
function startGame(selectedMode) {
    gameMode = selectedMode;
    modeSelector.textContent = `Mode: ${gameMode === "single" ? "Single Player" : "Two Player"}`;
    menu.style.display = "none";
    game.style.display = "block";
    updateGame(); // Start the game loop
}

// Update paddles and ball
function updateGame() {
    // Move Player 1 Paddle (W/S keys)
    if (keys["w"] && paddle1Y > 0) paddle1Y -= paddleSpeed;
    if (keys["s"] && paddle1Y < game.clientHeight - paddle1.offsetHeight) paddle1Y += paddleSpeed;

    // Move Player 2 Paddle (Up/Down keys in two-player mode)
    if (gameMode === "two") {
        if (keys["ArrowUp"] && paddle2Y > 0) paddle2Y -= paddleSpeed;
        if (keys["ArrowDown"] && paddle2Y < game.clientHeight - paddle2.offsetHeight) paddle2Y += paddleSpeed;
    } else {
        // Auto-move Player 2 paddle to follow the ball in single-player mode
        if (ballY < paddle2Y + paddle2.offsetHeight / 2 && paddle2Y > 0) paddle2Y -= paddleSpeed;
        else if (ballY > paddle2Y + paddle2.offsetHeight / 2 && paddle2Y < game.clientHeight - paddle2.offsetHeight) paddle2Y += paddleSpeed;
    }

    // Update Paddle Positions
    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;

    // Ball Movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball Collision with top and bottom walls
    if (ballY <= 0 || ballY >= game.clientHeight - ball.offsetHeight) ballSpeedY *= -1;

    // Ball Collision with paddles
    if (ballX <= paddle1.offsetLeft + paddle1.offsetWidth && ballY + ball.offsetHeight >= paddle1Y && ballY <= paddle1Y + paddle1.offsetHeight) {
        ballSpeedX *= -1;
    }
    if (ballX + ball.offsetWidth >= paddle2.offsetLeft && ballY + ball.offsetHeight >= paddle2Y && ballY <= paddle2Y + paddle2.offsetHeight) {
        ballSpeedX *= -1;
    }

    // Check for scoring
    if (ballX <= 0) {
        player2Score++;
        resetBall();
    } else if (ballX >= game.clientWidth - ball.offsetWidth) {
        player1Score++;
        resetBall();
    }

    // Update Score Display
    scoreBoard.textContent = `Player 1: ${player1Score} | Player 2: ${player2Score}`;

    // Update Ball Position
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(updateGame);
}

// Reset Ball Position after scoring
function resetBall() {
    ballX = game.clientWidth / 2 - ball.offsetWidth / 2;
    ballY = game.clientHeight / 2 - ball.offsetHeight / 2;
    ballSpeedX *= -1; // Reverse direction
}
