// src/systems/PowerupSystem.js
import { EVENTS } from '../core/Constants.js';

export default class PowerupSystem {
    constructor(scene) {
        this.scene = scene;
        this.activePowerups = new Map();
        this.setupPowerupTypes();
    }

    setupPowerupTypes() {
        this.powerupTypes = {
            speedBoost: {
                sprite: 'powerup_speed',
                color: 0xffff00,
                duration: 5000,
                apply: (player) => {
                    const originalSpeed = player.getData('speed');
                    player.setData('speed', originalSpeed * 1.5);
                    return () => player.setData('speed', originalSpeed);
                }
            },
            damageBoost: {
                sprite: 'powerup_damage',
                color: 0xff0000,
                duration: 7000,
                apply: (player) => {
                    const originalDamage = player.getData('damage');
                    player.setData('damage', originalDamage * 1.75);
                    return () => player.setData('damage', originalDamage);
                }
            },
            rapidFire: {
                sprite: 'powerup_fire',
                color: 0x00ffff,
                duration: 4000,
                apply: (player) => {
                    const originalRate = player.getData('fireRate');
                    player.setData('fireRate', originalRate * 0.5);
                    return () => player.setData('fireRate', originalRate);
                }
            },
            shield: {
                sprite: 'powerup_shield',
                color: 0x0000ff,
                duration: 8000,
                apply: (player) => {
                    const shield = this.createShieldEffect(player);
                    return () => shield.destroy();
                }
            }
        };
    }

    createShieldEffect(player) {
        const shield = this.scene.add.circle(
            player.x, player.y, 40,
            0x0000ff, 0.3
        );
        
        this.scene.tweens.add({
            targets: shield,
            alpha: 0.1,
            yoyo: true,
            duration: 1000,
            repeat: -1
        });

        // Update shield position with player
        const updateShield = () => {
            shield.setPosition(player.x, player.y);
        };
        this.scene.events.on('update', updateShield);

        shield.destroy = () => {
            this.scene.events.off('update', updateShield);
            shield.destroy();
        };

        return shield;
    }

    spawnPowerup(x, y) {
        const types = Object.keys(this.powerupTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const powerupConfig = this.powerupTypes[randomType];

        const powerup = this.scene.entityManager.createEntity('powerups', x, y, {
            sprite: powerupConfig.sprite,
            type: randomType,
            ...powerupConfig
        });

        // Add floating animation
        this.scene.tweens.add({
            targets: powerup,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Add glow effect
        const glow = this.scene.add.circle(x, y, 30, powerupConfig.color, 0.3);
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.1,
            scale: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Link glow to powerup
        powerup.setData('glowEffect', glow);
        
        return powerup;
    }

    collectPowerup(player, powerup) {
        const type = powerup.getData('type');
        const powerupConfig = this.powerupTypes[type];

        // Remove existing powerup of same type
        if (this.activePowerups.has(type)) {
            const existing = this.activePowerups.get(type);
            existing.timer.remove();
            existing.revert();
            this.activePowerups.delete(type);
        }

        // Apply new powerup
        const revertFunction = powerupConfig.apply(player);
        const timer = this.scene.time.delayedCall(
            powerupConfig.duration,
            () => {
                revertFunction();
                this.activePowerups.delete(type);
                this.createExpireEffect(player.x, player.y, powerupConfig.color);
            }
        );

        this.activePowerups.set(type, {
            timer: timer,
            revert: revertFunction
        });

        // Create collect effect
        this.createCollectEffect(powerup);

        // Remove powerup and its glow effect
        const glow = powerup.getData('glowEffect');
        if (glow) glow.destroy();
        this.scene.entityManager.removeEntity(powerup);

        // Emit collection event
        this.scene.events.emit(EVENTS.POWERUP.COLLECTED, type);
    }

    createCollectEffect(powerup) {
        const particles = this.scene.add.particles('particle');
        const emitter = particles.createEmitter({
            x: powerup.x,
            y: powerup.y,
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            tint: powerup.getData('color'),
            lifespan: 500,
            quantity: 20,
            blendMode: 'ADD'
        });

        this.scene.time.delayedCall(500, () => {
            emitter.stop();
            this.scene.time.delayedCall(1000, () => {
                particles.destroy();
            });
        });
    }

    createExpireEffect(x, y, color) {
        const circle = this.scene.add.circle(x, y, 40, color, 0.5);
        
        this.scene.tweens.add({
            targets: circle,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => circle.destroy()
        });
    }

    update() {
        // Update powerup positions and effects
        this.scene.entityManager.getEntitiesByType('powerups').forEach(powerup => {
            const glow = powerup.getData('glowEffect');
            if (glow) {
                glow.setPosition(powerup.x, powerup.y);
            }
        });
    }

    destroy() {
        // Clean up all active powerups
        this.activePowerups.forEach(powerup => {
            powerup.timer.remove();
            powerup.revert();
        });
        this.activePowerups.clear();
    }
}