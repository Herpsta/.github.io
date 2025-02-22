// src/entities/Player.js
import { GAME_CONSTANTS } from '../core/Constants.js';

export default class Player {
    constructor(scene, x, y) {
        this.sprite = scene.entityManager.createEntity('players', x, y, {
            sprite: 'player',
            health: GAME_CONSTANTS.PLAYER.BASE_HEALTH,
            maxHealth: GAME_CONSTANTS.PLAYER.BASE_HEALTH,
            speed: GAME_CONSTANTS.PLAYER.BASE_SPEED,
            damage: GAME_CONSTANTS.PLAYER.BASE_DAMAGE,
            fireRate: GAME_CONSTANTS.PLAYER.BASE_FIRE_RATE,
            lastFired: 0
        });

        this.scene = scene;
        this.setupPhysics();
        this.setupEventListeners();
    }

    setupPhysics() {
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.1);
        this.sprite.setFriction(1);
    }

    setupEventListeners() {
        this.scene.events.on(EVENTS.PLAYER.DAMAGE, this.takeDamage, this);
        this.scene.events.on(EVENTS.PLAYER.HEAL, this.heal, this);
    }

    update(time, delta) {
        this.handleMovement();
        this.handleShooting(time);
    }

    handleMovement() {
        const movement = this.scene.inputManager.getMovementVector();
        const speed = this.sprite.getData('speed');
        
        this.sprite.setVelocity(
            movement.x * speed,
            movement.y * speed
        );
    }

    handleShooting(time) {
        if (!this.scene.inputManager.isKeyDown('space')) return;
        if (time < this.sprite.getData('lastFired') + this.sprite.getData('fireRate')) return;

        const mousePos = this.scene.inputManager.getMousePosition();
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            mousePos.x, mousePos.y
        );

        this.fireProjectile(angle);
        this.sprite.setData('lastFired', time);
    }

    fireProjectile(angle) {
        const projectile = this.scene.entityManager.createEntity('projectiles', 
            this.sprite.x, this.sprite.y, {
                sprite: 'projectile',
                damage: this.sprite.getData('damage'),
                lifespan: 2000
            }
        );

        const speed = 400;
        projectile.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        this.scene.time.delayedCall(2000, () => {
            this.scene.entityManager.removeEntity(projectile);
        });
    }

    takeDamage(amount) {
        const currentHealth = this.sprite.getData('health');
        const newHealth = Math.max(0, currentHealth - amount);
        this.sprite.setData('health', newHealth);

        if (newHealth <= 0) {
            this.scene.events.emit(EVENTS.PLAYER.DEATH);
        }
    }

    heal(amount) {
        const currentHealth = this.sprite.getData('health');
        const maxHealth = this.sprite.getData('maxHealth');
        this.sprite.setData('health', Math.min(currentHealth + amount, maxHealth));
    }

    destroy() {
        this.scene.events.off(EVENTS.PLAYER.DAMAGE, this.takeDamage, this);
        this.scene.events.off(EVENTS.PLAYER.HEAL, this.heal, this);
        this.scene.entityManager.removeEntity(this.sprite);
    }
}