// src/systems/SaveSystem.js
export default class SaveSystem {
    constructor(scene) {
        this.scene = scene;
        this.saveKey = 'waveSurvivalSave';
        this.autoSaveInterval = 60000; // Auto save every minute
        this.setupAutoSave();
    }

    setupAutoSave() {
        this.scene.time.addEvent({
            delay: this.autoSaveInterval,
            callback: () => this.saveGame(),
            loop: true
        });
    }

    saveGame() {
        const saveData = {
            version: '1.0',
            timestamp: Date.now(),
            player: this.getPlayerData(),
            progression: this.getProgressionData(),
            statistics: this.getStatisticsData(),
            unlocks: this.getUnlocksData(),
            settings: this.getSettingsData()
        };

        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            this.scene.events.emit(EVENTS.SAVE.SUCCESS);
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            this.scene.events.emit(EVENTS.SAVE.ERROR, error);
            return false;
        }
    }

    loadGame() {
        try {
            const saveData = JSON.parse(localStorage.getItem(this.saveKey));
            if (!saveData) return false;

            // Verify save version compatibility
            if (!this.isCompatibleVersion(saveData.version)) {
                throw new Error('Incompatible save version');
            }

            this.applyPlayerData(saveData.player);
            this.applyProgressionData(saveData.progression);
            this.applyStatisticsData(saveData.statistics);
            this.applyUnlocksData(saveData.unlocks);
            this.applySettingsData(saveData.settings);

            this.scene.events.emit(EVENTS.SAVE.LOADED);
            return true;
        } catch (error) {
            console.error('Load failed:', error);
            this.scene.events.emit(EVENTS.SAVE.ERROR, error);
            return false;
        }
    }

    getPlayerData() {
        return {
            level: this.scene.gameState.level,
            experience: this.scene.gameState.experience,
            coins: this.scene.gameState.coins,
            skillPoints: this.scene.gameState.skillPoints,
            skills: Array.from(this.scene.skillSystem.unlockedSkills),
            equipment: this.scene.player.getEquipmentData()
        };
    }

    getProgressionData() {
        return {
            highestWave: this.scene.gameState.highestWave,
            achievements: Array.from(this.scene.achievementSystem.unlockedAchievements),
            challengesCompleted: this.scene.gameState.challengesCompleted,
            difficulty: this.scene.gameState.difficulty
        };
    }

    getStatisticsData() {
        return {
            totalPlayTime: this.scene.gameState.totalPlayTime,
            enemiesKilled: this.scene.gameState.enemiesKilled,
            bossesDefeated: this.scene.gameState.bossesDefeated,
            powerupsCollected: this.scene.gameState.powerupsCollected,
            damageDealt: this.scene.gameState.damageDealt,
            damageTaken: this.scene.gameState.damageTaken,
            highScore: this.scene.gameState.highScore
        };
    }

    getUnlocksData() {
        return {
            characters: Array.from(this.scene.gameState.unlockedCharacters),
            weapons: Array.from(this.scene.gameState.unlockedWeapons),
            skins: Array.from(this.scene.gameState.unlockedSkins)
        };
    }

    getSettingsData() {
        return {
            audio: this.scene.game.sound.settings,
            controls: this.scene.inputManager.getControlConfig(),
            graphics: this.scene.game.config.graphics
        };
    }

    applyPlayerData(data) {
        this.scene.gameState.level = data.level;
        this.scene.gameState.experience = data.experience;
        this.scene.gameState.coins = data.coins;
        this.scene.gameState.skillPoints = data.skillPoints;
        this.scene.skillSystem.loadSkills(data.skills);
        this.scene.player.loadEquipment(data.equipment);
    }

    applyProgressionData(data) {
        this.scene.gameState.highestWave = data.highestWave;
        this.scene.achievementSystem.loadAchievements(data.achievements);
        this.scene.gameState.challengesCompleted = data.challengesCompleted;
        this.scene.gameState.difficulty = data.difficulty;
    }

    applyStatisticsData(data) {
        Object.assign(this.scene.gameState, data);
    }

    applyUnlocksData(data) {
        this.scene.gameState.unlockedCharacters = new Set(data.characters);
        this.scene.gameState.unlockedWeapons = new Set(data.weapons);
        this.scene.gameState.unlockedSkins = new Set(data.skins);
    }

    applySettingsData(data) {
        this.scene.game.sound.setSettings(data.audio);
        this.scene.inputManager.setControlConfig(data.controls);
        this.scene.game.setGraphicsConfig(data.graphics);
    }

    isCompatibleVersion(version) {
        // Simple version check, can be made more sophisticated
        return version.startsWith('1.');
    }

    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            this.scene.events.emit(EVENTS.SAVE.DELETED);
            return true;
        } catch (error) {
            console.error('Delete save failed:', error);
            this.scene.events.emit(EVENTS.SAVE.ERROR, error);
            return false;
        }
    }
}