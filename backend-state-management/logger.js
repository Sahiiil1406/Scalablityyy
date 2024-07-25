const {gameManager} = require('./store');

const logger = () => {
    setInterval(() => {
        console.log(gameManager.log());
    }, 1000);
    
}
module.exports = logger;