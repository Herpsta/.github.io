// src/entities/enemies/BaseEnemy.js
export default class BaseEnemy {
    constructor(scene, x, y, config = {}) {
        this.scene = scene;
        this.sprite = scene.entityManager.createEntity('enemies', x, y, {
            sprite: config.sprite || 'enemy',
            health: config.health || 100,
            damage: config.damage || 10,
            speed: config.speed || 100,
            points: config.points || 10,
            type: config.type || 'basic',
            behavior: this.updateBehavior.bind(this)
        });

        this.setupPhysics();
        this.setupAnimations();
        this.lastAttackTime = 0;
        this.attackCooldown = config.attackCooldown || 2000;
    }

    setupPhysics() {
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.2);
        this.sprite.setFriction(1);
    }

    setupAnimations() {
        // Override in specific enemy classes
    }

    update(time, delta) {
        if (!this.sprite.active) return;
        
        this.updateBehavior(time, delta);
        this.updateEffects(time, delta);
    }

    updateBehavior(time, delta) {
        // Override in specific enemy classes
    }

    updateEffects(time, delta) {
        // Update any active effects (damage flashing, etc.)
        if (this.sprite.getData('flashTime') > time) {
            this.sprite.setTint(0xff0000);
        } else {
            this.sprite.clearTint();
        }
    }

    takeDamage(amount) {
        const health = this.sprite.getData('health') - amount;
        this.sprite.setData('health', health);
        
        // Visual feedback
        this.sprite.setData('flashTime', this.scene.time.now + 100);
        
        // Create damage number
        this.showDamageNumber(amount);
        
        return health <= 0;
    }

    showDamageNumber(amount) {
        const text = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 20,
            amount.toString(),
            {
                fontSize: '20px',
                fill: '#ff0000',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    destroy() {
        this.sprite.destroy();
    }
}