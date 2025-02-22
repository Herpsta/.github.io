// src/ui/screens/ChallengeCompleteScreen.js
export default class ChallengeCompleteScreen extends BaseScreen {
    constructor(scene, challenge) {
        super(scene);
        this.challenge = challenge;
    }

    create() {
        super.create();

        // Victory banner
        this.createVictoryBanner();

        // Challenge info
        this.createChallengeInfo();

        // Rewards section
        this.createRewardsSection();

        // Continue button
        const continueButton = this.createButton(
            'Continue',
            0, 150,
            () => this.hide()
        );
        this.container.add(continueButton);

        // Add celebration effects
        this.createCelebrationEffects();
    }

    createVictoryBanner() {
        const banner = this.scene.add.container(0, -150);

        // Animated background
        const bg = this.scene.add.rectangle(0, 0, 500, 80, 0x000000)
            .setStrokeStyle(4, 0xffff00);

        // Victory text with glow effect
        const text = this.scene.add.text(
            0, 0,
            'CHALLENGE COMPLETE!',
            {
                fontSize: '36px',
                fill: '#ffffff',
                stroke: '#ffff00',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        banner.add([bg, text]);
        this.container.add(banner);

        // Add pulsing animation
        this.scene.tweens.add({
            targets: banner,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createChallengeInfo() {
        const container = this.scene.add.container(0, -50);

        // Challenge name
        const name = this.scene.add.text(
            0, 0,
            this.challenge.name,
            {
                fontSize: '28px',
                fill: '#00ff00'
            }
        ).setOrigin(0.5);

        // Challenge description
        const description = this.scene.add.text(
            0, 40,
            this.challenge.description,
            {
                fontSize: '18px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: 400 }
            }
        ).setOrigin(0.5);

        container.add([name, description]);
        this.container.add(container);
    }

    createRewardsSection() {
        const container = this.scene.add.container(0, 50);

        // Rewards title
        const title = this.scene.add.text(
            0, -30,
            'Rewards Earned',
            {
                fontSize: '24px',
                fill: '#ffff00'
            }
        ).setOrigin(0.5);

        // Regular rewards
        const rewardsContainer = this.createRewardsDisplay();

        // Special reward if any
        if (this.challenge.reward.special) {
            const specialReward = this.createSpecialRewardDisplay();
            specialReward.setPosition(0, 60);
            container.add(specialReward);
        }

        container.add([title, rewardsContainer]);
        this.container.add(container);
    }

    createRewardsDisplay() {
        const container = this.scene.add.container(0, 0);

        // Coins reward
        const coinsRow = this.createRewardRow(
            '🪙',
            `${this.challenge.reward.coins} Coins`,
            -15
        );

        // Experience reward
        const expRow = this.createRewardRow(
            '⭐',
            `${this.challenge.reward.experience} XP`,
            15
        );

        container.add([coinsRow, expRow]);
        return container;
    }

    createSpecialRewardDisplay() {
        const container = this.scene.add.container(0, 0);

        const specialReward = this.challenge.reward.special;
        const icon = this.getSpecialRewardIcon(specialReward.type);
        
        const specialRow = this.createRewardRow(
            icon,
            this.formatSpecialReward(specialReward),
            0,
            '#00ffff'
        );

        // Add sparkle effect
        this.addSparkleEffect(specialRow);

        container.add(specialRow);
        return container;
    }

    getSpecialRewardIcon(type) {
        const icons = {
            weapon: '⚔️',
            skin: '🎨',
            character: '👤'
        };
        return icons[type] || '🎁';
    }

    formatSpecialReward(reward) {
        return `Special ${reward.type.charAt(0).toUpperCase() + 
               reward.type.slice(1)} Unlock!`;
    }

    createRewardRow(icon, text, y, color = '#ffffff') {
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
                fontSize: '20px',
                fill: color
            }
        ).setOrigin(0, 0.5);

        container.add([iconText, rewardText]);
        return container;
    }

    addSparkleEffect(container) {
        const particles = this.scene.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: { min: -150, max: 150 },
            y: { min: -10, max: 10 },
            speed: { min: 20, max: 40 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            tint: 0x00ffff
        });

        container.add(particles);
    }

    createCelebrationEffects() {
        // Confetti effect
        this.createConfetti();
        
        // Fireworks effect
        this.createFireworks();
        
        // Play celebration sound
        this.scene.sound.play('challenge_complete', { volume: 0.5 });
    }

    createConfetti() {
        const particles = this.scene.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: { min: 0, max: this.scene.game.config.width },
            y: -50,
            speedY: { min: 200, max: 400 },
            speedX: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 },
            scale: { min: 0.2, max: 0.4 },
            lifespan: 4000,
            quantity: 2,
            frequency: 50,
            tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff]
        });

        this.container.add(particles);
    }

    createFireworks() {
        const createFirework = (x, y) => {
            const particles = this.scene.add.particles('particle');
            
            const emitter = particles.createEmitter({
                x: x,
                y: y,
                speed: { min: 100, max: 200 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.4, end: 0 },
                blendMode: 'ADD',
                lifespan: 1000,
                quantity: 30,
                tint: Phaser.Math.RND.pick([
                    0xff0000, 0x00ff00, 0x0000ff,
                    0xffff00, 0xff00ff, 0x00ffff
                ])
            });

            this.scene.time.delayedCall(100, () => {
                emitter.stop();
                this.scene.time.delayedCall(1000, () => {
                    particles.destroy();
                });
            });
        };

        // Create multiple fireworks with delays
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 500, () => {
                createFirework(
                    Phaser.Math.Between(100, this.scene.game.config.width - 100),
                    Phaser.Math.Between(100, this.scene.game.config.height - 100)
                );
            });
        }
    }
}