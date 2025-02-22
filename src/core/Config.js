// src/core/Config.js
export const GAME_CONFIG = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_CONSTANTS.CANVAS.WIDTH,
    height: GAME_CONSTANTS.CANVAS.HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    backgroundColor: '#000000'
};