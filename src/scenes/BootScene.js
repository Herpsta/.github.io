// src/scenes/BootScene.js
import AssetGenerator from '../utils/AssetGenerator.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Generate minimal assets needed for loading screen
        AssetGenerator.generateAssets(this);

        // Add click handler for audio context
        this.input.once('pointerdown', () => {
            if (this.sound.locked) {
                this.sound.unlock();
            }
        });
    }

    create() {
        // Add simple loading text
        const loadingText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Click to Start',
            {
                fontSize: '32px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Wait for click/tap to start
        this.input.once('pointerdown', () => {
            loadingText.destroy();
            this.scene.start('LoadScene');
        });
    }
}