// src/core/Constants.js

// Game Constants
export const GAME_CONSTANTS = {
    VERSION: '1.0.0',
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    WORLD: {
        WIDTH: 2000,
        HEIGHT: 2000
    },
    PLAYER: {
        BASE_HEALTH: 100,
        BASE_SPEED: 200,
        BASE_DAMAGE: 25,
        BASE_FIRE_RATE: 500,
        INVULNERABILITY_TIME: 1000
    },
    ENEMY: {
        BASE_HEALTH: 50,
        BASE_SPEED: 100,
        SPAWN_DISTANCE: 400,
        TYPES: ['basic', 'fast', 'tank', 'boss']
    },
    WAVE: {
        INITIAL_ENEMIES: 10,
        INCREASE_PER_WAVE: 5,
        DELAY: 5000
    },
    POWERUP: {
        SPAWN_CHANCE: 0.1,
        DURATION: 5000,
        TYPES: ['health', 'speed', 'damage', 'shield']
    }
};

// Event Names
export const EVENTS = {
    GAME: {
        START: 'game-start',
        PAUSE: 'game-pause',
        RESUME: 'game-resume',
        OVER: 'game-over'
    },
    PLAYER: {
        DAMAGE_TAKEN: 'player-damage-taken',
        HEALTH_CHANGE: 'player-health-change',
        EXPERIENCE_GAIN: 'player-experience-gain',
        LEVEL_UP: 'player-level-up',
        DEATH: 'player-death',
        WEAPON_CHANGE: 'player-weapon-change'
    },
    ENEMY: {
        SPAWN: 'enemy-spawn',
        DEATH: 'enemy-death',
        DAMAGE: 'enemy-damage'
    },
    WAVE: {
        START: 'wave-start',
        END: 'wave-end',
        ENEMY_COUNT_CHANGE: 'wave-enemy-count-change'
    },
    POWERUP: {
        COLLECTED: 'powerup-collected',
        EXPIRED: 'powerup-expired'
    },
    SCORE: {
        UPDATE: 'score-update',
        MULTIPLIER_CHANGE: 'score-multiplier-change'
    }
};

// Colors
export const COLORS = {
    UI: {
        PRIMARY: '#00ff00',
        SECONDARY: '#00ffff',
        WARNING: '#ffff00',
        DANGER: '#ff0000',
        TEXT: '#ffffff',
        BACKGROUND: '#000000'
    },
    POWERUPS: {
        HEALTH: 0x00ff00,
        SPEED: 0xffff00,
        DAMAGE: 0xff0000,
        SHIELD: 0x0000ff
    }
};

// Asset Keys
export const ASSETS = {
    SPRITES: {
        PLAYER: 'player',
        ENEMY: 'enemy',
        PROJECTILE: 'projectile',
        POWERUP: 'powerup',
        PARTICLE: 'particle'
    },
    AUDIO: {
        MUSIC: {
            MENU: 'menu-music',
            GAME: 'game-music'
        },
        SFX: {
            SHOOT: 'shoot',
            HIT: 'hit',
            EXPLOSION: 'explosion',
            POWERUP: 'powerup',
            LEVEL_UP: 'level-up',
            GAME_OVER: 'game-over',
            MENU_SELECT: 'menu-select'
        }
    }
};

// Layer Depths
export const DEPTHS = {
    BACKGROUND: 0,
    ENTITIES: 10,
    PROJECTILES: 20,
    EFFECTS: 30,
    UI: 100,
    OVERLAY: 1000
};

// Make sure to export everything as default as well
export default {
    GAME_CONSTANTS,
    EVENTS,
    COLORS,
    ASSETS,
    DEPTHS
};