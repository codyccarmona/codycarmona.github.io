/*************************************************************************/
/*                          DOCUMENT ELEMENTS                            */
/*************************************************************************/
const Document = (() => {
    const _idLiterals = {
        TABLEFORGAME: 'tableBoard',
        STARTGAMEBUTTON: 'btnStartGame',
    };


    const getTDInTable = (i) => {
        return document.getElementById(i);
    }
    const getAllTDInTable = () => {
        return document.getElementsByName
    }
    const getGameTable = () => {
        return document.getElementById(_idLiterals.TABLEFORGAME);
    }
    const getStartButton = () => {
        return document.getElementsByTagName('TD');
    };

    return {
        getGameTable,
        getAllTDInTable,
        getStartButton,
        getTDInTable,
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
            isOnPage: false,
            lastIndInCol: (i) => {
                return (i + (rows * (dimension - 1)));
            },
            lastIndInRow: (i) => {
                return (i + row);
            },
        }
    };


    const _checkDiagnolWin = () => {
        let currPlayerId = null;
        if ((_layout[0] && _layout[_prop.bottomRightInd]) &&
            (_layout[0] == _layout[_prop.bottomRightInd])) {
            let currPlayerId = _layout[_prop.topLeftInd];
            for (let i = (_prop.topLeftInd + lToRDiagStep); i <= _prop.bottomRightInd; i + lToRDiagStep) {
                if (_layout[i] != currPlayerId) {
                    currPlayerId = null;
                    break;
                }
            }
        }
        if ((_layout[_prop.topRightInd] && _layout[_prop.bottomLeftInd]) &&
            (_layout[_prop.topRightInd] == _layout[_prop.bottomRightInd])) {
            currPlayerId = _layout[_prop.topRightInd];
            for (let i = (_prop.topRightInd + _prop.rToLDiagStep); i <= _prop.bottomLeftInd; i + _prop.rToLDiagStep) {
                if (_layout[i] != currPlayerId) {
                    currPlayerId = null;
                    break;
                }
            }
        }
        if(currPlayerId){
            resolve(currPlayerId);
         }
         return;
    };

    const _checkVertical = () => {
        const checkVert = function(resolve, reject){
        let currPlayerId = null;
        for (let i = 0; i < _prop.topRightInd; i++) {
            if ((_layout[i] && _layout[(i + _prop.linesOnBoard)]) &&
                (_layout[i] == _layout[(i + _prop.linesOnBoard)])) {
                currPlayerId = _layout[i];
                for (let j = (i + _prop.rows); j < (i + (_prop.rows * _prop.linesOnBoard)); j + _prop.rows) {
                    if (_layout[j] != currPlayerId) {
                        currPlayerId = null;
                        break;
                    }
                }
            }
        }
        if(currPlayerId){
           resolve(currPlayerId);
        }
        return;
    }
    };

    const _checkHorizontal = () => {
        let currPlayerId = null;
        for (let i = 0; i < _prop.lastIndInRow; i++) {
            if (_layout[i] && _layout[_prop.lastIndInCol] &&
                _layout[i] == _layout[_prop.lastIndInCol]) {
                currPlayerId = _layout[i];
                for (let j = (i + _prop.rows); j < _prop.lastIndInCol; j + _prop.rows) {
                    if (_layout[j] != currPlayerId) {
                        currPlayerId = null;
                        return;
                    }
                }
            }
        }
        if(currPlayerId){
            resolve(currPlayerId);
         }

         return;
    };

    //Add board to page
    const _addBoardToPage = () => {
        if (_prop && _prop.isOnPage) {
            _removeFromDom();
        }
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
        _prop.isOnPage = true;
    };
    //Remove board from table
    const _removeFromDom = () => {
        if (_prop.isOnPage) {
            let table = Document.getGameTable();
            while (table.rows.length >= 0) {
                table.deleteRow(table.rows.length - 1);
            }
            _prop.isOnPage = false;
        }
    };

    const _noWinner = () =>{
        alert('no winner')
    }

    const _addEventListenersToBoard = () => {
        Document.getGameTable().onclick = (e) => {
            if (e.target.tagName == 'TD' && e.target.innerText == '') {
                _layout[e.target.id] = '*';
                e.target.innerText = '*';
                return true;
            }
            else {
                return false;
            }
        };
    };
    const _noWinnerx = () =>{
        return;
    }
    const checkForWinner = async () => {
        let horz = new Promise(_checkDiagnolWin(), _noWinnerx);
        let vert = new Promise(_checkVertical(), _noWinnerx);
        let diag = new Promise(_checkDiagnolWin(), _noWinnerx); 
        await Promise.any([horz, vert, diag]).then(val=>{
            alert('winner');
        }).catch(e=>{
            'No winner';
            return;
        });
    };
    //Makes a blank board and adds it to the page
    const newGame = (dimension = 3) => {
        _createBoard(dimension);
        _addBoardToPage();
        _addEventListenersToBoard();
    };
    //Return accessible functions
    return {
        newGame,
        checkForWinner,
    }
})();



/*************************************************************************/
/*                               GAME CONTROLLER                         */
/*************************************************************************/
const Game = (() => {

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
        return this.symbol;
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
};


document.addEventListener('DOMContentLoaded', () => {
    Board.newGame();
    document.getElementById('testChecks').onclick = Board.checkForWinner();

});
