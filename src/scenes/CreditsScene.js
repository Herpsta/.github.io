// src/scenes/CreditsScene.js
export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        this.createBackground();
        this.createCredits();
        this.setupInput();
    }

    createBackground() {
        // Semi-transparent dark background
        this.bg = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.9
        ).setOrigin(0);

        // Add title
        this.add.text(
            this.cameras.main.centerX,
            50,
            'CREDITS',
            {
                fontSize: '48px',
                fill: '#ffffff',
                fontFamily: 'monospace',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
    }

    createCredits() {
        const credits = [
            { header: 'Game Design & Development', content: ['Your Name'] },
            { header: 'Programming', content: ['Your Name', 'Additional Contributors'] },
            { header: 'Art & Visual Effects', content: ['Generated with AssetGenerator'] },
            { header: 'Sound Effects', content: ['Generated with Web Audio API'] },
            { header: 'Special Thanks', content: ['Phaser Framework', 'Your Community'] },
            { header: 'Version', content: [`v${GAME_CONSTANTS.VERSION}`] }
        ];

        const startY = 150;
        const spacing = 100;

        credits.forEach((section, index) => {
            const y = startY + (spacing * index);
            
            // Header
            this.add.text(
                this.cameras.main.centerX,
                y,
                section.header,
                {
                    fontSize: '24px',
                    fill: '#00ff00',
                    fontFamily: 'monospace'
                }
            ).setOrigin(0.5);

            // Content
            section.content.forEach((line, lineIndex) => {
                this.add.text(
                    this.cameras.main.centerX,
                    y + 30 + (lineIndex * 25),
                    line,
                    {
                        fontSize: '20px',
                        fill: '#ffffff',
                        fontFamily: 'monospace'
                    }
                ).setOrigin(0.5);
            });
        });

        // Back button
        this.createBackButton();
    }

    createBackButton() {
        const button = this.add.container(
            this.cameras.main.centerX,
            this.cameras.main.height - 100
        );

        const bg = this.add.rectangle(0, 0, 200, 40, 0x000000)
            .setStrokeStyle(2, 0x00ff00);

        const text = this.add.text(0, 0, 'Back', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        button.add([bg, text]);

        bg.setInteractive()
            .on('pointerover', () => {
                bg.setStrokeStyle(2, 0x00ffff);
                text.setFill('#00ffff');
            })
            .on('pointerout', () => {
                bg.setStrokeStyle(2, 0x00ff00);
                text.setFill('#ffffff');
            })
            .on('pointerdown', () => {
                this.sound.play('menu-select');
                this.exit();
            });
    }

    setupInput() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.exit();
        });
    }

    exit() {
        if (this.scene.get('GameScene').scene.isActive()) {
            this.scene.resume('GameScene');
            this.scene.resume('PauseScene');
        } else {
            this.scene.resume('MenuScene');
        }
        this.scene.stop();
    }
}