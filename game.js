// Game State and Configuration
const gameState = {
    playerHealth: 100,
    maxHealth: 100,
    level: 1,
    experience: 0,
    experienceToLevel: 100,
    coins: 0,
    kills: 0,
    upgrades: {},
    achievements: {}
};

// Wave System
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
        this.spawnWaveEnemies();
    }

    spawnWaveEnemies() {
        const enemyConfig = {
            health: this.baseEnemyHealth + (this.currentWave * 10),
            speed: this.baseEnemySpeed + (this.currentWave * 5)
        };

        for (let i = 0; i < this.enemiesPerWave; i++) {
            setTimeout(() => {
                if (this.scene.active) {
                    this.spawnEnemy(enemyConfig);
                }
            }, i * 1000);
        }
    }

    spawnEnemy(config) {
        const spawnPoint = this.getRandomSpawnPoint();
        const enemy = this.scene.enemies.create(spawnPoint.x, spawnPoint.y, 'enemy');
        enemy.setData('health', config.health);
        enemy.setData('speed', config.speed);
        enemy.setCollideWorldBounds(true);
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

// Achievement System
class AchievementSystem {
    constructor(scene) {
        this.scene = scene;
        this.achievements = {
            killCount: { current: 0, thresholds: [10, 50, 100], rewards: [5, 15, 30], awarded: [] },
            waveSurvival: { current: 0, thresholds: [5, 10, 20], rewards: [10, 20, 40], awarded: [] },
            speedRunner: { current: 0, thresholds: [300, 600, 900], rewards: [8, 16, 32], awarded: [] }
        };
    }

    checkAndAward(type, value) {
        const achievement = this.achievements[type];
        achievement.current = value;

        achievement.thresholds.forEach((threshold, index) => {
            if (achievement.current >= threshold && !achievement.awarded.includes(index)) {
                gameState.coins += achievement.rewards[index];
                this.displayAchievement(`${type} Achievement: +${achievement.rewards[index]} coins!`);
                achievement.awarded.push(index);
            }
        });
    }

    displayAchievement(message) {
        const achievementText = this.scene.add.text(400, 100, message, {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: achievementText,
            alpha: 0,
            y: 50,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => achievementText.destroy()
        });
    }
}

// Power-up System
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

// Skill Tree System
class SkillTree {
    constructor(scene) {
        this.scene = scene;
        this.skillPoints = 0;
        this.skills = {
            damage: {
                name: 'Damage Up',
                level: 0,
                maxLevel: 5,
                cost: 1,
                effect: (player) => {
                    player.stats.projectileDamage *= 1.2;
                }
            },
            fireRate: {
                name: 'Fire Rate Up',
                level: 0,
                maxLevel: 5,
                cost: 1,
                effect: (player) => {
                    player.stats.fireRate *= 0.9;
                }
            },
            speed: {
                name: 'Movement Speed',
                level: 0,
                maxLevel: 5,
                cost: 1,
                effect: (player) => {
                    player.stats.moveSpeed *= 1.15;
                }
            },
            projectileSpeed: {
                name: 'Projectile Speed',
                level: 0,
                maxLevel: 3,
                cost: 2,
                effect: (player) => {
                    player.stats.projectileSpeed *= 1.25;
                }
            }
        };
        this.menuVisible = false;
    }

    addSkillPoint() {
        this.skillPoints++;
        this.updateSkillTreeUI();
    }

    toggleMenu() {
        this.menuVisible = !this.menuVisible;
        if (this.menuVisible) {
            this.showSkillTreeMenu();
        } else {
            this.hideSkillTreeMenu();
        }
    }

    showSkillTreeMenu() {
        this.menuBackground = this.scene.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
        this.menuContainer = this.scene.add.container(400, 300);
        
        const title = this.scene.add.text(0, -180, 'Skill Tree', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        const pointsText = this.scene.add.text(0, -140, `Skill Points: ${this.skillPoints}`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        this.menuContainer.add([title, pointsText]);
        
        let yPos = -80;
        for (const [skillId, skill] of Object.entries(this.skills)) {
            const buttonText = `${skill.name} (${skill.level}/${skill.maxLevel}) - Cost: ${skill.cost}`;
            const button = this.scene.add.text(0, yPos, buttonText, {
                fontSize: '20px',
                fill: this.canUpgradeSkill(skill) ? '#fff' : '#666',
                backgroundColor: '#333',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);
            
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => this.upgradeSkill(skillId));
            
            this.menuContainer.add(button);
            yPos += 40;
        }
        
        const closeButton = this.scene.add.text(250, 150, 'Close', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerdown', () => this.toggleMenu());
        
        this.menuContainer.add(closeButton);
    }

    hideSkillTreeMenu() {
        if (this.menuBackground) {
            this.menuBackground.destroy();
        }
        if (this.menuContainer) {
            this.menuContainer.destroy();
        }
    }

    canUpgradeSkill(skill) {
        return this.skillPoints >= skill.cost && skill.level < skill.maxLevel;
    }

    upgradeSkill(skillId) {
        const skill = this.skills[skillId];
        if (this.canUpgradeSkill(skill)) {
            this.skillPoints -= skill.cost;
            skill.level++;
            skill.effect(this.scene.player);
            this.hideSkillTreeMenu();
            this.showSkillTreeMenu();
            
            this.displayUpgradeMessage(skill.name);
        }
    }

    displayUpgradeMessage(skillName) {
        const text = this.scene.add.text(400, 150, `${skillName} Upgraded!`, {
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

    updateSkillTreeUI() {
        if (this.menuVisible) {
            this.hideSkillTreeMenu();
            this.showSkillTreeMenu();
        }
    }
}

// Main Scene
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Update these paths to match your repository structure
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

        // Initialize empty sound objects to prevent errors
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

        this.waveSystem.startWave();
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
        this.projectiles = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.powerups = this.physics.add.group();
        this.xpOrbs = this.physics.add.group();
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
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                this.player.x, this.player.y
            );
            
            const velocity = this.physics.velocityFromRotation(angle, enemy.getData('speed'));
            enemy.setVelocity(velocity.x, velocity.y);
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

        // Check achievements
        this.achievements.checkAndAward('killCount', gameState.kills);
    }

    collectPowerup(player, powerup) {
        this.powerupSystem.applyPowerup(player, powerup);
    }

    playerHit(player, enemy) {
        // Implement player damage logic here
        gameState.playerHealth -= 10;
        if (gameState.playerHealth <= 0) {
            // Implement game over logic
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

// Initialize the game
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: MainScene
};

const game = new Phaser.Game(config);