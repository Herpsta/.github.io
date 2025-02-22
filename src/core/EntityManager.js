// src/core/EntityManager.js
import { EVENTS } from './Constants.js';

export default class EntityManager {
    constructor(scene) {
        this.scene = scene;
        this.entities = new Map();
        this.groups = new Map();
        this.initializeGroups();
    }

    initializeGroups() {
        const groupTypes = ['players', 'enemies', 'projectiles', 'powerups', 'particles'];
        groupTypes.forEach(type => {
            this.groups.set(type, this.scene.physics.add.group());
        });
    }

    createEntity(type, x, y, config = {}) {
        const group = this.groups.get(type);
        if (!group) throw new Error(`Invalid entity type: ${type}`);

        const entity = group.create(x, y, config.sprite || type);
        entity.setData('type', type);
        
        // Apply configuration
        Object.entries(config).forEach(([key, value]) => {
            if (key !== 'sprite') entity.setData(key, value);
        });

        // Common physics setup
        entity.setCollideWorldBounds(true);
        
        this.entities.set(entity.id, entity);
        this.scene.events.emit(EVENTS.ENTITY.CREATED, entity);
        
        return entity;
    }

    removeEntity(entity) {
        if (!entity) return;
        
        this.entities.delete(entity.id);
        entity.destroy();
        this.scene.events.emit(EVENTS.ENTITY.DESTROYED, entity);
    }

    getGroup(type) {
        return this.groups.get(type);
    }

    getEntitiesByType(type) {
        return Array.from(this.groups.get(type).getChildren());
    }

    update(time, delta) {
        this.entities.forEach(entity => {
            if (entity.getData('update')) {
                entity.getData('update').call(entity, time, delta);
            }
        });
    }

    destroy() {
        this.groups.forEach(group => group.clear(true, true));
        this.entities.clear();
    }
}