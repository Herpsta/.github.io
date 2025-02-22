// src/ui/screens/UnlockScreen.js
export default class UnlockScreen extends BaseScreen {
    constructor(scene, category, item) {
        super(scene);
        this.category = category;
        this.item = item;
    }

    create() {
        super.create();

        // Unlock title
        const title = this.scene.add.text(
            0, -150,
            'New Unlock!',
            {
                fontSize: '48px',
                fill: '#00ffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Category text
        const categoryText = this.scene.add.text(
            0, -80,
            this.formatCategory(this.category),
            {
                fontSize: '24px',
                fill: '#888888'
            }
        ).setOrigin(0.5);

        // Item name with special styling
        const itemName = this.scene.add.text(
            0, -20,
            this.item.name,
            {
                fontSize: '32px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        // Item preview (if applicable)
        const preview = this.createItemPreview();
        preview.setPosition(0, 40);

        // Stats display (if applicable)
        const stats = this.createStatsDisplay();
        stats.setPosition(0, 80);

        // Equip/Close buttons
        const buttonContainer = this.createButtons();
        buttonContainer.setPosition(0, 150);

        this.container.add([
            title, categoryText, itemName,
            preview, stats, buttonContainer
        ]);

        // Add unlock effects
        this.createUnlockEffects();
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + 
               category.slice(1).toLowerCase();
    }

    createItemPreview() {
        const container = this.scene.add.container(0, 0);

        // Create preview based on category
        switch (this.category) {
            case 'characters':
                this.createCharacterPreview(container);
                break;
            case 'weapons':
                this.createWeaponPreview(container);
                break;
            case 'skins':
                this.createSkinPreview(container);
                break;
        }

        return container;
    }

    createCharacterPreview(container) {
        // Character sprite preview
        const preview = this.scene.add.sprite(0, 0, this.item.id);
        preview.setScale(2);
        container.add(preview);
    }

    createWeaponPreview(container) {
        // Weapon sprite preview
        const preview = this.scene.add.sprite(0, 0, this.item.id);
        preview.setScale(1.5);
        container.add(preview);
    }

    createSkinPreview(container) {
        // Skin preview
        const preview = this.scene.add.sprite(0, 0, this.item.id);
        preview.setScale(2);
        container.add(preview);
    }

    createStatsDisplay() {
        const container = this.scene.add.container(0, 0);

        if (this.item.stats) {
            const stats = Object.entries(this.item.stats);
            const startY = -((stats.length - 1) * 20) / 2;

            stats.forEach(([stat, value], index) => {
                const row = this.createStatRow(
                    stat,
                    value,
                    startY + (index * 20)
                );
                container.add(row);
            });
        }

        return container;
    }

    createStatRow(stat, value, y) {
        const container = this.scene.add.container(0, y);

        const statName = this.scene.add.text(
            -100, 0,
            this.formatStat(stat),
            {
                fontSize: '16px',
                fill: '#888888'
            }
        ).setOrigin(1, 0.5);

        const statValue = this.scene.add.text(
            -80, 0,
            this.formatValue(value),
            {
                fontSize: '16px',
                fill: value >= 1 ? '#00ff00' : '#ff0000'
            }
        ).setOrigin(0, 0.5);

        container.add([statName, statValue]);
        return container;
    }

    formatStat(stat) {
        return stat.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    formatValue(value) {
        const percent = (value * 100) - 100;
        return (percent >= 0 ? '+' : '') + percent + '%';
    }

    createButtons() {
        const container = this.scene.add.container(0, 0);

        if (this.category !== 'skins') {
            const equipButton = this.createButton(
                'Equip',
                -110, 0,
                () => this.equipItem()
            );
            container.add(equipButton);
        }

        const closeButton = this.createButton(
            'Close',
            110, 0,
            () => this.hide()
        );
        container.add(closeButton);

        return container;
    }

    equipItem() {
        // Handle equipping the item based on category
        switch (this.category) {
            case 'characters':
                this.scene.player.setCharacter(this.item.id);
                break;
            case 'weapons':
                this.scene.player.setWeapon(this.item.id);
                break;
        }
        this.hide();
    }

    createUnlockEffects() {
        // Create shine effect
        const shine = this.scene.add.sprite(0, 0, 'shine');
        shine.setScale(4);
        shine.setAlpha(0);

        this.scene.tweens.add({
            targets: shine,
            alpha: 0.5,
            rotation: Math.PI * 2,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Create particles
        const particles = this.scene.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: 0,
            y: 0,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            tint: 0x00ffff
        });

        this.container.add([shine, particles]);
    }
}