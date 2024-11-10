const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размер канваса на весь экран
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2 - 25, y: canvas.height - 120, width: 50, height: 100, speed: 5, movingLeft: false, movingRight: false };
let obstacles = [];
let gameSpeed = 2;  // Уменьшенная скорость игры
let score = 0;
let gameOver = false;

// Размеры красных зон
const zoneWidth = 50; // Ширина красной зоны

// Обработка кнопок мыши
document.getElementById('left').addEventListener('mousedown', () => player.movingLeft = true);
document.getElementById('left').addEventListener('mouseup', () => player.movingLeft = false);
document.getElementById('right').addEventListener('mousedown', () => player.movingRight = true);
document.getElementById('right').addEventListener('mouseup', () => player.movingRight = false);

// Обработка клавиш
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.movingLeft = true;
    }
    if (e.key === 'ArrowRight') {
        player.movingRight = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        player.movingLeft = false;
    }
    if (e.key === 'ArrowRight') {
        player.movingRight = false;
    }
});

// Создание препятствий
function addObstacle() {
    let x = Math.random() * (canvas.width - player.width - zoneWidth * 2) + zoneWidth; // Исключаем красные зоны
    let width = Math.random() * 40 + 30;
    let height = Math.random() * 50 + 50;
    let color = getRandomColor();
    obstacles.push({ x, y: -height, width, height, color });
}

// Получение случайного цвета
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Обновление игры
function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем дорогу
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем красные зоны
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, zoneWidth, canvas.height); // Левая зона
    ctx.fillRect(canvas.width - zoneWidth, 0, zoneWidth, canvas.height); // Правая зона

    // Проверка на столкновение с красными зонами
    if (player.x < zoneWidth || player.x + player.width > canvas.width - zoneWidth) {
        gameOver = true;
        alert(`Игра окончена! Ваш счёт: ${score}`);
        if (confirm("Начать заново?")) {
            restartGame();
        }
        return;
    }

    // Управление машиной
    if (player.movingLeft && player.x > zoneWidth) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x < canvas.width - player.width - zoneWidth) {
        player.x += player.speed;
    }

    // Отрисовка машины игрока
    drawPlayerCar(player.x, player.y);

    // Обновление и отрисовка препятствий
    for (let obstacle of obstacles) {
        obstacle.y += gameSpeed;
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Проверка столкновений с машиной игрока
        if (
            obstacle.y + obstacle.height > player.y &&
            obstacle.y < player.y + player.height &&
            obstacle.x < player.x + player.width &&
            obstacle.x + obstacle.width > player.x
        ) {
            gameOver = true;
            alert(`Игра окончена! Ваш счёт: ${score}`);
            if (confirm("Начать заново?")) {
                restartGame();
            }
            return;
        }
    }

    // Удаление препятствий за экраном
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    // Добавление новых препятствий
    if (Math.random() < 0.02) addObstacle();

    // Увеличение счёта и скорости
    score++;
    if (score % 500 === 0) gameSpeed += 0.5;

    // Отображение счёта
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Счёт: ${score}`, 10, 30);

    // Обновление экрана
    requestAnimationFrame(update);
}

// Функция для рисования машины игрока
function drawPlayerCar(x, y) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 50, 80);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + 12, y + 75, 10, 0, Math.PI * 2);
    ctx.arc(x + 38, y + 75, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.fillRect(x + 10, y + 10, 15, 25);
    ctx.fillRect(x + 25, y + 10, 15, 25);
}

// Функция для рестарта игры
function restartGame() {
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 120;
    obstacles = [];
    gameSpeed = 2;
    score = 0;
    gameOver = false;
    update();
}

// Инициализация игры
update();
