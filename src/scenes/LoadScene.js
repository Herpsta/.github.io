// src/scenes/LoadScene.js
import AssetGenerator from '../utils/AssetGenerator.js';
import { GAME_CONSTANTS } from '../core/Constants.js';

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadScene' });
        this.loadingText = null;
        this.progressBar = null;
        this.progressBox = null;
        this.loadingAssets = false;
    }

    preload() {
        this.cameras.main.setBackgroundColor('#000000');
        this.createLoadingScreen();
        this.setupLoadingEvents();
        
        // Generate all game assets
        this.loadingAssets = true;
        AssetGenerator.generateAllAssets(this);
        this.loadingAssets = false;

        // Load audio assets
        this.loadAudioAssets();
    }

    createLoadingScreen() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create loading text
        this.loadingText = this.add.text(
            width / 2,
            height / 2 - 50,
            'Loading...',
            {
                fontFamily: 'monospace',
                fontSize: '32px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Create progress box
        this.progressBox = this.add.graphics();
        this.progressBox.lineStyle(2, 0x00ff00, 1);
        this.progressBox.strokeRect(
            width / 2 - 160,
            height / 2 - 15,
            320,
            30
        );

        // Create progress bar
        this.progressBar = this.add.graphics();

        // Add loading tips
        this.tipIndex = 0;
        this.tips = [
            'Tip: Collect powerups to become stronger!',
            'Tip: Watch out for enemy patterns!',
            'Tip: Survive longer to face stronger enemies!',
            'Tip: Use space to shoot, WASD to move!'
        ];

        this.tipText = this.add.text(
            width / 2,
            height / 2 + 50,
            this.tips[0],
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#888888'
            }
        ).setOrigin(0.5);

        // Rotate tips every 3 seconds
        this.time.addEvent({
            delay: 3000,
            callback: this.updateTip,
            callbackScope: this,
            loop: true
        });

        // Add version number
        this.add.text(
            10,
            height - 20,
            `v${GAME_CONSTANTS.VERSION}`,
            {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#444444'
            }
        );
    }

    updateTip() {
        this.tipIndex = (this.tipIndex + 1) % this.tips.length;
        this.tipText.setText(this.tips[this.tipIndex]);
    }

    setupLoadingEvents() {
        this.load.on('progress', this.updateProgress, this);
        this.load.on('complete', this.loadComplete, this);
    }

    updateProgress(value) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.progressBar.clear();
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(
            width / 2 - 150,
            height / 2 - 10,
            300 * value,
            20
        );

        const percent = Math.round(value * 100);
        this.loadingText.setText(`Loading... ${percent}%`);
    }

    loadAudioAssets() {
        const audioFiles = [
            'shoot', 'hit', 'explosion', 'powerup',
            'level-up', 'game-over', 'menu-select'
        ];

        audioFiles.forEach(file => {
            this.load.audio(file, `assets/audio/${file}.wav`);
        });

        this.load.audio('menu-music', 'assets/audio/menu-music.mp3');
        this.load.audio('game-music', 'assets/audio/game-music.mp3');
    }

    loadComplete() {
        this.createAnimations();

        // Add a small delay before transitioning
        this.time.delayedCall(500, () => {
            this.cameras.main.fadeOut(1000);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MenuScene');
            });
        });
    }

    createAnimations() {
        // Player animations
        this.anims.create({
            key: 'player-idle',
            frames: [{ key: 'player' }],
            frameRate: 1,
            repeat: -1
        });

        // Enemy animations
        ['basic', 'fast', 'tank', 'boss'].forEach(type => {
            this.anims.create({
                key: `enemy-${type}-move`,
                frames: [{ key: `enemy-${type}` }],
                frameRate: 1,
                repeat: -1
            });
        });

        // Explosion animation
        this.anims.create({
            key: 'explosion',
            frames: Array.from({ length: 8 }, (_, i) => ({
                key: `explosion-${i}`
            })),
            frameRate: 15,
            repeat: 0
        });
    }
}