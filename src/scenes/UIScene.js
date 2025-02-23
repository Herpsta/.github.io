// src/scenes/UIScene.js
import { GAME_CONSTANTS, EVENTS } from '../core/Constants.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        this.hudElements = new Map();
    }

    create() {
        // Get reference to game scene
        this.gameScene = this.scene.get('GameScene');

        // Create UI layers
        this.createUILayers();

        // Create UI elements
        this.createHUD();
        this.createWaveInfo();
        this.createScoreDisplay();
        this.createPowerupDisplay();
        this.createWeaponInfo();
        this.createMinimapDisplay();

        // Setup event listeners
        this.setupEventListeners();
    }

    createUILayers() {
        // Create layers for different UI elements
        this.layers = {
            background: this.add.container(0, 0),
            main: this.add.container(0, 0),
            effects: this.add.container(0, 0),
            overlay: this.add.container(0, 0)
        };
    }

    createHUD() {
        // Health bar
        this.hudElements.set('health', this.createHealthBar());
        
        // Experience bar
        this.hudElements.set('experience', this.createExperienceBar());
        
        // Add to main layer
        this.layers.main.add([
            this.hudElements.get('health').container,
            this.hudElements.get('experience').container
        ]);
    }

    createHealthBar() {
        const container = this.add.container(10, 10);

        // Background
        const bg = this.add.rectangle(100, 0, 200, 20, 0x000000, 0.8)
            .setStrokeStyle(1, 0xffffff);

        // Health bar
        const bar = this.add.rectangle(1, 0, 198, 18, 0xff0000)
            .setOrigin(0, 0.5);

        // Health text
        const text = this.add.text(100, 0, '100/100', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Health icon
        const icon = this.add.sprite(-20, 0, 'health-icon')
            .setScale(0.8);

        container.add([bg, bar, text, icon]);

        return { container, bar, text, bg };
    }

    createExperienceBar() {
        const container = this.add.container(10, 35);

        // Background
        const bg = this.add.rectangle(100, 0, 200, 10, 0x000000, 0.8)
            .setStrokeStyle(1, 0xffffff);

        // XP bar
        const bar = this.add.rectangle(1, 0, 198, 8, 0x00ff00)
            .setOrigin(0, 0.5);

        // Level text
        const levelText = this.add.text(-20, 0, 'Lv.1', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // XP text
        const xpText = this.add.text(100, 0, '0/100', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        container.add([bg, bar, levelText, xpText]);

        return { container, bar, levelText, xpText };
    }

    createWaveInfo() {
        const container = this.add.container(
            this.cameras.main.width - 10,
            10
        ).setOrigin(1, 0);

        // Wave number
        const waveText = this.add.text(0, 0, 'Wave 1', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'monospace'
        }).setOrigin(1, 0);

        // Enemies remaining
        const enemyText = this.add.text(0, 30, 'Enemies: 0', {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            fontFamily: 'monospace'
        }).setOrigin(1, 0);

        // Timer
        const timerText = this.add.text(0, 50, 'Next wave: --', {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            fontFamily: 'monospace'
        }).setOrigin(1, 0);

        container.add([waveText, enemyText, timerText]);

        this.hudElements.set('wave', { container, waveText, enemyText, timerText });
        this.layers.main.add(container);
    }

    createScoreDisplay() {
        const container = this.add.container(
            this.cameras.main.width / 2,
            10
        );

        // Score text
        const scoreText = this.add.text(0, 0, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'monospace'
        }).setOrigin(0.5, 0);

        // Multiplier
        const multiplierText = this.add.text(0, 30, 'x1', {
            fontSize: '16px',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2,
            fontFamily: 'monospace'
        }).setOrigin(0.5, 0);

        container.add([scoreText, multiplierText]);

        this.hudElements.set('score', { container, scoreText, multiplierText });
        this.layers.main.add(container);
    }

    createPowerupDisplay() {
        const container = this.add.container(10, 110);
        this.activePowerups = new Map();

        this.hudElements.set('powerups', { container });
        this.layers.main.add(container);
    }

    createWeaponInfo() {
        const container = this.add.container(10, 60);

        // Weapon icon background
        const iconBg = this.add.rectangle(0, 0, 40, 40, 0x000000, 0.8)
            .setStrokeStyle(1, 0xffffff);

        // Weapon icon
        const icon = this.add.sprite(0, 0, 'weapon-pistol')
            .setScale(0.8);

        // Ammo/cooldown info
        const ammoText = this.add.text(50, 0, 'Ready', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0, 0.5);

        container.add([iconBg, icon, ammoText]);

        this.hudElements.set('weapon', { container, icon, ammoText });
        this.layers.main.add(container);
    }

    // ... continuing UIScene.js

    createMinimapDisplay() {
        const size = 150;
        const padding = 10;
        
        const container = this.add.container(
            this.cameras.main.width - size - padding,
            this.cameras.main.height - size - padding
        );

        // Background
        const bg = this.add.rectangle(0, 0, size, size, 0x000000, 0.5)
            .setStrokeStyle(1, 0xffffff);

        // Create minimap camera
        this.minimapCamera = this.cameras.add(
            this.cameras.main.width - size - padding,
            this.cameras.main.height - size - padding,
            size, size
        ).setZoom(0.1);

        this.minimapCamera.setBackgroundColor(0x000000);
        this.minimapCamera.ignore(this.layers);

        // Add player dot
        const playerDot = this.add.circle(0, 0, 3, 0x00ff00);
        
        // Add enemy dots container
        const enemyDotsContainer = this.add.container(0, 0);

        container.add([bg, playerDot]);

        this.hudElements.set('minimap', {
            container,
            camera: this.minimapCamera,
            playerDot,
            enemyDotsContainer
        });
        this.layers.main.add(container);
    }

    setupEventListeners() {
        // Player events
        this.gameScene.events.on(EVENTS.PLAYER.HEALTH_CHANGE, this.updateHealthBar, this);
        this.gameScene.events.on(EVENTS.PLAYER.EXPERIENCE_GAIN, this.updateExperienceBar, this);
        this.gameScene.events.on(EVENTS.PLAYER.LEVEL_UP, this.onLevelUp, this);
        this.gameScene.events.on(EVENTS.PLAYER.WEAPON_CHANGE, this.updateWeaponInfo, this);
        
        // Wave events
        this.gameScene.events.on(EVENTS.WAVE.START, this.onWaveStart, this);
        this.gameScene.events.on(EVENTS.WAVE.END, this.onWaveEnd, this);
        this.gameScene.events.on(EVENTS.WAVE.ENEMY_COUNT_CHANGE, this.updateWaveInfo, this);
        
        // Score events
        this.gameScene.events.on(EVENTS.SCORE.UPDATE, this.updateScore, this);
        this.gameScene.events.on(EVENTS.SCORE.MULTIPLIER_CHANGE, this.updateMultiplier, this);
        
        // Powerup events
        this.gameScene.events.on(EVENTS.POWERUP.COLLECTED, this.addPowerupIcon, this);
        this.gameScene.events.on(EVENTS.POWERUP.EXPIRED, this.removePowerupIcon, this);
    }

    updateHealthBar(health, maxHealth) {
        const healthBar = this.hudElements.get('health');
        const percentage = health / maxHealth;
        
        // Update bar width
        healthBar.bar.width = 198 * percentage;
        
        // Update text
        healthBar.text.setText(`${Math.ceil(health)}/${maxHealth}`);

        // Update color based on health percentage
        let color = 0xff0000;
        if (percentage > 0.6) color = 0x00ff00;
        else if (percentage > 0.3) color = 0xffff00;
        
        healthBar.bar.setFillStyle(color);

        // Add pulse effect on low health
        if (percentage <= 0.3) {
            this.pulseHealthBar();
        }
    }

    pulseHealthBar() {
        if (!this.healthPulse) {
            this.healthPulse = this.tweens.add({
                targets: this.hudElements.get('health').bar,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }

    updateExperienceBar(experience, maxExperience, level) {
        const expBar = this.hudElements.get('experience');
        const percentage = experience / maxExperience;
        
        // Update bar width
        expBar.bar.width = 198 * percentage;
        
        // Update texts
        expBar.levelText.setText(`Lv.${level}`);
        expBar.xpText.setText(`${experience}/${maxExperience}`);
    }

    onLevelUp(level) {
        // Create level up effect
        const text = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'LEVEL UP!',
            {
                fontSize: '48px',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 6,
                fontFamily: 'monospace'
            }
        ).setOrigin(0.5);

        // Add to effects layer
        this.layers.effects.add(text);

        // Animate
        this.tweens.add({
            targets: text,
            y: text.y - 100,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });

        // Create particle effect
        this.createLevelUpParticles();
    }

    createLevelUpParticles() {
        const particles = this.add.particles('particle');
        
        particles.createEmitter({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            tint: [0xffff00, 0x00ff00],
            lifespan: 1000,
            quantity: 50,
            blendMode: 'ADD'
        });

        this.time.delayedCall(1000, () => particles.destroy());
    }

    updateWaveInfo(enemies, total) {
        const waveInfo = this.hudElements.get('wave');
        waveInfo.enemyText.setText(`Enemies: ${enemies}/${total}`);
    }

    onWaveStart(waveNumber) {
        const waveInfo = this.hudElements.get('wave');
        waveInfo.waveText.setText(`Wave ${waveNumber}`);
        
        // Create wave announcement
        this.createWaveAnnouncement(waveNumber);
    }

    createWaveAnnouncement(waveNumber) {
        const text = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `Wave ${waveNumber}`,
            {
                fontSize: '64px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontFamily: 'monospace'
            }
        ).setOrigin(0.5);

        this.layers.effects.add(text);

        this.tweens.add({
            targets: text,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    updateScore(score) {
        const scoreDisplay = this.hudElements.get('score');
        scoreDisplay.scoreText.setText(`Score: ${score}`);
        
        // Create score popup if it's a significant increase
        if (score - this.lastScore > 100) {
            this.createScorePopup(score - this.lastScore);
        }
        
        this.lastScore = score;
    }

    createScorePopup(points) {
        const text = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            `+${points}`,
            {
                fontSize: '32px',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4,
                fontFamily: 'monospace'
            }
        ).setOrigin(0.5);

        this.layers.effects.add(text);

        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    updateMultiplier(multiplier) {
        const scoreDisplay = this.hudElements.get('score');
        if (multiplier > 1) {
            scoreDisplay.multiplierText.setText(`x${multiplier}`).setVisible(true);
        } else {
            scoreDisplay.multiplierText.setVisible(false);
        }
    }

    update() {
        // Update minimap if needed
        if (this.minimapCamera) {
            this.updateMinimap();
        }
    }

    updateMinimap() {
        const minimap = this.hudElements.get('minimap');
        
        // Update player position on minimap
        const player = this.gameScene.player.sprite;
        minimap.playerDot.setPosition(player.x, player.y);

        // Update enemy positions
        this.updateMinimapEnemies();
    }

    updateMinimapEnemies() {
        const minimap = this.hudElements.get('minimap');
        minimap.enemyDotsContainer.removeAll(true);

        this.gameScene.enemyGroup.getChildren().forEach(enemy => {
            const dot = this.add.circle(enemy.x, enemy.y, 2, 0xff0000);
            minimap.enemyDotsContainer.add(dot);
        });
    }

    shutdown() {
        // Clean up any running tweens
        this.tweens.killAll();
        
        // Remove all event listeners
        this.gameScene.events.off(EVENTS.PLAYER.HEALTH_CHANGE, this.updateHealthBar, this);
        this.gameScene.events.off(EVENTS.PLAYER.EXPERIENCE_GAIN, this.updateExperienceBar, this);
        this.gameScene.events.off(EVENTS.PLAYER.LEVEL_UP, this.onLevelUp, this);
        this.gameScene.events.off(EVENTS.PLAYER.WEAPON_CHANGE, this.updateWeaponInfo, this);
        this.gameScene.events.off(EVENTS.WAVE.START, this.onWaveStart, this);
        this.gameScene.events.off(EVENTS.WAVE.END, this.onWaveEnd, this);
        this.gameScene.events.off(EVENTS.WAVE.ENEMY_COUNT_CHANGE, this.updateWaveInfo, this);
        this.gameScene.events.off(EVENTS.SCORE.UPDATE, this.updateScore, this);
        this.gameScene.events.off(EVENTS.SCORE.MULTIPLIER_CHANGE, this.updateMultiplier, this);
        this.gameScene.events.off(EVENTS.POWERUP.COLLECTED, this.addPowerupIcon, this);
        this.gameScene.events.off(EVENTS.POWERUP.EXPIRED, this.removePowerupIcon, this);
    }
}