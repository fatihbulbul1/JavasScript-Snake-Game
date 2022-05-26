const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let direction = "R";
let score = 0;
let foodX;
let foodY;
let foodEaten = false;
let goldenX;
let goldenY;
let goldenSwitch = false;
let GAME_TICK = 75;
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize * 1, y: 0},
    {x: 0, y: 0}
];
const LEFT = 65;
const UP = 87;
const RIGHT = 68;
const DOWN = 83;
window.addEventListener("keydown",changeDirection);
resetBtn.addEventListener("click",resetGame);
startGame();
function startGame(){
    running= true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}
function nextTick(){
    if(running){
        setTimeout(() =>{
            clearBoard();
            drawFood();
            drawGolden();
            popGolden();
            drawSnake();
            moveSnake();
            checkCollision();
            checkGolden();
            nextTick();
        },GAME_TICK);
    }
}
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};

function drawFood(){
    ctx.fillStyle = "red";
    ctx.strokeStyle= "black";
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
    ctx.strokeRect(foodX, foodY, unitSize, unitSize);
};
function clearBoard(){
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,gameWidth,gameHeight);
}
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    snake.unshift(head);
    if(snake[0].x == foodX && snake[1].y == foodY){
        checkApple();
    }
    else
        snake.pop();
}
function drawSnake(){
    ctx.fillStyle = "Lime";
    ctx.strokeStyle = "Black";
    snake.forEach(snakePart =>{
        ctx.fillRect(snakePart.x,snakePart.y,unitSize,unitSize);
        ctx.strokeRect(snakePart.x,snakePart.y,unitSize,unitSize);
    })
}

function changeDirection(event){
    let keycode = event.keyCode;
    switch(keycode){
        case LEFT:
            if(direction != "R"){
                xVelocity = -unitSize;
                yVelocity = 0;
                direction = "L";
            }
            break;
        case UP:
            if(direction != "D"){
                xVelocity = 0;
                yVelocity = -unitSize;
                direction = "U";
            }
            break;   
        case RIGHT:
            if(direction != "L"){
                xVelocity = +unitSize;
                yVelocity = 0;
                direction = "R";
            }
            break;
       case DOWN:
            if(direction != "U"){
                xVelocity = 0;
                yVelocity = +unitSize;
                direction = "D";
            }
            break;        
    }
}
function checkCollision(){
    if(snake[0].x < 0 || snake[0].x > gameWidth - unitSize||
        snake[0].y < 0|| snake[0].y > gameHeight - unitSize) {
        running = false;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
}
function checkApple(){
    score += 1;
    scoreText.textContent = score;
    createFood();
    GAME_TICK -= 2;
    const goldenChance = Math.round(Math.random()*3);
    if(!goldenSwitch && goldenChance == 1){
        createGolden();
        goldenSwitch = true;
    }
}

function createGolden(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    goldenX = randomFood(0, gameWidth - unitSize);
    goldenY = randomFood(0, gameWidth - unitSize);
};

function drawGolden(){
    ctx.fillStyle = "yellow";
    ctx.strokeStyle= "black";
    ctx.fillRect(goldenX, goldenY, unitSize, unitSize);
    ctx.strokeRect(goldenX, goldenY, unitSize, unitSize);
};

function popGolden(){
    const disappear = Math.round(Math.random()*30);
    if (disappear == 3 && goldenSwitch) {
        goldenX = 1000;
        goldenY = 1000;
        goldenSwitch = false;
    }
}
function checkGolden() {
    if(snake[0].x == goldenX && snake[0].y == goldenY){
        score += 3;
        GAME_TICK += 3;
        scoreText.textContent = score;
        goldenX = 1000;
        goldenY = 1000;
        goldenSwitch = false;
        snake.pop();
        snake.pop();
        snake.pop();
    }
}
function resetGame(){
    location.reload();
};