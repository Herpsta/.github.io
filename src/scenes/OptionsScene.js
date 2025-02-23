// src/scenes/OptionsScene.js
export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
        this.settings = {
            music: 0.5,
            sfx: 0.7,
            difficulty: 'normal',
            particles: true,
            screenShake: true
        };
    }

    create() {
        this.loadSettings();
        this.createBackground();
        this.createOptionsMenu();
        this.setupInput();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
    }

    createBackground() {
        // Semi-transparent dark background
        this.bg = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.8
        ).setOrigin(0);

        // Add title
        this.add.text(
            this.cameras.main.centerX,
            50,
            'OPTIONS',
            {
                fontSize: '48px',
                fill: '#ffffff',
                fontFamily: 'monospace',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
    }

    createOptionsMenu() {
        const startY = 150;
        const spacing = 60;

        // Volume controls
        this.createVolumeSlider('Music Volume', startY, 'music');
        this.createVolumeSlider('SFX Volume', startY + spacing, 'sfx');

        // Difficulty selector
        this.createDifficultySelector(startY + spacing * 2);

        // Toggle options
        this.createToggleOption(
            'Particles',
            startY + spacing * 3,
            'particles',
            'Toggle visual effects'
        );
        this.createToggleOption(
            'Screen Shake',
            startY + spacing * 4,
            'screenShake',
            'Toggle screen shake effects'
        );

        // Controls info
        this.createControlsInfo(startY + spacing * 5);

        // Save and back button
        this.createMenuButton(
            this.cameras.main.centerX,
            this.cameras.main.height - 100,
            'Save & Back',
            () => this.saveAndExit()
        );
    }

    createVolumeSlider(label, y, setting) {
        const container = this.add.container(this.cameras.main.centerX, y);

        // Label
        const text = this.add.text(-150, 0, label, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(1, 0.5);

        // Slider background
        const sliderBg = this.add.rectangle(0, 0, 200, 10, 0x666666);

        // Slider fill
        const sliderFill = this.add.rectangle(
            -100, 0,
            200 * this.settings[setting],
            10,
            0x00ff00
        ).setOrigin(0, 0.5);

        // Slider handle
        const handle = this.add.circle(
            -100 + (200 * this.settings[setting]),
            0,
            15,
            0x00ff00
        );

        // Make slider interactive
        sliderBg.setInteractive()
            .on('pointerdown', (pointer) => {
                this.updateSlider(pointer, sliderBg, sliderFill, handle, setting);
            });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.updateSlider(pointer, sliderBg, sliderFill, handle, setting);
            }
        });

        container.add([text, sliderBg, sliderFill, handle]);
    }

    updateSlider(pointer, bg, fill, handle, setting) {
        const bounds = bg.getBounds();
        let x = Phaser.Math.Clamp(pointer.x, bounds.left, bounds.right);
        let value = (x - bounds.left) / bounds.width;

        this.settings[setting] = value;
        fill.width = bounds.width * value;
        handle.x = x - bounds.left - 100;

        // Update audio volume in real-time
        if (setting === 'music') {
            this.game.sound.setMusicVolume(value);
        } else if (setting === 'sfx') {
            this.game.sound.setSFXVolume(value);
        }
    }

    createDifficultySelector(y) {
        const difficulties = ['easy', 'normal', 'hard'];
        const container = this.add.container(this.cameras.main.centerX, y);

        // Label
        const text = this.add.text(-150, 0, 'Difficulty', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(1, 0.5);

        // Create buttons for each difficulty
        const buttons = difficulties.map((diff, index) => {
            const button = this.add.container((index - 1) * 100, 0);
            
            const bg = this.add.rectangle(0, 0, 90, 40, 0x000000)
                .setStrokeStyle(
                    2,
                    this.settings.difficulty === diff ? 0x00ff00 : 0x666666
                );

            const buttonText = this.add.text(0, 0, diff.toUpperCase(), {
                fontSize: '16px',
                fill: this.settings.difficulty === diff ? '#00ff00' : '#ffffff',
                fontFamily: 'monospace'
            }).setOrigin(0.5);

            button.add([bg, buttonText]);

            bg.setInteractive()
                .on('pointerdown', () => {
                    this.settings.difficulty = diff;
                    buttons.forEach(btn => {
                        btn.first.setStrokeStyle(2, 0x666666);
                        btn.last.setFill('#ffffff');
                    });
                    bg.setStrokeStyle(2, 0x00ff00);
                    buttonText.setFill('#00ff00');
                });

            return button;
        });

        container.add([text, ...buttons]);
    }

    createToggleOption(label, y, setting, tooltip) {
        const container = this.add.container(this.cameras.main.centerX, y);

        // Label
        const text = this.add.text(-150, 0, label, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(1, 0.5);

        // Toggle button
        const toggle = this.add.rectangle(0, 0, 60, 30, 0x666666)
            .setStrokeStyle(2, 0xffffff);

        const indicator = this.add.circle(
            this.settings[setting] ? 15 : -15,
            0,
            12,
            this.settings[setting] ? 0x00ff00 : 0xff0000
        );

        // Tooltip
        const tooltipText = this.add.text(50, 0, tooltip, {
            fontSize: '16px',
            fill: '#888888',
            fontFamily: 'monospace'
        }).setOrigin(0, 0.5);

        toggle.setInteractive()
            .on('pointerdown', () => {
                this.settings[setting] = !this.settings[setting];
                indicator.x = this.settings[setting] ? 15 : -15;
                indicator.setFillStyle(this.settings[setting] ? 0x00ff00 : 0xff0000);
            });

        container.add([text, toggle, indicator, tooltipText]);
    }

    createControlsInfo(y) {
        const container = this.add.container(this.cameras.main.centerX, y);

        const controls = [
            'WASD / Arrows - Move',
            'Mouse - Aim',
            'Left Click / Space - Shoot',
            'ESC - Pause'
        ];

        const title = this.add.text(0, -30, 'Controls', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        const controlsText = controls.map((control, index) => {
            return this.add.text(0, index * 25, control, {
                fontSize: '16px',
                fill: '#888888',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
        });

        container.add([title, ...controlsText]);
    }

    createMenuButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 200, 40, 0x000000)
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
            })
            .on('pointerout', () => {
                bg.setStrokeStyle(2, 0x00ff00);
                buttonText.setFill('#ffffff');
            })
            .on('pointerdown', () => {
                this.sound.play('menu-select');
                callback();
            });

        return button;
    }

    setupInput() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.saveAndExit();
        });
    }

    saveAndExit() {
        // Save settings to localStorage
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));

        // Apply settings
        this.applySettings();

        // Return to previous scene
        if (this.scene.get('GameScene').scene.isActive()) {
            this.scene.resume('GameScene');
            this.scene.resume('PauseScene');
        }
        this.scene.stop();
    }

    applySettings() {
        // Apply volume settings
        this.game.sound.setMusicVolume(this.settings.music);
        this.game.sound.setSFXVolume(this.settings.sfx);

        // Apply other settings to game configuration
        this.game.config.gameSettings = this.settings;
    }
}