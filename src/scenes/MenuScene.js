// src/scenes/MenuScene.js
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.selectedOption = 0;
        this.menuOptions = ['Start Game', 'Options', 'Credits'];
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.setupBackground();
        this.createTitle();
        this.createMenu();
        this.setupInput();
        this.playMenuMusic();
        this.createParticleEffect();
    }

    setupBackground() {
        // Create starfield background
        const particles = this.add.particles('particle');
        particles.createEmitter({
            x: { min: 0, max: this.game.config.width },
            y: -10,
            speedY: { min: 20, max: 50 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.5, end: 0 },
            quantity: 1,
            frequency: 500,
            lifespan: 5000,
            alpha: { start: 0.5, end: 0 },
            tint: [0x0000ff, 0x00ffff, 0x00ff00]
        });
    }

    createTitle() {
        const title = this.add.text(
            this.cameras.main.centerX,
            100,
            'WAVE SURVIVAL',
            {
                fontFamily: 'monospace',
                fontSize: '64px',
                fill: '#ffffff',
                stroke: '#00ff00',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Add glow effect
        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    createMenu() {
        this.menuItems = [];
        const startY = this.cameras.main.centerY - 50;
        const spacing = 60;

        this.menuOptions.forEach((option, index) => {
            const menuItem = this.add.container(
                this.cameras.main.centerX,
                startY + (spacing * index)
            );

            // Background
            const bg = this.add.rectangle(0, 0, 200, 40, 0x000000, 0.5)
                .setStrokeStyle(2, 0x00ff00);

            // Text
            const text = this.add.text(0, 0, option, {
                fontFamily: 'monospace',
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);

            menuItem.add([bg, text]);
            menuItem.setInteractive(
                new Phaser.Geom.Rectangle(-100, -20, 200, 40),
                Phaser.Geom.Rectangle.Contains
            )
                .on('pointerover', () => this.selectMenuItem(index))
                .on('pointerdown', () => this.confirmSelection());

            this.menuItems.push({ container: menuItem, bg, text });
        });

        this.selectMenuItem(0);
    }

    setupInput() {
        this.input.keyboard.on('keydown-UP', () => {
            this.selectMenuItem(
                (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length
            );
            this.sound.play('menu-select', { volume: 0.5 });
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            this.selectMenuItem(
                (this.selectedOption + 1) % this.menuOptions.length
            );
            this.sound.play('menu-select', { volume: 0.5 });
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.confirmSelection();
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.confirmSelection();
        });
    }

    selectMenuItem(index) {
        // Deselect previous item
        const prevItem = this.menuItems[this.selectedOption];
        prevItem.bg.setStrokeStyle(2, 0x00ff00);
        prevItem.text.setFill('#ffffff');
        this.tweens.add({
            targets: prevItem.container,
            scale: 1,
            duration: 200
        });

        // Select new item
        this.selectedOption = index;
        const newItem = this.menuItems[this.selectedOption];
        newItem.bg.setStrokeStyle(2, 0x00ffff);
        newItem.text.setFill('#00ffff');
        this.tweens.add({
            targets: newItem.container,
            scale: 1.1,
            duration: 200
        });
    }

    confirmSelection() {
        this.sound.play('menu-select', { volume: 0.7 });
        
        const selectedItem = this.menuItems[this.selectedOption];
        this.tweens.add({
            targets: selectedItem.container,
            alpha: 0.5,
            yoyo: true,
            duration: 100,
            onComplete: () => this.handleSelection()
        });
    }

    handleSelection() {
        switch (this.selectedOption) {
            case 0: // Start Game
                this.startGame();
                break;
            case 1: // Options
                this.showOptions();
                break;
            case 2: // Credits
                this.showCredits();
                break;
        }
    }

    startGame() {
        this.cameras.main.fadeOut(1000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }

    showOptions() {
        this.scene.launch('OptionsScene');
        this.scene.pause();
    }

    showCredits() {
        this.scene.launch('CreditsScene');
        this.scene.pause();
    }

    playMenuMusic() {
        if (!this.sound.get('menu-music')) {
            this.sound.play('menu-music', {
                loop: true,
                volume: 0.5
            });
        }
    }

    createParticleEffect() {
        const particles = this.add.particles('particle');
        
        // Create a circular motion effect
        const radius = 100;
        const points = 10;
        const angle = 360 / points;
        
        for (let i = 0; i < points; i++) {
            const x = this.cameras.main.centerX + radius * Math.cos(angle * i * Math.PI / 180);
            const y = this.cameras.main.centerY + radius * Math.sin(angle * i * Math.PI / 180);
            
            particles.createEmitter({
                x: x,
                y: y,
                speed: { min: 10, max: 20 },
                scale: { start: 0.5, end: 0 },
                lifespan: 1000,
                frequency: 100,
                tint: 0x00ff00
            });
        }
    }
}