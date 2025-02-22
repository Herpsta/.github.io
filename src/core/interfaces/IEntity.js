// src/core/interfaces/IEntity.js
export default class IEntity {
    constructor() {
        if (this.constructor === IEntity) {
            throw new Error('IEntity cannot be instantiated directly');
        }
    }
    
    get id() { throw new Error('id getter must be implemented'); }
    get type() { throw new Error('type getter must be implemented'); }
    update(time, delta) { throw new Error('update() must be implemented'); }
    destroy() { throw new Error('destroy() must be implemented'); }
}