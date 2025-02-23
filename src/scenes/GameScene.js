// src/scenes/GameScene.js
import Player from '../entities/Player.js';
import WaveSystem from '../systems/WaveSystem.js';
import PowerupSystem from '../systems/PowerupSystem.js';
import { GAME_CONSTANTS, EVENTS } from '../core/Constants.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gameState = {
            score: 0,
            wave: 1,
            isGameOver: false,
            isPaused: false,
            stats: {
                kills: 0,
                powerupsCollected: 0,
                damageTaken: 0,
                damageDealt: 0,
                timeSurvived: 0
            }
        };
    }

    init() {
        this.gameState.score = 0;
        this.gameState.wave = 1;
        this.gameState.isGameOver = false;
        this.gameState.isPaused = false;
        Object.keys(this.gameState.stats).forEach(key => {
            this.gameState.stats[key] = 0;
        });
    }

    create() {
        // Initialize core systems
        this.setupSystems();
        
        // Create game objects
        this.createPlayer();
        this.createGroups();
        
        // Setup physics and collisions
        this.setupPhysics();
        this.setupCollisions();
        
        // Setup input handling
        this.setupInput();
        
        // Start UI scene
        this.scene.launch('UIScene');
        
        // Start game music
        this.playGameMusic();
        
        // Start first wave
        this.waveSystem.startWave();

        // Start game timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });
    }

    setupSystems() {
        // Initialize game systems
        this.waveSystem = new WaveSystem(this);
        this.powerupSystem = new PowerupSystem(this);
        
        // Create object pools
        this.createObjectPools();
    }

    createObjectPools() {
        // Projectiles pool
        this.projectiles = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: 'projectile',
            maxSize: 100,
            runChildUpdate: true
        });

        // Enemies pool
        this.enemies = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: 'enemy',
            maxSize: 50,
            runChildUpdate: true
        });

        // Powerups pool
        this.powerups = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: 'powerup',
            maxSize: 10,
            runChildUpdate: true
        });

        // Particles pool
        this.particles = this.add.group({
            defaultKey: 'particle',
            maxSize: 100
        });
    }

    createPlayer() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.player = new Player(this, centerX, centerY);
        
        // Setup camera follow
        this.cameras.main.startFollow(this.player.sprite, true, 0.09, 0.09);
        this.cameras.main.setZoom(1);
    }

    createGroups() {
        // Create physics groups
        this.enemyGroup = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1
        });

        this.projectileGroup = this.physics.add.group({
            collideWorldBounds: false
        });

        this.powerupGroup = this.physics.add.group({
            collideWorldBounds: true
        });
    }

    setupPhysics() {
        // Set world bounds
        this.physics.world.setBounds(
            0, 0,
            GAME_CONSTANTS.WORLD.WIDTH,
            GAME_CONSTANTS.WORLD.HEIGHT
        );

        // Set camera bounds
        this.cameras.main.setBounds(
            0, 0,
            GAME_CONSTANTS.WORLD.WIDTH,
            GAME_CONSTANTS.WORLD.HEIGHT
        );
    }

    setupCollisions() {
        // Player collisions
        this.physics.add.overlap(
            this.player.sprite,
            this.enemyGroup,
            this.handlePlayerEnemyCollision,
            null,
            this
        );

        this.physics.add.overlap(
            this.player.sprite,
            this.powerupGroup,
            this.handlePlayerPowerupCollision,
            null,
            this
        );

        // Projectile collisions
        this.physics.add.overlap(
            this.projectileGroup,
            this.enemyGroup,
            this.handleProjectileEnemyCollision,
            null,
            this
        );

        // Enemy collisions
        this.physics.add.collider(
            this.enemyGroup,
            this.enemyGroup
        );
    }

    setupInput() {
        // Movement keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Action keys
        this.input.keyboard.on('keydown-SPACE', () => {
            if (!this.gameState.isPaused && !this.gameState.isGameOver) {
                this.player.shoot();
            }
        });

        // Mouse input for shooting
        this.input.on('pointerdown', (pointer) => {
            if (!this.gameState.isPaused && !this.gameState.isGameOver) {
                this.player.shoot(pointer);
            }
        });

        // Pause game
        this.input.keyboard.on('keydown-ESC', () => {
            this.togglePause();
        });
    }

    // ... continuing GameScene.js

    handlePlayerEnemyCollision(playerSprite, enemySprite) {
        if (this.player.isInvulnerable) return;

        // Calculate damage
        const damage = enemySprite.getData('damage');
        
        // Update stats
        this.gameState.stats.damageTaken += damage;
        
        // Player takes damage
        this.player.takeDamage(damage);

        // Create hit effect
        this.createHitEffect(playerSprite.x, playerSprite.y);

        // Screen shake
        this.cameras.main.shake(100, 0.01);

        // Play hit sound
        this.sound.play('hit', { volume: 0.5 });

        // Emit event for UI update
        this.events.emit(EVENTS.PLAYER.DAMAGE_TAKEN, damage);
    }

    handlePlayerPowerupCollision(playerSprite, powerupSprite) {
        // Update stats
        this.gameState.stats.powerupsCollected++;
        
        // Apply powerup effect
        this.powerupSystem.collectPowerup(powerupSprite);
        
        // Play powerup sound
        this.sound.play('powerup', { volume: 0.5 });
        
        // Create collection effect
        this.createPowerupCollectEffect(powerupSprite);
    }

    handleProjectileEnemyCollision(projectile, enemy) {
        // Calculate damage
        const damage = projectile.getData('damage');
        const enemyHealth = enemy.getData('health') - damage;
        
        // Update stats
        this.gameState.stats.damageDealt += damage;
        
        // Update enemy health
        enemy.setData('health', enemyHealth);

        // Create hit effect
        this.createHitEffect(projectile.x, projectile.y);

        // Play hit sound
        this.sound.play('hit', { volume: 0.3 });

        // Destroy projectile
        projectile.destroy();

        // Check if enemy is defeated
        if (enemyHealth <= 0) {
            this.killEnemy(enemy);
        } else {
            // Flash enemy red
            this.flashSprite(enemy);
        }
    }

    killEnemy(enemy) {
        // Update stats
        this.gameState.stats.kills++;
        
        // Update score
        const points = enemy.getData('points');
        this.updateScore(points);

        // Create death effect
        this.createDeathEffect(enemy.x, enemy.y);

        // Chance to spawn powerup
        if (Math.random() < GAME_CONSTANTS.POWERUP.SPAWN_CHANCE) {
            this.powerupSystem.spawnPowerup(enemy.x, enemy.y);
        }

        // Play death sound
        this.sound.play('explosion', { volume: 0.4 });

        // Remove enemy
        enemy.destroy();

        // Update wave system
        this.waveSystem.onEnemyKilled();
    }

    createHitEffect(x, y) {
        const particles = this.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            tint: 0xffff00,
            lifespan: 300,
            quantity: 5,
            blendMode: 'ADD'
        });

        this.time.delayedCall(300, () => {
            particles.destroy();
        });
    }

    createDeathEffect(x, y) {
        // Create explosion sprite
        const explosion = this.add.sprite(x, y, 'explosion-0');
        explosion.play('explosion');
        explosion.once('animationcomplete', () => {
            explosion.destroy();
        });

        // Add particles
        const particles = this.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            tint: [0xff0000, 0xff6600, 0xffff00],
            blendMode: 'ADD',
            lifespan: 500,
            quantity: 20
        });

        this.time.delayedCall(500, () => {
            particles.destroy();
        });
    }

    createPowerupCollectEffect(powerup) {
        const particles = this.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: powerup.x,
            y: powerup.y,
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            tint: powerup.getData('color'),
            blendMode: 'ADD',
            lifespan: 400,
            quantity: 15
        });

        this.time.delayedCall(400, () => {
            particles.destroy();
        });
    }

    flashSprite(sprite) {
        this.tweens.add({
            targets: sprite,
            tint: 0xff0000,
            duration: 50,
            yoyo: true,
            onComplete: () => {
                sprite.clearTint();
            }
        });
    }

    updateScore(points) {
        this.gameState.score += points;
        this.events.emit(EVENTS.SCORE.UPDATE, this.gameState.score);
    }

    updateGameTime() {
        if (!this.gameState.isPaused && !this.gameState.isGameOver) {
            this.gameState.stats.timeSurvived++;
            this.events.emit(EVENTS.TIME.UPDATE, this.gameState.stats.timeSurvived);
        }
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            this.physics.pause();
            this.scene.launch('PauseScene');
        } else {
            this.physics.resume();
            this.scene.stop('PauseScene');
        }
    }

    gameOver() {
        if (this.gameState.isGameOver) return;
        
        this.gameState.isGameOver = true;
        this.physics.pause();

        // Stop game timer
        this.gameTimer.remove();

        // Stop music and play game over sound
        this.sound.stopAll();
        this.sound.play('game-over');

        // Save high score
        const highScore = localStorage.getItem('highScore') || 0;
        if (this.gameState.score > highScore) {
            localStorage.setItem('highScore', this.gameState.score);
        }

        // Show game over scene
        this.scene.launch('GameOverScene', {
            score: this.gameState.score,
            stats: this.gameState.stats,
            highScore: Math.max(highScore, this.gameState.score)
        });
    }

    playGameMusic() {
        if (!this.sound.get('game-music')) {
            this.sound.play('game-music', {
                loop: true,
                volume: 0.3
            });
        }
    }

    update(time, delta) {
        if (this.gameState.isPaused || this.gameState.isGameOver) return;

        // Update player
        this.player.update(time, delta);

        // Update enemies
        this.enemyGroup.getChildren().forEach(enemy => {
            this.updateEnemy(enemy, time, delta);
        });

        // Update wave system
        this.waveSystem.update(time, delta);

        // Update powerup system
        this.powerupSystem.update(time, delta);

        // Clean up off-screen projectiles
        this.cleanupProjectiles();
    }

    updateEnemy(enemy, time, delta) {
        if (!enemy.active) return;

        // Get enemy behavior
        const behavior = enemy.getData('behavior');
        if (behavior) {
            behavior.update(time, delta);
        } else {
            // Default behavior - move towards player
            this.defaultEnemyBehavior(enemy);
        }
    }

    defaultEnemyBehavior(enemy) {
        // Calculate angle to player
        const angle = Phaser.Math.Angle.Between(
            enemy.x, enemy.y,
            this.player.sprite.x, this.player.sprite.y
        );

        // Move towards player
        const speed = enemy.getData('speed');
        enemy.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Rotate enemy to face player
        enemy.rotation = angle + Math.PI / 2;
    }

    cleanupProjectiles() {
        this.projectileGroup.getChildren().forEach(projectile => {
            if (!Phaser.Geom.Rectangle.Overlaps(
                this.physics.world.bounds,
                projectile.getBounds()
            )) {
                projectile.destroy();
            }
        });
    }

    shutdown() {
        // Clean up any running timers
        if (this.gameTimer) {
            this.gameTimer.remove();
        }

        // Stop all sounds
        this.sound.stopAll();

        // Clear all groups
        this.projectiles.clear(true, true);
        this.enemies.clear(true, true);
        this.powerups.clear(true, true);
        this.particles.clear(true, true);
    }
}