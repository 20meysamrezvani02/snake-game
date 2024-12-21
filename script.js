// تنظیمات بازی
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// اندازه‌ها
const gridSize = 10;
const canvasSize = 300;
const snakeSpeed = 100; // میلی‌ثانیه بین هر حرکت

// وضعیت بازی
let snake = [{ x: 50, y: 50 }];
let food = { x: 0, y: 0 };
let direction = "RIGHT";
let score = 0;
let gameInterval;

// شروع بازی
function startGame() {
    score = 0;
    snake = [{ x: 50, y: 50 }];
    direction = "RIGHT";
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, snakeSpeed);
}

// رسم صفحه بازی
function gameLoop() {
    moveSnake();
    if (isGameOver()) {
        alert("بازی تمام شد! امتیاز شما: " + score);
        startGame();
        return;
    }
    draw();
}

// حرکت مار
function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case "UP":
            head.y -= gridSize;
            break;
        case "DOWN":
            head.y += gridSize;
            break;
        case "LEFT":
            head.x -= gridSize;
            break;
        case "RIGHT":
            head.x += gridSize;
            break;
    }

    snake.unshift(head);

    // برخورد با غذا
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop();
    }
}

// بررسی برخورد با دیوار یا بدن مار
function isGameOver() {
    const head = snake[0];

    // برخورد با دیوار
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    // برخورد با بدن مار
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// رسم صفحه
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم مار
    snake.forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // رسم غذا
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // رسم امتیاز
    document.getElementById("score").innerText = "امتیاز: " + score;
}

// تولید مکان تصادفی برای غذا
function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food = { x, y };
}

// کنترل جهت حرکت مار با دکمه‌ها
document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
});

// شروع بازی به طور خودکار
startGame();
