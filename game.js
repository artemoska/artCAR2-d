const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth; // Полный экран по ширине
canvas.height = window.innerHeight; // Полный экран по высоте

let player = { x: canvas.width / 2 - 25, y: canvas.height - 120, width: 50, height: 100, speed: 5, movingLeft: false, movingRight: false };
let obstacles = [];
let roadLines = [];
let gameSpeed = 4;
let score = 0;
let gameOver = false;

// Задний фон (дорога)
const roadColor = '#555'; // Цвет дороги
const lineColor = 'white'; // Цвет полос

// Управление машиной с помощью стрелок
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
    let x = Math.random() * (canvas.width - player.width); // Случайная позиция по X
    let width = Math.random() * 40 + 30; // Случайная ширина машины
    let height = Math.random() * 50 + 50; // Случайная высота машины
    let color = getRandomColor(); // Случайный цвет
    obstacles.push({ x, y: -height, width, height, color });
}

// Создание полос на дороге
function addRoadLine() {
    let x = Math.random() * (canvas.width - 10); // Случайная позиция полосы
    roadLines.push({ x, y: -50, width: 10, height: 50 });
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
    ctx.fillStyle = roadColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Фон дороги

    // Рисуем несколько полос
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = lineColor;
        ctx.fillRect(canvas.width / 5 * i + 10, 0, 10, canvas.height); // Рисуем полосы
    }

    // Движение полос на дороге
    for (let line of roadLines) {
        line.y += gameSpeed;
        ctx.fillStyle = lineColor;
        ctx.fillRect(line.x, line.y, line.width, line.height); // Полосы на дороге
    }

    // Удаление полос за экраном
    roadLines = roadLines.filter(line => line.y < canvas.height);

    // Добавление новых полос
    if (Math.random() < 0.1) addRoadLine();

    // Управление машиной
    if (player.movingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Отрисовка машины игрока
    drawPlayerCar(player.x, player.y);

    // Обновление и отрисовка препятствий
    for (let obstacle of obstacles) {
        obstacle.y += gameSpeed;
        ctx.fillStyle = obstacle.color; // Препятствие с случайным цветом
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Проверка столкновений
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
    // Основная часть кузова машины
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 50, 80); // Основной прямоугольник

    // Колеса (круги)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + 12, y + 75, 10, 0, Math.PI * 2); // Левое колесо
    ctx.arc(x + 38, y + 75, 10, 0, Math.PI * 2); // Правое колесо
    ctx.fill();

    // Окна (маленькие прямоугольники)
    ctx.fillStyle = 'white';
    ctx.fillRect(x + 10, y + 10, 15, 25); // Левое окно
    ctx.fillRect(x + 25, y + 10, 15, 25); // Правое окно
}

// Функция для рестарта игры
function restartGame() {
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 120;
    obstacles = [];
    roadLines = [];
    gameSpeed = 4;
    score = 0;
    gameOver = false;
    update();
}

// Инициализация игры
addRoadLine();
update();
