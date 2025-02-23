// src/utils/AssetGenerator.js
export default class AssetGenerator {
    static generateAllAssets(scene) {
        this.generateUIAssets(scene);
        this.generatePlayerAssets(scene);
        this.generateEnemyAssets(scene);
        this.generateWeaponAssets(scene);
        this.generateEffectAssets(scene);
        this.generatePowerupAssets(scene);
    }

    static generateUIAssets(scene) {
        // Health bar assets
        this.createHealthBarAssets(scene);
        
        // Button assets
        this.createButtonAssets(scene);
        
        // Icons
        this.createIconAssets(scene);
        
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
        
        // Create gradient
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

        // Pressed button
        const buttonPressed = scene.textures.createCanvas('button-pressed', 200, 50);
        const pressedCtx = buttonPressed.getContext();
        this.drawButton(pressedCtx, '#222222', '#00ff00');
        buttonPressed.refresh();
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

        // Add subtle gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 50);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    static createIconAssets(scene) {
        // Weapon icons
        this.createWeaponIcons(scene);
        
        // Powerup icons
        this.createPowerupIcons(scene);
        
        // Status icons
        this.createStatusIcons(scene);
    }

    static createWeaponIcons(scene) {
        const weapons = ['pistol', 'shotgun', 'laser', 'rocket'];
        const colors = {
            pistol: '#ffff00',
            shotgun: '#ff0000',
            laser: '#00ffff',
            rocket: '#ff00ff'
        };

        weapons.forEach(weapon => {
            const icon = scene.textures.createCanvas(`weapon-${weapon}`, 32, 32);
            const ctx = icon.getContext();
            
            // Draw weapon icon
            ctx.fillStyle = colors[weapon];
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;

            switch (weapon) {
                case 'pistol':
                    this.drawPistolIcon(ctx);
                    break;
                case 'shotgun':
                    this.drawShotgunIcon(ctx);
                    break;
                case 'laser':
                    this.drawLaserIcon(ctx);
                    break;
                case 'rocket':
                    this.drawRocketIcon(ctx);
                    break;
            }

            icon.refresh();
        });
    }

