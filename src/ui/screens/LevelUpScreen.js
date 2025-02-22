// src/ui/screens/LevelUpScreen.js
export default class LevelUpScreen extends BaseScreen {
    constructor(scene, level, rewards) {
        super(scene);
        this.level = level;
        this.rewards = rewards;
    }

    create() {
        super.create();

        // Level up title with glow effect
        const title = this.scene.add.text(
            0, -150,
            'LEVEL UP!',
            {
                fontSize: '48px',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Add glow animation
        this.scene.tweens.add({
            targets: title,
            alpha: 0.7,
            yoyo: true,
            repeat: -1,
            duration: 1000
        });

        // Level number
        const levelText = this.scene.add.text(
            0, -80,
            `Level ${this.level}`,
            {
                fontSize: '32px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Rewards section
        const rewardsContainer = this.createRewardsDisplay();
        rewardsContainer.setPosition(0, 0);

        // Continue button
        const continueButton = this.createButton(
            'Continue',
            0, 150,
            () => this.hide()
        );

        this.container.add([title, levelText, rewardsContainer, continueButton]);

        // Add particle effects
        this.createLevelUpEffects();
    }

    createRewardsDisplay() {
        const container = this.scene.add.container(0, 0);

        const rewardsTitle = this.scene.add.text(
            0, -40,
            'Rewards',
            {
                fontSize: '24px',
                fill: '#00ff00'
            }
        ).setOrigin(0.5);

        // Coins reward
        const coinsRow = this.createRewardRow(
            '🪙', 
            `${this.rewards.coins} Coins`,
            -20
        );

        // Skill points reward
        const skillPointsRow = this.createRewardRow(
            '⭐', 
            `${this.rewards.skillPoints} Skill Points`,
            20
        );

        container.add([rewardsTitle, coinsRow, skillPointsRow]);
        return container;
    }

    createRewardRow(icon, text, y) {
        const container = this.scene.add.container(0, y);

        const iconText = this.scene.add.text(
            -100, 0,
            icon,
            { fontSize: '24px' }
        ).setOrigin(0.5);

        const rewardText = this.scene.add.text(
            0, 0,
            text,
            {
                fontSize: '24px',
                fill: '#ffffff'
            }
        ).setOrigin(0, 0.5);

        container.add([iconText, rewardText]);
        return container;
    }

    createLevelUpEffects() {
        // Create particle emitter for sparkles
        const particles = this.scene.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: 0,
            y: 0,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            tint: [0xffff00, 0x00ff00, 0x0000ff]
        });

        emitter.setPosition(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2
        );

        this.container.add(particles);
    }
}
