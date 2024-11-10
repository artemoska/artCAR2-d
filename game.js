const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2 - 25, y: canvas.height - 120, width: 50, height: 100, speed: 5, movingLeft: false, movingRight: false };
let obstacles = [];
let roadLines = [];
let gameSpeed = 2;
let score = 0;
let gameOver = false;

const roadColor = '#555';
const lineColor = 'white';

// Управление стрелками
document.getElementById('left').addEventListener('mousedown', () => player.movingLeft = true);
document.getElementById('left').addEventListener('mouseup', () => player.movingLeft = false);
document.getElementById('right').addEventListener('mousedown', () => player.movingRight = true);
document.getElementById('right').addEventListener('mouseup', () => player.movingRight = false);

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
    let x = Math.random() * (canvas.width - player.width);
    let width = Math.random() * 40 + 30;
    let height = Math.random() * 50 + 50;
    let color = getRandomColor();
    obstacles.push({ x, y: -height, width, height, color });
}

// Функция для генерации случайных цветов
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Функция для создания полос дороги
function createRoadLines() {
    roadLines = [
        { x: canvas.width / 6 - 5, y: -50, width: 10, height: 50 }, // 1 полоса
        { x: canvas.width / 3 - 5, y: -50, width: 10, height: 50 }, // 2 полоса
        { x: canvas.width / 2 - 5, y: -50, width: 10, height: 50 }, // 3 полоса (центральная)
        { x: canvas.width / 3 * 2 - 5, y: -50, width: 10, height: 50 }, // 4 полоса
        { x: canvas.width / 6 * 5 - 5, y: -50, width: 10, height: 50 }  // 5 полоса
    ];
}

// Основная игровая логика
function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = roadColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Заполняем фон

    // Отрисовка полос
    ctx.fillStyle = lineColor;
    for (let line of roadLines) {
        line.y += gameSpeed;
        ctx.fillRect(line.x, line.y, line.width, line.height);
    }

    roadLines = roadLines.filter(line => line.y < canvas.height);

    // Добавление новых полос, если они прошли экран
    if (roadLines[roadLines.length - 1].y > 100) {
        createRoadLines();
    }

    // Управление движением автомобиля
    if (player.movingLeft && player.x > canvas.width / 6) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x < canvas.width - player.width - canvas.width / 6) {
        player.x += player.speed;
    }

    // Отрисовка автомобиля
    drawPlayerCar(player.x, player.y);

    // Обновление и отрисовка препятствий
    for (let obstacle of obstacles) {
        obstacle.y += gameSpeed;
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

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

    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    if (Math.random() < 0.02) addObstacle();

    score++;
    if (score % 500 === 0) gameSpeed += 0.5;

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Счёт: ${score}`, 10, 30);

    requestAnimationFrame(update);
}

// Функция для рисования машины
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

// Рестарт игры
function restartGame() {
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 120;
    obstacles = [];
    roadLines = [];
    gameSpeed = 2;
    score = 0;
    gameOver = false;
    createRoadLines();
    update();
}

// Инициализация
createRoadLines();
update();
