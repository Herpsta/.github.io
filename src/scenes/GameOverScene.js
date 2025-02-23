// src/scenes/GameOverScene.js
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score;
        this.stats = data.stats;
        this.highScore = data.highScore;
    }

    create() {
        this.createBackground();
        this.createGameOverDisplay();
        this.createStats();
        this.createButtons();
        this.setupInput();
        
        // Play game over sound
        this.sound.play('game-over', { volume: 0.7 });
    }

    createBackground() {
        // Create dark overlay with fade in
        this.bg = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0
        ).setOrigin(0);

        this.tweens.add({
            targets: this.bg,
            alpha: 0.8,
            duration: 1000
        });
    }

    createGameOverDisplay() {
        const centerX = this.cameras.main.centerX;

        // Game Over text with animation
        const gameOverText = this.add.text(centerX, 100, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0.5);

        // Animate game over text
        this.tweens.add({
            targets: gameOverText,
            y: 120,
            duration: 2000,
            ease: 'Bounce'
        });

        // Score display
        const isHighScore = this.score >= this.highScore;
        
        const scoreText = this.add.text(centerX, 200,
            `Score: ${this.score}\nHigh Score: ${this.highScore}`,
            {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'monospace',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Add high score effect if achieved
        if (isHighScore) {
            this.createHighScoreEffect(scoreText);
        }
    }

    createHighScoreEffect(scoreText) {
        // Add glow effect
        this.tweens.add({
            targets: scoreText,
            alpha: 0.5,
            yoyo: true,
            repeat: -1,
            duration: 1000
        });

        // Add particles
        const particles = this.add.particles('particle');
        
        particles.createEmitter({
            x: this.cameras.main.centerX,
            y: 200,
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            tint: 0xffff00,
            lifespan: 1000,
            frequency: 100,
            quantity: 2
        });
    }

    createStats() {
        const startY = 300;
        const spacing = 30;
        const stats = [
            `Time Survived: ${this.formatTime(this.stats.timeSurvived)}`,
            `Enemies Killed: ${this.stats.kills}`,
            `Damage Dealt: ${this.stats.damageDealt}`,
            `Damage Taken: ${this.stats.damageTaken}`,
            `Powerups Collected: ${this.stats.powerupsCollected}`
        ];

        stats.forEach((stat, index) => {
            this.add.text(
                this.cameras.main.centerX,
                startY + (spacing * index),
                stat,
                {
                    fontSize: '20px',
                    fill: '#ffffff',
                    fontFamily: 'monospace'
                }
            ).setOrigin(0.5);
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    createButtons() {
        const centerX = this.cameras.main.centerX;
        const startY = 500;
        const spacing = 60;

        const buttons = [
            { text: 'Try Again', callback: () => this.restartGame() },
            { text: 'Main Menu', callback: () => this.returnToMenu() }
        ];

        buttons.forEach((button, index) => {
            this.createMenuButton(
                centerX,
                startY + (spacing * index),
                button.text,
                button.callback
            );
        });
    }

    createMenuButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 200, 40, 0x000000, 0.8)
            .setStrokeStyle(2, 0x00ff00);

        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        button.add([bg, buttonText]);

        bg.setInteractive()
            .on('pointerover', () => {
                bg.setStrokeStyle(2, 0x00ffff);
                buttonText.setFill('#00ffff');
                this.tweens.add({
                    targets: button,
                    scale: 1.1,
                    duration: 100
                });
            })
            .on('pointerout', () => {
                bg.setStrokeStyle(2, 0x00ff00);
                buttonText.setFill('#ffffff');
                this.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 100
                });
            })
            .on('pointerdown', () => {
                this.sound.play('menu-select');
                callback();
            });

        return button;
    }

    setupInput() {
        this.input.keyboard.on('keydown-SPACE', () => {
            this.restartGame();
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.returnToMenu();
        });
    }

    restartGame() {
        this.scene.stop('GameScene');
        this.scene.stop('UIScene');
        this.scene.start('GameScene');
        this.scene.stop();
    }

    returnToMenu() {
        this.scene.stop('GameScene');
        this.scene.stop('UIScene');
        this.scene.start('MenuScene');
        this.scene.stop();
    }
}