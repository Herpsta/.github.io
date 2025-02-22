// src/entities/enemies/BasicEnemy.js
export default class BasicEnemy extends BaseEnemy {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y, {
            ...config,
            type: 'basic',
            sprite: 'enemy_basic',
            health: 100,
            damage: 10,
            speed: 100,
            points: 10
        });
    }

    updateBehavior(time, delta) {
        // Simple chase behavior
        const player = this.scene.player.sprite;
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        );

        const speed = this.sprite.getData('speed');
        this.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        this.sprite.rotation = angle + Math.PI / 2;
    }
}
