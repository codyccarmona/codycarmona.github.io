const GameBoard = (() =>{

    //Private properties
    const _boardObj = null;
    const gameTable = document.getElementById('tableBoard');


    //Private function 
    const _createBoard = (dimension = 3) =>{
        _boardObj = {boardArr: new Array(dimension * dimension), size: dimension,};
    };
    const _addBoardToPage = () =>{
        for(let i = 0; i < _boardObj.size; i++){
            const newRow = 
        }
        for(let i = 0; i < board.length; i++){
            const newRow = gameTable.insertRow();
            for(let j = 0; j < board[i].length; j++){
                const newTD = newRow.insertCell();
                newTD.id = i + ':' + j;
                newTD.appendChild(document.createTextNode(''));
                newTD.onclick = (e) =>{
                    /* function */
                    let textValue = e.target.firstChild;
                    if(textValue.nodeValue == ''){
                        //if(GameController.isCompPlaying() && ComputerPlayer.getIdentifier() == GameController.whoseTurn()){
                            //return false;
                        //}
                        board[location[0], location[1]] = GameController.whoseTurn();
                        GameController.addMove();
                        ComputerPlayer.recordMove(location[0], location[1])
                        GameController.changeTurn();
                    }
                }
            }
        }
    };
    const _removeBoardFromPage = () => {
        for (let i = 0; i < getDimensions(); i++){
            gameTable.deleteRow(i);
        }
    };
    const _clearBoardAndPage = () =>{
        _removeBoardFromPage();
        board.length = 0;
    };
    const _checkVertical = async () => {
        let currPlayerId = null;
        for(let i = 0; i < board.length; i++){
            if(!board[0][i]){
                continue;
            }
            else{
                currPlayerId = board[0][i];
                for(let j = 1; j < board.length; j++){
                    if(!board[j][i] || (currPlayerId && currPlayerId != board[j][i])){
                        currPlayerId = null;
                        break;
                    }
                }
            }

        }
        currPlayerId == null ? Promise.reject(0) : Promise.resolve(currPlayerId);
    };
    const _isEmpty = () =>{
        return (getDimensions() > 0);
    };

    const _checkHorizontal = async () =>{
        let currPlayerId = null;
        for(let i = 0; i < board.length; i++){
            if(!board[i][0]){
                continue;
            }
            else{
                currPlayerId = board[i][0];
                for(let j = 1; j < board.length; j++){
                    if(!board[i][j] || (currPlayerId && currPlayerId != board[i][j])){
                        currPlayerId = null;
                        break;
                    }
                    continue;
                }
            }
        }
        currPlayerId == null ? Promise.reject(0) : Promise.resolve(currPlayerId);
    };



    //Public functions 
    const makeMove = (i, j) =>{
        document.getElementById(i + ':' + j).click();
    };
    const showMeBoard = () =>{
        let boardImg = [];
        for(let i = 0; i < board.length; i++){
            boardImg[i] = board[i].slice();
        }
        return boardImg;
    }
    const getDimensions = () =>{
        return board.length;
    };
    const verifyBoard = () =>{
        Promise.any([_checkHorizontal(), _checkVertical(), _checkDiagnol()]).then((resp)=>{
            return resp;
        }).catch(e =>{
            return false;
        });
    };
    const prepare = (dimension) => {
        if(!_isEmpty()){
            _clearBoardAndPage();
        }
        _createBoard(dimension);
        _addBoardToPage();
    };
    //Return public functions
    return {
        prepare,
        getDimensions,
        verifyBoard,
        showMeBoard,
        makeMove,
    };
})();


/*********************************************************************************************/
/*                                      COMPUTER                                             */   
/*********************************************************************************************/
const ComputerPlayer = (() => {

    let _myPlayer = null;
    let _boardImg = [];
    let decisionFlags = null



    
    const _isCornerMove = (i, j) =>{
        if(i == 0){
            if(j != 0 && j != _boardImg.length){
                return false;
            }
        }
        else if(j == 0){
            if(i != 0 && i != _boardImg.length){
                return false;
            }
        }
        else if(i != _boardImg.length && j != _boardImg.length){
            return false;
        }
        return true;
    };
    const _randomCorner = () =>{   
        return (Math.floor(Math.random() * (4 - 1 + 1)) + 1);  
    };
    const _firstMoveCorner = () =>{
        switch(_randomCorner()){
            case 1:
                GameBoard.makeMove(0,0);
                i = j = _boardImg.length;
                break;
            case 2:
                GameBoard.makeMove(0,_boardImg.length);
                i = 0;
                j = 0;
                break;
            case 3:
                GameBoard.makeMove(_boardImg.length,0);
                i = 0;
                j = _boardImg.length;
                break;
            case 4:
                GameBoard.makeMove(_boardImg.length, board.length);
                i = j = 0;
        }
        _firstMoveAdv = true;
    };
    const makeTurn = () =>{
        if(GameController.getNumOfTurns() == 0){
            _firstMoveCorner();
            _firstMoveAdv = true;
        }
        if(_firstMoveAdv){
            if(_oppMidFirst){
                if(GameController.getNumOfTurns() == 2){
                    GameBoard.makeMove(i, j);
                }
                else {

                }
            }
        }
    };
    const initialize = (player) => {
        _boardImg = null;
        _decisionFlags = new _Flags();
        _myPlayer = player;
    };
    const getIdentifier = () =>{
        return _myPlayer.getIdentifier();
    };
    const recordMove = (i,j) =>{
        _boardImg(i,j) = GameController.whoseTurn();
        if(GameController.getNumOfTurns() == 1 && i == 1 && i == j){
            _oppMidFirst = true;
        }
        if(GameController.getNumOfTurns() == 3 && )
    };
    return{
        initialize,
        getIdentifier,
        makeTurn,
        recordMove,
    }
})();



