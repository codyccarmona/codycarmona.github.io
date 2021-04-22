const DOM = (() => {
    return {
        boardContainer: document.getElementById('gameTable'),
        cells: document.querySelectorAll('#boardCells'),
        startButton: document.querySelector('.startGame'),
        setUpWindow: document.querySelector('#startUpWindow'),
    }
})();
/*************************************************************************/
/*                               GAME BOARD                              */
/*************************************************************************/
const Board = (() => {
    let singleCell = {
        mark: '',
    }
    let cells = DOM.cells;
    let boardArr = [[], [], []];

    const getBoard = () => {
        return boardArr;
    }

    const checkDiagnol = (id) => {
        if (cells[4].innerText != id) {
            return false;
        }
        if (cells[0].innerText === id && cells[8].innerText === id) {
            return true;
        }
        if (cells[2].innerText === id && cells[6].innerText === id) {
            return true;
        }
        return false;
    };
    const checkHorizontal = (id) => {
        for (let i = 0; i < 3; i += _step.ver) {
            if (cells[i].innerText === id) {
                if (cells[i + 1].innerText === id && cells[i + 2].innerText === id) {
                    return true;
                }
            }
        }
        return false;
    };
    const checkVertical = (id) => {
        for (let i = 0; i < 3; i++) {
            if (cells[i].innerText === id) {
                if (cells[i + _step.ver].innerText === id && cells[i + (_step.ver * _step.hor)].innerText === id) {
                    return true;
                }
            }
        }
        return false;
    };
    const checkForWin = (id) => {
        if (checkVertical(id)) {
            return true;
        }
        else if (checkDiagnol(id)) {
            return true;
        }
        else if (checkHorizontal(id))
            return true;
        return false;
    };
    return {
        checkForWin,
        getBoard,
    }
})();

/*************************************************************************/
/*                               GAME CONTROLLER                         */
/*************************************************************************/
const Controller = (() => {
    let player1 = {
        name: 'player1',
        mark: 'X',
        type: '',
        turn: false,
    };
    let player2 = {
        name: 'Player 2',
        mark: 'O',
        type: 'AI',
        turn: false,
    };
    let aiThinking = {
        findBestMove: () =>{
            let bestVal = -1000;
            let move = {
                row: -1,
                col: -1,
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (!_board[i][j]) {
                        _board[i][j] = _symbol;
                        let moveVal = aiThinking.minimax(0, false);
                        _board[i][j] = '';
                        if (moveVal > bestVal) {
                            move.row = i;
                            move.col = j;
                            bestVal = moveVal;
                        }
                    }
                }
            }
            return (move.row, move.col);
        },
        isMovesLeft: () => {
            for (let i = 0; i < _board.length; i++) {
                for (let j = 0; j < _board.length; j++) {
                    if (!_board[i][j])
                        return true;
                }
            }
            return false;
        },
        evaluate: () => {
            for (let row = 0; row < _board.length; row++) {
                if (_board[row][0] === _board[row][1] &&
                    _board[row][1] === _board[row][2]) {
                    if (_board[row][0] === _symbol)
                        return 10;
                    else if (_board[row][0] === Game.oppSymbol())
                        return -10;
                }
            }
            for (let col = 0; col < _board.length; col++) {
                if (_board[0][col] === _board[1][col] &&
                    _board[1][col] === _board[2][col]) {
                    if (_board[0][col] === _symbol)
                        return 10;
                    else if (_board[0][col] === Game.oppSymbol())
                        return -10;
                }
            }
            if (_board[0][0] === _board[1][1] && _board[1][1] === _board[2][2]) {
                if (_board[0][0] === _symbol) {
                    return 10;
                }
                else if (_board[0][0] === Game.oppSymbol()) {
                    return -10;
                }
            }
            if (_board[0][2] === _board[1][1] &&
                _board[1][1] === _board[2][0]) {
                if (_board[0][2] === _symbol)
                    return 10;
                else if (_board[0][2] === Game.oppSymbol()) {
                    return -10;
                }
            }
            return 0;
        },
        minimax: (depth, isMax) => {
            let score = _evaluate();

            if (score === 10)
                return score;
            if (score === -10)
                return score;
            if (_isMovesLeft() === false)
                return 0;
            if (isMax) {
                let best = -1000;
                for (let i = 0; i < _board.length; i++) {
                    for (let j = 0; j < _board.length; j++) {
                        if (!_board[i][j]) {
                            _board[i][j] = _symbol;
                            best = Math.max(best, _minimax(depth + 1, !isMax));
                            _board[i][j] = '';
                        }
                    }
                }
                return best;
            }
            else {
                let best = 1000;
                for (let i = 0; i < _board.length; i++) {
                    for (let j = 0; j < _board.length; j++) {
                        if (!_board[i][j]) {
                            _board[i][j] = Game.oppSymbol();
                            best = Math.min(best, _minimax(depth + 1, !isMax));
                            _board[i][j] = '';
                        }
                    }
                }
                return best;
            }
        }
    };
    const changeTurn = () => {
      player1.turn = !player1.turn;
       player2.turn = !player2.turn;
    };
    const determineOrder = () => {
        if (Math.floor(Math.random() * 2)) {
            player1.turn = true;
        }
        player2.turn = true;
    };
})();










