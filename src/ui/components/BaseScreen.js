// src/ui/components/BaseScreen.js
export default class BaseScreen {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.isVisible = false;
    }

    create() {
        this.container = this.scene.add.container(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2
        );
        this.container.setDepth(1000);
        this.createBackground();
    }

    createBackground() {
        // Semi-transparent dark background
        const bg = this.scene.add.rectangle(
            0, 0,
            this.scene.game.config.width,
            this.scene.game.config.height,
            0x000000, 0.7
        );
        
        // Make background clickable to prevent clicking through
        bg.setInteractive();
        
        const panel = this.scene.add.rectangle(
            0, 0, 600, 400,
            0x111111, 0.9
        ).setStrokeStyle(2, 0x00ff00);

        this.container.add([bg, panel]);
    }

    show() {
        if (!this.container) this.create();
        this.isVisible = true;
        
        // Animate in from top
        this.container.setPosition(
            this.scene.game.config.width / 2,
            -this.container.height
        );

        this.scene.tweens.add({
            targets: this.container,
            y: this.scene.game.config.height / 2,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => this.onShowComplete()
        });
    }

    hide() {
        if (!this.container) return;

        this.scene.tweens.add({
            targets: this.container,
            y: this.scene.game.config.height + this.container.height,
            duration: 500,
            ease: 'Back.in',
            onComplete: () => {
                this.container.destroy();
                this.container = null;
                this.isVisible = false;
                this.onHideComplete();
            }
        });
    }

    onShowComplete() {}
    onHideComplete() {}

    createButton(text, x, y, callback) {
        const button = this.scene.add.container(x, y);
        
        const bg = this.scene.add.rectangle(
            0, 0, 200, 50,
            0x222222
        ).setStrokeStyle(2, 0x00ff00);

        const label = this.scene.add.text(
            0, 0, text,
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        button.add([bg, label]);
        
        bg.setInteractive()
            .on('pointerover', () => {
                bg.setFillStyle(0x444444);
                this.scene.tweens.add({
                    targets: button,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100
                });
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x222222);
                this.scene.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            })
            .on('pointerdown', () => callback());

        return button;
    }
}