// src/ui/UISystem.js
import { EVENTS, GAME_CONSTANTS } from '../core/Constants.js';

export default class UISystem {
    constructor(scene) {
        this.scene = scene;
        this.elements = new Map();
        this.setupHUD();
        this.setupEventListeners();
    }

    setupHUD() {
        // Create HUD container
        this.hud = {
            health: this.createHealthBar(),
            wave: this.createWaveInfo(),
            score: this.createScoreDisplay(),
            powerups: this.createPowerupDisplay(),
            weaponInfo: this.createWeaponInfo()
        };

        // Make HUD elements fixed to camera
        Object.values(this.hud).forEach(element => {
            if (element.setScrollFactor) {
                element.setScrollFactor(0);
            }
        });
    }

    createHealthBar() {
        const width = 200;
        const height = 20;
        const padding = 2;
        const x = 20;
        const y = 20;

        const background = this.scene.add.rectangle(x, y, width, height, 0x000000, 0.7);
        const bar = this.scene.add.rectangle(
            x + padding, 
            y, 
            width - (padding * 2), 
            height - (padding * 2), 
            0xff0000
        );
        const text = this.scene.add.text(x, y - 20, 'HEALTH', {
            fontSize: '16px',
            fill: '#ffffff'
        });

        background.setOrigin(0, 0.5);
        bar.setOrigin(0, 0.5);
        text.setOrigin(0, 0.5);

        return { background, bar, text };
    }

    createWaveInfo() {
        const x = this.scene.game.config.width - 20;
        const y = 20;

        const waveText = this.scene.add.text(x, y, 'WAVE 1', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0.5);

        const enemyCount = this.scene.add.text(x, y + 30, 'Enemies: 0', {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0.5);

        return { waveText, enemyCount };
    }

    createScoreDisplay() {
        const x = this.scene.game.config.width / 2;
        const y = 20;

        return this.scene.add.text(x, y, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);
    }

    createPowerupDisplay() {
        const container = this.scene.add.container(20, 60);
        const background = this.scene.add.rectangle(0, 0, 150, 40, 0x000000, 0.7);
        const text = this.scene.add.text(-70, -10, 'POWERUPS', {
            fontSize: '14px',
            fill: '#ffffff'
        });

        container.add([background, text]);
        return container;
    }

    createWeaponInfo() {
        const x = 20;
        const y = this.scene.game.config.height - 40;

        const container = this.scene.add.container(x, y);
        const background = this.scene.add.rectangle(0, 0, 200, 60, 0x000000, 0.7);
        const weaponName = this.scene.add.text(-90, -20, 'Standard Weapon', {
            fontSize: '16px',
            fill: '#ffffff'
        });
        const ammoText = this.scene.add.text(-90, 5, 'Unlimited', {
            fontSize: '14px',
            fill: '#ffff00'
        });

        container.add([background, weaponName, ammoText]);
        return container;
    }

    setupEventListeners() {
        this.scene.events.on(EVENTS.PLAYER.DAMAGE, this.updateHealthBar, this);
        this.scene.events.on(EVENTS.PLAYER.HEAL, this.updateHealthBar, this);
        this.scene.events.on(EVENTS.WAVE.START, this.onWaveStart, this);
        this.scene.events.on(EVENTS.ENEMY.DEATH, this.onEnemyDeath, this);
        this.scene.events.on(EVENTS.SCORE.UPDATE, this.updateScore, this);
        this.scene.events.on(EVENTS.POWERUP.COLLECTED, this.showPowerupEffect, this);
    }

    updateHealthBar() {
        const player = this.scene.player.sprite;
        const health = player.getData('health');
        const maxHealth = player.getData('maxHealth');
        const percentage = health / maxHealth;

        // Update health bar width
        const fullWidth = this.hud.health.background.width - 4;
        this.hud.health.bar.width = fullWidth * percentage;

        // Update color based on health percentage
        let color = 0x00ff00;
        if (percentage < 0.6) color = 0xffff00;
        if (percentage < 0.3) color = 0xff0000;
        this.hud.health.bar.setFillStyle(color);

        // Flash effect on damage
        if (this.lastHealth > health) {
            this.scene.tweens.add({
                targets: this.hud.health.bar,
                alpha: 0.5,
                yoyo: true,
                duration: 100
            });
        }

        this.lastHealth = health;
    }

    onWaveStart(waveNumber) {
        this.hud.wave.waveText.setText(`WAVE ${waveNumber}`);
        
        // Wave number display effect
        const waveAnnouncement = this.scene.add.text(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2,
            `Wave ${waveNumber}`,
            {
                fontSize: '64px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: waveAnnouncement,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => waveAnnouncement.destroy()
        });
    }

    onEnemyDeath() {
        const remainingEnemies = this.scene.waveSystem.enemiesRemaining;
        this.hud.wave.enemyCount.setText(`Enemies: ${remainingEnemies}`);
    }

    updateScore(score) {
        this.hud.score.setText(`Score: ${score}`);
        
        // Score popup effect
        const scorePopup = this.scene.add.text(
            this.scene.player.sprite.x,
            this.scene.player.sprite.y - 50,
            `+${score}`,
            {
                fontSize: '20px',
                fill: '#ffff00'
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: scorePopup,
            y: scorePopup.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => scorePopup.destroy()
        });
    }

    showPowerupEffect(type) {
        const powerupConfig = this.scene.powerupSystem.powerupTypes[type];
        
        // Create powerup icon in HUD
        const icon = this.scene.add.circle(0, 0, 15, powerupConfig.color);
        const timer = this.scene.add.arc(0, 0, 18, 0, 360, false, 0xffffff, 0.3);
        const group = this.scene.add.container(0, 0, [icon, timer]);

        // Add to powerup display
        const offset = this.hud.powerups.length * 40;
        group.setPosition(offset + 20, 0);
        this.hud.powerups.add(group);

        // Timer animation
        this.scene.tweens.add({
            targets: timer,
            angle: 360,
            duration: powerupConfig.duration,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: group,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        group.destroy();
                        // Reorganize remaining powerup icons
                        this.reorganizePowerupIcons();
                    }
                });
            }
        });
    }

    reorganizePowerupIcons() {
        const icons = this.hud.powerups.list.slice(2); // Skip background and text
        icons.forEach((icon, index) => {
            this.scene.tweens.add({
                targets: icon,
                x: index * 40 + 20,
                duration: 200
            });
        });
    }

    showMessage(text, duration = 2000) {
        const message = this.scene.add.text(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2,
            text,
            {
                fontSize: '32px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                backgroundColor: '#00000088',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setScrollFactor(0);

        this.scene.time.delayedCall(duration, () => {
            this.scene.tweens.add({
                targets: message,
                alpha: 0,
                duration: 500,
                onComplete: () => message.destroy()
            });
        });
    }

    destroy() {
        // Remove all event listeners
        this.scene.events.off(EVENTS.PLAYER.DAMAGE, this.updateHealthBar, this);
        this.scene.events.off(EVENTS.PLAYER.HEAL, this.updateHealthBar, this);
        this.scene.events.off(EVENTS.WAVE.START, this.onWaveStart, this);
        this.scene.events.off(EVENTS.ENEMY.DEATH, this.onEnemyDeath, this);
        this.scene.events.off(EVENTS.SCORE.UPDATE, this.updateScore, this);
        this.scene.events.off(EVENTS.POWERUP.COLLECTED, this.showPowerupEffect, this);

        // Destroy all UI elements
        Object.values(this.hud).forEach(element => {
            if (element.destroy) element.destroy();
        });
    }
}