class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('projectile', 'assets/projectile.png');
        this.load.image('powerup', 'assets/powerup.png');
        this.load.image('particle', 'assets/particle.png');
    }

    create() {
        this.waveSystem = new WaveSystem(this);
        this.achievements = new AchievementSystem(this);
        this.powerupSystem = new PowerupSystem(this);
        this.skillTree = new SkillTree(this);

        // Initialize empty sound objects
        this.sounds = {
            shoot: { play: () => {} },
            hit: { play: () => {} },
            pickup: { play: () => {} },
            wave: { play: () => {} },
            powerup: { play: () => {} }
        };

        this.createPlayer();
        this.createGroups();
        this.createParticleSystems();
        this.setupControls();
        this.setupCollisions();

        // Debug info
        console.log('Scene created, starting first wave');
        this.waveSystem.startWave();

        // Add periodic wave check
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                console.log('Active enemies:', this.enemies.getChildren().length);
                console.log('Wave active:', this.waveSystem.isWaveActive);
                console.log('Enemies remaining:', this.waveSystem.enemiesRemaining);
            },
            loop: true
        });
    }

    createPlayer() {
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        
        this.player.stats = {
            moveSpeed: 200,
            fireRate: 500,
            projectileSpeed: 400,
            projectileDamage: 25,
            lastFired: 0
        };
    }

    createGroups() {
        this.projectiles = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite
        });
        this.enemies = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite
        });
        this.powerups = this.physics.add.group();
        this.xpOrbs = this.physics.add.group();

        // Debug: Add visual boundary
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xff0000);
        graphics.strokeRect(0, 0, this.game.config.width, this.game.config.height);
    }

    createParticleSystems() {
        this.particles = {
            hit: this.add.particles('particle').createEmitter({
                speed: { min: -100, max: 100 },
                scale: { start: 0.5, end: 0 },
                lifespan: 300,
                on: false
            }),
            powerup: this.add.particles('particle').createEmitter({
                speed: { min: -50, max: 50 },
                scale: { start: 0.3, end: 0 },
                tint: 0xff00ff,
                lifespan: 500,
                on: false
            })
        };
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.input.keyboard.on('keydown-T', () => {
            this.skillTree.toggleMenu();
        });
    }

    setupCollisions() {
        this.physics.add.collider(this.projectiles, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
        this.physics.add.overlap(this.player, this.xpOrbs, this.collectXP, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
    }

    update() {
        this.handlePlayerMovement();
        this.handlePlayerShooting();
        this.updateEnemies();
        this.waveSystem.update();
        this.powerupSystem.update();
        this.updateHUD();
    }

    handlePlayerMovement() {
        const speed = this.player.stats.moveSpeed;
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown) velocityX -= speed;
        if (this.cursors.right.isDown) velocityX += speed;
        if (this.cursors.up.isDown) velocityY -= speed;
        if (this.cursors.down.isDown) velocityY += speed;

        if (velocityX !== 0 && velocityY !== 0) {
            const factor = 1 / Math.sqrt(2);
            velocityX *= factor;
            velocityY *= factor;
        }

        this.player.setVelocity(velocityX, velocityY);
    }

    handlePlayerShooting() {
        if (this.fireKey.isDown && this.time.now > this.player.stats.lastFired) {
            this.fireProjectile();
            this.player.stats.lastFired = this.time.now + this.player.stats.fireRate;
        }
    }

    fireProjectile() {
        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.Between(
            this.player.x, this.player.y,
            pointer.x + this.cameras.main.scrollX,
            pointer.y + this.cameras.main.scrollY
        );

        const projectile = this.projectiles.create(this.player.x, this.player.y, 'projectile');
        projectile.setData('damage', this.player.stats.projectileDamage);
        
        const velocity = this.physics.velocityFromRotation(angle, this.player.stats.projectileSpeed);
        projectile.setVelocity(velocity.x, velocity.y);
    }

    updateEnemies() {
        this.enemies.children.each(enemy => {
            if (enemy && enemy.active) {
                const angle = Phaser.Math.Angle.Between(
                    enemy.x, enemy.y,
                    this.player.x, this.player.y
                );
                
                const speed = enemy.getData('speed') || 100;
                const velocity = this.physics.velocityFromRotation(angle, speed);
                enemy.setVelocity(velocity.x, velocity.y);
            }
        });
    }

    hitEnemy(projectile, enemy) {
        projectile.destroy();
        
        const damage = projectile.getData('damage');
        const health = enemy.getData('health') - damage;
        enemy.setData('health', health);

        this.particles.hit.emitParticleAt(enemy.x, enemy.y, 10);

        if (health <= 0) {
            this.killEnemy(enemy);
        }
    }

    killEnemy(enemy) {
        enemy.destroy();
        gameState.kills++;
        this.waveSystem.enemiesRemaining--;
        
        if (Math.random() < 0.1) {
            this.powerupSystem.spawnPowerup(enemy.x, enemy.y);
        }

        if (this.waveSystem.enemiesRemaining <= 0) {
            this.waveSystem.endWave();
        }

        this.achievements.checkAndAward('killCount', gameState.kills);
    }

    collectPowerup(player, powerup) {
        this.powerupSystem.applyPowerup(player, powerup);
    }

    playerHit(player, enemy) {
        gameState.playerHealth -= 10;
        if (gameState.playerHealth <= 0) {
            // Implement game over logic
            console.log('Game Over!');
        }
    }

    updateHUD() {
        document.getElementById('hud').innerHTML = `
            Health: ${gameState.playerHealth}/${gameState.maxHealth} | 
            Level: ${gameState.level} | 
            XP: ${Math.floor(gameState.experience)}/${Math.floor(gameState.experienceToLevel)} | 
            Coins: ${gameState.coins} |
            Wave: ${this.waveSystem.currentWave} |
            Enemies: ${this.waveSystem.enemiesRemaining}
        `;
    }
}