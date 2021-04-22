/*************************************************************************/
/*                          DOCUMENT ELEMENTS                            */
/*************************************************************************/
const Document = (() => {
    const _idLiterals = {
        TABLEFORGAME: 'tableBoard',
        STARTGAMEBUTTON: 'btnStartGame',
        NEXTGAMEBUTTON: 'btnNextGame',
    };


    const getTDInTable = (i) => {
        return document.getElementById(i);
    }
    const getAllTDInTable = () => {
        return document.getElementsByName('TD');
    }
    const getGameTable = () => {
        return document.getElementById(_idLiterals.TABLEFORGAME);
    }
    const getStartButton = () => {
        return document.getElementById(_idLiterals.STARTGAMEBUTTON);
    };
    const getNextButton = () =>{
        return document.getElementById(_idLiterals.NEXTGAMEBUTTON);
    }
    const markMoveOnTable = (id) =>{
        return new Promise((res, rej) =>{
            let cell = getTDInTable(id);
            if(cell){
                cell.innerText = GameController.getTurn();
                cell.style.backgroundColor = '#fff891';
                res(true);
            }
            else{
                rej('DOM error');
            }
        });
    };
    return {
        getGameTable,
        getAllTDInTable,
        getStartButton,
        getTDInTable,
        getNextButton,
        markMoveOnTable,
    }
})();
/*************************************************************************/
/*                               GAME BOARD                              */
/*************************************************************************/
const Board = (() => {
    //Private functions/variables
    let _layout = null;
    let _prop = null;
    //Create the board
    const _createBoard = (dimension = 3) => {
        _layout = new Array(dimension * dimension).fill(null);
        _prop = {
            rows: dimension,
            linesOnBoard: dimension - 1,
            lToRDiagStep: dimension + 1,
            rToLDiagStep: dimension - 1,
            topLeftInd: (0 * (dimension - 1)),
            topRightInd: (1 * (dimension - 1)),
            bottomLeftInd: (3 * (dimension - 1)),
            bottomRightInd: (4 * (dimension - 1)),
        }
    };

    const _getLastIndexInRow = ((row) => {
        return (row + _prop.linesOnBoard);
    });
    const _getLastIndexInCol = ((col) => {
        return (col + ((_prop.rows) * _prop.linesOnBoard));
    });
    const _checkDiagnol = () => {
        return new Promise((res, rej) => {
            let winner = { id: null, path: [] };
            if ((_layout[0] && _layout[_prop.bottomRightInd]) &&
                (_layout[0] === _layout[_prop.bottomRightInd])) {
                winner.id = _layout[0];
                winner.path.push(0);
                for (let i = (0 + _prop.lToRDiagStep); i < _prop.bottomRightInd; i += _prop.lToRDiagStep) {
                    if (_layout[i] != winner.id) {
                        winner.id = null;
                        winner.path.length = 0;
                        break;
                    }
                    winner.path.push(i);
                }
                if(winner.id){
                    winner.path.push(_prop.bottomRightInd);
                }
            }
            //Top right to bottom left
            if (!winner.id) {
                if ((_layout[_prop.topRightInd] && _layout[_prop.bottomLeftInd]) &&
                    (_layout[_prop.topRightInd] === _layout[_prop.bottomRightInd])) {
                    winner.id = _layout[_prop.topRightInd];
                    winner.path.push(_prop.topRightInd);
                    for (let i = (_prop.topRightInd + _prop.rToLDiagStep); i < _prop.bottomLeftInd; i += _prop.rToLDiagStep) {
                        if (_layout[i] != winner.id) {
                            winner.id = null;
                            winner.path.length = 0;
                            break;
                        }
                        winner.path.push(i);
                    }
                }
            }
            winner.id ? res({id: winner.id, path: winner.path}) : rej(0);
        });
    };

    const _checkVertical = () => {
        return new Promise((res, rej) => {
            let winner = { id: null, path: [] };
            for (let i = 0; i <= _prop.topRightInd; i++) {
                if ((_layout[i] && _layout[_getLastIndexInCol(i)]) &&
                    (_layout[i] === _layout[_getLastIndexInCol(i)])) {
                    winner.id = _layout[i];
                    winner.path.push(i);
                    for (let j = (i + _prop.rows); j < (_getLastIndexInCol(i)); j += _prop.rows) {
                        if (_layout[j] != winner.id) {
                            winner.id = null;
                            winner.path.length = 0;
                            break;
                        }
                        winner.path.push(j);
                    }
                    if(winner.id){
                        winner.path.push(_getLastIndexInCol(i));
                    }
                }
            }
            winner.id ? res({id: winner.id, path: winner.path}) : rej(0);
        });
    };

    const _checkHorizontal = () => {
        return new Promise((res, rej) => {
            let winner = { id: null, path: [] };
            for (let i = 0; i < _prop.bottomLeftInd; i += _prop.rows) {
                if (_layout[i] && _layout[_getLastIndexInRow(i)] &&
                    _layout[i] == _layout[_getLastIndexInRow(i)]) {
                    winner.id = _layout[i];
                    winner.path.push(i);
                    for (let j = (i + 1); j < _getLastIndexInRow(i); j++) {
                        if (_layout[j] != winner.id) {
                            winner.id = null;
                            winner.path.length = 0;
                            break;
                        }
                        winner.path.push(j);
                    }
                    if(winner.id){
                        winner.path.push(_getLastIndexInRow(i));
                    }
                }
            }
            winner.id ? res({id: winner.id, path: winner.path}) : rej(0);
        });
    };

    //Add board to page
    const _addBoardToPage = () => {
        let index = 0;
        for (let i = 0; i < _prop.rows; i++) {
            const newRow = Document.getGameTable().insertRow();
            for (let j = 0; j < _prop.rows; j++) {
                const newTD = newRow.insertCell();
                newTD.id = index;
                newTD.appendChild(document.createTextNode(''));
                index++;
            }
        }
    };
    //Remove board from table
    const _removeFromDom = () => {
        let table = Document.getGameTable();
        while (table.rows.length >= 0) {
            table.deleteRow(table.rows.length - 1);
        }
    };

    /*
    const _markWin = (path)=>{
        path.forEach(index => {
            Document.getTDInTable(index).classList.add('marked');
        });
        return;
    };
    */
    const checkForWinner = async () => {
        let resp = null;
        await Promise.any([_checkDiagnol(), _checkHorizontal(), _checkVertical()]).then(winner => {
            //_markWin(winner.path);
            resp = winner;
        }).catch(e => {
            resp = e;
        });
        alert(resp);
    };

    //Makes a blank board and adds it to the page
    const initialize = (dimension = 3) => {
        if(_layout){
            _removeFromDom();
        }
        _createBoard(dimension);
        _addBoardToPage();
    };
    const getBoardImg = ()=>{
        return _layout.slice(0);
    };
    const markMoveOnBoard = (i) =>{
        return new Promise((res, rej) =>{
            if(_layout[i]){
                rej('Board error');
            }
            _layout[i] = GameController.getTurn();
            res(true);
        });
    };
    //Return accessible functions
    return {
        initialize,
        checkForWinner,
        getBoardImg,
        markMoveOnBoard,
    }
})();