/*********************************************************************************************/
/*                                      GAME CONTROLLER                                      */   
/*********************************************************************************************/
const GameController = (() => {
    //Private
    let _player1 = null;
    let _player2 = null;
    let _currId = null;
    let _checkBoxO = document.getElementById('checkO');
    let _checkBoxX = document.getElementById('checkX');
    const _1Symbol = 'X';
    const _2Symbol = 'O';
    let _computerPlaying = true;
    let _numOfTurns = 0;
    let _gameInProgess = false;
    let _isThereWinner = false;
    let _firstMove = null;


    const _determineOrder = () =>{  
       _currId = (Math.floor(Math.random() >= .5) ? _1Symbol : _2Symbol);
       _firstMove = GameController.getPlayer(_currId);
    };
    //Public
    const _initializePlayers = () =>{
        _player1 = createPlayer(_1Symbol, 'Player1');
        _player2 = createPlayer(_2Symbol, 'Player2');
        if(_computerPlaying){
            ComputerPlayer.initialize(_player2);
        }
    };
    const _resetVariables = () =>{
        _currId = null;
        _numOfTurns = 0;
        _gameInProgess = false;
    }
    const newGame = () => {
        _resetVariables
        if(_numOfTurns){
            _resetVariables();
        }
        _initializePlayers();
        _determineOrder();
        //GameBoard.prepare(parseInt(document.getElementById('inputDim').value));
        GameBoard.prepare();
        _gameInProgess = true;
        if(ComputerPlayer.getIdentifier() == _currId){
            ComputerPlayer.makeTurn();
        }
    };
    const changeTurn = () =>{  
        if(_numOfTurns >= (GameBoard.getDimensions() - 1)){
            if(GameBoard.verifyBoard()){
                _isThereWinner = true;
                return;
            }
        } 
        _currId == _1Symbol ? _currId = _2Symbol : _currId = _1Symbol;
        if(ComputerPlayer.getIdentifier() == _currId){
            ComputerPlayer.makeTurn();
        }
    };
    const whoWasFirst = () =>{
        return _firstMove;
    }
    const whoseTurn = () =>{
        return _currId;
    };
    const whoseNext = () =>{
        return _currId == _checkBoxO ? _checkBoxO : _checkBoxX;
    }
    const isCompPlaying = () => {
        return _computerPlaying;
    };
    const getNumOfTurns = () => {
        return _numOfTurns;
    };
    const getPlayer = (playerId) =>{
        return _player2.getIdentifier() == playerId ? _player1 : _player2;
    };
    const isThereAWinner = () =>{
        return _isThereWinner;
    };
    const addMove = () =>{
        _numOfTurns++;
    }
    return{
        newGame,
        changeTurn,
        whoseTurn,
        isCompPlaying,
        getNumOfTurns,
        getPlayer,
        isThereAWinner,
        getNumOfTurns,
        whoseNext,
        addMove,
    }
})();

function createPlayer(identifier = null, name = null){
    //Private
    let _identifier = identifier;
    let _name = name;
    let _numOfWins = 0;
    let _numOfLosses = 0;

    return{
        resetLosses(){
            _numOfLosses = 0;
        },
        resetWins(){
            _numOfWins = 0;
        },
        getIdentifier(){
            return _identifier;
        },

        getNumOfLosses(){
            return _numOfLosses;
        },

        getNumOfWins(){
            return _numOfWins;
        },
        getName(){
            return _name;
        },
        incrWins(){
            _numOfWins++;
        },
        incrLosses(){
            _numOfLosses++;
        },
        setIdentifier(identifier){
            _identifier = identifier;
        },
        setName(name){
            _name = name;
        }
    }
};


document.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('btnSubmitDim').addEventListener('click', () =>{
        GameController.newGame();
        document.getElementById('playerInput').style.display = 'none';
    });
});

