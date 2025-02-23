
// src/core/Config.js
import { GAME_CONSTANTS } from './Constants.js';
import BootScene from '../scenes/BootScene.js';
import LoadScene from '../scenes/LoadScene.js';
import MenuScene from '../scenes/MenuScene.js';
import GameScene from '../scenes/GameScene.js';
import UIScene from '../scenes/UIScene.js';

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
    backgroundColor: '#000000',
    scene: [
        BootScene,
        LoadScene,
        MenuScene,
        GameScene,
        UIScene
    ],
    callbacks: {
        postBoot: function(game) {
            // Post-boot configuration
            game.canvas.style.imageRendering = 'pixelated';
        }
    },
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: true
    },
    audio: {
        disableWebAudio: false
    },
    dom: {
        createContainer: true
    }
};