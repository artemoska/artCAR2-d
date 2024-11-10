const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let player = { x: 180, y: 500, width: 40, height: 80, speed: 5 };
let obstacles = [];
let gameSpeed = 2;
let score = 0;
let gameOver = false;

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
    let width = 60;
    let x = Math.random() * (canvas.width - width);
    obstacles.push({ x, y: -100, width, height: 80 });
}

function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Движение игрока
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Обновление и отрисовка препятствий
    for (let obstacle of obstacles) {
        obstacle.y += gameSpeed;
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Проверка столкновений
        if (obstacle.y + obstacle.height > player.y &&
            obstacle.y < player.y + player.height &&
            obstacle.x < player.x + player.width &&
            obstacle.x + obstacle.width > player.x) {
            gameOver = true;
            alert(`Игра окончена! Ваш счёт: ${score}`);
            return;
        }
    }

    // Удаление препятствий за экраном
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    // Добавление новых препятствий
    if (Math.random() < 0.02) {
        addObstacle();
    }

    // Увеличение счёта и скорости
    score++;
    if (score % 100 === 0) gameSpeed += 0.5;

    // Обновление экрана
    requestAnimationFrame(update);
}

update();