    static drawPistolIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.lineTo(20, 16);
        ctx.lineTo(24, 12);
        ctx.lineTo(24, 20);
        ctx.lineTo(20, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static drawShotgunIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(6, 16);
        ctx.lineTo(26, 16);
        ctx.lineTo(26, 12);
        ctx.lineTo(26, 20);
        ctx.lineTo(6, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static drawLaserIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.lineTo(24, 16);
        ctx.moveTo(20, 12);
        ctx.lineTo(24, 16);
        ctx.lineTo(20, 20);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 5;
        ctx.stroke();
    }

    static drawRocketIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.lineTo(20, 16);
        ctx.lineTo(24, 12);
        ctx.lineTo(28, 16);
        ctx.lineTo(24, 20);
        ctx.lineTo(20, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static createPowerupIcons(scene) {
        const powerups = [
            { name: 'speed', color: '#ffff00' },
            { name: 'damage', color: '#ff0000' },
            { name: 'shield', color: '#0000ff' },
            { name: 'health', color: '#00ff00' }
        ];

        powerups.forEach(powerup => {
            const icon = scene.textures.createCanvas(`powerup-${powerup.name}`, 32, 32);
            const ctx = icon.getContext();
            
            ctx.fillStyle = powerup.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;

            switch (powerup.name) {
                case 'speed':
                    this.drawSpeedIcon(ctx);
                    break;
                case 'damage':
                    this.drawDamageIcon(ctx);
                    break;
                case 'shield':
                    this.drawShieldIcon(ctx);
                    break;
                case 'health':
                    this.drawHealthIcon(ctx);
                    break;
            }

            icon.refresh();
        });
    }

    static drawSpeedIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.lineTo(24, 16);
        ctx.lineTo(20, 12);
        ctx.moveTo(24, 16);
        ctx.lineTo(20, 20);
        ctx.stroke();
    }

    static drawDamageIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(24, 16);
        ctx.lineTo(16, 24);
        ctx.lineTo(8, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static drawShieldIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(24, 12);
        ctx.lineTo(24, 20);
        ctx.lineTo(16, 24);
        ctx.lineTo(8, 20);
        ctx.lineTo(8, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static drawHealthIcon(ctx) {
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(20, 8);
        ctx.lineTo(20, 14);
        ctx.lineTo(26, 14);
        ctx.lineTo(26, 18);
        ctx.lineTo(20, 18);
        ctx.lineTo(20, 24);
        ctx.lineTo(16, 24);
        ctx.lineTo(16, 18);
        ctx.lineTo(10, 18);
        ctx.lineTo(10, 14);
        ctx.lineTo(16, 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static createFrameAssets(scene) {
        // Panel background
        const panel = scene.textures.createCanvas('panel', 300, 200);
        const panelCtx = panel.getContext();
        
        // Draw panel with gradient and border
        panelCtx.fillStyle = '#000000';
        panelCtx.globalAlpha = 0.8;
        panelCtx.fillRect(0, 0, 300, 200);
        
        // Add border
        panelCtx.globalAlpha = 1;
        panelCtx.strokeStyle = '#ffffff';
        panelCtx.lineWidth = 2;
        panelCtx.strokeRect(0, 0, 300, 200);
        
        // Add gradient overlay
        const gradient = panelCtx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        panelCtx.fillStyle = gradient;
        panelCtx.fill();
        
        panel.refresh();
    }

    static generatePlayerAssets(scene) {
        // Player ship
        const player = scene.textures.createCanvas('player', 32, 32);
        const playerCtx = player.getContext();
        
        // Draw player ship
        playerCtx.fillStyle = '#00ff00';
        playerCtx.strokeStyle = '#ffffff';
        playerCtx.lineWidth = 2;
        
        // Ship body
        playerCtx.beginPath();
        playerCtx.moveTo(16, 4);
        playerCtx.lineTo(28, 28);
        playerCtx.lineTo(16, 24);
        playerCtx.lineTo(4, 28);
        playerCtx.closePath();
        playerCtx.fill();
        playerCtx.stroke();
        
        // Engine glow
        playerCtx.fillStyle = '#ffff00';
        playerCtx.beginPath();
        playerCtx.moveTo(14, 24);
        playerCtx.lineTo(18, 24);
        playerCtx.lineTo(16, 30);
        playerCtx.closePath();
        playerCtx.fill();
        
        player.refresh();
    }

    static generateEnemyAssets(scene) {
        const enemyTypes = [
            { name: 'basic', color: '#ff0000' },
            { name: 'fast', color: '#ffff00' },
            { name: 'tank', color: '#ff00ff' },
            { name: 'boss', color: '#ff3333' }
        ];

        enemyTypes.forEach(type => {
            const enemy = scene.textures.createCanvas(`enemy-${type.name}`, 32, 32);
            const ctx = enemy.getContext();
            
            ctx.fillStyle = type.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;

            switch (type.name) {
                case 'basic':
                    this.drawBasicEnemy(ctx);
                    break;
                case 'fast':
                    this.drawFastEnemy(ctx);
                    break;
                case 'tank':
                    this.drawTankEnemy(ctx);
                    break;
                case 'boss':
                    this.drawBossEnemy(ctx);
                    break;
            }

            enemy.refresh();
        });
    }

    static drawBasicEnemy(ctx) {
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(28, 28);
        ctx.lineTo(4, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static drawFastEnemy(ctx) {
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(24, 28);
        ctx.lineTo(16, 24);
        ctx.lineTo(8, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static drawTankEnemy(ctx) {
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(24, 12);
        ctx.lineTo(24, 20);
        ctx.lineTo(16, 24);
        ctx.lineTo(8, 20);
        ctx.lineTo(8, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static drawBossEnemy(ctx) {
        // Main body
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(28, 12);
        ctx.lineTo(28, 20);
        ctx.lineTo(16, 28);
        ctx.lineTo(4, 20);
        ctx.lineTo(4, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Details
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(16, 16, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    static generateEffectAssets(scene) {
        // Explosion
        this.createExplosionEffect(scene);
        
        // Projectiles
        this.createProjectileEffects(scene);
        
        // Particles
        this.createParticleEffects(scene);
    }

    static createExplosionEffect(scene) {
        const size = 64;
        const frames = 8;
        
        for (let i = 0; i < frames; i++) {
            const explosion = scene.textures.createCanvas(`explosion-${i}`, size, size);
            const ctx = explosion.getContext();
            
            const radius = (i + 1) * (size / frames / 2);
            const alpha = 1 - (i / frames);
            
            ctx.fillStyle = `rgba(255, ${200 - i * 20}, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(size/2, size/2, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add details
            const particles = 8 + i * 4;
            for (let p = 0; p < particles; p++) {
                const angle = (p / particles) * Math.PI * 2;
                const distance = radius * 0.8;
                
                ctx.fillStyle = `rgba(255, ${255 - i * 20}, 0, ${alpha})`;
                ctx.beginPath();
                ctx.arc(
                    size/2 + Math.cos(angle) * distance,
                    size/2 + Math.sin(angle) * distance,
                    2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
            
            explosion.refresh();
        }
    }

    static createProjectileEffects(scene) {
        const projectileTypes = [
            { name: 'basic', color: '#ffff00' },
            { name: 'laser', color: '#00ffff' },
            { name: 'plasma', color: '#ff00ff' }
        ];

        projectileTypes.forEach(type => {
            const projectile = scene.textures.createCanvas(`projectile-${type.name}`, 8, 8);
            const ctx = projectile.getContext();
            
            ctx.fillStyle = type.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            
            switch (type.name) {
                case 'basic':
                    ctx.beginPath();
                    ctx.arc(4, 4, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    break;
                    
                case 'laser':
                    ctx.beginPath();
                    ctx.moveTo(0, 4);
                    ctx.lineTo(8, 4);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = type.color;
                    ctx.stroke();
                    
                    // Add glow
                    ctx.shadowColor = type.color;
                    ctx.shadowBlur = 4;
                    ctx.stroke();
                    break;
                    
                case 'plasma':
                    ctx.beginPath();
                    ctx.moveTo(4, 0);
                    ctx.lineTo(8, 4);
                    ctx.lineTo(4, 8);
                    ctx.lineTo(0, 4);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;
            }
            
            projectile.refresh();
        });
    }

    static createParticleEffects(scene) {
        const particles = scene.textures.createCanvas('particles', 32, 8);
        const ctx = particles.getContext();
        
        // Small dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4, 4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Star shape
        ctx.translate(16, 4);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.rotate(Math.PI * 2 / 5);
            ctx.lineTo(0, -4);
            ctx.lineTo(0, -2);
        }
        ctx.closePath();
        ctx.fill();
        
        particles.refresh();
    }
}