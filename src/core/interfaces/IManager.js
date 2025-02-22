// src/core/interfaces/IManager.js
export default class IManager {
    init() { throw new Error('init() must be implemented'); }
    update(time, delta) { throw new Error('update() must be implemented'); }
    destroy() { throw new Error('destroy() must be implemented'); }
}