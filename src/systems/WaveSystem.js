// src/systems/WaveSystem.js
export default class WaveSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 0;
        this.enemiesRemaining = 0;
        this.isWaveActive = false;
        this.waveDelay = GAME_CONSTANTS.WAVE.DELAY;
        this.setupEvents();
    }

    setupEvents() {
        this.scene.events.on(EVENTS.ENEMY.DEATH, this.onEnemyDeath, this);
    }

    startWave() {
        this.currentWave++;
        this.isWaveActive = true;
        this.enemiesRemaining = this.calculateEnemyCount();
        
        this.displayWaveMessage();
        this.spawnWaveEnemies();
        
        this.scene.events.emit(EVENTS.WAVE.START, this.currentWave);
    }

    calculateEnemyCount() {
        return GAME_CONSTANTS.WAVE.INITIAL_ENEMIES + 
            (this.currentWave - 1) * GAME_CONSTANTS.WAVE.INCREASE_PER_WAVE;
    }

    spawnWaveEnemies() {
        const spawnDelay = 500; // ms between enemy spawns
        
        for (let i = 0; i < this.enemiesRemaining; i++) {
            this.scene.time.delayedCall(i * spawnDelay, () => {
                this.spawnEnemy();
            });
        }
    }

    spawnEnemy() {
        const spawnPoint = this.getRandomSpawnPoint();
        const enemyConfig = this.getEnemyConfig();
        
        this.scene.entityManager.createEntity('enemies', 
            spawnPoint.x, spawnPoint.y, enemyConfig);
    }

    getRandomSpawnPoint() {
        const padding = GAME_CONSTANTS.ENEMY.SPAWN_DISTANCE;
        const gameWidth = this.scene.game.config.width;
        const gameHeight = this.scene.game.config.height;

        // Randomly choose a side to spawn from
        const side = Phaser.Math.Between(0, 3);
        switch (side) {
            case 0: // Top
                return {
                    x: Phaser.Math.Between(padding, gameWidth - padding),
                    y: -padding
                };
            case 1: // Right
                return {
                    x: gameWidth + padding,
                    y: Phaser.Math.Between(padding, gameHeight - padding)
                };
            case 2: // Bottom
                return {
                    x: Phaser.Math.Between(padding, gameWidth - padding),
                    y: gameHeight + padding
                };
            case 3: // Left
                return {
                    x: -padding,
                    y: Phaser.Math.Between(padding, gameHeight - padding)
                };
        }
    }

    getEnemyConfig() {
        return {
            sprite: 'enemy',
            health: GAME_CONSTANTS.ENEMY.BASE_HEALTH + (this.currentWave * 10),
            speed: GAME_CONSTANTS.ENEMY.BASE_SPEED + (this.currentWave * 5),
            damage: 10 + Math.floor(this.currentWave / 2),
            points: 10 * this.currentWave
        };
    }

    onEnemyDeath() {
        this.enemiesRemaining--;
        
        if (this.enemiesRemaining <= 0) {
            this.endWave();
        }
    }

    endWave() {
        this.isWaveActive = false;
        this.scene.events.emit(EVENTS.WAVE.END, this.currentWave);
        
        this.scene.time.delayedCall(this.waveDelay, () => {
            this.startWave();
        });
    }

    displayWaveMessage() {
        const text = this.scene.add.text(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2,
            `Wave ${this.currentWave}`,
            {
                fontSize: '64px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 100,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    destroy() {
        this.scene.events.off(EVENTS.ENEMY.DEATH, this.onEnemyDeath, this);
    }
}