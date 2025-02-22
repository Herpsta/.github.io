// src/systems/ProgressionSystem.js
export default class ProgressionSystem {
    constructor(scene) {
        this.scene = scene;
        this.setupProgression();
        this.setupUnlockables();
        this.setupChallenges();
    }

    setupProgression() {
        this.levelThresholds = new Array(100).fill(0).map((_, i) => 
            Math.floor(100 * Math.pow(1.2, i))
        );

        this.rewards = {
            levelUp: {
                coins: level => 100 * level,
                skillPoints: level => 1 + Math.floor(level / 5)
            },
            achievement: {
                coins: difficulty => 100 * (difficulty + 1),
                experience: difficulty => 50 * (difficulty + 1)
            },
            challenge: {
                coins: difficulty => 500 * (difficulty + 1),
                experience: difficulty => 250 * (difficulty + 1),
                specialRewards: new Map([
                    ['CHALLENGE_1', { type: 'weapon', id: 'special_weapon_1' }],
                    ['CHALLENGE_2', { type: 'skin', id: 'special_skin_1' }],
                    ['CHALLENGE_3', { type: 'character', id: 'special_character_1' }]
                ])
            }
        };
    }

    setupUnlockables() {
        this.unlockables = {
            characters: [
                {
                    id: 'character_1',
                    name: 'Speed Demon',
                    requirement: { type: 'level', value: 5 },
                    stats: { speed: 1.2, health: 0.8 }
                },
                {
                    id: 'character_2',
                    name: 'Tank',
                    requirement: { type: 'level', value: 10 },
                    stats: { speed: 0.8, health: 1.5 }
                }
            ],
            weapons: [
                {
                    id: 'weapon_1',
                    name: 'Dual Pistols',
                    requirement: { type: 'kills', value: 100 },
                    stats: { fireRate: 1.5, damage: 0.8 }
                },
                {
                    id: 'weapon_2',
                    name: 'Shotgun',
                    requirement: { type: 'boss_kills', value: 5 },
                    stats: { fireRate: 0.5, damage: 2.0 }
                }
            ],
            skins: [
                {
                    id: 'skin_1',
                    name: 'Golden Warrior',
                    requirement: { type: 'achievement', value: 'ACHIEVEMENT_1' }
                },
                {
                    id: 'skin_2',
                    name: 'Shadow Assassin',
                    requirement: { type: 'wave', value: 20 }
                }
            ]
        };
    }

    setupChallenges() {
        this.challenges = [
            {
                id: 'CHALLENGE_1',
                name: 'Speed Run',
                description: 'Complete 10 waves in under 5 minutes',
                condition: state => 
                    state.wavesCompleted >= 10 && 
                    state.playTime <= 300,
                reward: {
                    coins: 1000,
                    experience: 500,
                    special: this.rewards.challenge.specialRewards.get('CHALLENGE_1')
                }
            },
            {
                id: 'CHALLENGE_2',
                name: 'Perfect Boss',
                description: 'Defeat a boss without taking damage',
                condition: state =>
                    state.bossesDefeated > state.previousBossesDefeated &&
                    !state.damageTakenDuringBoss,
                reward: {
                    coins: 2000,
                    experience: 1000,
                    special: this.rewards.challenge.specialRewards.get('CHALLENGE_2')
                }
            }
        ];
    }

    addExperience(amount) {
        const currentExp = this.scene.gameState.experience;
        const currentLevel = this.scene.gameState.level;
        let newExp = currentExp + amount;
        let newLevel = currentLevel;

        // Check for level ups
        while (newExp >= this.levelThresholds[newLevel - 1]) {
            newExp -= this.levelThresholds[newLevel - 1];
            newLevel++;
            this.handleLevelUp(newLevel);
        }

        this.scene.gameState.experience = newExp;
        this.scene.gameState.level = newLevel;

        // Update UI
        this.scene.events.emit(EVENTS.EXPERIENCE.UPDATE, {
            level: newLevel,
            experience: newExp,
            nextLevel: this.levelThresholds[newLevel - 1]
        });
    }

    handleLevelUp(newLevel) {
        // Calculate rewards
        const coinReward = this.rewards.levelUp.coins(newLevel);
        const skillPointReward = this.rewards.levelUp.skillPoints(newLevel);

        // Apply rewards
        this.scene.gameState.coins += coinReward;
        this.scene.gameState.skillPoints += skillPointReward;

        // Check for unlocks
        this.checkUnlocks({ type: 'level', value: newLevel });

        // Show level up screen
        this.showLevelUpScreen(newLevel, {
            coins: coinReward,
            skillPoints: skillPointReward
        });
    }

    checkUnlocks(requirement) {
        Object.entries(this.unlockables).forEach(([category, items]) => {
            items.forEach(item => {
                if (!this.scene.gameState[`unlocked${category}`].has(item.id) &&
                    item.requirement.type === requirement.type &&
                    item.requirement.value <= requirement.value) {
                    
                    this.unlockItem(category, item);
                }
            });
        });
    }

    unlockItem(category, item) {
        this.scene.gameState[`unlocked${category}`].add(item.id);
        this.showUnlockScreen(category, item);
    }

    showLevelUpScreen(level, rewards) {
        // Create level up UI
        const levelUpScreen = new LevelUpScreen(this.scene, level, rewards);
        levelUpScreen.show();
    }

    showUnlockScreen(category, item) {
        // Create unlock UI
        const unlockScreen = new UnlockScreen(this.scene, category, item);
        unlockScreen.show();
    }

    checkChallenges() {
        this.challenges.forEach(challenge => {
            if (!this.scene.gameState.challengesCompleted.has(challenge.id) &&
                challenge.condition(this.scene.gameState)) {
                
                this.completeChallenge(challenge);
            }
        });
    }

    completeChallenge(challenge) {
        // Add to completed challenges
        this.scene.gameState.challengesCompleted.add(challenge.id);

        // Apply rewards
        this.scene.gameState.coins += challenge.reward.coins;
        this.addExperience(challenge.reward.experience);

        if (challenge.reward.special) {
            this.unlockItem(
                challenge.reward.special.type,
                this.unlockables[challenge.reward.special.type]
                    .find(item => item.id === challenge.reward.special.id)
            );
        }

        // Show completion screen
        this.showChallengeComplete(challenge);
    }

    showChallengeComplete(challenge) {
        // Create challenge complete UI
        const challengeScreen = new ChallengeCompleteScreen(this.scene, challenge);
        challengeScreen.show();
    }

    destroy() {
        // Cleanup any event listeners or timers
    }
}