const game = document.getElementById("game");
const controls = document.getElementById("show-controls")
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const scoreBoard = document.getElementById("score");
const menu = document.getElementById("menu");

let player1Score = 0;
let player2Score = 0;
let gameMode = "single"; 
let paddle1Y = 160, paddle2Y = 160;
let ballX = 392, ballY = 192;
let ballSpeedX = 4, ballSpeedY = 4;
const paddleSpeed = 5;
const ballSpeedIncrease = 1.0001;

let keys = {};

document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

function startGame(selectedMode) {
    gameMode = selectedMode;
    menu.style.display = "none";
    game.style.display = "block";
    controls.style.display = "block";
    updateGame();
}


function updateGame() {
    if (keys["w"] && paddle1Y > 0) paddle1Y -= paddleSpeed;
    if (keys["s"] && paddle1Y < game.clientHeight - paddle1.offsetHeight) paddle1Y += paddleSpeed;

    if (gameMode === "two") {
        if (keys["ArrowUp"] && paddle2Y > 0) paddle2Y -= paddleSpeed;
        if (keys["ArrowDown"] && paddle2Y < game.clientHeight - paddle2.offsetHeight) paddle2Y += paddleSpeed;
    } else {
        if (ballY < paddle2Y + paddle2.offsetHeight / 2 && paddle2Y > 0) paddle2Y -= paddleSpeed;
        else if (ballY > paddle2Y + paddle2.offsetHeight / 2 && paddle2Y < game.clientHeight - paddle2.offsetHeight) paddle2Y += paddleSpeed;
    }

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    ballSpeedX *= ballSpeedIncrease;
    ballSpeedY *= ballSpeedIncrease;

    if (ballY <= 0 || ballY >= game.clientHeight - ball.offsetHeight) ballSpeedY *= -1;

    if (ballX <= paddle1.offsetLeft + paddle1.offsetWidth && ballY + ball.offsetHeight >= paddle1Y && ballY <= paddle1Y + paddle1.offsetHeight) {
        ballSpeedX *= -1;
    }
    if (ballX + ball.offsetWidth >= paddle2.offsetLeft && ballY + ball.offsetHeight >= paddle2Y && ballY <= paddle2Y + paddle2.offsetHeight) {
        ballSpeedX *= -1;
    }

    if (ballX <= 0) {
        player2Score++;
        resetBall();
    } else if (ballX >= game.clientWidth - ball.offsetWidth) {
        player1Score++;
        resetBall();
    }

    scoreBoard.textContent = `${player1Score}  ${player2Score}`;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(updateGame);
}

function goBack() {
    window.history.back();
}

function resetBall() {
    ballX = game.clientWidth / 2 - ball.offsetWidth / 2;
    ballY = game.clientHeight / 2 - ball.offsetHeight / 2;
    ballSpeedX *= -1;
}
