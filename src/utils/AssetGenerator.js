// src/utils/AssetGenerator.js
export default class AssetGenerator {
    static generateAssets(scene) {
        this.generateUIAssets(scene);
        this.generateGameAssets(scene);
        this.generateEffectAssets(scene);
    }

    static generateUIAssets(scene) {
        // Health bar assets
        this.createHealthBarAssets(scene);
        
        // Button assets
        this.createButtonAssets(scene);
        
        // Icons
        this.createWeaponIcons(scene);
        this.createPowerupIcons(scene);
        
        // Frames and panels
        this.createFrameAssets(scene);
    }

    static createHealthBarAssets(scene) {
        // Health bar background
        const barBg = scene.textures.createCanvas('health-bar-bg', 200, 20);
        const bgCtx = barBg.getContext();
        bgCtx.fillStyle = '#000000';
        bgCtx.strokeStyle = '#ffffff';
        bgCtx.lineWidth = 2;
        bgCtx.fillRect(0, 0, 200, 20);
        bgCtx.strokeRect(0, 0, 200, 20);
        barBg.refresh();

        // Health bar fill
        const barFill = scene.textures.createCanvas('health-bar-fill', 196, 16);
        const fillCtx = barFill.getContext();
        const gradient = fillCtx.createLinearGradient(0, 0, 196, 0);
        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(0.5, '#ff3333');
        gradient.addColorStop(1, '#ff0000');
        fillCtx.fillStyle = gradient;
        fillCtx.fillRect(0, 0, 196, 16);
        barFill.refresh();
    }

    static createButtonAssets(scene) {
        // Normal button
        const button = scene.textures.createCanvas('button', 200, 50);
        const btnCtx = button.getContext();
        this.drawButton(btnCtx, '#333333', '#ffffff');
        button.refresh();

        // Hover button
        const buttonHover = scene.textures.createCanvas('button-hover', 200, 50);
        const hoverCtx = buttonHover.getContext();
        this.drawButton(hoverCtx, '#444444', '#00ff00');
        buttonHover.refresh();
    }

    static drawButton(ctx, fillColor, strokeColor) {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        
        // Draw rounded rectangle
        const radius = 10;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(200 - radius, 0);
        ctx.quadraticCurveTo(200, 0, 200, radius);
        ctx.lineTo(200, 50 - radius);
        ctx.quadraticCurveTo(200, 50, 200 - radius, 50);
        ctx.lineTo(radius, 50);
        ctx.quadraticCurveTo(0, 50, 0, 50 - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
    }

    static createWeaponIcons(scene) {
        // Basic weapon icon
        const weaponIcon = scene.textures.createCanvas('weapon-icon', 32, 32);
        const ctx = weaponIcon.getContext();
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        // Draw basic weapon shape
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.lineTo(24, 16);
        ctx.lineTo(24, 12);
        ctx.lineTo(28, 16);
        ctx.lineTo(24, 20);
        ctx.lineTo(24, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        weaponIcon.refresh();
    }

    static createPowerupIcons(scene) {
        const powerupTypes = [
            { name: 'health', color: '#00ff00' },
            { name: 'speed', color: '#ffff00' },
            { name: 'damage', color: '#ff0000' },
            { name: 'shield', color: '#0000ff' }
        ];

        powerupTypes.forEach(type => {
            const icon = scene.textures.createCanvas(`powerup-${type.name}`, 32, 32);
            const ctx = icon.getContext();
            ctx.fillStyle = type.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            // Draw powerup icon
            ctx.beginPath();
            ctx.arc(16, 16, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            icon.refresh();
        });
    }

    static createFrameAssets(scene) {
        const frame = scene.textures.createCanvas('frame', 300, 200);
        const ctx = frame.getContext();
        
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        ctx.fillRect(0, 0, 300, 200);
        ctx.strokeRect(0, 0, 300, 200);
        
        frame.refresh();
    }

    static generateGameAssets(scene) {
        // Player
        const player = scene.textures.createCanvas('player', 32, 32);
        const playerCtx = player.getContext();
        playerCtx.fillStyle = '#00ff00';
        playerCtx.fillRect(8, 8, 16, 16);
        player.refresh();

        // Enemy
        const enemy = scene.textures.createCanvas('enemy', 32, 32);
        const enemyCtx = enemy.getContext();
        enemyCtx.fillStyle = '#ff0000';
        enemyCtx.fillRect(8, 8, 16, 16);
        enemy.refresh();

        // Projectile
        const projectile = scene.textures.createCanvas('projectile', 8, 8);
        const projectileCtx = projectile.getContext();
        projectileCtx.fillStyle = '#ffff00';
        projectileCtx.beginPath();
        projectileCtx.arc(4, 4, 3, 0, Math.PI * 2);
        projectileCtx.fill();
        projectile.refresh();
    }

    static generateEffectAssets(scene) {
        // Particle
        const particle = scene.textures.createCanvas('particle', 4, 4);
        const particleCtx = particle.getContext();
        particleCtx.fillStyle = '#ffffff';
        particleCtx.fillRect(0, 0, 4, 4);
        particle.refresh();
    }
}