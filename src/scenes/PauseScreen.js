// src/scenes/PauseScene.js
export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        this.createBackground();
        this.createPauseMenu();
        this.setupInput();
    }

    createBackground() {
        // Semi-transparent dark background
        this.bg = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.7
        ).setOrigin(0);

        // Add blur effect to game scene
        this.game.scene.getScene('GameScene').cameras.main.setAlpha(0.5);
    }

    createPauseMenu() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Pause title
        this.add.text(centerX, centerY - 100, 'PAUSED', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Create menu options
        this.menuOptions = [
            { text: 'Resume', callback: () => this.resumeGame() },
            { text: 'Options', callback: () => this.showOptions() },
            { text: 'Quit to Menu', callback: () => this.quitToMenu() }
        ];

        this.menuButtons = this.menuOptions.map((option, index) => {
            return this.createMenuButton(
                centerX,
                centerY + (index * 60),
                option.text,
                option.callback
            );
        });

        // Add controls info
        this.add.text(centerX, this.cameras.main.height - 50,
            'ESC to Resume | Arrow Keys to Navigate | ENTER to Select',
            {
                fontSize: '16px',
                fill: '#ffffff',
                fontFamily: 'monospace'
            }
        ).setOrigin(0.5);
    }

    createMenuButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        // Button background
        const bg = this.add.rectangle(0, 0, 200, 40, 0x000000, 0.8)
            .setStrokeStyle(2, 0x00ff00);

        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        button.add([bg, buttonText]);

        // Make interactive
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
        this.input.keyboard.on('keydown-ESC', () => {
            this.resumeGame();
        });
    }

    resumeGame() {
        // Restore game scene alpha
        this.game.scene.getScene('GameScene').cameras.main.setAlpha(1);
        
        // Resume game scene and stop pause scene
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    showOptions() {
        this.scene.launch('OptionsScene');
        this.scene.pause();
    }

    quitToMenu() {
        // Show confirmation dialog
        this.createConfirmationDialog(
            'Quit to Menu?',
            'Progress will be lost!',
            () => {
                // Reset game scene
                this.scene.get('GameScene').scene.restart();
                
                // Stop all scenes and return to menu
                this.scene.stop('GameScene');
                this.scene.stop('UIScene');
                this.scene.stop();
                this.scene.start('MenuScene');
            }
        );
    }

    createConfirmationDialog(title, message, callback) {
        const dialog = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);

        // Background
        const bg = this.add.rectangle(0, 0, 400, 200, 0x000000, 0.9)
            .setStrokeStyle(2, 0xff0000);

        // Title
        const titleText = this.add.text(0, -60, title, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Message
        const messageText = this.add.text(0, -20, message, {
            fontSize: '20px',
            fill: '#ff0000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Buttons
        const confirmButton = this.createMenuButton(
            -80, 40,
            'Yes',
            () => {
                callback();
                dialog.destroy();
            }
        ).setScale(0.8);

        const cancelButton = this.createMenuButton(
            80, 40,
            'No',
            () => dialog.destroy()
        ).setScale(0.8);

        dialog.add([bg, titleText, messageText, confirmButton, cancelButton]);
    }
}