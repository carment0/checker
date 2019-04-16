const BOARD_SIZE = 5;
/**
 * 
 * @param {number[]} board 
 * @param {number[]} start 
 * @param {number[]} end 
 * @param {number=1} player 
 * @param {number=BOARD_SIZE} boardSize
 * @return {boolean} boolean indicting if a start position can be moved to end position
 */
function canMove(board, start, end, player = 1, boardSize = BOARD_SIZE) {
  let twoDBoard = create2DBoard(board, boardSize);

  //Check if START is the correct player
  if (twoDBoard[start[0]][start[1]] !== player) return new Error('Start position is not players token!');

  // Check if START is END 
  if (start[0] === end[0] && start[1] === end[1]) {
    return true;
  }

  // Check if END is out of bounds
  const isEndInBound = isInBounds(boardSize, end)
  if (!isEndInBound) return new Error('End position is out of bounds!');

  // Check if START is out of bounds
  const isStartInBound = isInBounds(boardSize, start)
  if (!isStartInBound) return new Error('Start position is out of bounds!');

  // Check if END is already filled
  const value = twoDBoard[end[0]][end[1]]
  if (value !== 0) return new Error('End position is already used!')

  // Check if diagonal positions is the END position
  const diags = [[1, 1], [1, -1]];
  diags.forEach(diag => {
    const row = diag[0] + start[0];
    const col = diag[1] + start[1];
    const isBound = isInBounds(boardSize, [row, col])
    if (isBound) {
      const newValuePos = twoDBoard[row][col];
      if (newValuePos === 0 && isBound && row === start[0] && col === start[1]) {
        return true;
      }
    }
  })

  // Check if diagonal jump position is the END position
  const diagJumps = [[2, 2], [2, -2], [-2, 2], [-2, -2]];

  const stack = [{
    position: start,
    board: twoDBoard
  }];

  let endFound = false;

  while (stack.length !== 0 && !endFound) {
    const currentGame = stack.pop();
    const currentPos = currentGame.position;
    const currentBoard = currentGame.board;
    
    diagJumps.forEach(jump => {
      const row = currentPos[0] + jump[0];
      const col = currentPos[1] + jump[1];
      const isBound = isInBounds(boardSize, [row, col])
      
      if (isBound) {
        const newValuePos = currentBoard[row][col];
        
        const rowBetween = jump[0] / 2;
        const colBetween = jump[1] / 2;
        const valueBetween = currentBoard[currentPos[0] + rowBetween][currentPos[1] + colBetween];

        if (newValuePos === 0 && valueBetween !== player && isBound) {
          if (row === end[0] && col === end[1]){
            endFound = true;
          }
          const copiedBoard = copyBoard(currentBoard);
          copiedBoard[currentPos[0] + rowBetween][currentPos[1] + colBetween] = 0;
          stack.push({
            position: [row, col],
            board: copiedBoard
          });
        }
      }
    })
  }

  return endFound;
}

/**
 * 
 * @param {number[]} board 
 * @param {number} boardSize 
 * @returns {number[][]} 2D copy of the 1D board
 */
function create2DBoard(board, boardSize) {
  const twoDBoard = [];
  while(board.length) {
    twoDBoard.push(board.splice(0, boardSize));
  }

  return twoDBoard;
}

/**
 * 
 * @param {number[][]} board 
 * @returns {number[][]} copy of a board
 */
function copyBoard(board) {
  const newBoard = [];

  for (let i = 0; i < board.length; i++){
    newBoard[i] = board[i].slice();
  }

  return newBoard;
}

/**
 * 
 * @param {number} boardSize 
 * @param {number[]} position 
 * @returns {boolean} boolean indicating if position is in bound of the board
 */
function isInBounds(boardSize, position){
  const col = position[0];
  const row = position[1];

  if (col < 0 || row < 0 || col >= boardSize || row >= boardSize) {
    return false;
  }

  return true;
}

//=======================Test=====================
let assert = {
  equal: function(firstValue, secondValue) {
    if (firstValue != secondValue) 
      throw new Error('Assert failed, ' + firstValue + ' is not equal to ' + secondValue + '.');
  }
};

function testCanMove() {
  const board = [ 0, 0, 0, 0, 0,
                  0, 2, 0, 2, 0,
                  1, 0, 0, 0, 0,
                  0, 0, 0, 2, 0,
                  0, 0, 0, 0, 0
                ]
  const start = [2, 0];
  const end = [4, 2];
  const success = true;
  const failure = false;

  const isMovePossible = canMove(board, start, end);

  console.log('canMove() should return a boolean indicting if a checker piece can make a valid move from start to end.');
  console.log('Expect ' + isMovePossible + ' to equal ' + success + '.');
  
  try {
    assert.equal(isMovePossible, success);
    
    console.log('Passed.');
  } catch (error) {
    console.log(error.message);
  }
}

testCanMove();