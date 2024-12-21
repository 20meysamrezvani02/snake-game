const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const touchArea = document.getElementById("touch-area");
const scoreDisplay = document.getElementById("score");

const gridSize = 20;
const canvasSize = 400;
const gridCount = canvasSize / gridSize;

let snake = [{ x: 5, y: 5 }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;  // متغیر برای نگهداری امتیاز
let gameInterval;
let speed = 130;  // مدت زمان بین فریم‌ها برای تنظیم سرعت بازی (هر 100 میلی‌ثانیه یک فریم)

function generateFood() {
  const x = Math.floor(Math.random() * gridCount);
  const y = Math.floor(Math.random() * gridCount);
  return { x, y };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // رسم غذا
  ctx.fillStyle = 'Yellow';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // رسم مار
  // سر مار با رنگ متفاوت
  ctx.fillStyle = 'white';  // رنگ سر مار
  ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);

  // بدن مار با رنگ متفاوت
  ctx.fillStyle = 'green';  // رنگ بدن مار
  for (let i = 1; i < snake.length; i++) {
    ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
  }

  // حرکت مار
  let head = { ...snake[0] };
  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  // برخورد با دیوار و بازگشت از طرف مخالف
  if (head.x < 0) head.x = gridCount - 1;  // برخورد با دیوار چپ
  if (head.x >= gridCount) head.x = 0;     // برخورد با دیوار راست
  if (head.y < 0) head.y = gridCount - 1;  // برخورد با دیوار بالا
  if (head.y >= gridCount) head.y = 0;     // برخورد با دیوار پایین

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score += 10;  // افزایش امتیاز
    scoreDisplay.textContent = `امتیاز: ${score}`;  // به روز رسانی نمایش امتیاز

    // افزایش سرعت بازی پس از خوردن غذا
    speed = Math.max(50, speed - 10);  // سرعت را کاهش دهید تا بازی سریعتر شود (حداقل 50 میلی‌ثانیه)
    clearInterval(gameInterval);  // متوقف کردن تایمر قبلی
    gameInterval = setInterval(draw, speed);  // شروع تایمر جدید با سرعت بالاتر
  } else {
    snake.pop();
  }

  // بررسی برخورد مار با خود
  if (isCollision(head)) {
    clearInterval(gameInterval);
    alert(`بازی تمام شد! امتیاز شما: ${score}`);
  }
}

function isCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function startGame() {
  gameInterval = setInterval(draw, speed);
}

// متغیرها برای ذخیره موقعیت‌های لمسی
let startX = 0;
let startY = 0;
let isTouching = false;

// تشخیص جهت کشیدن انگشت برای تغییر جهت حرکت مار
function handleTouchMove(event) {
  if (!isTouching) return;

  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;

  const deltaX = touchX - startX;
  const deltaY = touchY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction !== 'LEFT') {
      direction = 'RIGHT';
    } else if (deltaX < 0 && direction !== 'RIGHT') {
      direction = 'LEFT';
    }
  } else {
    if (deltaY > 0 && direction !== 'UP') {
      direction = 'DOWN';
    } else if (deltaY < 0 && direction !== 'DOWN') {
      direction = 'UP';
    }
  }

  // به روزرسانی موقعیت شروع برای حرکت بعدی
  startX = touchX;
  startY = touchY;
}

// شروع ردیابی لمسی
touchArea.addEventListener('touchstart', (event) => {
  isTouching = true;
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
});

// پایان ردیابی لمسی
touchArea.addEventListener('touchend', () => {
  isTouching = false;
});

// ردیابی حرکت‌های لمسی
touchArea.addEventListener('touchmove', handleTouchMove);

startGame();
