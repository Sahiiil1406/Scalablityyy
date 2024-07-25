const logger = require('./logger');
const {gameManager} = require('./store');

const main = async () => {
    setInterval(() => {
        gameManager.addGame({id: Math.random(), name: 'game',
            players: [{id: Math.random(), name: 'player1'}, {id: Math.random(),
                name: 'player2'}]});
    }, 2000);
}
logger();
main()