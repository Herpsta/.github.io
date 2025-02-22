// src/entities/enemies/BossEnemy.js
export default class BossEnemy extends BaseEnemy {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y, {
            ...config,
            type: 'boss',
            sprite: 'enemy_boss',
            health: 1000,
            damage: 30,
            speed: 60,
            points: 100,
            attackCooldown: 3000
        });

        this.attackPatterns = ['circular', 'burst', 'spiral'];
        this.currentPattern = 0;
        this.setupPhaseTransitions();
    }

    setupPhaseTransitions() {
        this.phases = [
            { threshold: 0.7, triggered: false },
            { threshold: 0.4, triggered: false },
            { threshold: 0.2, triggered: false }
        ];
    }

    updateBehavior(time, delta) {
        // Check phase transitions
        this.checkPhaseTransition();

        // Update movement pattern
        this.updateMovement(time, delta);

        // Update attack pattern
        if (time > this.lastAttackTime + this.attackCooldown) {
            this.executeAttackPattern();
            this.lastAttackTime = time;
        }
    }

    checkPhaseTransition() {
        const healthPercentage = this.sprite.getData('health') / 1000;
        
        this.phases.forEach(phase => {
            if (!phase.triggered && healthPercentage <= phase.threshold) {
                this.triggerPhaseTransition(phase);
                phase.triggered = true;
            }
        });
    }

    triggerPhaseTransition(phase) {
        // Create phase transition effect
        this.createPhaseTransitionEffect();

        // Increase attack frequency
        this.attackCooldown *= 0.8;

        // Change attack pattern
        this.currentPattern = (this.currentPattern + 1) % this.attackPatterns.length;

        // Heal a small amount
        const health = this.sprite.getData('health');
        this.sprite.setData('health', health + 100);
    }

    createPhaseTransitionEffect() {
        // Create shockwave effect
        const circle = this.scene.add.circle(
            this.sprite.x, this.sprite.y,
            50, 0xff0000, 0.5
        );

        this.scene.tweens.add({
            targets: circle,
            scale: 10,
            alpha: 0,
            duration: 1000,
            onComplete: () => circle.destroy()
        });

        // Screen shake
        this.scene.cameras.main.shake(500, 0.01);
    }

    updateMovement(time, delta) {
        const player = this.scene.player.sprite;
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        );

        // Complex movement pattern
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        );

        const speed = this.sprite.getData('speed');
        const t = time / 1000;

        // Circular movement with player tracking
        this.sprite.setVelocity(
            Math.cos(angle + Math.sin(t)) * speed,
            Math.sin(angle + Math.sin(t)) * speed
        );

        // Always face player
        this.sprite.rotation = angle + Math.PI / 2;
    }

    executeAttackPattern() {
        switch (this.attackPatterns[this.currentPattern]) {
            case 'circular':
                this.circularAttack();
                break;
            case 'burst':
                this.burstAttack();
                break;
            case 'spiral':
                this.spiralAttack();
                break;
        }
    }

    circularAttack() {
        const projectileCount = 12;
        const angleStep = (Math.PI * 2) / projectileCount;

        for (let i = 0; i < projectileCount; i++) {
            const angle = i * angleStep;
            this.fireProjectile(angle);
        }
    }

    burstAttack() {
        const burstCount = 3;
        const projectilesPerBurst = 5;
        
        for (let i = 0; i < burstCount; i++) {
            this.scene.time.delayedCall(i * 200, () => {
                for (let j = 0; j < projectilesPerBurst; j++) {
                    const spread = (j - (projectilesPerBurst - 1) / 2) * 0.2;
                    const angle = Phaser.Math.Angle.Between(
                        this.sprite.x, this.sprite.y,
                        this.scene.player.sprite.x, this.scene.player.sprite.y
                    ) + spread;
                    this.fireProjectile(angle);
                }
            });
        }
    }

    spiralAttack() {
        const projectileCount = 20;
        let angle = 0;

        for (let i = 0; i < projectileCount; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                this.fireProjectile(angle);
                angle += 0.5;
            });
        }
    }

    fireProjectile(angle) {
        const projectile = this.scene.entityManager.createEntity('enemyProjectiles',
            this.sprite.x, this.sprite.y,
            {
                sprite: 'boss_projectile',
                damage: this.sprite.getData('damage'),
                lifespan: 4000
            }
        );

        const projectileSpeed = 150;
        projectile.setVelocity(
            Math.cos(angle) * projectileSpeed,
            Math.sin(angle) * projectileSpeed
        );

        // Add visual effects
        projectile.setTint(0xff0000);
        this.scene.add.particles('particle').createEmitter({
            follow: projectile,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: 20,
            lifespan: 200,
            blendMode: 'ADD'
        });
    }
}