/*************************************************************************/
/*                               GAME CONTROLLER                         */
/*************************************************************************/
const GameController = (() => {
    let _flags = null;
    let _player1 = null;
    let _player2 = null;

    const _setFlags = (hasComputer = false)  =>{
        _flags = {
            isCompPlaying: hasComputer,
            isWhoseTurn: null,
        }
    };
    const _changeTurn = () =>{
        _flags.isWhoseTurn === _player1.symbol ? _flags.isWhoseTurn = _player2.symbol : _flags.isWhoseTurn = _player1.symbol;
    }
    const _isSpotOpen = (cell) =>{
        if(cell.innerText != ''){
            return false;
        }
        else{
            return true;
        }
    }

    const _playMove = async (tableEvent) => {
        let cell = tableEvent.target;
        if (_isSpotOpen(cell) && !_flags.isWinner) {
            await Document.markMoveOnTable(cell.id).then(Board.markMoveOnBoard(cell.id));
            if (await Board.checkForWinner()) {
                alert('Player ' + _flags.isWhoseTurn + ' won!');
                _flags.isWinner = true;
                return false;
            };
        }
    };

    const _addEventListenersToBoard = () => {
        Document.getGameTable().onclick = (e) => {
            return _playMove(e);
        };
    };
    const _createPlayers = ()=>{
        _flags.isCompPlaying ? _player1 = new Computer('X') : _player1 = new Player('X');       
        _player2 = new Player('O');
    };

    const _determineFirstPlayer = () =>{
        (Math.floor(Math.random() * 2) === 0) ? _flags.isWhoseTurn = _player1.symbol : _flags.isWhoseTurn = _player2.symbol;
    };

    const getTurn = () =>{
        return _flags.isWhoseTurn;
    }









    const newGame = ((hasComputer = false) =>{
        Board.initialize();
        _setFlags();
        _createPlayers();
        _determineFirstPlayer();
        _addEventListenersToBoard();
    });

    return{
        newGame,
        getTurn,
    }
})();

//Use map to track num of moves per player

//Test Game


/*************************************************************************/
/*                               PLAYER                                  */
/*************************************************************************/
class Player {
    constructor(symbol) {
        this._symbol = symbol;
        this._wins = 0;
        this._losses = 0;
    }

    get symbol() {
        return this._symbol;
    }
    set symbol(symbol) {
        this._symbol = symbol;
    }

    get wins() {
        return this._wins;
    }
    addWin() {
        this._wins++;
    }
    get losses() {
        return this._losses;
    }
    addLoss() {
        this._losses++;
    }
    isMyTurn(){
        return this._symbol === GameController.getTurn() ? true: false;
    }
};

class Computer extends Player {
    constructor(symbol){
        super(symbol);
        this._first = false;
        this._board = null;
    };

    set first(bool){
        this._first = bool;
    };

    get first(){
        return this._first;
    };

    set board(boardImg){
        this._board = boardImg;
    }

};


document.addEventListener('DOMContentLoaded', () => {
    //Document.getNextButton().onclick = GameController.nextGame;
    Document.getStartButton().onclick = GameController.newGame;
});
