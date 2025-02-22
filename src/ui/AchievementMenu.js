// src/ui/AchievementMenu.js
export default class AchievementMenu {
    constructor(scene) {
        this.scene = scene;
        this.isVisible = false;
        this.achievementSystem = scene.achievementSystem;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.isVisible = true;
        this.createMenu();
    }

    hide() {
        this.isVisible = false;
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }

    createMenu() {
        // Create container
        this.container = this.scene.add.container(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2
        );

        // Background
        const bg = this.scene.add.rectangle(0, 0, 600, 400, 0x000000, 0.9)
            .setStrokeStyle(2, 0xffffff);
        this.container.add(bg);

        // Title
        const title = this.scene.add.text(0, -180, 'Achievements', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.container.add(title);

        // Create scrollable achievement list
        this.createAchievementList();

        // Close button
        const closeButton = this.scene.add.text(260, -180, 'X', {
            fontSize: '24px',
            fill: '#ffffff'
        })
            .setInteractive()
            .on('pointerdown', () => this.hide());
        this.container.add(closeButton);
    }

    createAchievementList() {
        const achievements = this.achievementSystem.getAllAchievements();
        const startY = -130;
        const spacing = 70;

        achievements.forEach((achievement, index) => {
            const y = startY + (index * spacing);

            // Achievement container
            const achievementContainer = this.scene.add.container(0, y);
            this.container.add(achievementContainer);

            // Icon
            const icon = this.scene.add.text(-250, 0, achievement.icon, {
                fontSize: '32px'
            }).setOrigin(0.5);
            achievementContainer.add(icon);

            // Name and description
            const name = this.scene.add.text(-200, -15, achievement.name, {
                fontSize: '20px',
                fill: achievement.isUnlocked ? '#00ff00' : '#ffffff'
            });
            achievementContainer.add(name);

            const description = this.scene.add.text(-200, 10, achievement.description, {
                fontSize: '16px',
                fill: '#aaaaaa'
            });
            achievementContainer.add(description);

            // Progress bar
            if (!achievement.isUnlocked) {
                this.createProgressBar(achievementContainer, achievement.progress);
            } else {
                const completedText = this.scene.add.text(150, 0, 'Completed!', {
                    fontSize: '16px',
                    fill: '#00ff00'
                }).setOrigin(0.5);
                achievementContainer.add(completedText);
            }
        });
    }

    createProgressBar(container, progress) {
        const width = 200;
        const height = 20;
        const x = 150;
        const y = 0;

        // Background
        const bg = this.scene.add.rectangle(x, y, width, height, 0x333333);
        container.add(bg);

        // Progress
        const fill = this.scene.add.rectangle(
            x - (width/2) + 2,
            y,
            (width - 4) * (progress.percentage / 100),
            height - 4,
            0x00ff00
        ).setOrigin(0, 0.5);
        container.add(fill);

        // Percentage text
        const text = this.scene.add.text(x, y, `${Math.floor(progress.percentage)}%`, {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        container.add(text);
    }
}