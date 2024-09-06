const startBtn = document.querySelector("#start-btn");
const player1Name = document.querySelector("#player-1");
const player2Name = document.querySelector("#player-2");
const status = document.querySelector(".status");
const gameSpace = document.querySelector(".game-space");

function gameMessage(message) {
    status.innerHTML = message;
}

// Represents the gameboard and its occupying spaces
const Gameboard = (() => {
    let gameboard = [
        "","","",
        "","","",
        "","",""];

    const winCondtions = [
        // Rows
        [0,1,2],
        [3,4,5],
        [6,7,8],
        // Columns
        [0,3,6],
        [1,4,7],
        [2,5,8],
        // Diagonal
        [0,4,8],
        [2,4,6],
    ]

    function update() {
        console.log(Game.gameOver)
        for (let combination = 0; combination < winCondtions.length; combination++) {
            for (let slot = 0; slot < winCondtions[combination].length; slot++) {
                if (gameboard[winCondtions[combination][0]] === gameboard[winCondtions[combination][1]] && gameboard[winCondtions[combination][0]] === gameboard[winCondtions[combination][2]] && gameboard[winCondtions[combination][0]] !== "") {
                    gameMessage(`${Game.players[Game.currentPlayer].name} has won!`)
                    Game.update(false);
                }
            }
        }
        console.log(Game.gameOver)
        if (Game.gameOver !== false) {

        } else{
            Game.nextTurn();
        }

    }

    const render = () => {
        let boardHTML = "";
        let count = 0;
        let curColumn = document.querySelector("#col-1");
        // For every spot in the gameboard loop over it / render X/O into grid
        gameboard.forEach((square,index) => {
            if (count === 3){
                curColumn = document.querySelector("#col-2");
            } 
            else if (count == 6){
                curColumn = document.querySelector("#col-3");
            }
            else if (count > 9){
                return
            }
            boardHTML = `<div class = "row" id = "square-${index}" ${square} </div>`
            const box = document.createElement("div");
            box.className = "row"
            box.id = `square-${index}`
            box.innerHTML = square

            box.addEventListener("click",(event)=>{
                console.log(event.target.id)
                const boxID = parseInt(event.target.id.split("-")[1]);
                const playerMark = Game.players[Game.currentPlayer].mark;
                gameboard[boxID] = playerMark;
                console.log(Game.players)
                box.innerHTML = playerMark;
                update();
                console.log(gameboard)
            })
            // curColumn.innerHTML += boardHTML
            curColumn.appendChild(box)
            count++;
        });
    }

    const clear = () => {
        for (let j = 0; j < gameSpace.children.length;j++) {
            gameSpace.children[j].replaceChildren();
        }
        gameboard = [
            "","","",
            "","","",
            "","",""];
    }
    return {
        render,
        clear
    }

})();

// Represents a player object factory function
const player = (name,mark) => {
    this.name = name;
    this.mark = mark;
    return {name,mark}
};

// Represents the game logic
const Game = (() => {
    let currentPlayer;

    const start = (player1,player2) => {
        Game.addPlayers(player1,player2)
        Game.restartTurn();
        console.log(this.players)
        Gameboard.clear();
        Game.gameStatus(true);
        Gameboard.render();
        Game.nextTurn();
    }

  

    const update = (status) => {
        Game.gameStatus(status);
    }

    return {
        start,
        update,
        players : [],
        gameOver : false,
        addPlayers : function(player1,player2){
            this.players = [player1,player2];
        },
        nextTurn : function(){
            if (this.currentPlayer === 1){
                this.currentPlayer = 0;
            } else {
                this.currentPlayer = 1;
            };
            gameMessage(`${Game.players[this.currentPlayer].name}'s turn!`)
        },
        restartTurn : function() {
            this.currentPlayer = 1;
        },
        gameStatus : function(over){
            if (over === false) {
                this.gameOver = true;
            } else {
                this.gameOver = false;
            }
        },
        currentPlayer,
    }

})();

// Initalize
startBtn.addEventListener("click", () => {
    let player1Text = player1Name.value;
    let player2Text = player2Name.value;

    if (player1Text === "") {
        player1Text = "Player 1";
    }
    if (player2Text === "") {
        player2Text = "Player 2";
    }
    let player1 = player(player1Text,"X");
    let player2 = player(player2Text,"O")
    Game.start(player1,player2)
    console.log(`start: ${Game.players}`)
});