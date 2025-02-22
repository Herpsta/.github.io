class WaveSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 1;
        this.enemiesPerWave = 10;
        this.enemiesRemaining = 10;
        this.waveDelay = 5000;
        this.isWaveActive = false;
        this.nextWaveTime = 0;
        this.baseEnemyHealth = 50;
        this.baseEnemySpeed = 100;
    }

    startWave() {
        this.isWaveActive = true;
        this.enemiesRemaining = this.enemiesPerWave;
        this.displayWaveMessage();
        
        for (let i = 0; i < this.enemiesPerWave; i++) {
            const enemyConfig = {
                health: this.baseEnemyHealth + (this.currentWave * 10),
                speed: this.baseEnemySpeed + (this.currentWave * 5)
            };
            this.spawnEnemy(enemyConfig);
        }
    }

    spawnEnemy(config) {
        const spawnPoint = this.getRandomSpawnPoint();
        const enemy = this.scene.enemies.create(spawnPoint.x, spawnPoint.y, 'enemy');
        enemy.setData('health', config.health);
        enemy.setData('speed', config.speed);
        enemy.setCollideWorldBounds(true);
        enemy.setTint(0xff0000);
    }

    getRandomSpawnPoint() {
        const edge = Phaser.Math.Between(0, 3);
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        switch (edge) {
            case 0: return { x: Phaser.Math.Between(0, width), y: 0 }; // Top
            case 1: return { x: width, y: Phaser.Math.Between(0, height) }; // Right
            case 2: return { x: Phaser.Math.Between(0, width), y: height }; // Bottom
            case 3: return { x: 0, y: Phaser.Math.Between(0, height) }; // Left
        }
    }

    displayWaveMessage() {
        const waveText = this.scene.add.text(400, 300, `Wave ${this.currentWave}`, {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: waveText,
            alpha: 0,
            y: 250,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => waveText.destroy()
        });
    }

    endWave() {
        this.isWaveActive = false;
        this.currentWave++;
        this.enemiesPerWave += 5;
        this.nextWaveTime = this.scene.time.now + this.waveDelay;
        gameState.coins += this.currentWave * 5;
    }

    update() {
        if (!this.isWaveActive && this.scene.time.now >= this.nextWaveTime) {
            this.startWave();
        }
    }
}