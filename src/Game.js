// src/Game.js
import { GAME_CONSTANTS } from './core/Constants.js';

export default class Game extends Phaser.Game {
    constructor() {
        super({
            type: Phaser.AUTO,
            width: GAME_CONSTANTS.CANVAS.WIDTH,
            height: GAME_CONSTANTS.CANVAS.HEIGHT,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            audio: {
                disableWebAudio: false
            },
            scene: [
                BootScene,
                LoadScene,
                MenuScene,
                GameScene,
                UIScene
            ]
        });
    }
}

window.onload = () => {
    new Game();
};