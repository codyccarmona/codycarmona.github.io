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
                    winner.path.push(bottomRightInd);
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
            winner.id ? res({id: winner.id, path: winner.path}) : rej();
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
                        winner.path.push(_getLastIndexInCol);
                    }
                }
            }
            winner.id ? res({id: winner.id, path: winner.path}) : rej();
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
            winner.id ? res({id: winner.id, path: winner.path}) : rej();
        });
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
    const _markWin = (path)=>{
        path.forEach(index => {
            Document.getTDInTable(index).innerText = '$';
        });
    };
    const checkForWinner = async () => {
        await Promise.any([_checkDiagnol(), _checkHorizontal(), _checkVertical()]).then(winner => {
            _markWin(winner.path);
        }).catch(e => {
            return;
        });
    };
    const getBoardImg = () =>{
        return _layout.slice();
    }
    //Makes a blank board and adds it to the page
    const newBoard = (dimension = 3) => {
        _createBoard(dimension);
        _addBoardToPage();
        _addEventListenersToBoard();
    };
    //Return accessible functions
    return {
        newBoard,
        checkForWinner,
        getBoardImg,
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
    Board.newBoard();
    document.getElementById('testChecks').onclick = Board.checkForWinner;

});
