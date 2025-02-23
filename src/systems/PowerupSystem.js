// src/systems/PowerupSystem.js
import { EVENTS, GAME_CONSTANTS, COLORS } from '../core/Constants.js';

export default class PowerupSystem {
    constructor(scene) {
        this.scene = scene;
        this.activePowerups = new Map();
        this.setupPowerupTypes();
    }

    setupPowerupTypes() {
        this.powerupTypes = {
            health: {
                sprite: ASSETS.SPRITES.POWERUP,
                color: COLORS.POWERUPS.HEALTH,
                duration: GAME_CONSTANTS.POWERUP.DURATION,
                apply: (player) => {
                    const healAmount = player.getData('maxHealth') * 0.3;
                    const currentHealth = player.getData('health');
                    const maxHealth = player.getData('maxHealth');
                    player.setData('health', Math.min(currentHealth + healAmount, maxHealth));
                    return () => {}; // Health powerup has no revert function
                }
            },
            speed: {
                sprite: ASSETS.SPRITES.POWERUP,
                color: COLORS.POWERUPS.SPEED,
                duration: GAME_CONSTANTS.POWERUP.DURATION,
                apply: (player) => {
                    const originalSpeed = player.getData('speed');
                    const newSpeed = originalSpeed * 1.5;
                    player.setData('speed', newSpeed);
                    return () => player.setData('speed', originalSpeed);
                }
            },
            damage: {
                sprite: ASSETS.SPRITES.POWERUP,
                color: COLORS.POWERUPS.DAMAGE,
                duration: GAME_CONSTANTS.POWERUP.DURATION,
                apply: (player) => {
                    const originalDamage = player.getData('damage');
                    const newDamage = originalDamage * 1.75;
                    player.setData('damage', newDamage);
                    return () => player.setData('damage', originalDamage);
                }
            },
            shield: {
                sprite: ASSETS.SPRITES.POWERUP,
                color: COLORS.POWERUPS.SHIELD,
                duration: GAME_CONSTANTS.POWERUP.DURATION,
                apply: (player) => {
                    const shield = this.createShieldEffect(player);
                    player.setData('isShielded', true);
                    return () => {
                        shield.destroy();
                        player.setData('isShielded', false);
                    };
                }
            }
        };
    }

    createShieldEffect(player) {
        const shield = this.scene.add.circle(
            player.x, player.y, 40,
            COLORS.POWERUPS.SHIELD,
            0.3
        );
        
        // Add shield to effects layer
        shield.setDepth(DEPTHS.EFFECTS);
        
        // Add pulsing effect
        this.scene.tweens.add({
            targets: shield,
            alpha: 0.1,
            scale: 1.1,
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
            this.createShieldBreakEffect(shield.x, shield.y);
            shield.destroy();
        };

        return shield;
    }

    createShieldBreakEffect(x, y) {
        const particles = this.scene.add.particles(ASSETS.SPRITES.PARTICLE);
        
        particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            tint: COLORS.POWERUPS.SHIELD,
            lifespan: 500,
            quantity: 20,
            blendMode: 'ADD'
        });

        this.scene.time.delayedCall(500, () => particles.destroy());
    }

    spawnPowerup(x, y) {
        const types = GAME_CONSTANTS.POWERUP.TYPES;
        const randomType = types[Math.floor(Math.random() * types.length)];
        const powerupConfig = this.powerupTypes[randomType];

        const powerup = this.scene.entityManager.createEntity('powerups', x, y, {
            sprite: powerupConfig.sprite,
            type: randomType,
            color: powerupConfig.color,
            duration: powerupConfig.duration
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
        glow.setDepth(DEPTHS.EFFECTS);
        
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

        // Handle existing powerup of same type
        if (this.activePowerups.has(type)) {
            const existing = this.activePowerups.get(type);
            existing.timer.remove();
            existing.revert();
            this.activePowerups.delete(type);
        }

        // Apply powerup effect
        const revertFunction = powerupConfig.apply(player);
        
        // Create timer for powerup duration
        const timer = this.scene.time.delayedCall(
            powerupConfig.duration,
            () => {
                revertFunction();
                this.activePowerups.delete(type);
                this.scene.events.emit(EVENTS.POWERUP.EXPIRED, type);
            }
        );

        // Store active powerup
        this.activePowerups.set(type, {
            timer: timer,
            revert: revertFunction
        });

        // Create collect effect
        this.createCollectEffect(powerup);

        // Play powerup sound
        this.scene.sound.play(ASSETS.AUDIO.SFX.POWERUP, { volume: 0.5 });

        // Clean up powerup
        const glow = powerup.getData('glowEffect');
        if (glow) glow.destroy();
        this.scene.entityManager.removeEntity(powerup);

        // Emit collection event
        this.scene.events.emit(EVENTS.POWERUP.COLLECTED, {
            type: type,
            duration: powerupConfig.duration
        });
    }

    createCollectEffect(powerup) {
        const particles = this.scene.add.particles(ASSETS.SPRITES.PARTICLE);
        
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
            this.scene.time.delayedCall(500, () => {
                particles.destroy();
            });
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