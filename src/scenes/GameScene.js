// src/scenes/GameScene.js
import Player from '../entities/Player.js';
import EntityManager from '../managers/EntityManager.js';
import InputManager from '../managers/InputManager.js';
import WaveSystem from '../systems/WaveSystem.js';
import PowerupSystem from '../systems/PowerupSystem.js';
import UISystem from '../ui/UISystem.js';
import { EVENTS, GAME_CONSTANTS } from '../core/Constants.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gameState = {
            score: 0,
            isGameOver: false,
            isPaused: false,
            difficulty: 1
        };
    }

    init(data) {
        this.difficulty = data.difficulty || 1;
        this.gameState.score = 0;
        this.gameState.isGameOver = false;
    }

    preload() {
        // Load all game assets
        this.load.image('player', 'assets/images/player.png');
        this.load.image('enemy', 'assets/images/enemy.png');
        this.load.image('projectile', 'assets/images/projectile.png');
        this.load.image('powerup', 'assets/images/powerup.png');
        this.load.image('particle', 'assets/images/particle.png');
        
        // Load audio
        this.load.audio('shoot', 'assets/audio/shoot.wav');
        this.load.audio('hit', 'assets/audio/hit.wav');
        this.load.audio('powerup', 'assets/audio/powerup.wav');
        this.load.audio('death', 'assets/audio/death.wav');
    }

    create() {
        this.setupSystems();
        this.setupPlayer();
        this.setupCollisions();
        this.setupAudio();
        this.setupEventListeners();
        
        // Start the first wave
        this.waveSystem.startWave();
    }

    setupSystems() {
        // Initialize all game systems
        this.entityManager = new EntityManager(this);
        this.inputManager = new InputManager(this);
        this.waveSystem = new WaveSystem(this);
        this.powerupSystem = new PowerupSystem(this);
        this.uiSystem = new UISystem(this);

        // Set up game state management
        this.setupGameState();
    }

    setupGameState() {
        // Create proxy for game state to track changes
        this.gameState = new Proxy(this.gameState, {
            set: (target, property, value) => {
                const oldValue = target[property];
                target[property] = value;
                
                // Emit state change event
                this.events.emit(EVENTS.STATE.CHANGED, {
                    property,
                    oldValue,
                    newValue: value
                });
                
                return true;
            }
        });
    }

    setupPlayer() {
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;
        this.player = new Player(this, centerX, centerY);
    }

    setupCollisions() {
        // Player projectiles hitting enemies
        this.physics.add.collider(
            this.entityManager.getGroup('projectiles'),
            this.entityManager.getGroup('enemies'),
            this.handleProjectileHit,
            null,
            this
        );

        // Enemies colliding with player
        this.physics.add.overlap(
            this.player.sprite,
            this.entityManager.getGroup('enemies'),
            this.handlePlayerCollision,
            null,
            this
        );

        // Player collecting powerups
        this.physics.add.overlap(
            this.player.sprite,
            this.entityManager.getGroup('powerups'),
            this.handlePowerupCollection,
            null,
            this
        );
    }

    setupAudio() {
        this.sounds = {
            shoot: this.sound.add('shoot', { volume: 0.5 }),
            hit: this.sound.add('hit', { volume: 0.6 }),
            powerup: this.sound.add('powerup', { volume: 0.7 }),
            death: this.sound.add('death', { volume: 0.8 })
        };
    }

    setupEventListeners() {
        // Game state events
        this.events.on(EVENTS.GAME.PAUSE, this.pauseGame, this);
        this.events.on(EVENTS.GAME.RESUME, this.resumeGame, this);
        this.events.on(EVENTS.GAME.OVER, this.gameOver, this);

        // Player events
        this.events.on(EVENTS.PLAYER.DEATH, this.onPlayerDeath, this);
        
        // Score events
        this.events.on(EVENTS.SCORE.UPDATE, this.updateScore, this);

        // Input events
        this.input.keyboard.on('keydown-ESC', () => {
            this.togglePause();
        });
    }

    update(time, delta) {
        if (this.gameState.isGameOver || this.gameState.isPaused) return;

        // Update all game systems
        this.player.update(time, delta);
        this.waveSystem.update(time, delta);
        this.powerupSystem.update(time, delta);
        this.entityManager.update(time, delta);

        // Update enemy behaviors
        this.updateEnemies(time, delta);
    }

    updateEnemies(time, delta) {
        const enemies = this.entityManager.getEntitiesByType('enemies');
        const playerPos = {
            x: this.player.sprite.x,
            y: this.player.sprite.y
        };

        enemies.forEach(enemy => {
            // Calculate direction to player
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                playerPos.x, playerPos.y
            );

            // Move enemy towards player
            const speed = enemy.getData('speed');
            enemy.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );

            // Rotate enemy to face player
            enemy.rotation = angle + Math.PI / 2;
        });
    }

    handleProjectileHit(projectile, enemy) {
        // Create hit effect
        this.createHitEffect(projectile.x, projectile.y);
        
        // Apply damage
        const damage = projectile.getData('damage');
        const health = enemy.getData('health') - damage;
        enemy.setData('health', health);

        // Destroy projectile
        this.entityManager.removeEntity(projectile);

        // Play hit sound
        this.sounds.hit.play();

        if (health <= 0) {
            this.killEnemy(enemy);
        }
    }

    createHitEffect(x, y) {
        const particles = this.add.particles('particle');
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            lifespan: 300,
            blendMode: 'ADD'
        });

        this.time.delayedCall(300, () => {
            particles.destroy();
        });
    }

    killEnemy(enemy) {
        // Update score
        const points = enemy.getData('points') || 10;
        this.updateScore(points);

        // Chance to spawn powerup
        if (Math.random() < 0.1) {
            this.powerupSystem.spawnPowerup(enemy.x, enemy.y);
        }

        // Create death effect
        this.createDeathEffect(enemy);

        // Remove enemy
        this.entityManager.removeEntity(enemy);
        
        // Play death sound
        this.sounds.death.play();

        // Emit enemy death event
        this.events.emit(EVENTS.ENEMY.DEATH);
    }

    createDeathEffect(enemy) {
        // Create explosion effect
        const particles = this.add.particles('particle');
        const emitter = particles.createEmitter({
            x: enemy.x,
            y: enemy.y,
            speed: { min: 50, max: 200 },
            scale: { start: 0.4, end: 0 },
            lifespan: 500,
            blendMode: 'ADD',
            tint: 0xff0000
        });

        this.time.delayedCall(500, () => {
            particles.destroy();
        });
    }

    handlePlayerCollision(player, enemy) {
        const damage = enemy.getData('damage');
        this.events.emit(EVENTS.PLAYER.DAMAGE, damage);
    }

    handlePowerupCollection(player, powerup) {
        this.powerupSystem.collectPowerup(player, powerup);
        this.sounds.powerup.play();
    }

    updateScore(points) {
        this.gameState.score += points;
        this.events.emit(EVENTS.SCORE.UPDATE, this.gameState.score);
    }

    togglePause() {
        if (this.gameState.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    pauseGame() {
        this.gameState.isPaused = true;
        this.physics.pause();
        this.uiSystem.showMessage('PAUSED', 0);
    }

    resumeGame() {
        this.gameState.isPaused = false;
        this.physics.resume();
        this.uiSystem.showMessage('GO!', 1000);
    }

    gameOver() {
        this.gameState.isGameOver = true;
        this.physics.pause();
        
        // Show game over screen
        this.uiSystem.showMessage(
            `GAME OVER\nScore: ${this.gameState.score}\nPress SPACE to restart`,
            0
        );

        // Listen for restart input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.restart();
        });
    }

    onPlayerDeath() {
        this.events.emit(EVENTS.GAME.OVER);
    }

    destroy() {
        // Cleanup all systems
        this.entityManager.destroy();
        this.inputManager.destroy();
        this.waveSystem.destroy();
        this.powerupSystem.destroy();
        this.uiSystem.destroy();

        // Remove all event listeners
        this.events.removeAllListeners();
    }
}