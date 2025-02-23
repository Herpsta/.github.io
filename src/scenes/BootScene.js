// src/scenes/BootScene.js
import AssetGenerator from '../utils/AssetGenerator.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Generate minimal assets needed for loading screen
        AssetGenerator.generateUIAssets(this);
    }

    create() {
        // Add simple loading text while transitioning to LoadScene
        const loadingText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Loading...',
            {
                fontSize: '32px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Transition to LoadScene
        this.scene.start('LoadScene');
    }
}