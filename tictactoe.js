/*************************************************************************/
/*                          DOCUMENT ELEMENTS                            */
/*************************************************************************/
const Document = (() =>{
    const _idLiterals = {
        TABLEFORGAME: 'tableBoard',
        STARTGAMEBUTTON: 'btnStartGame',
    };
    

    const getTDInTable = (i, j) => {
        return document.getElementById(i + ':' + j);
    }
    const getAllTDInTable = () => {
        return document.getElementsByName
    }
    const getGameTable = () =>{
        return document.getElementById(_idLiterals.TABLEFORGAME);
    }
    const getStartButton = () =>{
        return document.getElementsByTagName('TD');
    };

    return{
        getGameTable,
        getAllTDInTable,
        getStartButton,
        getTDInTable,
    }
})();
/*************************************************************************/
/*                               GAME BOARD                              */
/*************************************************************************/
const GameBoard = (() =>{
    //Private functions/variables
    let _board = null;
    //Create the board
    const _createBoard = (dimension = 3) =>{
        _board = new Array(dimension).fill(null);
        _board.prop = {
            vertStep: dimension,
            horzStep: 1,
            leftToRightStep: dimension + 1,
            rightToLeftStep: dimension - 1,
            isEmpty: false,
            isOnPage: false,
            topLeftCorner: 0,
            topRightCorner: 1 * (dimension - 1),
            bottomLeftCorner: 2 * (dimension - 1),
            bottomRightCorner: 3 * (dimension - 1),
    };

    const checkDiagnolWin = async () =>{
        let currPlayerId = null;       
        if((_board[0] && _board[_prop.bottomRightCorner])&& 
            _board[0] == _board[_prop.bottomRightCorner]){
                currPlayerId = _board[0];
                for(let i = _prop.leftToRightStep; i < _board.length; i + _prop.leftToRightStep){
                    if(_board[i] != currPlayerId){
                        currPlayerId = null;
                        break;
                    }

                }
            }
        else if((_board[_prop.topRightCorner] && _board[_prop.bottomLeftCorner])&& 
                (_board[0] == _board[_prop.bottomRightCorner])){
                    currPlayerId = _board[_prop.topRightCorner];
                    for(let i = (_prop.topRightCorner + _prop.rightToLeftStep); i < _board.length; i + _prop.rightToLeftStep){
                        if(_board[i] != currPlayerId){
                            currPlayerId = null;
                            break;
                        }
                    }
                }
        if(currPlayerId) Promise.resolve(currPlayerId);
        else Promise.reject(null);

    };
 
    const _checkVertical = async () => {
        let currPlayerId = null;
    };
    /*
    Top left corner always index 0
    Top right corner always 0 + size of each row in tic tac toe box
    Bottom left is = (top right) 
    */
    const _checkHorizontal = async () =>{
        let currPlayerId = null;
        for(let i = 0; i < _boardProperties.length; i++){
            if(!_boardProperties[i][0]){
                continue;
            }
            else{
                currPlayerId = _boardProperties[i][0];
                for(let j = 1; j < _boardProperties.length; j++){
                    if(!_boardProperties[i][j] || (currPlayerId && currPlayerId != _boardProperties[i][j])){
                        currPlayerId = null;
                        break;
                    }
                }
            }
            if(currPlayerId){
                Promise.resolve(currPlayerId);
            }
        }
        Promise.reject(0);
    };
    //Is my board already made
    const _isEmpty = () =>{
        return _boardProperties.isEmpty;
    };

    //Has board been added to the table
    const _isBoardOnDoc = () =>{
        return _boardProperties.isOnPage;
    };



    //Add board to page
    const _addBoardToPage = () =>{
        if(_isEmpty()){
            return false;
        }
        for(let i = 0; i < Math.pow(_boardProperties.boardSize, _boardProperties.boardSize); i++){
            const newRow = Document.getGameTable().insertRow();
            for(let j = 0; j < _boardProperties.boardSize; j++){
                const newTD = newRow.insertCell();
                newTD.id = i + ':' + j;
                newTD.appendChild(document.createTextNode(null));
            }
        }
    };
    //Remove board from table
    const _removeFromDom = () =>{
        let table = Document.getGameTable();
        while(table.rows.length >= 0){
            table.deleteRow(table.rows.length - 1);
        }
    };
    //Reset the board container
    const _clearBoardArr = () =>{
        if(_isEmpty()) return;
        _boardProperties.length = 0;
    };
    const _addEventListenersToBoard = () =>{
        Document.getGameTable().onclick = (e) =>{
            if(e.target.tagName != 'TD') return;
            markMove(e.target);
        }
    };


    //check for wins or ties

    //Prep for new game

    //Return a current img of the board as is

    //Marks move in board arr
    const markMove = (tdClicked) =>{
        tdClicked.firstChild.nodeValue = '*';
        let tdClickedInd = tdClicked.id.split(':');
        _boardProperties[tdClickedInd[0]][tdClickedInd[1]] = '*';
    };
    //Makes a blank board and adds it to the page
    const initialize = (dimension = 3) =>{
        if(!_isEmpty()){
            _removeFromDom();
            _clearBoardArr();
            cornerSpots.reset();
        }
        _createBoard(dimension);
        _addBoardToPage();
        _addEventListenersToBoard();
        cornerSpots.setYCoords(_boardProperties.length);
    };
    //Return accessible functions
    return{
        initialize,
        markMove,
        checkDiagnol,
    };
})();



/*************************************************************************/
/*                               GAME CONTROLLER                         */
/*************************************************************************/
const Game = (() =>{

})();
//Use map to track num of moves per player

//Test GameBoard


/*************************************************************************/
/*                               PLAYER                                  */
/*************************************************************************/
class Player{
    constructor(symbol){
        this._symbol = symbol;
        this._wins = 0;
        this._losses = 0;
    }

    get symbol(){
        return this.symbol;
    }
    set symbol(symbol){
        this._symbol - symbol;
    }

    get  wins(){
        return this._wins;
    }
    addWin(){
        this._wins++;
    }
    get  losses(){
        return this._losses;
    }
    addLoss(){
        this._losses++;
    }
};


document.addEventListener('DOMContentLoaded',()=>{
    GameBoard.initialize();
    document.getElementById('testChecks').onclick = ()=>{
        GameBoard.checkVertical().then(()=>{
            alert('win');
    }).catch(()=>{
        alert('no win');
    })}
});
