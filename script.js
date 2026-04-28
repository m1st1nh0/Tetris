const grid = document.querySelector("#grid");
let squares = [];


const scoredisplay = document.querySelector('#score')

const width = 10;

let score = 0;
let timerId = null;
let isPaused = false;





function createBoard() {
    for (let i = 0; i < 200; i++) {
        const square = document.createElement("div");
        grid.appendChild(square);
        squares.push(square);
    }

    for (let i = 0; i < 10; i++) {
        const square = document.createElement("div");
        square.classList.add("taken");
        grid.appendChild(square);
        squares.push(square);
    }
}
createBoard();

const lTetrimino = [
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2],
    [0, 1, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, 2],
];
const iTetrimino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
];
const tTetrimino = [
    [0, 1, 2, width + 1],
    [2, width + 1, width + 2, width * 2 + 2],
    [width, width + 1, width + 2, 1],
    [0, width, width * 2, width + 1],
];
const oTetrimino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
];
const zTetrimino = [
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, width * 2 + 1],
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, width * 2 + 1],
];
const sTetrimino = [
    [1, 2, width, width + 1],
    [1, width + 1, width + 2, width * 2 + 2],
    [1, 2, width, width + 1],
    [1, width + 1, width + 2, width * 2 + 2],
];
const theTetriminos = [
    lTetrimino,
    tTetrimino,
    iTetrimino,
    oTetrimino,
    zTetrimino,
    sTetrimino,
];
currentPosition = 4;
currentRotation = 0;

let random = Math.floor(Math.random() * theTetriminos.length);
let current = theTetriminos[random][currentRotation];

function draw() {
    current.forEach((index) => {
        squares[currentPosition + index].classList.add("tetrimino");
    });
}

function undraw() {
    current.forEach((index) => {
        squares[currentPosition + index].classList.remove("tetrimino");
    });
}

function freeze() {
    if (
        current.some((index) =>
            squares[currentPosition + index + width].classList.contains("taken"),
        )
    ) {
        current.forEach((index) =>
            squares[currentPosition + index].classList.add("taken"),
        );
        clearLines();
        random = Math.floor(Math.random() * theTetriminos.length);
        currentRotation = 0;
        current = theTetriminos[random][currentRotation];
        currentPosition = 4;
        draw();

        gameOver();
    }
}

draw();
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

function moveLeft() {
    undraw()

    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    if (!isAtLeftEdge) currentPosition -= 1;

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1
    }
    draw()
}

function moveRight() {
    undraw()

    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

    if (!isAtRightEdge) currentPosition += 1;

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1
    }
    draw()
}

const kicksNormal = [0, -1, 1, -2, 2];
const kicksI = [0, -2, 2, -1, 1];

function wouldWrap(shape, pos) {
    const cols = shape.map(i => (pos + i) % width);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
    return (maxCol - minCol >= 4);
}

function isValid(shape, pos) {
    return shape.every(i => {
        const target = pos + i;
        if (target < 0 || target >= squares.length) return false;
        return !squares[target].classList.contains("taken");
    });
}

function rotate() {
    undraw();

    const oldPosition = currentPosition;
    const oldRotation = currentRotation;

    let nextRotation = currentRotation + 1;
    if (nextRotation === theTetriminos[random].length) nextRotation = 0;

    const next = theTetriminos[random][nextRotation];
    const kicks = (theTetriminos[random] === iTetrimino) ? kicksI : kicksNormal;

    let rotated = false;

    for (const kick of kicks) {
        const testPos = currentPosition + kick;

        const wrap = wouldWrap(next, testPos);
        const valid = isValid(next, testPos);

        if (!wrap && valid) {
            currentPosition = testPos;
            currentRotation = nextRotation;
            current = next;
            rotated = true;
            break;
        }
    }

    if (!rotated) {
        currentRotation = oldRotation;
        currentPosition = oldPosition;
        current = theTetriminos[random][currentRotation];
    }

    draw();
}

function control(e) {
    if (e.keyCode == 37 || e.keyCode == 65) { moveLeft() }
    else if (e.keyCode == 39 || e.keyCode == 68) { moveRight() }
    else if (e.keyCode == 38 || e.keyCode == 87) { rotate() }
    else if (e.keyCode == 40 || e.keyCode == 83) { moveDown() }
}

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        clearInterval(timerId);
        document.removeEventListener('keydown', control)
        alert("Game Over!")
    }
}

document.addEventListener("keydown", control)





function clearLines() {

    for (let i = 0; i < 200; i += width) {
        const row = [...Array(width).keys()].map(x => i + x);
        const isFull = row.every(index => squares[index].classList.contains('taken'))

        if (isFull) {
            score += 10
            if (scoredisplay) {
                scoredisplay.textContent = score;

                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrimino')
                })
                const removed = squares.splice(i, width);
                squares = removed.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
}

document.querySelector('#start').addEventListener('click', () => {
    if (timerId) return;
    timerId = setInterval(moveDown, 1000)
    isPaused = false;
})

document.querySelector('#pause').addEventListener('click', () => {
    if (!timerId) return;
    clearInterval(timerId);
    timerId = null;

})

document.querySelector('#reset').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;

    grid.innerHTML ="";
    squares = [];
    
    createBoard()

    score = 0;
    if (scoredisplay) scoredisplay.textContent = score;

    random = Math.floor(Math.random() * theTetriminos.length)
    currentRotation = 0
    current = theTetriminos[random][currentRotation];
    currentPosition = 4;
    draw()
})
