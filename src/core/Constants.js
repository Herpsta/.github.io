// src/core/Constants.js
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
    },
    TIME: {
        UPDATE: 'time-update'
    },
    SAVE: {
        SUCCESS: 'save-success',
        ERROR: 'save-error',
        LOADED: 'save-loaded',
        DELETED: 'save-deleted'
    },
    UI: {
        UPDATE: 'ui-update',
        SHOW_MESSAGE: 'ui-show-message'
    }
};

export const SCENES = {
    BOOT: 'BootScene',
    LOAD: 'LoadScene',
    MENU: 'MenuScene',
    GAME: 'GameScene',
    UI: 'UIScene',
    PAUSE: 'PauseScene',
    OPTIONS: 'OptionsScene',
    CREDITS: 'CreditsScene',
    GAME_OVER: 'GameOverScene'
};

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
        HEALTH: '#00ff00',
        SPEED: '#ffff00',
        DAMAGE: '#ff0000',
        SHIELD: '#0000ff'
    }
};

export const DEPTHS = {
    BACKGROUND: 0,
    ENTITIES: 10,
    PROJECTILES: 20,
    EFFECTS: 30,
    UI: 100,
    OVERLAY: 1000
};

export const CONTROLS = {
    MOVEMENT: {
        UP: ['W', 'UP'],
        DOWN: ['S', 'DOWN'],
        LEFT: ['A', 'LEFT'],
        RIGHT: ['D', 'RIGHT']
    },
    ACTIONS: {
        SHOOT: ['SPACE', 'LEFT_CLICK'],
        PAUSE: 'ESC',
        INTERACT: 'E'
    }
};

export default {
    GAME_CONSTANTS,
    EVENTS,
    SCENES,
    ASSETS,
    COLORS,
    DEPTHS,
    CONTROLS
};