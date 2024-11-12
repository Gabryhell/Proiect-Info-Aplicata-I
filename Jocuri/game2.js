const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [[5, 5]];
let score = 0;
let gameSpeed = 100;
let lastMoveTime = 0;
let growSnake = false;
let directionChanged = false;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    gameOver = true;
    alert("Game Over! Click OK to play again.");
    location.reload();
}

const changeDirection = (e) => {
    if (directionChanged) return;

    if ((e.key === "ArrowUp" || e.key === "w") && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
        directionChanged = true;
    } else if ((e.key === "ArrowDown" || e.key === "s") && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
        directionChanged = true;
    } else if ((e.key === "ArrowLeft" || e.key === "a") && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
        directionChanged = true;
    } else if ((e.key === "ArrowRight" || e.key === "d") && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
        directionChanged = true;
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const gameLoop = (currentTime) => {
    if (gameOver) return;

    if (currentTime - lastMoveTime > gameSpeed) {
        lastMoveTime = currentTime;
        initGame();
    }
    requestAnimationFrame(gameLoop);
}


const initGame = () => {
    directionChanged = false;

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        handleGameOver();
        return;
    }
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            handleGameOver();
            return;
        }
    }

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        growSnake = true;
        score++;
        highScore = Math.max(score, highScore);
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeBody.unshift([snakeX, snakeY]);

    if (!growSnake) {
        snakeBody.pop();
    } else {
        growSnake = false;
    }
    renderGame();
}

const renderGame = () => {
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;
    snakeBody.forEach((part, index) => {
        html += `<div class="head" style="grid-area: ${part[1]} / ${part[0]}; transition: all 0.1s ease;"></div>`;
    });
    playBoard.innerHTML = html;
}

function goBack() {
    window.history.back();
}

updateFoodPosition();
requestAnimationFrame(gameLoop);
document.addEventListener("keydown", changeDirection);
