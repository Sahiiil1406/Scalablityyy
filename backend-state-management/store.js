class GameManager{
   
    constructor(){
        this.games = [];
    }

    addGame(game){
        this.games.push(game);
    }

    getGame(gameId){
        return this.games.find(game => game.id === gameId);
    }

    log(){
        console.log(this.games);
    }
    
}

const gameManager = new GameManager();
module.exports = {gameManager};