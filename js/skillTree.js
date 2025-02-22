class SkillTree {
    constructor(scene) {
        this.scene = scene;
        this.skillPoints = 0;
        this.skills = {
            damage: {
                name: 'Damage Up',
                level: 0,
                maxLevel: 5,
                cost: 1,
                effect: (player) => {
                    player.stats.projectileDamage *= 1.2;
                }
            },
            fireRate: {
                name: 'Fire Rate Up',
                level: 0,
                maxLevel: 5,
                cost: 1,
                effect: (player) => {
                    player.stats.fireRate *= 0.9;
                }
            },
            speed: {
                name: 'Movement Speed',
                level: 0,
                maxLevel: 5,
                cost: 1,
                effect: (player) => {
                    player.stats.moveSpeed *= 1.15;
                }
            },
            projectileSpeed: {
                name: 'Projectile Speed',
                level: 0,
                maxLevel: 3,
                cost: 2,
                effect: (player) => {
                    player.stats.projectileSpeed *= 1.25;
                }
            }
        };
        this.menuVisible = false;
    }

    addSkillPoint() {
        this.skillPoints++;
        this.updateSkillTreeUI();
    }

    toggleMenu() {
        this.menuVisible = !this.menuVisible;
        if (this.menuVisible) {
            this.showSkillTreeMenu();
        } else {
            this.hideSkillTreeMenu();
        }
    }

    showSkillTreeMenu() {
        this.menuBackground = this.scene.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
        this.menuContainer = this.scene.add.container(400, 300);
        
        const title = this.scene.add.text(0, -180, 'Skill Tree', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        const pointsText = this.scene.add.text(0, -140, `Skill Points: ${this.skillPoints}`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        this.menuContainer.add([title, pointsText]);
        
        let yPos = -80;
        for (const [skillId, skill] of Object.entries(this.skills)) {
            const buttonText = `${skill.name} (${skill.level}/${skill.maxLevel}) - Cost: ${skill.cost}`;
            const button = this.scene.add.text(0, yPos, buttonText, {
                fontSize: '20px',
                fill: this.canUpgradeSkill(skill) ? '#fff' : '#666',
                backgroundColor: '#333',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);
            
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => this.upgradeSkill(skillId));
            
            this.menuContainer.add(button);
            yPos += 40;
        }
        
        const closeButton = this.scene.add.text(250, 150, 'Close', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerdown', () => this.toggleMenu());
        
        this.menuContainer.add(closeButton);
    }

    hideSkillTreeMenu() {
        if (this.menuBackground) {
            this.menuBackground.destroy();
        }
        if (this.menuContainer) {
            this.menuContainer.destroy();
        }
    }

    canUpgradeSkill(skill) {
        return this.skillPoints >= skill.cost && skill.level < skill.maxLevel;
    }

    upgradeSkill(skillId) {
        const skill = this.skills[skillId];
        if (this.canUpgradeSkill(skill)) {
            this.skillPoints -= skill.cost;
            skill.level++;
            skill.effect(this.scene.player);
            this.hideSkillTreeMenu();
            this.showSkillTreeMenu();
            
            this.displayUpgradeMessage(skill.name);
        }
    }

    displayUpgradeMessage(skillName) {
        const text = this.scene.add.text(400, 150, `${skillName} Upgraded!`, {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: 100,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    updateSkillTreeUI() {
        if (this.menuVisible) {
            this.hideSkillTreeMenu();
            this.showSkillTreeMenu();
        }
    }
}