// src/core/InputManager.js
export default class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.keys = {};
        this.setupInput();
    }

    setupInput() {
        this.keys = {
            up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            shift: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            esc: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        };

        // Add custom event handling
        Object.values(this.keys).forEach(key => {
            key.on('down', () => this.scene.events.emit(EVENTS.INPUT.KEY_DOWN, key));
            key.on('up', () => this.scene.events.emit(EVENTS.INPUT.KEY_UP, key));
        });
    }

    getMovementVector() {
        const vector = { x: 0, y: 0 };
        
        if (this.keys.up.isDown) vector.y -= 1;
        if (this.keys.down.isDown) vector.y += 1;
        if (this.keys.left.isDown) vector.x -= 1;
        if (this.keys.right.isDown) vector.x += 1;

        // Normalize for diagonal movement
        if (vector.x !== 0 && vector.y !== 0) {
            const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            vector.x /= length;
            vector.y /= length;
        }

        return vector;
    }

    getMousePosition() {
        return {
            x: this.scene.input.mousePointer.x,
            y: this.scene.input.mousePointer.y
        };
    }

    isKeyDown(keyCode) {
        return this.keys[keyCode]?.isDown || false;
    }

    destroy() {
        Object.values(this.keys).forEach(key => {
            key.removeAllListeners();
        });
        this.keys = {};
    }
}