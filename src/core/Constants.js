// src/core/Constants.js
export const GAME_CONSTANTS = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
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
        TYPES: {
            BASIC: 'basic',
            RANGED: 'ranged',
            BOSS: 'boss'
        }
    },
    
    WAVE: {
        INITIAL_ENEMIES: 10,
        INCREASE_PER_WAVE: 5,
        DELAY: 5000,
        BOSS_WAVES: [5, 10, 15, 20]
    },

    POWERUP: {
        TYPES: {
            HEALTH: 'health',
            SPEED: 'speed',
            DAMAGE: 'damage',
            SHIELD: 'shield'
        },
        DURATION: 5000,
        SPAWN_CHANCE: 0.1
    },

    PROJECTILE: {
        SPEED: 400,
        LIFESPAN: 2000
    },

    SCORE: {
        ENEMY_KILL: 100,
        BOSS_KILL: 1000,
        WAVE_COMPLETE: 500
    }
};

export const EVENTS = {
    GAME: {
        START: 'game-start',
        PAUSE: 'game-pause',
        RESUME: 'game-resume',
        OVER: 'game-over'
    },
    PLAYER: {
        DAMAGE: 'player-damage',
        HEAL: 'player-heal',
        DEATH: 'player-death',
        LEVEL_UP: 'player-level-up',
        POWERUP: 'player-powerup'
    },
    ENEMY: {
        SPAWN: 'enemy-spawn',
        DAMAGE: 'enemy-damage',
        DEATH: 'enemy-death'
    },
    WAVE: {
        START: 'wave-start',
        END: 'wave-end',
        BOSS: 'wave-boss'
    },
    POWERUP: {
        SPAWN: 'powerup-spawn',
        COLLECT: 'powerup-collect',
        EXPIRE: 'powerup-expire'
    },
    SCORE: {
        UPDATE: 'score-update',
        HIGH_SCORE: 'high-score'
    },
    UI: {
        SHOW_MESSAGE: 'ui-show-message',
        HIDE_MESSAGE: 'ui-hide-message',
        UPDATE_HUD: 'ui-update-hud'
    }
};