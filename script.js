const grid = document.querySelector("#grid");
let squares = [];

const width = 10;

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

    random = Math.floor(Math.random() * theTetriminos.length);
    currentRotation = 0;
    current = theTetriminos[random][currentRotation];
    currentPosition = 4;
    draw();
  }
}

draw();
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

let timerId = setInterval(moveDown, 1000);
