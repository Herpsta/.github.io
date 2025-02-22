// src/systems/AchievementSystem.js
export default class AchievementSystem {
    constructor(scene) {
        this.scene = scene;
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.setupAchievements();
        this.setupEventListeners();
    }

    setupAchievements() {
        this.registerAchievement('firstKill', {
            name: 'First Blood',
            description: 'Kill your first enemy',
            condition: stats => stats.kills >= 1,
            reward: 100,
            icon: '🗡️'
        });

        this.registerAchievement('killStreak', {
            name: 'Kill Streak',
            description: 'Kill 10 enemies without taking damage',
            condition: stats => stats.currentStreak >= 10,
            reward: 500,
            icon: '🔥'
        });

        this.registerAchievement('waveSurvival', {
            name: 'Wave Master',
            description: 'Survive 10 waves',
            condition: stats => stats.wavesCompleted >= 10,
            reward: 1000,
            icon: '🌊'
        });

        this.registerAchievement('perfectWave', {
            name: 'Perfect Wave',
            description: 'Complete a wave without taking damage',
            condition: stats => stats.perfectWaves >= 1,
            reward: 750,
            icon: '⭐'
        });

        this.registerAchievement('powerupCollector', {
            name: 'Power Hungry',
            description: 'Collect 20 power-ups',
            condition: stats => stats.powerupsCollected >= 20,
            reward: 500,
            icon: '⚡'
        });

        this.registerAchievement('bossSlayer', {
            name: 'Boss Slayer',
            description: 'Defeat your first boss',
            condition: stats => stats.bossesDefeated >= 1,
            reward: 2000,
            icon: '👑'
        });
    }

    registerAchievement(id, config) {
        this.achievements.set(id, {
            id,
            ...config,
            isUnlocked: false,
            progress: 0
        });
    }

    setupEventListeners() {
        // Listen for relevant game events
        this.scene.events.on(EVENTS.ENEMY.DEATH, this.onEnemyKill, this);
        this.scene.events.on(EVENTS.WAVE.END, this.onWaveComplete, this);
        this.scene.events.on(EVENTS.POWERUP.COLLECTED, this.onPowerupCollect, this);
        this.scene.events.on(EVENTS.BOSS.DEFEATED, this.onBossDefeated, this);
        this.scene.events.on(EVENTS.PLAYER.DAMAGE, this.onPlayerDamage, this);
    }

    onEnemyKill() {
        this.updateStats('kills', stats => stats.kills + 1);
        this.updateStats('currentStreak', stats => stats.currentStreak + 1);
        this.checkAchievements();
    }

    onWaveComplete() {
        this.updateStats('wavesCompleted', stats => stats.wavesCompleted + 1);
        if (!this.scene.player.hasTakenDamage) {
            this.updateStats('perfectWaves', stats => stats.perfectWaves + 1);
        }
        this.checkAchievements();
    }

    onPowerupCollect() {
        this.updateStats('powerupsCollected', stats => stats.powerupsCollected + 1);
        this.checkAchievements();
    }

    onBossDefeated() {
        this.updateStats('bossesDefeated', stats => stats.bossesDefeated + 1);
        this.checkAchievements();
    }

    onPlayerDamage() {
        this.updateStats('currentStreak', () => 0);
    }

    updateStats(key, updateFn) {
        const stats = this.scene.gameState.stats;
        stats[key] = updateFn(stats);
        this.scene.events.emit(EVENTS.STATS.UPDATE, key, stats[key]);
    }

    checkAchievements() {
        this.achievements.forEach((achievement, id) => {
            if (!this.unlockedAchievements.has(id) && 
                achievement.condition(this.scene.gameState.stats)) {
                this.unlockAchievement(id);
            }
        });
    }

    unlockAchievement(id) {
        const achievement = this.achievements.get(id);
        if (!achievement || this.unlockedAchievements.has(id)) return;

        this.unlockedAchievements.add(id);
        this.scene.gameState.score += achievement.reward;
        this.displayAchievementUnlock(achievement);
        
        // Save to local storage
        this.saveProgress();
    }

    displayAchievementUnlock(achievement) {
        // Create achievement popup container
        const popup = this.scene.add.container(
            this.scene.game.config.width / 2,
            -100
        );

        // Background
        const bg = this.scene.add.rectangle(0, 0, 400, 80, 0x000000, 0.8)
            .setStrokeStyle(2, 0xffffff);
        popup.add(bg);

        // Icon
        const icon = this.scene.add.text(-180, -15, achievement.icon, { fontSize: '32px' });
        popup.add(icon);

        // Text
        const title = this.scene.add.text(-140, -20, achievement.name, {
            fontSize: '24px',
            fill: '#ffff00'
        });
        popup.add(title);

        const description = this.scene.add.text(-140, 10, achievement.description, {
            fontSize: '16px',
            fill: '#ffffff'
        });
        popup.add(description);

        const reward = this.scene.add.text(140, -20, `+${achievement.reward}`, {
            fontSize: '24px',
            fill: '#00ff00'
        });
        popup.add(reward);

        // Animate popup
        this.scene.tweens.add({
            targets: popup,
            y: 100,
            duration: 1000,
            ease: 'Bounce',
            onComplete: () => {
                this.scene.time.delayedCall(3000, () => {
                    this.scene.tweens.add({
                        targets: popup,
                        y: -100,
                        alpha: 0,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => popup.destroy()
                    });
                });
            }
        });

        // Play achievement sound
        this.scene.sound.play('achievement', { volume: 0.5 });
    }

    saveProgress() {
        const saveData = {
            unlockedAchievements: Array.from(this.unlockedAchievements),
            stats: this.scene.gameState.stats
        };
        localStorage.setItem('achievementProgress', JSON.stringify(saveData));
    }

    loadProgress() {
        const saveData = localStorage.getItem('achievementProgress');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.unlockedAchievements = new Set(data.unlockedAchievements);
            this.scene.gameState.stats = data.stats;
        }
    }

    getProgress(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement) return null;

        return {
            current: achievement.progress,
            required: achievement.condition.toString(),
            percentage: Math.min(100, (achievement.progress / achievement.target) * 100)
        };
    }

    getAllAchievements() {
        return Array.from(this.achievements.values()).map(achievement => ({
            ...achievement,
            isUnlocked: this.unlockedAchievements.has(achievement.id),
            progress: this.getProgress(achievement.id)
        }));
    }

    destroy() {
        this.scene.events.off(EVENTS.ENEMY.DEATH, this.onEnemyKill, this);
        this.scene.events.off(EVENTS.WAVE.END, this.onWaveComplete, this);
        this.scene.events.off(EVENTS.POWERUP.COLLECTED, this.onPowerupCollect, this);
        this.scene.events.off(EVENTS.BOSS.DEFEATED, this.onBossDefeated, this);
        this.scene.events.off(EVENTS.PLAYER.DAMAGE, this.onPlayerDamage, this);
    }
}