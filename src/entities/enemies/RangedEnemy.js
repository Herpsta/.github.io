// src/entities/enemies/RangedEnemy.js
export default class RangedEnemy extends BaseEnemy {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y, {
            ...config,
            type: 'ranged',
            sprite: 'enemy_ranged',
            health: 80,
            damage: 15,
            speed: 80,
            points: 15,
            attackCooldown: 2000
        });
    }

    updateBehavior(time, delta) {
        const player = this.scene.player.sprite;
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        );

        // Keep distance from player
        const idealDistance = 200;
        if (distanceToPlayer < idealDistance) {
            // Move away from player
            this.moveAwayFromPlayer(player, distanceToPlayer);
        } else if (distanceToPlayer > idealDistance + 50) {
            // Move closer to player
            this.moveTowardPlayer(player);
        } else {
            // Stop and attack
            this.sprite.setVelocity(0, 0);
        }

        // Always face player
        this.sprite.rotation = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        ) + Math.PI / 2;

        // Attack if cooldown is ready
        if (time > this.lastAttackTime + this.attackCooldown) {
            this.attack(player);
            this.lastAttackTime = time;
        }
    }

    moveAwayFromPlayer(player, distance) {
        const angle = Phaser.Math.Angle.Between(
            player.x, player.y,
            this.sprite.x, this.sprite.y
        );
        
        const speed = this.sprite.getData('speed');
        this.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    moveTowardPlayer(player) {
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        );
        
        const speed = this.sprite.getData('speed') * 0.5;
        this.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    attack(player) {
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        );

        const projectile = this.scene.entityManager.createEntity('enemyProjectiles',
            this.sprite.x, this.sprite.y,
            {
                sprite: 'enemy_projectile',
                damage: this.sprite.getData('damage'),
                lifespan: 3000
            }
        );

        const projectileSpeed = 200;
        projectile.setVelocity(
            Math.cos(angle) * projectileSpeed,
            Math.sin(angle) * projectileSpeed
        );

        // Create muzzle flash effect
        this.createMuzzleFlash(angle);
    }

    createMuzzleFlash(angle) {
        const flash = this.scene.add.sprite(
            this.sprite.x + Math.cos(angle) * 30,
            this.sprite.y + Math.sin(angle) * 30,
            'muzzle_flash'
        );
        flash.setRotation(angle);
        flash.setScale(0.5);

        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 0.2,
            duration: 100,
            onComplete: () => flash.destroy()
        });
    }
}