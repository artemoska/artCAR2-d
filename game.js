const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let player = { x: 180, y: 500, width: 50, height: 100, speed: 5 };
let obstacles = [];
let roadLines = [];
let gameSpeed = 4;
let score = 0;
let gameOver = false;

// Загрузка изображений
const playerImg = new Image();
playerImg.src = 'player-car.png'; // Изображение машины игрока

const obstacleImg = new Image();
obstacleImg.src = 'obstacle-car.png'; // Изображение препятствия (другой машины)

// Загрузка звуков
const crashSound = new Audio('crash.mp3'); // Звук столкновения
const backgroundMusic = new Audio('background-music.mp3'); // Фоновая музыка
backgroundMusic.loop = true;

// Запуск фоновой музыки
backgroundMusic.play();

// Управление машиной
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    }
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
});

// Создание препятствий
function addObstacle() {
    let x = Math.random() * (canvas.width - player.width);
    obstacles.push({ x, y: -100, width: 50, height: 100 });
}

// Создание полос на дороге
function addRoadLine() {
    roadLines.push({ x: canvas.width / 2 - 5, y: -50, width: 10, height: 50 });
}

// Обновление игры
function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Движение полос на дороге
    for (let line of roadLines) {
        line.y += gameSpeed;
        ctx.fillStyle = 'white';
        ctx.fillRect(line.x, line.y, line.width, line.height);
    }

    // Удаление полос за экраном
    roadLines = roadLines.filter(line => line.y < canvas.height);

    // Добавление новых полос
    if (Math.random() < 0.1) addRoadLine();

    // Отрисовка машины игрока
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Обновление и отрисовка препятствий
    for (let obstacle of obstacles) {
        obstacle.y += gameSpeed;
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Проверка столкновений
        if (
            obstacle.y + obstacle.height > player.y &&
            obstacle.y < player.y + player.height &&
            obstacle.x < player.x + player.width &&
            obstacle.x + obstacle.width > player.x
        ) {
            gameOver = true;
            crashSound.play(); // Звук столкновения
            backgroundMusic.pause(); // Остановка фоновой музыки
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

// Функция для рестарта игры
function restartGame() {
    player.x = 180;
    player.y = 500;
    obstacles = [];
    roadLines = [];
    gameSpeed = 4;
    score = 0;
    gameOver = false;
    backgroundMusic.play();
    update();
}

// Инициализация игры
addRoadLine();
update();
