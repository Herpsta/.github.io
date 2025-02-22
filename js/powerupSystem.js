class PowerupSystem {
    constructor(scene) {
        this.scene = scene;
        this.powerupTypes = {
            speedBoost: {
                name: 'Speed Boost',
                color: 0xffff00,
                duration: 5000,
                effect: (player) => {
                    const originalSpeed = player.stats.moveSpeed;
                    player.stats.moveSpeed *= 1.5;
                    return () => player.stats.moveSpeed = originalSpeed;
                }
            },
            rapidFire: {
                name: 'Rapid Fire',
                color: 0xff0000,
                duration: 4000,
                effect: (player) => {
                    const originalRate = player.stats.fireRate;
                    player.stats.fireRate *= 0.5;
                    return () => player.stats.fireRate = originalRate;
                }
            },
            damageBoost: {
                name: 'Damage Boost',
                color: 0xff6600,
                duration: 6000,
                effect: (player) => {
                    const originalDamage = player.stats.projectileDamage;
                    player.stats.projectileDamage *= 1.5;
                    return () => player.stats.projectileDamage = originalDamage;
                }
            }
        };
        this.activeEffects = new Map();
    }

    spawnPowerup(x, y) {
        const types = Object.keys(this.powerupTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const powerup = this.scene.powerups.create(x, y, 'powerup');
        
        powerup.setData('type', randomType);
        powerup.setTint(this.powerupTypes[randomType].color);
        
        this.scene.tweens.add({
            targets: powerup,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    applyPowerup(player, powerup) {
        const type = powerup.getData('type');
        const powerupConfig = this.powerupTypes[type];
        
        if (this.activeEffects.has(type)) {
            this.activeEffects.get(type).timer.remove();
            this.activeEffects.get(type).revert();
        }

        const revertFunction = powerupConfig.effect(player);
        const timer = this.scene.time.delayedCall(powerupConfig.duration, () => {
            revertFunction();
            this.activeEffects.delete(type);
        });

        this.activeEffects.set(type, { timer, revert: revertFunction });
        this.displayPowerupMessage(powerupConfig.name);
        
        powerup.destroy();
    }

    displayPowerupMessage(name) {
        const text = this.scene.add.text(400, 150, `${name} Activated!`, {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: 100,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    update() {
        // Additional update logic if needed
    }
}