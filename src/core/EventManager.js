// src/core/EventManager.js
export default class EventManager {
    constructor() {
        this.events = new Phaser.Events.EventEmitter();
        this.debugMode = false;
    }

    emit(eventName, ...args) {
        if (this.debugMode) {
            console.log(`[Event Emitted] ${eventName}`, ...args);
        }
        this.events.emit(eventName, ...args);
    }

    on(eventName, fn, context) {
        this.events.on(eventName, fn, context);
    }

    off(eventName, fn, context) {
        this.events.off(eventName, fn, context);
    }

    setDebugMode(enabled) {
        this.debugMode = enabled;
    }

    destroy() {
        this.events.removeAllListeners();
    }
}