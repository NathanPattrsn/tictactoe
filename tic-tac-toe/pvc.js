window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const resetScoreButton = document.querySelector('#reset-score');
    const announcer = document.querySelector('.announcer'); //Adding event listeners to the player display section, the reset button and the announcer section

    let board = ['', '', '', '', '', '', '', '', '']; //Setting up board
    let currentPlayer = 'X'; //Setting user as X
    let isGameActive = true; //Game is active instantly

    const PLAYERX_WON = 'PLAYERX_WON'; //To say player x won
    const PLAYERO_WON = 'PLAYERO_WON'; //To say player o won
    const TIE = 'TIE'; //To say tie


    /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleResultValidation() { // checks if the current player has won the game by checking if any of the 
        let roundWon = false;           //winning combinations of tiles on the board are filled by that player's symbol.
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        resetScoreButton.addEventListener('click', () => {
            xScore = 0;
            oScore = 0;
            xScoreboard.innerText = xScore;
            oScoreboard.innerText = oScore;
          });

          resetScoreButton.addEventListener('click', () => {
            const confirmReset = confirm('Are you sure you want to reset the scores?');
          
            if (confirmReset) {
              xScore = 0;
              oScore = 0;
              xScoreboard.innerText = xScore;
              oScoreboard.innerText = oScore;
            }
          });

    if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

    if (!board.includes(''))
        announce(TIE);
    }

    let xScore = 0;
    let oScore = 0;
    
    const xScoreboard = document.querySelector('.x-score');
    const oScoreboard = document.querySelector('.o-score');
    
    const updateScore = (player) => {
      if (player === 'X') {
        xScore++;
        xScoreboard.innerText = xScore;
      } else if (player === 'O') {
        oScore++;
        oScoreboard.innerText = oScore;
      }
    };

    const announce = (type) => { //function is called to display a message to the user.
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                updateScore('O');
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                updateScore('X');
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => { //function ensures that a player cannot place their symbol on a tile that is already filled
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    const updateBoard =  (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => { //this function allows the game to switch player and announce who's turn it is
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => { //handles a player's move by updating the board and changing the current player
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }
    
    const resetBoard = () => { // resets the game by emptying the board, setting the game to active, hiding the announcement message, and resetting the tiles on the board.
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    function playTurn(e) { //function to place symbol on board
        if (!isGameActive)
          return;
      
        const index = tiles.indexOf(e.target); //index of tile that was clicked
      
        if (board[index] !== '') //if index is not empty
          return;
      
          
        board[index] = currentPlayer; //place player's symbol on board
        e.target.innerHTML = currentPlayer;
        handleResultValidation(); // check if the current player has won the game
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // switch turns
        playerDisplay.innerHTML = currentPlayer; //display current player
      
        // Make the computer's move after a delay
        if (currentPlayer === 'O') {
          setTimeout(() => {
            const emptySquares = board.filter(square => square === ''); // find empty squares
            const index = Math.floor(Math.random() * emptySquares.length); // choose a random empty square
            board[index] = 'O'; // place the computer's symbol on the board
            tiles[index].innerHTML = 'O'; // update the tile
            handleResultValidation(); // check if the current player has won the game
            currentPlayer = 'X'; // switch turns back to X
            playerDisplay.innerHTML = currentPlayer; // display current player
          }, 2000); // delay the computer's move by 1 second
        }
      }

    tiles.forEach( (tile, index) => {
        
        tiles.forEach(tile => tile.addEventListener('click', playTurn));
    });

    resetButton.addEventListener('click', resetBoard);
});