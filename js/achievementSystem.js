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