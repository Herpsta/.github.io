// src/Game.js
import { GAME_CONFIG } from './core/Config.js';

class Game extends Phaser.Game {
    constructor() {
        super(GAME_CONFIG);
    }
}

// Create game instance
window.onload = () => {
    new Game();
};

export default Game;