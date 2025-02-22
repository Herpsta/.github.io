// src/ui/components/ToastNotification.js
export default class ToastNotification {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];
        this.isDisplaying = false;
    }

    show(message, type = 'info') {
        this.queue.push({ message, type });
        if (!this.isDisplaying) {
            this.displayNext();
        }
    }

    displayNext() {
        if (this.queue.length === 0) {
            this.isDisplaying = false;
            return;
        }

        this.isDisplaying = true;
        const { message, type } = this.queue.shift();
        this.createToast(message, type);
    }

    createToast(message, type) {
        const colors = {
            info: 0x0088ff,
            success: 0x00ff00,
            warning: 0xffff00,
            error: 0xff0000
        };

        const container = this.scene.add.container(
            this.scene.game.config.width / 2,
            -50
        );

        const bg = this.scene.add.rectangle(
            0, 0, 400, 50,
            colors[type], 0.9
        ).setStrokeStyle(2, 0xffffff);

        const text = this.scene.add.text(
            0, 0,
            message,
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        container.add([bg, text]);

        // Slide in
        this.scene.tweens.add({
            targets: container,
            y: 50,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => {
                // Wait and slide out
                this.scene.time.delayedCall(2000, () => {
                    this.scene.tweens.add({
                        targets: container,
                        y: -50,
                        duration: 500,
                        ease: 'Back.in',
                        onComplete: () => {
                            container.destroy();
                            this.displayNext();
                        }
                    });
                });
            }
        });
    }
}